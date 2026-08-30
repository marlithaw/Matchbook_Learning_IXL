// A single practice skill row: a check cell (button) + a link to the IXL skill.
// `showCode` renders the skill-code line; `tight` uses the whole-week padding.

export default function TaskRow({ task, showCode = false, tight = false }) {
  return (
    <div className="task">
      <button
        type="button"
        onClick={task.onToggle}
        aria-pressed={task.done}
        aria-label={task.checkLabel}
        className={`task__check${task.done ? ' task__check--done' : ''}`}
      >
        <span className={`task__box${task.done ? ' task__box--done' : ''}`}>{task.done ? '✓' : ''}</span>
      </button>
      <a
        href={task.url}
        target="_blank"
        rel="noopener"
        className={`task__link${tight ? ' task__link--tight' : ''}`}
      >
        <span className="task__body">
          <span
            className={`task__subject${showCode ? '' : ' task__subject--sm'}`}
            style={{ color: task.subjColor }}
          >
            {task.subject}
          </span>
          <span className={`task__title${showCode ? '' : ' task__title--sm'}`}>{task.title}</span>
          {showCode && task.codeLine ? <span className="task__code">{task.codeLine}</span> : null}
        </span>
        <span aria-hidden="true" className={`task__arrow${showCode ? '' : ' task__arrow--sm'}`}>
          →
        </span>
      </a>
    </div>
  )
}
