import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parse date input (string, number, Date) ensuring naive ISO strings without timezone
 * are correctly treated as UTC timestamps.
 */
export function parseUTCDate(dateInput: string | number | Date | null | undefined): Date | null {
  if (!dateInput) return null
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput
  }
  if (typeof dateInput === 'number') {
    const d = new Date(dateInput)
    return isNaN(d.getTime()) ? null : d
  }
  let raw = String(dateInput).trim()
  if (!raw) return null

  // Replace space with T if YYYY-MM-DD HH:MM:SS
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/.test(raw)) {
    raw = raw.replace(' ', 'T')
  }

  // If naive ISO string without 'Z' or offset (+HH:MM / -HH:MM), append 'Z' so JS parses as UTC
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw) && !/[Zz]$/.test(raw) && !/[+\-]\d{2}:?\d{2}$/.test(raw)) {
    raw += 'Z'
  }

  const d = new Date(raw)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Get current user/browser timezone or default to UTC
 */
export function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/**
 * Format date into viewer's local timezone (dynamically detected from browser/device).
 * e.g. "16 Aug 2026, 08:00:00 PM IST" in India, or "Aug 16, 2026, 10:30:00 AM EDT" in New York.
 */
export function formatLocalDate(
  dateInput: string | number | Date | null | undefined,
  includeTimezoneName: boolean = true
): string {
  if (!dateInput) return 'N/A'
  try {
    const dateObj = parseUTCDate(dateInput)
    if (!dateObj) return 'N/A'

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }
    if (includeTimezoneName) {
      options.timeZoneName = 'short'
    }

    return new Intl.DateTimeFormat(undefined, options).format(dateObj)
  } catch {
    return 'N/A'
  }
}

/**
 * Format date into short viewer's local timezone - e.g. "16 Aug, 08:00 PM"
 */
export function formatLocalDateShort(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return 'N/A'
  try {
    const dateObj = parseUTCDate(dateInput)
    if (!dateObj) return 'N/A'

    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj)
  } catch {
    return 'N/A'
  }
}

/**
 * Backwards-compatible aliases for formatIST / formatISTShort.
 * Automatically converts UTC to viewer's actual local timezone rather than hardcoding IST.
 */
export function formatIST(dateInput: string | number | Date | null | undefined): string {
  return formatLocalDate(dateInput, true)
}

export function formatISTShort(dateInput: string | number | Date | null | undefined): string {
  return formatLocalDateShort(dateInput)
}
