// Week/day calendar math for IXL at Home.
//
// Week 1 Day 1 is `startDate` (a Monday). Week w Day d is
// startDate + (w-1)*7 + (d-1) days, EXCEPT that any Monday listed in
// `skipWeeks` (a no-school Monday) is not assigned a week number, so weeks
// after it shift forward. With an empty `skipWeeks` this reduces exactly to
// the prototype's arithmetic.
//
// Current position rules (matching the prototype):
//   before startDate      -> Week 1 Day 1        (state "before")
//   Saturday              -> next week Day 1      (state "weekend")
//   Sunday                -> this week Day 1      (state "weekend")
//   Mon–Fri               -> that week, day=getDay()  (state "school")
//   past the last week     -> last week Day 5      (state "after")

import { DAYS, MONTHS } from '../data/strings.js'

function parseISO(str) {
  const p = String(str).split('-').map(Number)
  return new Date(p[0], (p[1] || 1) - 1, p[2] || 1)
}

function addDays(date, n) {
  const x = new Date(date)
  x.setDate(x.getDate() + n)
  return x
}

function atMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isoLocal(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function createCalendar(startDate, skipWeeks = []) {
  const skipSet = new Set(skipWeeks)
  const dayOne = () => parseISO(startDate || '2026-08-31')

  // Real Monday date for authored week number `w` (1-based), skipping
  // no-school Mondays.
  function mondayForWeek(w) {
    let count = 0
    let cursor = dayOne()
    // Guard against a runaway loop if w is absurd.
    for (let i = 0; i < 520; i++) {
      if (!skipSet.has(isoLocal(cursor))) {
        count++
        if (count === w) return cursor
      }
      cursor = addDays(cursor, 7)
    }
    return cursor
  }

  // Number of authored (non-skip) Mondays in [startDate, monday].
  function weekIndexUpTo(monday) {
    let wk = 0
    let cursor = dayOne()
    while (cursor <= monday) {
      if (!skipSet.has(isoLocal(cursor))) wk++
      cursor = addDays(cursor, 7)
    }
    return wk
  }

  function dateOf(w, d) {
    return addDays(mondayForWeek(w), d - 1)
  }

  function currentPos(lastWeek, now = new Date()) {
    const one = dayOne()
    const today = atMidnight(now)
    const last = lastWeek || 1
    if (today < one) return { week: 1, day: 1, state: 'before', date: one }

    const monday = new Date(today)
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
    let wk = weekIndexUpTo(monday)
    if (wk < 1) wk = 1

    const dow = today.getDay()
    if (dow === 0 || dow === 6) {
      const nx = dow === 6 ? wk + 1 : wk
      if (nx > last) return { week: last, day: 5, state: 'after', date: today }
      return { week: nx, day: 1, state: 'weekend', date: today }
    }
    if (wk > last) return { week: last, day: 5, state: 'after', date: today }
    return { week: wk, day: dow, state: 'school', date: today }
  }

  function fmtDate(date, lang) {
    return lang === 'es'
      ? `${DAYS.es[date.getDay()]} ${date.getDate()} de ${MONTHS.es[date.getMonth()]}`
      : `${DAYS.en[date.getDay()]}, ${MONTHS.en[date.getMonth()]} ${date.getDate()}`
  }

  return { dayOne, mondayForWeek, dateOf, currentPos, fmtDate }
}

// Largest authored week number across math + ela for a grade.
export function maxWeek(data, g) {
  if (!data) return 1
  const w = Object.keys(data.math[g] || {})
    .concat(Object.keys(data.ela[g] || {}))
    .map(Number)
    .filter((n) => !isNaN(n))
  return w.length ? Math.max(...w) : 1
}

// Skills for a kind/grade/week/day; iread is not keyed by grade.
export function skillsFor(data, kind, g, w, d) {
  if (!data) return []
  const root = kind === 'iread' ? data.iread : (data[kind] || {})[g]
  if (!root) return []
  const wk = root[String(w)]
  if (!wk) return []
  return wk[String(d)] || []
}
