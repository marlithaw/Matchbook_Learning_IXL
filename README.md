# IXL at Home — Matchbook Learning

A bilingual (English/Spanish), mobile-first family site for Matchbook Learning
K–8 families at **Wendell Phillips School 63**. Its single job: a parent opens
it on a phone and, in two taps, reaches the exact two IXL skills their child
must practice tonight — one math, one reading — chosen in advance by the teacher
for that specific week and weekday. Everything else (SmartScore explanation, app
setup, fluency, the "why") is secondary and collapsed.

Built as a small **React + Vite** static site. No backend, no accounts — all
personalization lives in the browser's `localStorage`.

> **IXL Code List:** every grade's IXL codes, week at a glance, for anyone who
> doesn't go through Clever — add `#codes` to the site address (`…/#codes/3` for
> 3rd grade, `…/#codes/all` for every grade), or use the "Week at a glance" card
> at the bottom of the home page.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

The build in `dist/` is a plain static bundle; host it on any static file
server (Netlify, GitHub Pages, S3, a school web server, etc.). If you deploy
under a sub-path, set `base` in `vite.config.js`.

## How it works

Three views inside one page (no router needed):

1. **Home** — hero, welcome/read-aloud card, saved grades, grade picker, and a
   current-week banner.
2. **Grade** — tonight's practice for one grade, with a **Tonight / Whole week**
   tab switch, optional extra practice (IREAD + fluency), a week picker, a
   printable sheet, and supporting callouts.
3. **IXL Code List** (`#codes`, `#codes/<grade>`, `#codes/all`) — a week at a
   glance for anyone who doesn't reach the skills through Clever. Its own dark
   header; grade circles plus a week dropdown with ‹ › arrows; one grade shows a
   Day × Math / Reading / IREAD table of subject-colored code chips (stacked day
   cards on phones), "All grades" shows a Grade × Mon–Fri grid of codes. Codes
   open the exact skill; Copy (per day) and Copy week put codes on the
   clipboard; Print gives a one-page code sheet. The URL hash makes it
   bookmarkable and shareable.

Below Home and Grade: a shared "Everything else you might ask" accordion, a red Help
block, and the footer. An off-screen print sheet appears only when printing.

### Behavior highlights

- **Return visit** — if exactly one grade is saved, the app opens straight to
  that grade; otherwise it opens Home.
- **Language toggle** — swaps every string, cancels any in-flight speech, and
  persists the choice.
- **Larger-text toggle** — sets the root `--tsc` custom property to `1.16`;
  every font size is written as `calc(<px> * var(--tsc))`.
- **Check-off** — toggles a per-skill key in `localStorage` and recomputes the
  weekly streak. Nothing is sent to the school.
- **Read-aloud** — the welcome script is spoken via the Web Speech API. When it
  is unavailable, the script stays visible as the text alternative. The recorded
  welcome clip (see `welcomeVideoUrl`) is the intended long-term replacement.
- **Print** — `window.print()` renders a black-on-white sheet for the currently
  selected grade and week.

## Configuration

Defaults live in `src/config.js` and can be overridden at build time with Vite
env vars:

| Config           | Env var                  | Default            | Purpose                                             |
| ---------------- | ------------------------ | ------------------ | --------------------------------------------------- |
| `welcomeVideoUrl`| `VITE_WELCOME_VIDEO_URL` | `""`               | Embed URL for the recorded welcome; empty hides it. |
| `showAvatar`     | `VITE_SHOW_AVATAR`       | `true`             | Show/hide the whole welcome card.                   |
| `officePhone`    | `VITE_OFFICE_PHONE`      | `(317) 226-4263`   | Display text plus the `tel:` / `sms:` hrefs.        |
| `defaultLang`    | `VITE_DEFAULT_LANG`      | `en`               | Language before the visitor chooses.                |
| `startDate`      | `VITE_START_DATE`        | `2026-08-31`       | Monday of Week 1; all week/day math derives from it.|

### Break weeks

`breaks` (in `src/config.js`) lists the full no-school weeks from the
Matchbook Learning School Calendar 2026-2027: Fall Break (Oct 12–16),
Thanksgiving Break (Nov 23–27), Winter Break (Dec 21–Jan 1) and Spring Break
(Mar 29–Apr 2). Each Monday whose Mon–Fri falls inside a break gets no week
number, so the sheet's weeks resume after it (Week 7 starts Oct 19). During a
break the site switches to a **catch-up week**:

- Home and the grade view say "Fall Break · No new skills this week" and when
  the next week starts.
- The grade view's first tab lists every required skill still unchecked from
  the weeks since the last break (checkable in place), plus a pointer to the
  Recommendations on the child's IXL dashboard. The second tab previews the
  coming week.
- Break markers sit between the week chips; the current one returns to the
  catch-up week. The IXL Code List shows a break note and marks breaks in its
  week dropdown.

