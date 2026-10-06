// IXL Code List — a week at a glance. Every assigned skill code by grade, week,
// and day, for anyone who doesn't reach the skills through Clever. One grade
// shows a Day × Math / Reading / IREAD table (stacked day cards on phones);
// "All grades" shows a Grade × Mon–Fri grid of codes. Codes open the exact
// skill on IXL; Copy buttons put a day's (or the week's) codes on the
// clipboard.

import { useRef, useState } from 'react'

function useCopy() {
  const [copied, setCopied] = useState(null)
  const timer = useRef(null)
  const canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard
  const copy = (key, text) => {
    if (!canCopy || !text) return
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(key)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(null), 1600)
      })
      .catch(() => {})
  }
  return { canCopy, copied, copy }
}

function Chip({ item, small = false }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener"
      title={item.title}
      className={`cl-chip cl-chip--${item.kind}${small ? ' cl-chip--sm' : ''}`}
    >
      {item.code || '—'}
    </a>
  )
}

function Skill({ item }) {
  return (
    <div className="cl-skill">
      <Chip item={item} />
      <a href={item.url} target="_blank" rel="noopener" className="cl-skill__title">
        {item.title}
      </a>
    </div>
  )
}

function Cell({ items, label, labelColor }) {
  if (!items.length) return <div className="cl-cell cl-cell--empty">—</div>
  return (
    <div className="cl-cell">
      {label ? (
        <span className="cl-cell__label" style={{ color: labelColor }}>
          {label}
        </span>
      ) : null}
      {items.map((it, i) => (
        <Skill key={i} item={it} />
      ))}
    </div>
  )
}

