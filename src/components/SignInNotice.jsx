// Sign-in / activation notice for parents. IXL is free (school-paid) but the
// child must sign in with credentials from the teacher to activate it.
// Full version on Home; compact one-line reminder on the grade view (where a
// returning parent with one saved grade lands directly).

export default function SignInNotice({ s, compact = false }) {
  if (compact) {
    return (
      <div className="signin signin--compact">
        <span className="signin__tag">{s.activateKicker}</span>
        <p className="signin__body">{s.activateNote}</p>
      </div>
    )
  }
  return (
    <section className="signin" aria-label={s.activateTitle}>
      <span className="signin__tag">{s.activateKicker}</span>
      <h2 className="signin__title">{s.activateTitle}</h2>
      <p className="signin__body">{s.activateBody}</p>
      <p className="signin__free">{s.activateFree}</p>
    </section>
  )
}
