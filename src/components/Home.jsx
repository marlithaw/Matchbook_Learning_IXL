// Home view: hero, sign-in notice, welcome/avatar card, saved grades, grade
// picker, current-week banner.

import SignInNotice from './SignInNotice.jsx'

export default function Home({
  s,
  showAvatar,
  hasVideo,
  videoUrl,
  speaking,
  speechUnavailable,
  onToggleSpeak,
  savedCards,
  gradeCards,
  homeWeekLine,
  homeDateLine,
}) {
  return (
    <>
      <div className="hero">
        <div className="redrule" />
        <div className="kicker">{s.heroKicker}</div>
        <h1 className="h1">{s.heroTitle}</h1>
        <p className="lede">{s.heroLede}</p>
      </div>

      <SignInNotice s={s} />

      {showAvatar ? (
        <div className="welcome">
          <div className="welcome__row">
            <div className="welcome__mark">
              <img src="./assets/flame-logo.svg" alt="" />
            </div>
            <div>
              <div className="welcome__kicker">{s.avatarKicker}</div>
              <div className="welcome__title">{s.avatarTitle}</div>
            </div>
          </div>
          {hasVideo ? (
            <div className="welcome__video">
              <iframe
                src={videoUrl}
                title={s.avatarTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
          <p className="welcome__script">{s.avatarScript}</p>
          <div className="welcome__actions">
            <button type="button" onClick={onToggleSpeak} className="pill pill--red">
              {speaking ? s.stopBtn : s.playBtn}
            </button>
            {speechUnavailable ? <span className="welcome__nospeech">{s.noSpeech}</span> : null}
          </div>
        </div>
      ) : null}

      {savedCards.length > 0 ? (
        <div className="section-mt34">
          <div className="muted-label">{s.savedTitle}</div>
          <div className="saved__row">
            {savedCards.map((c) => (
              <div className="chip" key={c.slug}>
                <button type="button" onClick={c.onOpen} className="chip__open">
                  {c.label}
                </button>
                <button
                  type="button"
                  onClick={c.onRemove}
                  aria-label={c.removeLabel}
                  className="chip__remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="picker">
        <h2 className="h2">{s.pickTitle}</h2>
        <p className="picker__sub">{s.pickSub}</p>
        <div className="picker__grid">
          {gradeCards.map((g) => (
            <button type="button" onClick={g.onOpen} className="gradecard" key={g.slug}>
              <span className="gradecard__badge">{g.badge}</span>
              <span className="gradecard__label">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="weekbanner weekbanner--home">
        <div className="weekbanner__label">{s.weekLabel}</div>
        <div className="weekbanner__line">{homeWeekLine}</div>
        <div className="weekbanner__date">{homeDateLine}</div>
      </div>
    </>
  )
}
