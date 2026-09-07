// Grade view: hero, week banner, Tonight / Whole-week tabs, optional extra
// practice, week picker + print, too-hard callout, plus-reading note.

import TaskRow from './TaskRow.jsx'
import SignInNotice from './SignInNotice.jsx'

export default function GradeView({
  s,
  gradeLabel,
  weekLine,
  dateLine,
  stateNote,
  mode,
  onShowTonight,
  onShowWeek,
  tonightTasks,
  noWork,
  streakText,
  streakDots,
  optionalTasks,
  hasOptional,
  hasMoreFluency,
  fluAll,
  onToggleFluAll,
  fluAllLabel,
  weekDays,
  weekValue,
  weekOptions,
  onWeekChange,
  onPrint,
  backTitle,
  backBody,
  hasPrevGrade,
  prevGradeLabel,
  onPrevGrade,
}) {
  const isTonight = mode === 'tonight'
  return (
    <>
      <div className="hero hero--grade">
        <div className="redrule" />
        <div className="kicker">{gradeLabel}</div>
        <h1 className="h1 h1--grade">{s.tonightTitle}</h1>
      </div>

      <SignInNotice s={s} compact />

      <div className="weekbanner weekbanner--grade">
        <div className="weekbanner__label">{s.weekLabel}</div>
        <div className="weekbanner__line">{weekLine}</div>
        <div className="weekbanner__date">{dateLine}</div>
        {stateNote ? <div className="weekbanner__note">{stateNote}</div> : null}
      </div>

      <div className="tabs">
        <button
          type="button"
          onClick={onShowTonight}
          className={`tab ${isTonight ? 'tab--on' : 'tab--off'}`}
        >
          {s.tabTonight}
        </button>
        <button
          type="button"
          onClick={onShowWeek}
          className={`tab ${!isTonight ? 'tab--on' : 'tab--off'}`}
        >
          {s.tabWeek}
        </button>
      </div>

      {isTonight ? (
        <>
          <div className="tonight">
            <div>
              <span className="tag">{s.reqLabel}</span>
            </div>
            <p className="reqnote">{s.reqNote}</p>
            <div className="tasklist">
              {tonightTasks.map((k) => (
                <TaskRow key={k.key} task={k} showCode />
              ))}
            </div>
            {noWork ? <div className="nowork">{s.noWork}</div> : null}

            <div className="streak">
              <div className="streak__head">
                <span className="streak__label">{s.streakLabel}</span>
                <span className="streak__count">{streakText}</span>
              </div>
              <div className="streak__bars">
                {streakDots.map((d, i) => (
                  <span
                    key={i}
                    title={d.label}
                    className={`streak__bar${d.filled ? ' streak__bar--on' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {hasOptional ? (
            <div className="optional">
              <span className="optional__label">{s.optLabel}</span>
              <span className="optional__note">{s.optNote}</span>
              <div className="optional__list">
                {optionalTasks.map((k, i) => (
                  <a href={k.url} target="_blank" rel="noopener" className="optrow" key={i}>
                    <span className="task__body">
                      <span className="task__subject task__subject--sm" style={{ color: k.subjColor }}>
                        {k.subject}
                      </span>
                      <span className="task__title task__title--sm">{k.title}</span>
                    </span>
                    <span aria-hidden="true" className="task__arrow task__arrow--sm">
                      →
                    </span>
                  </a>
                ))}
              </div>
              {hasMoreFluency ? (
                <button type="button" onClick={onToggleFluAll} className="ghostpill">
                  {fluAllLabel}
                </button>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <div className="week">
          {weekDays.map((d, i) => (
            <div key={i}>
              <div className="weekday__head">
                <span className="weekday__name">{d.label}</span>
                <span className="weekday__date">{d.date}</span>
                {d.isToday ? <span className="weekday__today">{s.todayTag}</span> : null}
              </div>
              <div className="weekday__tasks">
                {d.tasks.map((k) => (
                  <TaskRow key={k.key} task={k} tight />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="weekpicker">
        <label htmlFor="wsel" className="weekpicker__label">
          {s.otherWeek}
        </label>
        <select id="wsel" value={weekValue} onChange={onWeekChange} className="weekpicker__select">
          {weekOptions.map((o) => (
            <option value={o.value} key={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={onPrint} className="weekpicker__print">
          {s.printBtn}
        </button>
        <p className="weekpicker__note">{s.weekArchiveNote}</p>
      </div>

      <div className="toohard">
        <h3 className="toohard__title">{backTitle}</h3>
        <p className="toohard__body">{backBody}</p>
        {hasPrevGrade ? (
          <button type="button" onClick={onPrevGrade} className="pill pill--ink toohard__btn">
            {prevGradeLabel} →
          </button>
        ) : null}
      </div>

      <div className="plus">
        <span className="plus__title">{s.plusTitle}</span>
        <p className="plus__body">{s.plusBody}</p>
      </div>
    </>
  )
}