export default function CodesView({ s, vm, big, onHome, onToggleBig, onToggleLang, onPrint }) {
  const { canCopy, copied, copy } = useCopy()
  const copyBtn = (key, text, label = s.copyWord, extra = '') =>
    canCopy ? (
      <button
        type="button"
        onClick={() => copy(key, text)}
        className={`cl-btn cl-btn--outline${extra}${copied === key ? ' cl-btn--done' : ''}`}
      >
        {copied === key ? `✓ ${s.copiedWord}` : label}
      </button>
    ) : null

  return (
    <div className="cl">
      <header className="cl-top">
        <div className="cl-top__inner">
          <img src="./assets/flame-logo.svg" alt="" className="cl-top__mark" />
          <div className="cl-top__titles">
            <div className="cl-top__kicker">{s.listKicker}</div>
            <h1 className="cl-top__title">{s.listTitle}</h1>
          </div>
          <div className="cl-top__actions">
            <button type="button" onClick={onToggleBig} aria-label={s.textSize} title={s.textSize} className="cl-toppill">
              {big ? 'A−' : 'A+'}
            </button>
            <button type="button" onClick={onToggleLang} className="cl-toppill">
              {s.langBtn}
            </button>
            <button type="button" onClick={onHome} className="cl-toppill cl-toppill--home">
              {s.homeBtn}
            </button>
          </div>
        </div>
      </header>

      <main className="cl-main">
        <p className="cl-intro">{s.listIntro}</p>

        <div className="cl-toolbar">
          <div className="cl-grades" role="group" aria-label={s.gradeLabel}>
            {vm.grades.map((g) => (
              <button
                type="button"
                key={g.key}
                onClick={g.onSelect}
                aria-pressed={g.isOn}
                aria-label={g.label}
                title={g.label}
                className={`cl-grade${g.key === 'all' ? ' cl-grade--all' : ''}${g.isOn ? ' cl-grade--on' : ''}`}
              >
                {g.badge}
              </button>
            ))}
          </div>
          <div className="cl-weekpick">
            <button
              type="button"
              onClick={vm.onPrev}
              disabled={!vm.canPrev}
              aria-label={s.prevWeek}
              className="cl-arrow"
            >
              ‹
            </button>
            <select
              value={vm.week}
              onChange={(e) => vm.onWeek(Number(e.target.value))}
              aria-label={s.weekPickLabel}
              className="cl-select"
            >
              {vm.weekOptions.map((o) => (
                <option key={o.key} value={o.disabled ? '' : o.week} disabled={o.disabled}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={vm.onNext}
              disabled={!vm.canNext}
              aria-label={s.nextWeek}
              className="cl-arrow"
            >
              ›
            </button>
          </div>
        </div>

        {vm.breakNote ? <div className="cl-break">{vm.breakNote}</div> : null}

        <section className="cl-card">
          <div className="cl-card__head">
            <div>
              <div className="cl-card__kicker">{vm.kicker}</div>
              <h2 className="cl-card__title">{vm.title}</h2>
            </div>
            <div className="cl-card__actions">
              {copyBtn('week', vm.copyWeekText, s.copyWeek)}
              <button type="button" onClick={onPrint} className="cl-btn cl-btn--red">
                {s.printShort}
              </button>
            </div>
          </div>

          {vm.mode === 'grade' ? (
            <div className={`cl-table${vm.withIread ? ' cl-table--iread' : ''}`} role="table">
              <div className="cl-row cl-row--head" role="row">
                <span role="columnheader">{s.colDay}</span>
                <span role="columnheader">{vm.labels.math}</span>
                <span role="columnheader">{vm.labels.ela}</span>
                {vm.withIread ? (
                  <span role="columnheader">
                    {vm.labels.iread} <em className="cl-opt">{s.optionalWord}</em>
                  </span>
                ) : null}
                <span role="columnheader" className="cl-sr">
                  {s.copyWord}
                </span>
              </div>
              {vm.days.map((d) => (
                <div className={`cl-row${d.isToday ? ' cl-row--today' : ''}`} role="row" key={d.key}>
                  <div className="cl-day" role="cell">
                    <span className="cl-day__name">{d.label}</span>
                    <span className="cl-day__date">{d.date}</span>
                    {d.isToday ? <span className="cl-today">{s.todayTag}</span> : null}
                    <span className="cl-day__copy--m">{copyBtn(d.key, d.copyText, s.copyWord, ' cl-btn--sm')}</span>
                  </div>
                  <div role="cell">
                    <Cell items={d.math} label={vm.labels.math} labelColor="var(--charcoal)" />
                  </div>
                  <div role="cell">
                    <Cell items={d.ela} label={vm.labels.ela} labelColor="var(--spark-red)" />
                  </div>
                  {vm.withIread ? (
                    <div role="cell">
                      <Cell
                        items={d.iread}
                        label={`${vm.labels.iread} · ${s.optionalWord}`}
                        labelColor="var(--iread-label)"
                      />
                    </div>
                  ) : null}
                  <div className="cl-rowcopy" role="cell">
                    {copyBtn(d.key, d.copyText, s.copyWord, ' cl-btn--sm')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cl-table cl-table--all" role="table">
              <div className="cl-row cl-row--head" role="row">
                <span role="columnheader">{s.colGrade}</span>
                {vm.dayHeads.map((d) => (
                  <span role="columnheader" key={d.key} className={d.isToday ? 'cl-head--today' : ''}>
                    {d.short}
                    <small>{d.date}</small>
                  </span>
                ))}
              </div>
              {vm.gradeRows.map((g) => (
                <div className="cl-row" role="row" key={g.key}>
                  <div className="cl-day" role="cell">
                    <button type="button" onClick={g.onOpen} className="cl-gradelink">
                      {g.label}
                    </button>
                  </div>
                  {g.days.map((d) => (
                    <div role="cell" key={d.key} className={`cl-allcell${d.isToday ? ' cl-allcell--today' : ''}`}>
                      <span className="cl-allcell__day">{d.short}</span>
                      <span className="cl-allcell__chips">
                        {d.items.length ? d.items.map((it, i) => <Chip key={i} item={it} small />) : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="cl-use">
          <h3 className="cl-use__title">{s.useTitle}</h3>
          <ul className="cl-use__list">
            <li>
              <b>{s.use1b}</b> {s.use1}
            </li>
            <li>
              <b>{s.use2b}</b> {s.use2}
            </li>
            <li>
              <b>{s.use3b}</b> {s.use3}
            </li>
            <li>
              <b>{s.use4b}</b> {s.use4}
            </li>
          </ul>
        </aside>

        <footer className="cl-foot">{s.listFoot}</footer>
      </main>
    </div>
  )
}
