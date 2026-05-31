import { useState } from 'react'
import { motion } from 'framer-motion'
import { MonitorPlay } from 'lucide-react'
import { useData } from '../../context/DataContext'
import StationCard from './StationCard'
import { cx } from '../../lib/format'

const FILTERS = ['All', 'PS5', 'VR', 'Available']
const LEGEND = [
  { label: 'Available', cls: 'bg-live' },
  { label: 'Occupied', cls: 'bg-busy' },
  { label: 'Reserved', cls: 'bg-reserved' },
  { label: 'Maintenance', cls: 'bg-maint' },
]

export default function SlotMonitor() {
  const { stations } = useData()
  const [filter, setFilter] = useState('All')

  const shown = stations.filter((s) => {
    if (filter === 'All') return true
    if (filter === 'Available') return s.status === 'available'
    return s.type === filter
  })

  return (
    <section className="glass-card neon-edge p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent">
            <MonitorPlay size={18} />
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-white">Live Slot Monitor</h2>
            <p className="text-[11px] text-slate-400">Real-time station activity</p>
          </div>
        </div>

        <div className="flex rounded-xl border border-white/10 bg-black/20 p-1">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cx('relative rounded-lg px-3 py-1.5 text-xs font-semibold transition', filter === f ? 'text-void' : 'text-slate-400 hover:text-white')}>
              {filter === f && <motion.span layoutId="slot-filter" className="absolute inset-0 rounded-lg bg-accent" />}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className={cx('h-2 w-2 rounded-full', l.cls)} /> {l.label}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((s, i) => (
          <StationCard key={s.id} station={s} index={i} />
        ))}
      </div>
    </section>
  )
}
