// Sign-in / activation notice for parents. IXL is free (no cost to families)
// but the child must sign in with credentials from ParentSquare to activate it.
// Shown on Home as a three-step guide; the headline "how to log in" message
// lives in the LoginBanner at the top of every view.

export default function SignInNotice({ s }) {
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
