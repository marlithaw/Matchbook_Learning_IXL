#!/usr/bin/env python3
"""Regenerate public/ixl-data.json from the 'IXL Codes for Home' Google Sheet.

The site's nightly assignments live in a Google Sheet maintained by the school;
this script is how that sheet becomes the site's data. It reads an .xlsx export
of the sheet (which preserves the per-cell IXL hyperlinks that CSV drops) and
writes the JSON the app consumes.

Usage:
  # From a local .xlsx you downloaded (File > Download > Microsoft Excel):
  python3 scripts/sync_ixl_data.py path/to/IXL_Codes_for_Home.xlsx

  # Directly from the sheet's export URL (requires the sheet to be viewable by
  # "anyone with the link"; otherwise the download is an HTML login page):
  python3 scripts/sync_ixl_data.py --sheet-id 17qR2VLb_9qRrhBUMLbsmLbRgXcfeSqbJYzYhvQyi0JA

Output: public/ixl-data.json (relative to the repo root).

Sheet layout (tabs):
  Math <grade> K-8, ELA <grade> K-8 : Grade | Week & Day | IXL Skill | Skill Code
  IREAD                             : Week & Day | IXL Skill | Skill Code  (no grade col)
  Math Fluency                      : Grade | Skill (click to open)
Each skill cell is a hyperlink to the IXL skill; we store the path after
https://www.ixl.com/ .  Data model:
  { math:{[grade]:{[week]:{[day]:[[title,path,code],...]}}},
    ela:{...}, iread:{[week]:{[day]:[...]}}, fluency:{[gradeName]:[[title,path],...]} }
"""
import io
import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = {
    'm': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(REPO_ROOT, 'public', 'ixl-data.json')

GRADE_NAMES = {'K': 'K', 'KINDERGARTEN': 'K'}
for n in '12345678':
    GRADE_NAMES[n] = n
WD_RE = re.compile(r'Week\s*(\d+)\s*[/ ]?\s*Day\s*(\d+)', re.I)


def norm_grade(g):
    g = (g or '').strip()
    m = re.match(r'^(\d+)\.0$', g)  # numeric cells export as "1.0"
    if m:
        g = m.group(1)
    return GRADE_NAMES.get(g.upper(), g)


def norm_code(code):
    """A code like '6E9' is stored by Sheets as a number and exports as
    '6.0E9' or '6000000000.0' — restore the short alphanumeric code."""
    c = (code or '').strip()
    m = re.match(r'^(\d)\.0E\+?0*(\d+)$', c)
    if m:
        return m.group(1) + 'E' + m.group(2)
    m = re.match(r'^(\d)0+\.0$', c)
    if m:
        return m.group(1) + 'E' + str(len(c.split('.')[0]) - 1)
    if c.endswith('.0') and c[:-2].isdigit():
        return c[:-2]
    return c


def path_from_url(url):
    if not url:
        return ''
    return re.sub(r'^https?://(www\.)?ixl\.com/', '', url).split('#')[0].split('?')[0].strip('/')


def col_of(ref):
    return re.match(r'[A-Z]+', ref).group(0)


def load_xlsx(data_bytes):
    z = zipfile.ZipFile(io.BytesIO(data_bytes))
    names = set(z.namelist())

    shared = []
    if 'xl/sharedStrings.xml' in names:
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall('m:si', NS):
            shared.append(''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])))

    wb = ET.fromstring(z.read('xl/workbook.xml'))
    name_to_rid = [(s.get('name'), s.get('{%s}id' % NS['r']))
                   for s in wb.find('m:sheets', NS).findall('m:sheet', NS)]

    wbrels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rid_to_path = {rel.get('Id'): 'xl/' + rel.get('Target').lstrip('/') for rel in wbrels}

    def read_sheet(path):
        sx = ET.fromstring(z.read(path))
        relpath = path.rsplit('/', 1)[0] + '/_rels/' + path.rsplit('/', 1)[1] + '.rels'
        rid_url = {}
        if relpath in names:
            for rel in ET.fromstring(z.read(relpath)):
                rid_url[rel.get('Id')] = rel.get('Target')
        ref_url = {}
        hyper = sx.find('m:hyperlinks', NS)
        if hyper is not None:
            for h in hyper.findall('m:hyperlink', NS):
                rid = h.get('{%s}id' % NS['r'])
                if rid in rid_url:
                    ref_url[h.get('ref')] = rid_url[rid]
        rows = []
        for row in sx.find('m:sheetData', NS).findall('m:row', NS):
            cells = {}
            for c in row.findall('m:c', NS):
                ref = c.get('r')
                t = c.get('t')
                v = c.find('m:v', NS)
                if t == 's':
                    text = shared[int(v.text)] if v is not None else ''
                elif t == 'inlineStr':
                    istr = c.find('m:is', NS)
                    text = ''.join(x.text or '' for x in istr.iter('{%s}t' % NS['m'])) if istr is not None else ''
                else:
                    text = v.text if v is not None else ''
                cells[col_of(ref)] = ((text or '').strip(), ref_url.get(ref))
            rows.append(cells)
        return rows

    return name_to_rid, rid_to_path, read_sheet


