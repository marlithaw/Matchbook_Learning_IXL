// Sticky header. Home shows the wordmark lockup; the grade view shows a
// back-to-all-grades button. Both show the text-size and language toggles.

export default function Header({ isHome, s, big, onBack, onToggleBig, onToggleLang }) {
  return (
    <header className="header">
      <div className="header__inner">
        {isHome ? (
          <div className="wordmark">
            <div className="wordmark__name">Matchbook Learning</div>
            <div className="wordmark__sub">Wendell Phillips 63</div>
          </div>
        ) : (
          <button type="button" onClick={onBack} className="backbtn">
            ← {s.allGrades}
          </button>
        )}
        <div className="header__spacer" />
        <button
          type="button"
          onClick={onToggleBig}
          aria-label={s.textSize}
          title={s.textSize}
          className="ctrl ctrl--size"
        >
          {big ? 'A−' : 'A+'}
        </button>
        <button type="button" onClick={onToggleLang} className="ctrl ctrl--lang">
          {s.langBtn}
        </button>
      </div>
    </header>
  )
}
