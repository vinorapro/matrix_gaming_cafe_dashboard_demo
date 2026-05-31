import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Banknote, CreditCard, Wallet, Receipt, CheckCircle2, Printer } from 'lucide-react'
import { useData } from '../context/DataContext'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import NeonButton from '../components/ui/NeonButton'
import Modal from '../components/ui/Modal'
import { inr, cx } from '../lib/format'
import { CAFE } from '../data/mockData'

const METHOD_ICON = { UPI: Smartphone, Cash: Banknote, Razorpay: Wallet, Card: CreditCard }

export default function Billing() {
  const { transactions, confirmTransaction } = useData()
  const [filter, setFilter] = useState('All')
  const [receipt, setReceipt] = useState(null)

  const totals = useMemo(() => {
    const by = { UPI: 0, Cash: 0, Razorpay: 0, Card: 0 }
    let total = 0
    transactions.forEach((t) => {
      if (t.status === 'Confirmed') { by[t.method] = (by[t.method] || 0) + t.amount; total += t.amount }
    })
    return { by, total }
  }, [transactions])

  const rows = filter === 'All' ? transactions : transactions.filter((t) => t.method === filter)

  return (
    <div>
      <PageHeader title="Payments & Billing" subtitle="Live transactions, settlements and receipts" />

      {/* method summary */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Object.entries(totals.by).map(([method, amount], i) => {
          const Icon = METHOD_ICON[method]
          return (
            <motion.button
              key={method}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setFilter(filter === method ? 'All' : method)}
              className={cx('glass-card neon-edge p-4 text-left transition', filter === method && 'ring-1 ring-accent shadow-glow-sm')}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent"><Icon size={18} /></span>
                <span className="text-[11px] text-slate-500">{method}</span>
              </div>
              <div className="mt-3 font-display text-xl font-bold text-white">{inr(amount)}</div>
            </motion.button>
          )
        })}
      </div>

      {/* transactions */}
      <div className="glass-card neon-edge overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><Receipt size={18} /></span>
            <div>
              <h3 className="font-display text-sm font-bold text-white">Live Transactions</h3>
              <p className="text-[11px] text-slate-400">{rows.length} records {filter !== 'All' && `• ${filter}`}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="label">Confirmed Today</div>
            <div className="font-display text-lg font-bold neon-text">{inr(totals.total)}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold">Transaction</th>
                <th className="px-5 py-3 font-semibold">Booking</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => {
                const Icon = METHOD_ICON[t.method] || Wallet
                return (
                  <motion.tr key={t.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.4) }}
                    className="border-b border-white/5 transition hover:bg-white/[0.03]">
                    <td className="px-5 py-3 font-mono text-xs text-accent">{t.id}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-400">{t.bookingId}</td>
                    <td className="px-5 py-3 text-slate-200">{t.customer}</td>
                    <td className="px-5 py-3 font-semibold text-white">{inr(t.amount)}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-300"><Icon size={14} /> {t.method}</span>
                    </td>
                    <td className="px-5 py-3 tabular-nums text-slate-400">{t.time}</td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status === 'Pending' && (
                          <button onClick={() => confirmTransaction(t.id)} title="Confirm"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-live/30 bg-live/10 text-emerald-300 hover:bg-live/20">
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                        <button onClick={() => setReceipt(t)} title="Receipt"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10">
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* receipt modal */}
      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Payment Receipt"
        footer={<>
          <NeonButton variant="ghost" onClick={() => setReceipt(null)}>Close</NeonButton>
          <NeonButton variant="solid" icon={Printer} onClick={() => window.print()}>Print</NeonButton>
        </>}>
        {receipt && (
          <div className="rounded-xl border border-white/10 bg-abyss/60 p-5">
            <div className="text-center">
              <div className="font-display text-lg font-bold neon-text">{CAFE.name}</div>
              <div className="text-[11px] text-slate-400">{CAFE.location}</div>
            </div>
            <div className="my-4 border-t border-dashed border-white/10" />
            <dl className="space-y-2 text-sm">
              {[
                ['Transaction ID', receipt.id],
                ['Booking ID', receipt.bookingId],
                ['Customer', receipt.customer],
                ['Method', receipt.method],
                ['Time', receipt.time],
                ['Status', receipt.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt className="text-slate-400">{k}</dt><dd className="font-medium text-slate-200">{v}</dd></div>
              ))}
            </dl>
            <div className="my-4 border-t border-dashed border-white/10" />
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-white">TOTAL PAID</span>
              <span className="font-display text-2xl font-extrabold neon-text">{inr(receipt.amount)}</span>
            </div>
            <p className="mt-4 text-center text-[11px] text-slate-500">Thank you for gaming with us! • GST included</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
