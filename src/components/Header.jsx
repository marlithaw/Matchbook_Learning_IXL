// Sticky header. Home shows the wordmark lockup; other views show a back
// button ("All grades", or "Home" from the teacher codes view). All views show
// the text-size and language toggles.

export default function Header({ isHome, s, backLabel, big, onBack, onToggleBig, onToggleLang }) {
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
            ← {backLabel || s.allGrades}
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
