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
 * Format date into Indian Standard Time (IST) - e.g. "02 Aug 2026, 10:21:34 am IST"
 */
export function formatIST(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return 'N/A'
  try {
    const dateObj = parseUTCDate(dateInput)
    if (!dateObj) return 'N/A'

    return dateObj.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }) + ' IST'
  } catch {
    return 'N/A'
  }
}

/**
 * Format date into short Indian Standard Time (IST) - e.g. "02 Aug, 10:21 am IST"
 */
export function formatISTShort(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return 'N/A'
  try {
    const dateObj = parseUTCDate(dateInput)
    if (!dateObj) return 'N/A'

    return dateObj.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) + ' IST'
  } catch {
    return 'N/A'
  }
}
