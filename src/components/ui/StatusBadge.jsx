import { cx } from '../../lib/format'

// Status -> visual style map covering stations, bookings and transactions.
const MAP = {
  // stations
  available: { dot: 'bg-live', text: 'text-emerald-300', bg: 'bg-live/10 border-live/30', label: 'Available' },
  occupied: { dot: 'bg-busy', text: 'text-red-300', bg: 'bg-busy/10 border-busy/30', label: 'Occupied' },
  reserved: { dot: 'bg-reserved', text: 'text-amber-300', bg: 'bg-reserved/10 border-reserved/30', label: 'Reserved' },
  maintenance: { dot: 'bg-maint', text: 'text-blue-300', bg: 'bg-maint/10 border-maint/30', label: 'Maintenance' },
  // bookings / txns
  Paid: { dot: 'bg-live', text: 'text-emerald-300', bg: 'bg-live/10 border-live/30', label: 'Paid' },
  Unpaid: { dot: 'bg-busy', text: 'text-red-300', bg: 'bg-busy/10 border-busy/30', label: 'Unpaid' },
  Active: { dot: 'bg-accent', text: 'text-accent', bg: 'bg-accent-soft border-accent/30', label: 'Active' },
  Completed: { dot: 'bg-slate-400', text: 'text-slate-300', bg: 'bg-white/5 border-white/10', label: 'Completed' },
  Cancelled: { dot: 'bg-busy', text: 'text-red-300/80', bg: 'bg-white/5 border-white/10', label: 'Cancelled' },
  Confirmed: { dot: 'bg-live', text: 'text-emerald-300', bg: 'bg-live/10 border-live/30', label: 'Confirmed' },
  Pending: { dot: 'bg-reserved', text: 'text-amber-300', bg: 'bg-reserved/10 border-reserved/30', label: 'Pending' },
  paid: { dot: 'bg-live', text: 'text-emerald-300', bg: 'bg-live/10 border-live/30', label: 'Paid' },
  unpaid: { dot: 'bg-reserved', text: 'text-amber-300', bg: 'bg-reserved/10 border-reserved/30', label: 'Unpaid' },
}

export default function StatusBadge({ status, pulse = false }) {
  const s = MAP[status] || MAP.Completed
  return (
    <span className={cx('chip border', s.bg, s.text)}>
      <span className={cx('h-1.5 w-1.5 rounded-full', s.dot, pulse && 'animate-pulse')} />
      {s.label}
    </span>
  )
}
