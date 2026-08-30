// Off-screen print sheet: one grade, one week, all five nights. Hidden on
// screen; revealed by the @media print rules. Reflects the currently selected
// grade and week.

export default function PrintSheet({ gradeLabel, printWeekLine, weekDays, printFoot }) {
  return (
    <div className="print">
      <div className="print__head">
        <div>
          <div className="print__name">Matchbook Learning</div>
          <div className="print__sub">IXL at Home · Wendell Phillips 63</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="print__grade">{gradeLabel}</div>
          <div className="print__week">{printWeekLine}</div>
        </div>
      </div>
      {weekDays.map((d, i) => (
        <div className="print__day" key={i}>
          <div className="print__dayhead">
            {d.label} · {d.date}
          </div>
          {d.tasks.map((k, j) => (
            <div className="print__task" key={j}>
              <span className="print__box" />
              <span className="print__line">
                <b>{k.subject}</b> · {k.title} <span className="muted">{k.codeLine}</span>
              </span>
            </div>
          ))}
        </div>
      ))}
      <div className="print__foot">{printFoot}</div>
    </div>
  )
}
