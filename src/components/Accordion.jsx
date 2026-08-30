// Shared "Everything else you might ask" accordion — five sections, all
// collapsed at first. `open` is a map of section id -> boolean; `onToggle`
// flips one.

function Row({ id, title, open, onToggle, children }) {
  return (
    <div className="acc">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="acc__btn"
      >
        <span className="acc__title">{title}</span>
        <span aria-hidden="true" className="acc__sign">
          {open ? '−' : '+'}
        </span>
      </button>
      {open ? <div className="acc__panel">{children}</div> : null}
    </div>
  )
}

export default function Accordion({ s, open, onToggle, startLinks, scoreRows, appSteps, researchUrl }) {
  return (
    <div className="accordion">
      <h2 className="accordion__h2">{s.learnTitle}</h2>

      <Row id="start" title={s.startTitle} open={open.start} onToggle={onToggle}>
        <p className="acc__p">{s.startSub}</p>
        <div className="startgrid">
          {startLinks.map((l, i) => (
            <a href={l.url} target="_blank" rel="noopener" className="startcard" key={i}>
              <span className="startcard__tag">{l.tag}</span>
              <span className="startcard__title">{l.title}</span>
              <span className="startcard__desc">{l.desc}</span>
            </a>
          ))}
        </div>
      </Row>

      <Row id="score" title={s.scoreTitle} open={open.score} onToggle={onToggle}>
        <p className="acc__p">{s.scoreSub}</p>
        <div className="scorerows">
          {scoreRows.map((r, i) => (
            <div className="scorerow" key={i}>
              <span className="scorerow__num">{r.num}</span>
              <span className="scorerow__text">
                <b>{r.bold}</b> {r.text}
              </span>
            </div>
          ))}
        </div>
        <div className="tipblock">{s.scoreTip}</div>
      </Row>

      <Row id="flu" title={s.fluTitle} open={open.flu} onToggle={onToggle}>
        <p className="acc__p">{s.fluBody}</p>
        <p className="acc__p acc__p--last">{s.fluWhy}</p>
      </Row>

      <Row id="app" title={s.appTitle} open={open.app} onToggle={onToggle}>
        <div className="appsteps">
          {appSteps.map((a, i) => (
            <div className="appstep" key={i}>
              <span className="appstep__n">{a.n}</span>
              <span className="appstep__text">{a.text}</span>
            </div>
          ))}
          <div className="tipblock" style={{ marginTop: 0 }}>
            {s.appTip}
          </div>
        </div>
      </Row>

      <Row id="why" title={s.whyTitle} open={open.why} onToggle={onToggle}>
        <p className="acc__p">{s.whyOurs}</p>
        <p className="acc__p">{s.whyOurs2}</p>
        <div className="sourceblock">
          <p className="sourceblock__p">{s.whyIxl}</p>
          <div className="sourceblock__src">
            {s.srcLabel}{' '}
            <a href={researchUrl} target="_blank" rel="noopener">
              {s.srcName}
            </a>
          </div>
        </div>
      </Row>
    </div>
  )
}
