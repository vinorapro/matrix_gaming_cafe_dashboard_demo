import { motion } from 'framer-motion'
import { Gamepad2, Headset, Clock, User, Plus, IndianRupee, Power, Play } from 'lucide-react'
import { useData } from '../../context/DataContext'
import StatusBadge from '../ui/StatusBadge'
import { formatClock, cx } from '../../lib/format'

const RING = {
  occupied: 'ring-busy/40 shadow-[0_0_22px_-6px_rgba(239,68,68,0.6)]',
  available: 'ring-live/40 shadow-[0_0_22px_-6px_rgba(34,197,94,0.55)]',
  reserved: 'ring-reserved/40 shadow-[0_0_22px_-6px_rgba(245,158,11,0.55)]',
  maintenance: 'ring-maint/40 shadow-[0_0_22px_-6px_rgba(59,130,246,0.55)]',
}
const GLOW_DOT = {
  occupied: 'bg-busy', available: 'bg-live', reserved: 'bg-reserved', maintenance: 'bg-maint',
}

export default function StationCard({ station, index = 0 }) {
  const { markPayment, extendSession, endSession, startSession } = useData()
  const Icon = station.type === 'VR' ? Headset : Gamepad2
  const busy = station.status === 'occupied'
  const low = busy && station.remaining < 300 // under 5 min

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={cx('relative rounded-2xl glass p-4 ring-1 transition-shadow', RING[station.status])}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-200">
            <Icon size={18} />
          </span>
          <div>
            <div className="text-sm font-bold text-white">{station.label}</div>
            <div className="text-[11px] text-slate-400">{station.type} • ₹{station.price}/hr</div>
          </div>
        </div>
        <span className="relative flex h-3 w-3">
          {busy && <span className={cx('absolute inline-flex h-full w-full rounded-full opacity-60', GLOW_DOT[station.status], 'animate-ping')} />}
          <span className={cx('relative inline-flex h-3 w-3 rounded-full', GLOW_DOT[station.status])} />
        </span>
      </div>

      <div className="mt-3">
        <StatusBadge status={station.status} pulse={busy} />
      </div>

      {/* Occupied / reserved details */}
      {(busy || station.status === 'reserved') ? (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <User size={14} className="text-slate-500" /> {station.customer}
          </div>
          <div className="text-[11px] text-slate-500">Playing: <span className="text-slate-300">{station.game}</span></div>

          <div className={cx('flex items-center justify-between rounded-xl border px-3 py-2',
            low ? 'border-busy/40 bg-busy/10' : 'border-white/5 bg-black/20')}>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Clock size={13} /> {busy ? 'Time left' : 'Starts in'}
            </div>
            <div className={cx('font-display text-lg font-bold tabular-nums', low ? 'text-red-300 animate-pulse' : 'text-white')}>
              {formatClock(station.remaining)}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Start {station.startTime}</span>
            <StatusBadge status={station.payment} />
          </div>

          {busy && (
            <div className="mt-1 grid grid-cols-3 gap-1.5">
              <button onClick={() => extendSession(station.id, 30)}
                className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:bg-white/10">
                <Plus size={12} /> Extend
              </button>
              <button onClick={() => markPayment(station.id)} disabled={station.payment === 'paid'}
                className="flex items-center justify-center gap-1 rounded-lg border border-live/30 bg-live/10 py-1.5 text-[11px] font-semibold text-emerald-300 transition hover:bg-live/20 disabled:opacity-40">
                <IndianRupee size={12} /> Paid
              </button>
              <button onClick={() => endSession(station.id)}
                className="flex items-center justify-center gap-1 rounded-lg border border-busy/30 bg-busy/10 py-1.5 text-[11px] font-semibold text-red-300 transition hover:bg-busy/20">
                <Power size={12} /> End
              </button>
            </div>
          )}
        </div>
      ) : station.status === 'maintenance' ? (
        <div className="mt-4 rounded-xl border border-maint/20 bg-maint/5 px-3 py-4 text-center text-xs text-blue-300">
          Under maintenance
        </div>
      ) : (
        <div className="mt-4">
          <div className="rounded-xl border border-live/20 bg-live/5 px-3 py-3 text-center text-xs text-emerald-300">
            Ready for next player
          </div>
          <button onClick={() => startSession(station.id, 'Walk-in Guest', 60)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent-soft py-2 text-xs font-semibold text-white transition hover:shadow-glow-sm">
            <Play size={13} /> Start Session
          </button>
        </div>
      )}
    </motion.div>
  )
}
