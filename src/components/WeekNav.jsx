// Prominent week navigator for the grade view. A tappable row of week chips
// (current week highlighted) so families can jump to any past week as easily as
// the Tonight / Whole-week tabs. A check on a chip means every night that week
// is done — a visible sign that each week's progress is saved on its own. With
// many weeks the row scrolls; it auto-centers the current week on load. Break
// weeks appear as markers between chips; the break happening now is tappable
// and returns to the catch-up week.

import { useEffect, useRef } from 'react'

export default function WeekNav({ s, weeks, onSelect }) {
  const rowRef = useRef(null)
  const activeRef = useRef(null)
  const currentKey = weeks && weeks.find((w) => w.isCurrent)?.key
  useEffect(() => {
    const row = rowRef.current
    const el = activeRef.current
    if (!row || !el) return
    // Center the current week within the row only — never scroll the page.
    try {
      row.scrollLeft = el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2
    } catch {
      /* ignore */
    }
  }, [currentKey])

  if (!weeks || weeks.length < 2) return null
  return (
    <nav className="weeknav" aria-label={s.weekNavLabel}>
      <div className="weeknav__label">{s.weekNavLabel}</div>
      <div className="weeknav__row" ref={rowRef}>
        {weeks.map((w) =>
          w.isBreak ? (
            <button
              type="button"
              key={w.key}
              ref={w.isCurrent ? activeRef : undefined}
              onClick={w.onSelect || undefined}
              disabled={!w.onSelect}
              aria-current={w.isCurrent ? 'true' : undefined}
              className={`weekchip weekchip--break${w.isCurrent ? ' weekchip--breakon' : ''}`}
            >
              <span className="weekchip__name">{w.label}</span>
              <span className="weekchip__date">{w.date}</span>
            </button>
          ) : (
            <button
              type="button"
              key={w.key}
              ref={w.isCurrent ? activeRef : undefined}
              onClick={() => onSelect(w.week)}
              aria-current={w.isCurrent ? 'true' : undefined}
              className={`weekchip${w.isCurrent ? ' weekchip--on' : ''}`}
            >
              <span className="weekchip__name">
                {s.weekWord} {w.week}
              </span>
              <span className="weekchip__date">{w.date}</span>
              {w.done ? (
                <span className="weekchip__done" title={s.weekDoneBadge} aria-label={s.weekDoneBadge}>
                  ✓
                </span>
              ) : null}
            </button>
          ),
        )}
      </div>
    </nav>
  )
}
