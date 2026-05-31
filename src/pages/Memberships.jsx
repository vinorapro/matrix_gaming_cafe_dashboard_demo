import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Plus, RotateCw, Minus, Phone, CalendarClock } from 'lucide-react'
import { useData } from '../context/DataContext'
import PageHeader from '../components/ui/PageHeader'
import NeonButton from '../components/ui/NeonButton'
import Modal from '../components/ui/Modal'
import { cx } from '../lib/format'

const TIER = {
  Bronze: 'from-amber-700/30 to-transparent text-amber-300 border-amber-600/30',
  Silver: 'from-slate-400/20 to-transparent text-slate-200 border-slate-400/30',
  Gold: 'from-yellow-500/25 to-transparent text-yellow-300 border-yellow-500/30',
  Platinum: 'from-cyan-400/20 to-transparent text-cyan-200 border-cyan-400/30',
}

export default function Memberships() {
  const { members, renewMembership, addMember } = useData()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', type: 'Silver' })

  const deduct = (id) => renewMembership(id, -1)
  const submit = () => {
    if (!form.name) return
    addMember({ ...form, expiry: '2026-12-31' })
    setForm({ name: '', phone: '', type: 'Silver' })
    setAdding(false)
  }

  return (
    <div>
      <PageHeader title="Memberships" subtitle={`${members.length} active members`}>
        <NeonButton icon={Plus} variant="solid" onClick={() => setAdding(true)}>Add Membership</NeonButton>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((m, i) => {
          const pct = Math.round((m.hoursLeft / (m.totalHours || 50)) * 100)
          const low = m.hoursLeft <= 5
          return (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={cx('glass-card neon-edge bg-gradient-to-br p-5', TIER[m.type])}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{m.name}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400"><Phone size={11} /> {m.phone}</div>
                </div>
                <span className="chip border border-white/15 bg-white/5"><Crown size={12} /> {m.type}</span>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-400">Hours remaining</span>
                  <span className={cx('font-bold', low ? 'text-red-300' : 'text-white')}>{m.hoursLeft}h / {m.totalHours}h</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-black/30">
                  <div className={cx('h-full rounded-full transition-all', low ? 'bg-busy' : 'bg-accent shadow-glow-sm')} style={{ width: `${Math.max(4, pct)}%` }} />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                <CalendarClock size={12} /> Expires {m.expiry}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <NeonButton variant="success" icon={RotateCw} onClick={() => renewMembership(m.id, 25)}>Renew +25h</NeonButton>
                <NeonButton variant="ghost" icon={Minus} onClick={() => deduct(m.id)}>Deduct 1h</NeonButton>
              </div>
            </motion.div>
          )
        })}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Membership"
        footer={<>
          <NeonButton variant="ghost" onClick={() => setAdding(false)}>Cancel</NeonButton>
          <NeonButton variant="solid" onClick={submit}>Create Member</NeonButton>
        </>}>
        <div className="space-y-4">
          <div>
            <label className="label mb-1.5 block">Member Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </div>
          <div>
            <label className="label mb-1.5 block">Phone Number</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 …" />
          </div>
          <div>
            <label className="label mb-1.5 block">Membership Type</label>
            <div className="flex flex-wrap gap-2">
              {['Bronze', 'Silver', 'Gold', 'Platinum'].map((t) => (
                <button key={t} onClick={() => setForm({ ...form, type: t })}
                  className={cx('rounded-xl border px-3 py-2 text-sm font-semibold transition',
                    form.type === t ? 'border-accent bg-accent-soft text-white' : 'border-white/10 text-slate-400 hover:text-white')}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
