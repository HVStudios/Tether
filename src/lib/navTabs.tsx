interface IconProps { active?: boolean }

export function NavIconLog({ active }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function NavIconHistory({ active }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 8v4l3 2" />
    </svg>
  )
}

export function NavIconStats({ active }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </svg>
  )
}

export const NAV_TABS = [
  { to: '/log',     label: 'Log',     Icon: NavIconLog },
  { to: '/history', label: 'History', Icon: NavIconHistory },
  { to: '/chart',   label: 'Stats',   Icon: NavIconStats },
]