def build(data_bytes):
    name_to_rid, rid_to_path, read_sheet = load_xlsx(data_bytes)
    math, ela, iread, fluency = {}, {}, {}, {}
    missing = 0
    total = 0

    for name, rid in name_to_rid:
        path = rid_to_path.get(rid)
        if not path:
            continue
        rows = read_sheet(path)
        low = name.lower()

        if 'fluency' in low or 'fluidez' in low:
            for m in rows:
                g = m.get('A')
                sk = m.get('B')
                if not g or not sk:
                    continue
                gv, (title, url) = g[0], sk
                if gv in ('Grade', '') or title in ('Skill (click to open)', 'IXL Skill', ''):
                    continue
                total += 1
                missing += not url
                fluency.setdefault(gv, []).append([title, path_from_url(url)])
            continue

        if 'iread' in low:
            for m in rows:
                wd, sk, code = m.get('A'), m.get('B'), m.get('C')
                if not (wd and sk):
                    continue
                mo = WD_RE.search(wd[0] or '')
                if not mo:
                    continue
                title, url = sk
                if not title or title in ('IXL Skill', 'Skill'):
                    continue
                total += 1
                missing += not url
                iread.setdefault(mo.group(1), {}).setdefault(mo.group(2), []).append(
                    [title, path_from_url(url), norm_code(code[0] if code else '')])
            continue

        if low.startswith('math') or 'matematicas' in low:
            target = math
        elif 'ela' in low or 'lenguaje' in low or name.startswith('Sheet2') or name.startswith('Sheet3'):
            target = ela
        else:
            continue

        for m in rows:
            g, wd, sk, code = m.get('A'), m.get('B'), m.get('C'), m.get('D')
            if not (g and wd and sk):
                continue
            mo = WD_RE.search(wd[0] or '')
            if not mo:
                continue
            title, url = sk
            if not title or title in ('IXL Skill', 'IXL Skill (description & link)'):
                continue
            total += 1
            missing += not url
            target.setdefault(norm_grade(g[0]), {}).setdefault(mo.group(1), {}).setdefault(
                mo.group(2), []).append([title, path_from_url(url), norm_code(code[0] if code else '')])

    return {'math': math, 'ela': ela, 'iread': iread, 'fluency': fluency}, total, missing


def fetch_bytes(args):
    if args and not args[0].startswith('--'):
        with open(args[0], 'rb') as f:
            return f.read()
    if args and args[0] == '--sheet-id' and len(args) > 1:
        import urllib.request
        url = f'https://docs.google.com/spreadsheets/d/{args[1]}/export?format=xlsx'
        with urllib.request.urlopen(url) as r:
            data = r.read()
        if data[:2] != b'PK':  # not a zip -> almost certainly an HTML login page
            sys.exit('Downloaded content is not an .xlsx. Make the sheet viewable by '
                     '"anyone with the link", or download it manually and pass the file path.')
        return data
    sys.exit(__doc__)


def main():
    data, total, missing = build(fetch_bytes(sys.argv[1:]))
    if not data['math'] or not data['ela']:
        sys.exit('Parse produced no math/ela data — the sheet layout may have changed.')
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    print(f'Wrote {OUT_PATH}')
    print(f'  math grades: {sorted(data["math"])}')
    print(f'  ela grades:  {sorted(data["ela"])}')
    print(f'  iread weeks: {len(data["iread"])}')
    print(f'  fluency:     {list(data["fluency"])}')
    print(f'  skills: {total}, missing links: {missing}')
    if missing:
        print('  WARNING: some skill cells had no hyperlink; those links will be blank.')


if __name__ == '__main__':
    main()
