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
import LoginBanner from './components/LoginBanner.jsx'
import Home from './components/Home.jsx'
import GradeView from './components/GradeView.jsx'
import CodesView from './components/CodesView.jsx'
import Accordion from './components/Accordion.jsx'
import HelpFooter from './components/HelpFooter.jsx'
import PrintSheet from './components/PrintSheet.jsx'

const OPEN_INIT = { start: false, score: false, flu: false, app: false, why: false }

// The IXL Code List lives at #codes (or #codes/<grade>, e.g. #codes/3, or
// #codes/all) so it can be bookmarked or shared as a link.
function parseCodesHash() {
  const m = /^#codes(?:\/([^/?#]+))?/i.exec((typeof window !== 'undefined' && window.location.hash) || '')
  if (!m) return null
  const g = (m[1] || '').toUpperCase()
  if (g === 'ALL') return { grade: 'all' }
  return { grade: GRADES.some((x) => x.g === g) ? g : null }
}
function codesHash(g) {
  return g ? `#codes/${g}` : '#codes'
}

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
  const [codesGrade, setCodesGrade] = useState(null)
  const [codesWeek, setCodesWeek] = useState(null)
  const [openAll, setOpenAll] = useState(false)

  const calendar = useMemo(() => createCalendar(config.startDate, config.breaks), [])

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
    const codesRoute = parseCodesHash()
    if (codesRoute) {
      // A #codes link always wins over the return-visit shortcut.
      setView('codes')
      setCodesGrade(codesRoute.grade || defaultCodesGrade(initSaved))
    } else if (initSaved.length === 1) {
      // Return visit: exactly one saved grade opens straight to it.
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

    // Browser back/forward in and out of #codes.
    const onHash = () => {
      const r = parseCodesHash()
      if (r) {
        setView('codes')
        if (r.grade) setCodesGrade(r.grade)
      } else {
        setView((v) => (v === 'codes' ? 'home' : v))
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => {
      alive = false
      window.removeEventListener('hashchange', onHash)
      try {
        window.speechSynthesis.cancel()
      } catch {
        /* ignore */
      }
    }
  }, [])

  function defaultCodesGrade(savedSlugs) {
    const first = GRADES.find((x) => x.slug === (savedSlugs || [])[0])
    return first ? first.g : 'all'
  }

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
    if (parseCodesHash()) {
      try {
        window.history.pushState(null, '', window.location.pathname + window.location.search)
      } catch {
        /* ignore */
      }
    }
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
  const openCodes = () => {
    const cg = codesGrade || defaultCodesGrade(saved)
    try {
      window.history.pushState(null, '', codesHash(cg))
    } catch {
      /* ignore */
    }
    setCodesGrade(cg)
    setCodesWeek(null)
    setView('codes')
    scrollTop()
  }
  const selectCodesGrade = (cg) => {
    try {
      window.history.replaceState(null, '', codesHash(cg))
    } catch {
      /* ignore */
    }
    setCodesGrade(cg)
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
  const isCodes = view === 'codes'
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

  // "October 12 – October 16" (or "12 de octubre – 16 de octubre").
  const longDate = (dt) =>
    lang === 'es' ? `${dt.getDate()} de ${MONTHS.es[dt.getMonth()]}` : `${MONTHS.en[dt.getMonth()]} ${dt.getDate()}`
  const breakRange = (b) => `${longDate(b.from)} – ${longDate(b.to)}`
  // "Week 7 starts Monday, October 19."
  const resumesLine = (w) => `${s.weekWord} ${w} ${s.resumesWord} ${calendar.fmtDate(calendar.dateOf(w, 1), lang)}.`

  // Home current-week banner uses grade 3 as the (shared) calendar reference.
  let homeWeekLine = ''
  let homeDateLine = ''
  if (data) {
    const hp = calendar.currentPos(maxWeek(data, '3'))
    if (hp.state === 'break') {
      homeWeekLine = `${L(hp.brk)} · ${s.breakNoNew}`
      homeDateLine = `${breakRange(hp.brk)}. ${resumesLine(hp.week)}`
    } else {
      homeWeekLine = `${s.weekWord} ${hp.week} · ${s.dayWord} ${hp.day} ${lang === 'es' ? 'de 5' : 'of 5'}`
      homeDateLine = calendar.fmtDate(calendar.dateOf(hp.week, hp.day), lang)
    }
  }

  // Grade-view data.
  let gradeVM = null
  if (data && g) {
    const pos = calendar.currentPos(maxWeek(data, g.g))
    const wk = week || pos.week
    const day = week && week !== pos.week ? 1 : pos.day
    const last = maxWeek(data, g.g)
    // Break week and no week picked: show the catch-up week, not new skills.
    const breakMode = pos.state === 'break' && !week

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

    // Per-week navigator data. A week is "done" when every task-bearing night
    // that week is fully checked — done state is keyed by week, so each week's
    // progress is independent and persists as new weeks are added.
    const weekComplete = (w) => {
      let hasWork = false
      for (let d = 1; d <= 5; d++) {
        const math = skillsFor(data, 'math', g.g, w, d)
        const ela = skillsFor(data, 'ela', g.g, w, d)
        if (math.length + ela.length === 0) continue
        hasWork = true
        const mathDone = math.every((_, i) => !!done[`${g.g}|${w}|${d}|math|${i}`])
        const elaDone = ela.every((_, i) => !!done[`${g.g}|${w}|${d}|ela|${i}`])
        if (!(mathDone && elaDone)) return false
      }
      return hasWork
    }
    // Week chips, with a marker for each break between weeks. The marker for
    // the break happening now is the way back to the catch-up week.
    const weekNav = []
    for (let w = 1; w <= last; w++) {
      calendar.breaksBefore(w).forEach((b) => {
        const isNow = pos.state === 'break' && pos.brk.en === b.en
        weekNav.push({
          key: `b-${b.en}`,
          isBreak: true,
          label: L(b),
          date: longDate(b.from),
          isCurrent: breakMode && isNow,
          onSelect: isNow ? () => setWeek(null) : null,
        })
      })
      weekNav.push({
        key: `w${w}`,
        week: w,
        date: longDate(calendar.dateOf(w, 1)),
        isCurrent: !breakMode && w === wk,
        done: weekComplete(w),
      })
    }

    // Catch-up list: every required skill still unchecked from the weeks
    // since the last break (or the start), most recent first.
    let catchUp = null
    if (breakMode) {
      let from = pos.week - 1
      while (from > 1 && calendar.breaksBefore(from).length === 0) from--
      const open = []
      for (let w = pos.week - 1; w >= from; w--) {
        for (let d = 1; d <= 5; d++) {
          ;['math', 'ela'].forEach((kind) =>
            skillsFor(data, kind, g.g, w, d).forEach((it, i) => {
              const t = taskObj(kind, it, g.g, w, d, i)
              if (t.done) return
              t.codeLine = `${s.weekWord} ${w} · ${dayNames[d - 1]}${it[2] ? ` · ${tt('codeWord')} ${it[2]}` : ''}`
              open.push(t)
            }),
          )
        }
      }
      catchUp = {
        tasks: openAll ? open : open.slice(0, 6),
        total: open.length,
        hasMore: open.length > 6,
        moreLabel: openAll ? s.showFewer : `${s.showAllOpen} (${open.length})`,
        onToggleMore: () => setOpenAll((v) => !v),
      }
    }

    gradeVM = {
      gradeLabel: L(g),
      weekLine: breakMode
        ? `${L(pos.brk)} · ${s.breakNoNew}`
        : `${s.weekWord} ${wk} · ${s.dayWord} ${day} ${lang === 'es' ? 'de 5' : 'of 5'}`,
      dateLine: breakMode ? breakRange(pos.brk) : calendar.fmtDate(calendar.dateOf(wk, day), lang),
      breakMode,
      catchUp,
      stateNote: breakMode
        ? resumesLine(pos.week)
        : pos.state === 'before'
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
      weekNav,
      printWeekLine: `${s.weekWord} ${wk} · ${calendar.fmtDate(calendar.dateOf(wk, 1), lang)}`,
    }
  }

  // IXL Code List data.
  let codesVM = null
  if (data && isCodes) {
    const cg = codesGrade || 'all'
    const isAll = cg === 'all'
    const gradeMeta = GRADES.find((x) => x.g === cg) || null
    // All grades share one calendar; grade 3 is the reference, as on Home.
    const last = isAll ? Math.max(...GRADES.map((x) => maxWeek(data, x.g))) : maxWeek(data, cg)
    const pos = calendar.currentPos(last)
    const wk = Math.max(1, Math.min(codesWeek || pos.week, last))
    const dayNames = WEEKDAY_NAMES[lang] || WEEKDAY_NAMES.en
    const monShort = (dt) =>
      lang === 'es'
        ? `${dt.getDate()} ${MONTHS.es[dt.getMonth()].slice(0, 3)}`
        : `${MONTHS.en[dt.getMonth()].slice(0, 3)} ${dt.getDate()}`
    const item = (kind, it) => ({
      kind,
      code: it[2] || '',
      title: it[0],
      url: `https://www.ixl.com/${it[1]}`,
    })
    const isToday = (d) => pos.state === 'school' && wk === pos.week && d === pos.day
    const codes = (list) => list.map((x) => x.code).filter(Boolean).join(', ')
    const labels = { math: L(SUBJ.math), ela: L(SUBJ.ela), iread: L(SUBJ.iread) }
    const range = `${monShort(calendar.dateOf(wk, 1))} ${s.toWord} ${monShort(calendar.dateOf(wk, 5))}`
    const dayLine = (d, parts) =>
      `${dayNames[d - 1]} ${monShort(calendar.dateOf(wk, d))}: ${parts.filter(Boolean).join(' · ')}`

    const vm = {
      mode: isAll ? 'all' : 'grade',
      week: wk,
      weekOptions: Array.from({ length: last }, (_, i) => i + 1).flatMap((w) =>
        calendar
          .breaksBefore(w)
          .map((b) => ({ key: `b-${b.en}`, disabled: true, label: `— ${L(b)} · ${monShort(b.from)} —` }))
          .concat({
            key: `w${w}`,
            week: w,
            label: `${s.weekWord} ${w} · ${monShort(calendar.dateOf(w, 1))}${
              w === pos.week ? ` · ${pos.state === 'break' ? s.nextWord : s.nowWord}` : ''
            }`,
          }),
      ),
      breakNote:
        pos.state === 'break'
          ? `${L(pos.brk)} (${monShort(pos.brk.from)} ${s.toWord} ${monShort(pos.brk.to)}): ${s.codesBreakNote}`
          : '',
      onWeek: (w) => setCodesWeek(w),
      canPrev: wk > 1,
      canNext: wk < last,
      onPrev: () => setCodesWeek(Math.max(1, wk - 1)),
      onNext: () => setCodesWeek(Math.min(last, wk + 1)),
      grades: [{ key: 'all', badge: s.allGrades, label: s.allGrades, isOn: isAll, onSelect: () => selectCodesGrade('all') }].concat(
        GRADES.map((x) => ({
          key: x.g,
          badge: x.badge,
          label: L(x),
          isOn: x.g === cg,
          onSelect: () => selectCodesGrade(x.g),
        })),
      ),
      kicker: `${s.weekWord} ${wk} · ${range}`,
      title: isAll ? s.allGrades : L(gradeMeta),
      labels,
    }

    if (!isAll) {
      vm.withIread = IREAD_GRADES.indexOf(cg) !== -1
      vm.days = [1, 2, 3, 4, 5].map((d) => {
        const math = skillsFor(data, 'math', cg, wk, d).map((it) => item('math', it))
        const ela = skillsFor(data, 'ela', cg, wk, d).map((it) => item('ela', it))
        const iread = vm.withIread ? skillsFor(data, 'iread', cg, wk, d).map((it) => item('iread', it)) : []
        return {
          key: `d${d}`,
          label: dayNames[d - 1],
          date: monShort(calendar.dateOf(wk, d)),
          isToday: isToday(d),
          math,
          ela,
          iread,
          copyText: dayLine(d, [
            math.length && `${labels.math} ${codes(math)}`,
            ela.length && `${labels.ela} ${codes(ela)}`,
            iread.length && `${labels.iread} (${s.optionalWord}) ${codes(iread)}`,
          ]),
        }
      })
      vm.copyWeekText = [`${vm.title} · ${vm.kicker}`]
        .concat(vm.days.map((d) => d.copyText))
        .join('\n')
      vm.printDays = vm.days.map((d) => ({
        label: d.label,
        date: d.date,
        tasks: [...d.math.map((x) => [labels.math, x]), ...d.ela.map((x) => [labels.ela, x]), ...d.iread.map((x) => [`${labels.iread} (${s.optionalWord})`, x])].map(
          ([subject, x]) => ({ subject, title: x.title, codeLine: x.code }),
        ),
      }))
    } else {
      const shortDay = (d) => dayNames[d - 1].slice(0, 3)
      vm.dayHeads = [1, 2, 3, 4, 5].map((d) => ({
        key: `h${d}`,
        short: shortDay(d),
        date: monShort(calendar.dateOf(wk, d)),
        isToday: isToday(d),
      }))
      vm.gradeRows = GRADES.map((x) => ({
        key: x.g,
        label: L(x),
        onOpen: () => selectCodesGrade(x.g),
        days: [1, 2, 3, 4, 5].map((d) => ({
          key: `${x.g}${d}`,
          short: shortDay(d),
          isToday: isToday(d),
          items: skillsFor(data, 'math', x.g, wk, d)
            .map((it) => item('math', it))
            .concat(skillsFor(data, 'ela', x.g, wk, d).map((it) => item('ela', it))),
        })),
      }))
      vm.copyWeekText = [`${vm.title} · ${vm.kicker}`]
        .concat(
          vm.gradeRows.map(
            (g) => `${g.label}: ${g.days.map((d) => `${d.short} ${codes(d.items) || '—'}`).join(' | ')}`,
          ),
        )
        .join('\n')
      vm.printDays = vm.gradeRows.map((g) => ({
        label: g.label,
        date: '',
        tasks: g.days.map((d) => ({ subject: '', title: codes(d.items) || '—', codeLine: d.short })),
      }))
    }
    vm.printWeekLine = vm.kicker
    codesVM = vm
  }

  const speechUnavailable = typeof window !== 'undefined' && !window.speechSynthesis

  return (
    <>
      {isCodes ? (
        <div className="screen">
          {codesVM ? (
            <CodesView
              s={s}
              vm={codesVM}
              big={big}
              onHome={goHome}
              onToggleBig={toggleBig}
              onToggleLang={toggleLang}
              onPrint={() => {
                try {
                  window.print()
                } catch {
                  /* ignore */
                }
              }}
            />
          ) : null}
        </div>
      ) : (
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
              <>
                <LoginBanner s={s} />
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
                codesHref={codesHash(null)}
                onOpenCodes={openCodes}
                />
              </>
            ) : gradeVM ? (
              <GradeView
                s={s}
                gradeLabel={gradeVM.gradeLabel}
                weekLine={gradeVM.weekLine}
                dateLine={gradeVM.dateLine}
                stateNote={gradeVM.stateNote}
                breakMode={gradeVM.breakMode}
                catchUp={gradeVM.catchUp}
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
                weekNav={gradeVM.weekNav}
                onSelectWeek={(w) => {
                  setWeek(w)
                  setFluAll(false)
                  scrollTop()
                }}
                onPrint={() => {
                  try {
                    window.print()
                  } catch {
                    /* ignore */
                  }
                }}
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
      )}

      {codesVM ? (
        <PrintSheet
          gradeLabel={codesVM.title}
          printWeekLine={codesVM.printWeekLine}
          weekDays={codesVM.printDays}
          printFoot={s.codesPrintFoot}
          codeFirst
        />
      ) : gradeVM && !isCodes ? (
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
