// Teacher codes view: every grade's IXL skill codes, one week at a time.
// Teachers don't enter through Clever like students do, so this lists the same
// assignments by code. Grade picker, week banner + week chips, then one block
// per school night with a code row per skill (tap the code to copy it; tap the
// skill to open it on IXL).

import { useState } from 'react'
import WeekNav from './WeekNav.jsx'

function CodeRow({ s, row }) {
  const [copied, setCopied] = useState(false)
  const canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard && !!row.code
  const copy = () => {
    if (!canCopy) return
    navigator.clipboard
      .writeText(row.code)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      })
      .catch(() => {})
  }
  return (
    <div className={`coderow${row.optional ? ' coderow--opt' : ''}`}>
      <button
        type="button"
        onClick={copy}
        disabled={!canCopy}
        aria-label={`${s.copyCodeLabel} ${row.code}`}
        className="coderow__code"
      >
        <span className="coderow__codetext">{row.code || '—'}</span>
        {canCopy ? (
          <span className={`coderow__copy${copied ? ' coderow__copy--done' : ''}`} aria-live="polite">
            {copied ? `✓ ${s.copiedWord}` : s.copyWord}
          </span>
        ) : null}
      </button>
      <a href={row.url} target="_blank" rel="noopener" className="coderow__link">
        <span className="task__body">
          <span className="task__subject task__subject--sm" style={{ color: row.subjColor }}>
            {row.subject}
          </span>
          <span className="coderow__title">{row.title}</span>
        </span>
        <span aria-hidden="true" className="task__arrow task__arrow--sm">
          →
        </span>
      </a>
    </div>
  )
}

export default function CodesView({
  s,
  grades,
  weekLine,
  rangeLine,
  isThisWeek,
  onThisWeek,
  weekNav,
  onSelectWeek,
  days,
  onPrint,
}) {
  return (
    <>
      <div className="hero hero--grade">
        <div className="redrule" />
        <div className="kicker">{s.codesKicker}</div>
        <h1 className="h1 h1--grade">{s.codesTitle}</h1>
        <p className="lede lede--codes">{s.codesLede}</p>
      </div>

      <nav className="gradepick" aria-label={s.gradeLabel}>
        <div className="weeknav__label">{s.gradeLabel}</div>
        <div className="gradepick__grid">
          {grades.map((g) => (
            <button
              type="button"
              key={g.slug}
              onClick={g.onSelect}
              aria-current={g.isOn ? 'true' : undefined}
              aria-label={g.label}
              title={g.label}
              className={`gradepick__btn${g.isOn ? ' gradepick__btn--on' : ''}`}
            >
              {g.badge}
            </button>
          ))}
        </div>
      </nav>

      <div className="weekbanner weekbanner--grade">
        <div className="weekbanner__label">{s.showingLabel}</div>
        <div className="weekbanner__line">
          {weekLine}
          {isThisWeek ? <span className="weekbanner__tag">{s.thisWeekTag}</span> : null}
        </div>
        <div className="weekbanner__date">{rangeLine}</div>
        {!isThisWeek ? (
          <button type="button" onClick={onThisWeek} className="ghostpill codes__back">
            {s.backToThisWeek}
          </button>
        ) : null}
      </div>

      <WeekNav s={s} weeks={weekNav} onSelect={onSelectWeek} />

      <div className="week">
        {days.map((d, i) => (
          <section key={i} aria-label={`${d.label} ${d.date}`}>
            <div className="weekday__head">
              <span className="weekday__name">{d.label}</span>
              <span className="weekday__date">{d.date}</span>
              {d.isToday ? <span className="weekday__today">{s.todayTag}</span> : null}
            </div>
            <div className="weekday__tasks">
              {d.rows.length ? (
                d.rows.map((r, j) => <CodeRow key={j} s={s} row={r} />)
              ) : (
                <div className="nowork">{s.noWork}</div>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="weekpicker">
        <button type="button" onClick={onPrint} className="weekpicker__print">
          {s.printBtn}
        </button>
      </div>
    </>
  )
}
