// Shared red Help block and the school footer.

export default function HelpFooter({ s, phone, telHref, smsHref }) {
  return (
    <>
      <div className="help">
        <h3 className="help__title">{s.helpTitle}</h3>
        <p className="help__body">{s.helpBody}</p>
        <div className="help__actions">
          <a href={telHref} className="pill help__call">
            {s.callBtn} {phone}
          </a>
          <a href={smsHref} className="pill help__text">
            {s.textBtn}
          </a>
        </div>
      </div>
      <footer className="footer">{s.foot}</footer>
    </>
  )
}
