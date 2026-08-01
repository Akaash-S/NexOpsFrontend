import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date into Indian Standard Time (IST) - e.g. "02 Aug 2026, 12:12:10 AM IST"
 */
export function formatIST(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return 'N/A'
  try {
    const raw = typeof dateInput === 'string' ? dateInput.trim() : dateInput
    const dateObj = typeof raw === 'string' && !/[Zz+\-]\d*$/.test(raw)
      ? new Date(raw + 'Z') // Treat naive backend ISO strings as UTC
      : new Date(raw)
    if (isNaN(dateObj.getTime())) return 'N/A'

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
 * Format date into short Indian Standard Time (IST) - e.g. "02 Aug, 12:12 AM IST"
 */
export function formatISTShort(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return 'N/A'
  try {
    const raw = typeof dateInput === 'string' ? dateInput.trim() : dateInput
    const dateObj = typeof raw === 'string' && !/[Zz+\-]\d*$/.test(raw)
      ? new Date(raw + 'Z')
      : new Date(raw)
    if (isNaN(dateObj.getTime())) return 'N/A'

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
