import { format, parseISO, isToday, isYesterday } from 'date-fns'

export function formatEntryDate(isoString: string): string {
  const date = parseISO(isoString)
  if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`
  if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`
  return format(date, 'MMM d, yyyy · h:mm a')
}

export function formatChartDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d')
}

export function toLocalDateString(isoString: string): string {
  return format(parseISO(isoString), 'yyyy-MM-dd')
}
