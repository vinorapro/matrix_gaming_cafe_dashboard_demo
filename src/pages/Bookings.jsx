import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ArrowUpDown, IndianRupee, XCircle, Gamepad2, Headset, Plus } from 'lucide-react'
import { useData } from '../context/DataContext'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import NeonButton from '../components/ui/NeonButton'
import { inr, cx } from '../lib/format'

const STATUS_FILTERS = ['All', 'Active', 'Paid', 'Unpaid', 'Completed', 'Cancelled']

export default function Bookings() {
  const { bookings, updateBookingStatus } = useData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortAsc, setSortAsc] = useState(false)

  const rows = useMemo(() => {
    let r = [...bookings]
    if (status !== 'All') r = r.filter((b) => b.status === status)
    if (typeFilter !== 'All') r = r.filter((b) => b.type === typeFilter)
    if (query) {
      const q = query.toLowerCase()
      r = r.filter((b) => b.customer.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.phone.includes(q))
    }
    r.sort((a, b) => (sortAsc ? a.amount - b.amount : b.amount - a.amount))
    return r
  }, [bookings, status, typeFilter, query, sortAsc])

  return (
    <div>
      <PageHeader title="Bookings" subtitle={`${rows.length} of ${bookings.length} bookings`}>
        <NeonButton icon={Plus} variant="solid">New Booking</NeonButton>
      </PageHeader>

      {/* toolbar */}
      <div className="glass-card neon-edge mb-4 flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-edge bg-abyss/70 px-3 py-2">
          <Search size={16} className="text-slate-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, booking ID or phone…"
            className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex"><Filter size={14} /> Type</span>
          <div className="flex rounded-xl border border-white/10 bg-black/20 p-1">
            {['All', 'PS5', 'VR'].map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={cx('rounded-lg px-3 py-1.5 text-xs font-semibold transition', typeFilter === t ? 'bg-accent text-void' : 'text-slate-400 hover:text-white')}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setSortAsc((s) => !s)}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white">
            <ArrowUpDown size={14} /> Amount {sortAsc ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* status pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className={cx('rounded-full border px-3 py-1.5 text-xs font-semibold transition',
              status === s ? 'border-accent bg-accent-soft text-white shadow-glow-sm' : 'border-white/10 text-slate-400 hover:text-white')}>
            {s}
          </button>
        ))}
      </div>

      {/* desktop table */}
      <div className="glass-card neon-edge hidden overflow-hidden p-0 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3 font-semibold">Booking ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Station</th>
                <th className="px-4 py-3 font-semibold">Time Slot</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b, i) => (
                <motion.tr key={b.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-mono text-xs text-accent">{b.id}</td>
                  <td className="px-4 py-3 font-medium text-white">{b.customer}</td>
                  <td className="px-4 py-3 text-slate-400">{b.phone}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-slate-300">
                      {b.type === 'VR' ? <Headset size={14} /> : <Gamepad2 size={14} />} {b.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{b.slot}</td>
                  <td className="px-4 py-3 text-slate-400">{b.duration}h</td>
                  <td className="px-4 py-3 font-semibold text-white">{inr(b.amount)}</td>
                  <td className="px-4 py-3 text-slate-300">{b.method}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {(b.status === 'Unpaid' || b.status === 'Active') && (
                        <button onClick={() => updateBookingStatus(b.id, 'Paid')} title="Mark paid"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-live/30 bg-live/10 text-emerald-300 hover:bg-live/20">
                          <IndianRupee size={14} />
                        </button>
                      )}
                      {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                        <button onClick={() => updateBookingStatus(b.id, 'Cancelled')} title="Cancel"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-busy/30 bg-busy/10 text-red-300 hover:bg-busy/20">
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <div className="py-10 text-center text-sm text-slate-500">No bookings match your filters.</div>}
      </div>

      {/* mobile cards */}
      <div className="space-y-3 md:hidden">
        {rows.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="glass-card neon-edge p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-xs text-accent">{b.id}</div>
                <div className="mt-0.5 font-semibold text-white">{b.customer}</div>
                <div className="text-xs text-slate-400">{b.phone}</div>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">Station</span><div className="text-slate-200">{b.type}</div></div>
              <div><span className="text-slate-500">Slot</span><div className="text-slate-200">{b.slot}</div></div>
              <div><span className="text-slate-500">Duration</span><div className="text-slate-200">{b.duration}h • {b.method}</div></div>
              <div><span className="text-slate-500">Amount</span><div className="font-semibold text-white">{inr(b.amount)}</div></div>
            </div>
            <div className="mt-3 flex gap-2">
              {(b.status === 'Unpaid' || b.status === 'Active') && (
                <NeonButton variant="success" icon={IndianRupee} className="flex-1" onClick={() => updateBookingStatus(b.id, 'Paid')}>Mark Paid</NeonButton>
              )}
              {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                <NeonButton variant="danger" icon={XCircle} className="flex-1" onClick={() => updateBookingStatus(b.id, 'Cancelled')}>Cancel</NeonButton>
              )}
            </div>
          </motion.div>
        ))}
        {rows.length === 0 && <div className="py-10 text-center text-sm text-slate-500">No bookings match your filters.</div>}
      </div>
    </div>
  )
}
