// Build-time configuration for the IXL at Home site.
// These mirror the tweakable props in the design prototype. Override via Vite
// env vars (VITE_*) at build time, or edit the defaults here.
//
// SKIP_WEEKS: no-school Mondays (YYYY-MM-DD) that shift week numbering. Empty
// until the school calendar is confirmed — see README "Open items". Each date
// listed is a Monday on which no new week is authored; weeks after it shift.

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
  // No-school Mondays that shift week numbering (see note above).
  skipWeeks: [],
}
