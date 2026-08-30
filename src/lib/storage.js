// Guarded localStorage helpers. Every access is wrapped so the app renders
// correctly when storage is unavailable (private windows, cleared data, or a
// browser that throws on access).

export function readString(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

// Persisted-state keys (see README "State management").
export const KEYS = {
  lang: 'mbl-ixl-lang',
  big: 'mbl-ixl-big',
  grades: 'mbl-ixl-grades',
  done: 'mbl-ixl-done',
}
