// Prominent login banner shown at the top of the Home (landing) page, so
// families see how to get their IXL login before anything else. Key phrases in
// the message are bolded (marked with **…** in the copy) so they stand out.

function renderBold(text) {
  // Split on **…** and bold the odd (marked) segments.
  return String(text)
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : part))
}

export default function LoginBanner({ s }) {
  return (
    <aside className="loginbanner" aria-label={s.activateLeadQ}>
      <span className="loginbanner__icon" aria-hidden="true">
        🔑
      </span>
      <p className="loginbanner__text">
        <b className="loginbanner__q">{s.activateLeadQ}</b> {renderBold(s.activateLead)}
      </p>
    </aside>
  )
}
