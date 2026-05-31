import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, Search, CreditCard, CalendarPlus, AlertTriangle, Crown, Check } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { cx } from '../../lib/format'

const ICONS = {
  payment: CreditCard,
  booking: CalendarPlus,
  alert: AlertTriangle,
  membership: Crown,
}
const ICON_TONE = {
  payment: 'text-emerald-300 bg-live/15',
  booking: 'text-accent bg-accent-soft',
  alert: 'text-amber-300 bg-reserved/15',
  membership: 'text-purple-300 bg-purple-500/15',
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const date = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  return (
    <div className="hidden sm:block text-right leading-tight">
      <div className="font-display text-sm font-semibold text-white tabular-nums">{time}</div>
      <div className="text-[11px] text-slate-400">{date}</div>
    </div>
  )
}

function NotificationBell() {
  const { notifications, markAllRead } = useData()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-10 w-10 place-items-center rounded-xl glass text-slate-300 hover:text-white hover:shadow-glow-sm transition"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-void shadow-glow">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-50 mt-2 w-80 max-w-[88vw] overflow-hidden rounded-2xl border border-white/10 bg-panel/95 backdrop-blur-xl shadow-card neon-edge"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <span className="font-display text-sm font-bold text-white">Notifications</span>
              <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline">
                <Check size={13} /> Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto no-scrollbar">
              {notifications.map((n) => {
                const Icon = ICONS[n.type] || Bell
                return (
                  <div key={n.id} className={cx('flex gap-3 px-4 py-3 transition hover:bg-white/5', !n.read && 'bg-accent-soft/40')}>
                    <span className={cx('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg', ICON_TONE[n.type] || 'text-slate-300 bg-white/10')}>
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug text-slate-200">{n.text}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{n.time}</p>
                    </div>
                    {!n.read && <span className="ml-auto mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Topbar({ onMenu, title }) {
  const { user } = useData()
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-void/70 px-4 py-3 backdrop-blur-xl lg:px-6">
      <button onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-xl glass text-slate-300 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="min-w-0">
        <h1 className="font-display text-base font-bold tracking-wide text-white sm:text-lg">{title}</h1>
        <p className="hidden text-xs text-slate-400 sm:block">Matrix Gaming Cafe • Kharghar</p>
      </div>

      <div className="ml-auto hidden items-center gap-2 rounded-xl glass px-3 py-2 md:flex">
        <Search size={16} className="text-slate-500" />
        <input placeholder="Search bookings, customers…" className="w-44 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none xl:w-56" />
      </div>

      <Clock />
      <NotificationBell />

      <div className="flex items-center gap-2.5 rounded-xl glass px-2 py-1.5 pr-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-void font-display text-sm font-bold">
          {(user?.name || 'A')[0]}
        </div>
        <div className="hidden leading-tight sm:block">
          <div className="text-xs font-semibold text-white">{user?.name || 'Admin'}</div>
          <div className="text-[10px] text-slate-400">{user?.role || 'Owner'}</div>
        </div>
      </div>
    </header>
  )
}
