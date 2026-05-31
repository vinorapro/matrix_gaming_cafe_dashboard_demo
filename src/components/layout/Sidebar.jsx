import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LogOut, Wifi } from 'lucide-react'
import { NAV } from './nav'
import { useData } from '../../context/DataContext'
import { CAFE } from '../../data/mockData'
import { cx } from '../../lib/format'

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-accent-soft border border-accent/40 shadow-glow-sm">
        <span className="font-display text-lg font-extrabold neon-text">M</span>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-live animate-pulse" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-sm font-bold tracking-wide text-white">MATRIX</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Control Room</div>
      </div>
    </div>
  )
}

function Links({ onNavigate }) {
  return (
    <nav className="mt-6 flex flex-1 flex-col gap-1 px-2">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) => cx('sidebar-link', isActive && 'sidebar-link-active')}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="nav-glow"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-accent shadow-glow"
                />
              )}
              <item.icon size={18} strokeWidth={2.2} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function SyncFooter() {
  const { syncOnline, logout } = useData()
  return (
    <div className="space-y-3 px-2 pb-4">
      <div className="glass flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs">
        <span className={cx('grid h-7 w-7 place-items-center rounded-lg', syncOnline ? 'bg-live/15 text-emerald-300' : 'bg-reserved/15 text-amber-300')}>
          <Wifi size={14} className={syncOnline ? 'animate-pulse' : ''} />
        </span>
        <div className="leading-tight">
          <div className="font-semibold text-slate-200">Bank Sync</div>
          <div className={syncOnline ? 'text-emerald-400' : 'text-amber-400'}>
            {syncOnline ? 'Live • Connected' : 'Reconnecting…'}
          </div>
        </div>
      </div>
      <button onClick={logout} className="sidebar-link w-full hover:text-red-300">
        <LogOut size={18} /> <span>Sign out</span>
      </button>
    </div>
  )
}

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-abyss/70 backdrop-blur-xl py-5">
        <Brand />
        <Links />
        <SyncFooter />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-white/10 bg-abyss py-5 lg:hidden"
            >
              <div className="flex items-center justify-between pr-3">
                <Brand />
                <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <Links onNavigate={() => setOpen(false)} />
              <SyncFooter />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
