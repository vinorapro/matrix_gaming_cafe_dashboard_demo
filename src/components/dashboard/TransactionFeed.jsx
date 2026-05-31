import { AnimatePresence, motion } from 'framer-motion'
import { Activity, CreditCard, CalendarPlus, Timer, XCircle } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { cx } from '../../lib/format'

const META = {
  payment: { icon: CreditCard, tone: 'text-emerald-300 bg-live/15' },
  booking: { icon: CalendarPlus, tone: 'text-accent bg-accent-soft' },
  extend: { icon: Timer, tone: 'text-amber-300 bg-reserved/15' },
  cancel: { icon: XCircle, tone: 'text-red-300 bg-busy/15' },
}

export default function TransactionFeed() {
  const { feed } = useData()
  return (
    <section className="glass-card neon-edge flex h-full flex-col p-5">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent">
          <Activity size={18} />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-white">Live Activity Feed</h2>
          <p className="text-[11px] text-slate-400">Real-time events</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-live animate-pulse" /> LIVE
        </span>
      </div>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto no-scrollbar pr-1" style={{ maxHeight: 420 }}>
        <AnimatePresence initial={false}>
          {feed.map((e) => {
            const m = META[e.kind] || META.booking
            const Icon = m.icon
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, x: -16, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
              >
                <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-lg', m.tone)}>
                  <Icon size={15} />
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-slate-200">{e.text}</p>
                <span className="shrink-0 text-[11px] tabular-nums text-slate-500">{e.time}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </section>
  )
}
