# IXL at Home — Matchbook Learning

A bilingual (English/Spanish), mobile-first family site for Matchbook Learning
K–8 families at **Wendell Phillips School 63**. Its single job: a parent opens
it on a phone and, in two taps, reaches the exact two IXL skills their child
must practice tonight — one math, one reading — chosen in advance by the teacher
for that specific week and weekday. Everything else (SmartScore explanation, app
setup, fluency, the "why") is secondary and collapsed.

Built as a small **React + Vite** static site. No backend, no accounts — all
personalization lives in the browser's `localStorage`.

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

Two views inside one page (no router needed):

1. **Home** — hero, welcome/read-aloud card, saved grades, grade picker, and a
   current-week banner.
2. **Grade** — tonight's practice for one grade, with a **Tonight / Whole week**
   tab switch, optional extra practice (IREAD + fluency), a week picker, a
   printable sheet, and supporting callouts.

Below both: a shared "Everything else you might ask" accordion, a red Help
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

`skipWeeks` (in `src/config.js`) is the list of no-school Mondays — see below.

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

To update assignments, edit `public/ixl-data.json` and rebuild.

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
src/components/*.jsx         Header, Home, GradeView, Accordion, HelpFooter,
                             TaskRow, PrintSheet
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

1. **`SKIP_WEEKS`** — no-school Mondays are unconfirmed. The mechanism is
   implemented (`config.skipWeeks`, empty for now); fill it in once the school
   calendar is set, or week numbering drifts after the first break.
2. **Welcome video** — the Web Speech read-aloud is a launch stand-in. The
   intended state is the recorded clip in the video slot (set `welcomeVideoUrl`),
   with captions.
3. **Skill-data updates** — decide whether teachers edit the JSON directly (a
   commit per revision) or the site fetches it, before check-off keys go live.
4. **Spanish copy** is translated but not yet reviewed by a native-speaking
   staff member.
5. **Fonts** — loaded from Google Fonts by `src/styles/tokens.css`. Self-host
   (Anton, Oswald, Mulish) for production reliability and offline use.
6. **Brand flame** — `public/assets/flame-logo.svg` is a recreation; swap in the
   official vector if the school provides it.
