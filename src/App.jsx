import { useEffect, useMemo, useState } from 'react'
import { config } from './config.js'
import {
  GRADES,
  FLU_KEY,
  IREAD_GRADES,
  SUBJ,
  T,
  MONTHS,
  WEEKDAY_NAMES,
  RESEARCH,
  VID_EN,
  VID_ES,
  VID_SCORE,
  HELP,
} from './data/strings.js'
import { createCalendar, maxWeek, skillsFor } from './lib/calendar.js'
import { readString, readJSON, write, KEYS } from './lib/storage.js'
import Header from './components/Header.jsx'
import Home from './components/Home.jsx'
import GradeView from './components/GradeView.jsx'
import Accordion from './components/Accordion.jsx'
import HelpFooter from './components/HelpFooter.jsx'
import PrintSheet from './components/PrintSheet.jsx'

const OPEN_INIT = { start: false, score: false, flu: false, app: false, why: false }

export default function App() {
  const [data, setData] = useState(null)
  const [lang, setLang] = useState(config.defaultLang)
  const [big, setBig] = useState(false)
  const [view, setView] = useState('home')
  const [grade, setGrade] = useState(null)
  const [week, setWeek] = useState(null)
  const [mode, setMode] = useState('tonight')
  const [saved, setSaved] = useState([])
  const [done, setDone] = useState({})
  const [speaking, setSpeaking] = useState(false)
  const [fluAll, setFluAll] = useState(false)
  const [open, setOpen] = useState(OPEN_INIT)

  const calendar = useMemo(() => createCalendar(config.startDate, config.skipWeeks), [])

  // ---- mount: hydrate persisted state, load data ----
  useEffect(() => {
    let initLang = config.defaultLang
    const l = readString(KEYS.lang)
    if (l === 'en' || l === 'es') initLang = l
    const initBig = readString(KEYS.big) === '1'
    let initSaved = readJSON(KEYS.grades, [])
    if (!Array.isArray(initSaved)) initSaved = []
    const initDone = readJSON(KEYS.done, {}) || {}

    setLang(initLang)
    setBig(initBig)
    setSaved(initSaved)
    setDone(initDone)
    applyScale(initBig)
    // Return visit: exactly one saved grade opens straight to it.
    if (initSaved.length === 1) {
      setView('grade')
      setGrade(initSaved[0])
    }

    let alive = true
    fetch(`${import.meta.env.BASE_URL}ixl-data.json`)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setData(d)
      })
      .catch(() => {})
    return () => {
      alive = false
      try {
        window.speechSynthesis.cancel()
      } catch {
        /* ignore */
      }
    }
  }, [])

  function applyScale(isBig) {
    try {
      document.documentElement.style.setProperty('--tsc', isBig ? '1.16' : '1')
    } catch {
      /* ignore */
    }
  }

  // ---- i18n helpers ----
  const s = useMemo(() => {
    const out = {}
    Object.keys(T).forEach((k) => {
      out[k] = T[k][lang] || T[k].en
    })
    return out
  }, [lang])
  const L = (o) => (lang === 'es' ? o.es : o.en)
  const tt = (k) => (T[k] ? T[k][lang] || T[k].en : '')

  // ---- actions ----
  function scrollTop() {
    try {
      window.scrollTo(0, 0)
    } catch {
      /* ignore */
    }
  }
  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es'
    try {
      window.speechSynthesis.cancel()
    } catch {
      /* ignore */
    }
    write(KEYS.lang, next)
    setSpeaking(false)
    setLang(next)
  }
  const toggleBig = () => {
    const next = !big
    write(KEYS.big, next ? '1' : '0')
    applyScale(next)
    setBig(next)
  }
  const goHome = () => {
    setView('home')
    setMode('tonight')
    setFluAll(false)
    scrollTop()
  }
  const openGrade = (slug) => {
    const nextSaved = saved.indexOf(slug) === -1 ? saved.concat([slug]) : saved
    write(KEYS.grades, JSON.stringify(nextSaved))
    setSaved(nextSaved)
    setView('grade')
    setGrade(slug)
    setWeek(null)
    setMode('tonight')
    setFluAll(false)
    scrollTop()
  }
  const removeGrade = (slug) => {
    const nextSaved = saved.filter((x) => x !== slug)
    write(KEYS.grades, JSON.stringify(nextSaved))
    setSaved(nextSaved)
  }
  const toggleDone = (key) => {
    setDone((prev) => {
      const next = { ...prev }
      if (next[key]) delete next[key]
      else next[key] = 1
      write(KEYS.done, JSON.stringify(next))
      return next
    })
  }
  const toggleSec = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  const toggleSpeak = () => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
    if (!synth) return
    if (speaking) {
      synth.cancel()
      setSpeaking(false)
      return
    }
    const u = new SpeechSynthesisUtterance(tt('avatarScript'))
    u.lang = lang === 'es' ? 'es-US' : 'en-US'
    u.rate = 0.95
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    synth.cancel()
    synth.speak(u)
    setSpeaking(true)
  }

  // ---- task object builder ----
  function taskObj(kind, item, g, w, d, i) {
    const key = `${g}|${w}|${d}|${kind}|${i}`
    const isDone = !!done[key]
    return {
      key,
      title: item[0],
      url: `https://www.ixl.com/${item[1]}`,
      codeLine: item[2] ? `${tt('codeWord')} ${item[2]}` : '',
      subject: L(SUBJ[kind]),
      subjColor: SUBJ[kind].color,
      done: isDone,
      checkLabel: `${isDone ? tt('markUndone') : tt('markDone')}: ${item[0]}`,
      onToggle: () => toggleDone(key),
    }
  }

  // ---- derived view data ----
  const phone = config.officePhone || '(317) 226-4263'
  const digits = '+1' + phone.replace(/[^0-9]/g, '')
  const telHref = `tel:${digits}`
  const smsHref = `sms:${digits}`
  const video = config.welcomeVideoUrl || ''
  const isHome = view === 'home'
  const g = GRADES.find((x) => x.slug === grade) || null

  const savedCards = saved
    .map((slug) => {
      const x = GRADES.find((q) => q.slug === slug)
      if (!x) return null
      return {
        slug,
        label: L(x),
        removeLabel: `${s.removeWord} ${L(x)}`,
        onOpen: () => openGrade(slug),
        onRemove: () => removeGrade(slug),
      }
    })
    .filter(Boolean)

  const gradeCards = GRADES.map((x) => ({
    slug: x.slug,
    badge: x.badge,
    label: L(x),
    onOpen: () => openGrade(x.slug),
  }))

  const startLinks = [
    { tag: s.tagVideo, title: s.vEn, desc: s.vEnD, url: VID_EN },
    { tag: s.tagVideo, title: s.vEs, desc: s.vEsD, url: VID_ES },
    { tag: s.tagVideo, title: s.vSc, desc: s.vScD, url: VID_SCORE },
    { tag: s.tagLink, title: s.vHelp, desc: s.vHelpD, url: HELP },
  ]
  const scoreRows = [
    { num: '80', bold: s.s80b, text: s.s80 },
    { num: '90', bold: s.s90b, text: s.s90 },
    { num: '100', bold: s.s100b, text: s.s100 },
  ]
  const appSteps = [
    { n: '1', text: s.app1 },
    { n: '2', text: s.app2 },
    { n: '3', text: s.app3 },
  ]

  // Home current-week banner uses grade 3 as the (shared) calendar reference.
  let homeWeekLine = ''
  let homeDateLine = ''
  if (data) {
    const hp = calendar.currentPos(maxWeek(data, '3'))
    homeWeekLine = `${s.weekWord} ${hp.week} · ${s.dayWord} ${hp.day} ${lang === 'es' ? 'de 5' : 'of 5'}`
    homeDateLine = calendar.fmtDate(calendar.dateOf(hp.week, hp.day), lang)
  }

  // Grade-view data.
  let gradeVM = null
  if (data && g) {
    const pos = calendar.currentPos(maxWeek(data, g.g))
    const wk = week || pos.week
    const day = week && week !== pos.week ? 1 : pos.day
    const last = maxWeek(data, g.g)

    const tonightTasks = []
    skillsFor(data, 'math', g.g, wk, day).forEach((it, i) =>
      tonightTasks.push(taskObj('math', it, g.g, wk, day, i)),
    )
    skillsFor(data, 'ela', g.g, wk, day).forEach((it, i) =>
      tonightTasks.push(taskObj('ela', it, g.g, wk, day, i)),
    )

    const optionalTasks = []
    if (IREAD_GRADES.indexOf(g.g) !== -1) {
      skillsFor(data, 'iread', g.g, wk, day).forEach((it, i) =>
        optionalTasks.push(taskObj('iread', it, g.g, wk, day, i)),
      )
    }
    const fluList = FLU_KEY[g.g] ? data.fluency[FLU_KEY[g.g]] || [] : []
    const fluShown = fluAll ? fluList : fluList.slice(0, 3)
    fluShown.forEach((it) =>
      optionalTasks.push({
        title: it[0],
        url: `https://www.ixl.com/${it[1]}`,
        subject: L(SUBJ.fluency),
        subjColor: SUBJ.fluency.color,
      }),
    )

    const dayNames = WEEKDAY_NAMES[lang] || WEEKDAY_NAMES.en
    let nightsDone = 0
    const weekDays = [1, 2, 3, 4, 5].map((d) => {
      const tasks = []
      skillsFor(data, 'math', g.g, wk, d).forEach((it, i) => tasks.push(taskObj('math', it, g.g, wk, d, i)))
      skillsFor(data, 'ela', g.g, wk, d).forEach((it, i) => tasks.push(taskObj('ela', it, g.g, wk, d, i)))
      if (tasks.length && tasks.every((x) => x.done)) nightsDone++
      const dt = calendar.dateOf(wk, d)
      const shortDate =
        lang === 'es'
          ? `${dt.getDate()} de ${MONTHS.es[dt.getMonth()]}`
          : `${MONTHS.en[dt.getMonth()]} ${dt.getDate()}`
      return {
        label: dayNames[d - 1],
        date: shortDate,
        isToday: pos.state === 'school' && wk === pos.week && d === pos.day,
        tasks,
      }
    })
    const streakDots = [1, 2, 3, 4, 5].map((d) => {
      const wd = weekDays[d - 1]
      const filled = wd.tasks.length > 0 && wd.tasks.every((x) => x.done)
      return { label: dayNames[d - 1], filled }
    })

    const idx = GRADES.map((x) => x.slug).indexOf(g.slug)

    gradeVM = {
      gradeLabel: L(g),
      weekLine: `${s.weekWord} ${wk} · ${s.dayWord} ${day} ${lang === 'es' ? 'de 5' : 'of 5'}`,
      dateLine: calendar.fmtDate(calendar.dateOf(wk, day), lang),
      stateNote:
        pos.state === 'before'
          ? s.beforeStart
          : pos.state === 'weekend'
            ? s.weekendMsg
            : pos.state === 'after'
              ? s.afterEnd
              : '',
      tonightTasks,
      noWork: tonightTasks.length === 0,
      streakText: `${nightsDone} ${s.nightsDone}`,
      streakDots,
      optionalTasks,
      hasOptional: optionalTasks.length > 0,
      hasMoreFluency: fluList.length > 3,
      fluAllLabel: fluAll ? s.fluLess : `${s.fluSeeAll} (${fluList.length})`,
      weekDays,
      weekValue: String(wk),
      weekOptions: Array.from({ length: last }, (_, i) => ({
        value: String(i + 1),
        label: `${s.weekWord} ${i + 1} · ${calendar.fmtDate(calendar.dateOf(i + 1, 1), lang)}`,
      })),
      printWeekLine: `${s.weekWord} ${wk} · ${calendar.fmtDate(calendar.dateOf(wk, 1), lang)}`,
      hasPrevGrade: idx > 0,
      backBody: idx > 0 ? s.backBody : s.backNoneK,
      prevGradeLabel: idx > 0 ? `${s.backBtn} ${L(GRADES[idx - 1])}` : '',
      onPrevGrade: idx > 0 ? () => openGrade(GRADES[idx - 1].slug) : undefined,
    }
  }

  const speechUnavailable = typeof window !== 'undefined' && !window.speechSynthesis

  return (
    <>
      <div className="screen">
        <Header
          isHome={isHome}
          s={s}
          big={big}
          onBack={goHome}
          onToggleBig={toggleBig}
          onToggleLang={toggleLang}
        />
        <main className="main">
          {isHome ? (
            <Home
              s={s}
              showAvatar={config.showAvatar !== false}
              hasVideo={!!video}
              videoUrl={video}
              speaking={speaking}
              speechUnavailable={speechUnavailable}
              onToggleSpeak={toggleSpeak}
              savedCards={savedCards}
              gradeCards={gradeCards}
              homeWeekLine={homeWeekLine}
              homeDateLine={homeDateLine}
            />
          ) : gradeVM ? (
            <GradeView
              s={s}
              gradeLabel={gradeVM.gradeLabel}
              weekLine={gradeVM.weekLine}
              dateLine={gradeVM.dateLine}
              stateNote={gradeVM.stateNote}
              mode={mode}
              onShowTonight={() => setMode('tonight')}
              onShowWeek={() => setMode('week')}
              tonightTasks={gradeVM.tonightTasks}
              noWork={gradeVM.noWork}
              streakText={gradeVM.streakText}
              streakDots={gradeVM.streakDots}
              optionalTasks={gradeVM.optionalTasks}
              hasOptional={gradeVM.hasOptional}
              hasMoreFluency={gradeVM.hasMoreFluency}
              fluAll={fluAll}
              onToggleFluAll={() => setFluAll((v) => !v)}
              fluAllLabel={gradeVM.fluAllLabel}
              weekDays={gradeVM.weekDays}
              weekValue={gradeVM.weekValue}
              weekOptions={gradeVM.weekOptions}
              onWeekChange={(e) => {
                setWeek(Number(e.target.value))
                setFluAll(false)
              }}
              onPrint={() => {
                try {
                  window.print()
                } catch {
                  /* ignore */
                }
              }}
              backTitle={s.backTitle}
              backBody={gradeVM.backBody}
              hasPrevGrade={gradeVM.hasPrevGrade}
              prevGradeLabel={gradeVM.prevGradeLabel}
              onPrevGrade={gradeVM.onPrevGrade}
            />
          ) : null}

          <Accordion
            s={s}
            open={open}
            onToggle={toggleSec}
            startLinks={startLinks}
            scoreRows={scoreRows}
            appSteps={appSteps}
            researchUrl={RESEARCH}
          />

          <HelpFooter s={s} phone={phone} telHref={telHref} smsHref={smsHref} />
        </main>
      </div>

      {gradeVM ? (
        <PrintSheet
          gradeLabel={gradeVM.gradeLabel}
          printWeekLine={gradeVM.printWeekLine}
          weekDays={gradeVM.weekDays}
          printFoot={s.printFoot}
        />
      ) : null}
    </>
  )
}
