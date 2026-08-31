import type { Lang } from '@/i18n'
import type { ExceptionalHour } from '@/payload-types'

// Exceptions apply to the business as a whole (no per-location relation), so
// this single set of upcoming rows feeds the Locație section, the footer,
// and the JSON-LD layer alike.
const TIMEZONE = 'Europe/Bucharest'
const UPCOMING_LIMIT = 6

// Payload's "day only" date field still stores a full ISO datetime; only the
// date part matters here, so comparing the YYYY-MM-DD slice avoids timezone
// drift from re-parsing it as a Date.
function dateKey(iso: string): string {
  return iso.slice(0, 10)
}

// "Today" in the studio's timezone, not the server's (the container runs UTC).
function todayKey(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(now)
}

// From-today-onward, soonest first, capped so a year of holidays can't flood
// the footer or the JSON-LD block.
export function getUpcomingExceptionalHours(hours: ExceptionalHour[], now = new Date()): ExceptionalHour[] {
  const today = todayKey(now)
  return hours
    .filter((hour) => dateKey(hour.date) >= today)
    .sort((a, b) => dateKey(a.date).localeCompare(dateKey(b.date)))
    .slice(0, UPCOMING_LIMIT)
}

// YYYY-MM-DD, for schema.org's validFrom/validThrough.
export function exceptionalHourDateKey(hour: ExceptionalHour): string {
  return dateKey(hour.date)
}

export function formatExceptionalHourDate(hour: ExceptionalHour, lang: Lang): string {
  const locale = lang === 'ro' ? 'ro-RO' : 'en-GB'
  return new Date(hour.date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

// Special hours only make sense when both bounds are set; a half-filled row
// (e.g. "closed" unticked but no hours entered yet) still reads as closed
// rather than showing "undefined - undefined".
export function isExceptionalHourClosed(hour: ExceptionalHour): boolean {
  return Boolean(hour.closed) || !hour.opensAt || !hour.closesAt
}
