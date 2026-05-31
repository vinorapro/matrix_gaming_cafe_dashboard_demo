import { AnimatePresence, motion } from 'framer-motion'
import { Landmark, RefreshCw, ArrowDownToLine, ShieldCheck } from 'lucide-react'
import { useData } from '../../context/DataContext'
import AnimatedCounter from '../ui/AnimatedCounter'
import { inr, cx } from '../../lib/format'

export default function BankSync() {
  const { kpis, bankPulses, syncOnline, transactions } = useData()
  const settled = Math.round(kpis.todayRevenue * 0.82)
  const pending = kpis.todayRevenue - settled

  return (
    <section className="glass-card neon-edge relative overflow-hidden p-5">
      {/* incoming payment pulses */}
      <div className="pointer-events-none absolute right-6 top-6">
        <AnimatePresence>
          {bankPulses.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -28, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1.2 }}
              className="absolute right-0 whitespace-nowrap rounded-full bg-live/20 px-2.5 py-1 text-[11px] font-bold text-emerald-300 shadow-glow-sm"
            >
              +{inr(p.amount)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent">
          <Landmark size={18} />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-white">Bank Settlement</h2>
          <p className="text-[11px] text-slate-400">Matrix Cafe • HDFC ••4821</p>
        </div>
        <span className={cx('ml-auto flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
          syncOnline ? 'border-live/30 bg-live/10 text-emerald-300' : 'border-reserved/30 bg-reserved/10 text-amber-300')}>
          <RefreshCw size={12} className={syncOnline ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
          {syncOnline ? 'Synced' : 'Syncing…'}
        </span>
      </div>

      {/* live revenue counter */}
      <div className="mt-5 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent-soft to-transparent p-4">
        <div className="label">Today's Settled Revenue</div>
        <div className="mt-1 font-display text-3xl font-extrabold neon-text">
          <AnimatedCounter value={kpis.todayRevenue} prefix="₹" />
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </span>
          Auto-syncing with bank account
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck size={13} className="text-emerald-400" /> Settled
          </div>
          <div className="mt-1 font-display text-lg font-bold text-emerald-300">{inr(settled)}</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ArrowDownToLine size={13} className="text-amber-400" /> In transit
          </div>
          <div className="mt-1 font-display text-lg font-bold text-amber-300">{inr(pending)}</div>
        </div>
      </div>

      <div className="mt-3 text-center text-[11px] text-slate-500">
        {transactions.length} transactions processed today
      </div>
    </section>
  )
}