Single days off (Labor Day, PD days, MLK Day, …) don't skip a week. When next
year's calendar arrives, replace the `breaks` list (and `startDate`).

## Data model

The skill dataset lives in `public/ixl-data.json` (converted from the design
handoff's `ixl-data.js`). Shape:

```
{
  math:    { [grade]: { [week]: { [day]: [ [title, ixlPath, code], … ] } } },
  ela:     { [grade]: { [week]: { [day]: [ [title, ixlPath, code], … ] } } },
  iread:   {           [week]: { [day]: [ [title, ixlPath, code], … ] } },
  fluency: { [gradeName]: [ [title, ixlPath], … ] }
}
```

- `grade` keys: `"K"`, `"1"`–`"8"`. `week`: `"1"`–`"32"`. `day`: `"1"`–`"5"`.
- `ixlPath` appends to `https://www.ixl.com/`.
- `iread` is not keyed by grade; it is shown only for grades 2, 3, 4.
- `fluency` keys are display names (`Kindergarten`, `1st Grade`, … `4th Grade`);
  there is no fluency list for grades 5–8.

### Source of truth: the Google Sheet

`public/ixl-data.json` is **generated from** the school's Google Sheet
**"IXL Codes for Home"** (owned by the school; each grade has a Math tab and an
ELA tab, plus IREAD and Math Fluency tabs). The sheet's skill cells are
hyperlinks to the exact IXL skills — that is where the links come from. Teachers
edit the sheet; the site is regenerated from it. Do not hand-edit
`ixl-data.json`; edit the sheet and re-sync.

**To re-sync after the sheet changes:**

```bash
# 1. In the sheet: File > Download > Microsoft Excel (.xlsx)
# 2. Regenerate the data from that download:
npm run sync-data -- path/to/IXL_Codes_for_Home.xlsx
# 3. Commit the updated public/ixl-data.json and push — the deploy is automatic.
```

If the sheet is shared "anyone with the link can view", you can pull it directly
without downloading:

```bash
npm run sync-data -- --sheet-id 17qR2VLb_9qRrhBUMLbsmLbRgXcfeSqbJYzYhvQyi0JA
```

The sync script (`scripts/sync_ixl_data.py`, zero dependencies) reads the .xlsx,
extracts each skill's hyperlink and code, and rewrites `public/ixl-data.json`.
It normalizes quirks such as IXL codes like `6E9` that Sheets stores as numbers.

## Project structure

```
public/ixl-data.json        skill dataset
public/assets/*.svg          brand marks (flame logo, matchstick)
src/config.js                build-time configuration
src/data/strings.js          bilingual copy, grade/subject metadata, links
src/lib/calendar.js          week/day math + skill lookup
src/lib/storage.js           guarded localStorage helpers
src/styles/tokens.css        design tokens (ported from the design system)
src/styles/app.css           layout & component styles
src/components/*.jsx         Header, Home, GradeView, CodesView, Accordion,
                             HelpFooter, TaskRow, WeekNav, PrintSheet
src/App.jsx                  state + view-model orchestration
```

## Persisted state (localStorage)

| Key              | Shape                       | Purpose            |
| ---------------- | --------------------------- | ------------------ |
| `mbl-ixl-lang`   | `"en" \| "es"`              | language           |
| `mbl-ixl-big`    | `"1" \| "0"`                | larger-text mode   |
| `mbl-ixl-grades` | `string[]` of grade slugs   | saved grades       |
| `mbl-ixl-done`   | `{ [key]: 1 }`              | checked skills     |

Check-off key format: `` `${grade}|${week}|${day}|${kind}|${index}` `` — e.g.
`3|4|2|ela|0`. This is stable as long as a week/day's skill list is not
reordered. If the school starts revising assignments mid-year, switch the last
segment to the IXL skill code.

## Open items (carried over from the design handoff)

1. **Break weeks** — resolved for 2026-27: `config.breaks` holds the four
   full no-school weeks from the school calendar (see "Break weeks"). Single
   days off are not yet marked on the site.
2. **Welcome video** — the Web Speech read-aloud is a launch stand-in. The
   intended state is the recorded clip in the video slot (set `welcomeVideoUrl`),
   with captions.
3. **Skill-data updates** — resolved: teachers edit the "IXL Codes for Home"
   Google Sheet, and `public/ixl-data.json` is regenerated from it with
   `npm run sync-data` (see "Source of truth: the Google Sheet"). For fully
   automatic syncing, the sheet would need to be link-viewable (or a Google
   service-account secret added to CI) so a scheduled GitHub Action can pull it.
4. **Spanish copy** is translated but not yet reviewed by a native-speaking
   staff member.
5. **Fonts** — loaded from Google Fonts by `src/styles/tokens.css`. Self-host
   (Anton, Oswald, Mulish) for production reliability and offline use.
6. **Brand flame** — `public/assets/flame-logo.svg` is a recreation; swap in the
   official vector if the school provides it.
