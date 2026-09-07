// Prominent login banner shown at the very top of every view (Home and each
// grade page), so returning families — who land straight on their saved grade —
// still see how to get their IXL login. The single source of the ParentSquare
// message; the Home page adds the fuller three-step card below.

export default function LoginBanner({ s }) {
  return (
    <aside className="loginbanner" aria-label={s.activateLeadQ}>
      <span className="loginbanner__icon" aria-hidden="true">
        🔑
      </span>
      <p className="loginbanner__text">
        <b className="loginbanner__q">{s.activateLeadQ}</b> {s.activateLead}
      </p>
    </aside>
  )
}
