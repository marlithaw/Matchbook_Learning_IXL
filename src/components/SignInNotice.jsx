// Sign-in / activation notice for parents. IXL is free (no cost to families)
// but the child must sign in with credentials from the teacher to activate it.
// Full three-step version on Home; a compact one-line reminder on the grade
// view (where a returning parent with one saved grade lands directly).

export default function SignInNotice({ s, compact = false }) {
  if (compact) {
    return (
      <div className="signin signin--compact">
        <span className="signin__tag">{s.activateBadge}</span>
        <p className="signin__body">{s.activateCompact}</p>
      </div>
    )
  }

  const steps = [
    [s.activateStep1a, s.activateStep1b],
    [s.activateStep2a, s.activateStep2b],
    [s.activateStep3a, s.activateStep3b],
  ]

  return (
    <section className="signin" aria-label={s.activateTitle}>
      <span className="signin__tag">{s.activateBadge}</span>
      <h2 className="signin__title">{s.activateTitle}</h2>
      <ol className="signin__steps">
        {steps.map(([lead, rest], i) => (
          <li className="signin__step" key={i}>
            <span className="signin__n" aria-hidden="true">
              {i + 1}
            </span>
            <span className="signin__steptext">
              <b>{lead}</b> {rest}
            </span>
          </li>
        ))}
      </ol>
      <p className="signin__free">{s.activateFree}</p>
      <p className="signin__note">{s.activateNote}</p>
    </section>
  )
}
