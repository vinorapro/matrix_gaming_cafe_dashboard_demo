import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Phone, History, Crown, Gamepad2, IndianRupee, Repeat } from 'lucide-react'
import { useData } from '../context/DataContext'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import StatusBadge from '../components/ui/StatusBadge'
import { inr, cx } from '../lib/format'

export default function Customers() {
  const { customers, bookings } = useData()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const rows = useMemo(() => {
    const q = query.toLowerCase()
    return customers
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q))
      .sort((a, b) => b.spend - a.spend)
  }, [customers, query])

  // booking history for the selected customer (fallback sample if none match)
  const history = selected
    ? bookings.filter((b) => b.customer === selected.name).slice(0, 6)
    : []

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} registered customers`} />

      <div className="glass-card neon-edge mb-4 flex items-center gap-2 p-4">
        <Search size={16} className="text-slate-500" />
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customer by name or phone…"
          className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((c, i) => (
          <motion.div key={c.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}
            className="glass-card neon-edge p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-void font-display font-bold">
                {c.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-white">{c.name}</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400"><Phone size={11} /> {c.phone}</div>
              </div>
              {c.member && <span className="chip border border-yellow-500/30 bg-yellow-500/10 text-yellow-300"><Crown size={11} /> Member</span>}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white/[0.03] py-2">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500"><Repeat size={10} /> Visits</div>
                <div className="font-display text-sm font-bold text-white">{c.visits}</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] py-2">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500"><IndianRupee size={10} /> Spend</div>
                <div className="font-display text-sm font-bold text-white">{inr(c.spend)}</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] py-2">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500"><Gamepad2 size={10} /> Fav</div>
                <div className="truncate px-1 text-[11px] font-semibold text-white">{c.favGame}</div>
              </div>
            </div>

            <button onClick={() => setSelected(c)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10">
              <History size={13} /> View History
            </button>
          </motion.div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.name} — History` : ''}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[['Visits', selected.visits], ['Total Spend', inr(selected.spend)], ['Last Visit', selected.lastVisit]].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center">
                  <div className="label">{k}</div>
                  <div className="mt-1 text-sm font-bold text-white">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="label mb-2">Recent Bookings</div>
              <div className="space-y-2">
                {(history.length ? history : bookings.slice(0, 4)).map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm">
                    <div>
                      <div className="font-mono text-xs text-accent">{b.id}</div>
                      <div className="text-[11px] text-slate-400">{b.type} • {b.slot}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{inr(b.amount)}</div>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
