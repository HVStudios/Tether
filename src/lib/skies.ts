export interface Sky {
  n: number
  label: string
  g: [string, string]   // light gradient
  dg: [string, string]  // dark gradient
}

export const SKIES: Sky[] = [
  { n:  1, label: 'storm',    g: ['#3a3858', '#5b577d'], dg: ['#23223a', '#3a3858'] },
  { n:  2, label: 'rain',     g: ['#52617e', '#7280a0'], dg: ['#2a3344', '#42516a'] },
  { n:  3, label: 'drizzle',  g: ['#7d8aa2', '#9aa6bf'], dg: ['#3b4555', '#5a6577'] },
  { n:  4, label: 'overcast', g: ['#a4abb8', '#c4c9d2'], dg: ['#4a4f5b', '#666c79'] },
  { n:  5, label: 'hazy',     g: ['#c2bdb4', '#dcd6cc'], dg: ['#54524c', '#76736a'] },
  { n:  6, label: 'breaking', g: ['#cfc7b4', '#e6dcc2'], dg: ['#5a5544', '#7d755e'] },
  { n:  7, label: 'clear',    g: ['#b8d4e3', '#e1ecf2'], dg: ['#3a5566', '#5a7a8e'] },
  { n:  8, label: 'sunny',    g: ['#f3c87a', '#fadfa3'], dg: ['#7d6028', '#a18646'] },
  { n:  9, label: 'golden',   g: ['#ee9a64', '#f6c08a'], dg: ['#7a4220', '#a16238'] },
  { n: 10, label: 'aurora',   g: ['#f5a0b8', '#ffd28a'], dg: ['#7a3a52', '#a16238'] },
]

export function sky(n: number): Sky {
  const idx = Math.max(0, Math.min(9, Math.round(n) - 1))
  return SKIES[idx]
}

export function skyGradient(n: number, isDark: boolean, angle = 180): string {
  const s = sky(n)
  const [a, b] = isDark ? s.dg : s.g
  return `linear-gradient(${angle}deg, ${a}, ${b})`
}

export function skyColors(n: number, isDark: boolean): [string, string] {
  const s = sky(n)
  return isDark ? s.dg : s.g
}
