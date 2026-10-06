// Build-time configuration for the IXL at Home site.
// These mirror the tweakable props in the design prototype. Override via Vite
// env vars (VITE_*) at build time, or edit the defaults here.
//
// BREAKS: full weeks with no school, from the Matchbook Learning School
// Calendar 2026-2027. No new skills are assigned in a break week — the site
// shows a catch-up week instead — and week numbering resumes after it, so the
// sheet's "Week 7" lands on the first school week after Fall Break. Single days
// off (Labor Day, PD days, etc.) do not skip a week.

const env = import.meta.env ?? {}

export const config = {
  // Embed URL for the recorded welcome clip; empty hides the video slot.
  welcomeVideoUrl: env.VITE_WELCOME_VIDEO_URL || '',
  // Show/hide the whole welcome card.
  showAvatar: env.VITE_SHOW_AVATAR ? env.VITE_SHOW_AVATAR !== 'false' : true,
  // Drives the display text and the tel:/sms: hrefs.
  officePhone: env.VITE_OFFICE_PHONE || '(317) 226-4263',
  // Language before the visitor chooses.
  defaultLang: env.VITE_DEFAULT_LANG === 'es' ? 'es' : 'en',
  // Monday of Week 1; all week/day math derives from it.
  startDate: env.VITE_START_DATE || '2026-08-31',
  // Full no-school weeks (see note above). `start`/`end` are inclusive.
  breaks: [
    { start: '2026-10-12', end: '2026-10-16', en: 'Fall Break', es: 'Receso de otoño' },
    { start: '2026-11-23', end: '2026-11-27', en: 'Thanksgiving Break', es: 'Receso de Acción de Gracias' },
    { start: '2026-12-21', end: '2027-01-01', en: 'Winter Break', es: 'Receso de invierno' },
    { start: '2027-03-29', end: '2027-04-02', en: 'Spring Break', es: 'Receso de primavera' },
  ],
}
