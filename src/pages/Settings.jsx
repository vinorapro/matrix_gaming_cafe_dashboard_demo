import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, IndianRupee, Crown, Bell, Palette, Check, Save, Download, Sun, Moon, FileSpreadsheet } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { cx } from '../lib/format'

function Toggle({ on, onClick, label }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between py-2.5">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={cx('relative h-6 w-11 rounded-full border transition', on ? 'border-accent bg-accent-soft' : 'border-white/15 bg-white/5')}>
        <span className={cx('absolute top-0.5 h-4.5 w-4.5 rounded-full transition-all', on ? 'left-[22px] bg-accent shadow-glow-sm' : 'left-0.5 bg-slate-400')}
          style={{ height: 18, width: 18 }} />
      </span>
    </button>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}

// --- CSV helpers (kept local to avoid adding a new file for a tiny demo feature) ---
const csvEscape = (v) => {
  const s = v === null || v === undefined ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const toCSV = (rows, columns) => {
  const header = columns.map((c) => csvEscape(c.label)).join(',')
  const body = rows.map((r) => columns.map((c) => csvEscape(c.get(r))).join(',')).join('\n')
  return `${header}\n${body}`
}
const downloadFile = (filename, text) => {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function Settings() {
  const { settings, setSettings, transactions, bookings, customers, members } = useData()
  const { accent, setAccent, accents, mode, toggleMode } = useTheme()
  const [draft, setDraft] = useState(settings)
  const [saved, setSaved] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const up = (k, v) => setDraft((d) => ({ ...d, [k]: v }))
  const save = () => {
    setSettings(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const downloadReports = () => {
    const stamp = new Date().toISOString().slice(0, 10)
    downloadFile(`matrix-transactions-${stamp}.csv`, toCSV(transactions, [
      { label: 'Transaction ID', get: (r) => r.id },
      { label: 'Booking ID', get: (r) => r.bookingId },
      { label: 'Customer', get: (r) => r.customer },
      { label: 'Amount', get: (r) => r.amount },
      { label: 'Method', get: (r) => r.method },
      { label: 'Time', get: (r) => r.time },
      { label: 'Status', get: (r) => r.status },
    ]))
    downloadFile(`matrix-bookings-${stamp}.csv`, toCSV(bookings, [
      { label: 'Booking ID', get: (r) => r.id },
      { label: 'Customer', get: (r) => r.customer },
      { label: 'Phone', get: (r) => r.phone },
      { label: 'Station', get: (r) => r.type },
      { label: 'Slot', get: (r) => r.slot },
      { label: 'Duration (h)', get: (r) => r.duration },
      { label: 'Amount', get: (r) => r.amount },
      { label: 'Method', get: (r) => r.method },
      { label: 'Status', get: (r) => r.status },
    ]))
    downloadFile(`matrix-customers-${stamp}.csv`, toCSV(customers, [
      { label: 'Customer ID', get: (r) => r.id },
      { label: 'Name', get: (r) => r.name },
      { label: 'Phone', get: (r) => r.phone },
      { label: 'Visits', get: (r) => r.visits },
      { label: 'Total Spend', get: (r) => r.spend },
      { label: 'Favourite Game', get: (r) => r.favGame },
      { label: 'Last Visit', get: (r) => r.lastVisit },
      { label: 'Member', get: (r) => (r.member ? 'Yes' : 'No') },
    ]))
    downloadFile(`matrix-members-${stamp}.csv`, toCSV(members, [
      { label: 'Member ID', get: (r) => r.id },
      { label: 'Name', get: (r) => r.name },
      { label: 'Phone', get: (r) => r.phone },
      { label: 'Tier', get: (r) => r.type },
      { label: 'Hours Left', get: (r) => r.hoursLeft },
      { label: 'Total Hours', get: (r) => r.totalHours },
      { label: 'Expiry', get: (r) => r.expiry },
    ]))
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your cafe operations">
        <NeonButton icon={Save} variant="solid" onClick={save}>Save Changes</NeonButton>
      </PageHeader>

      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 rounded-xl border border-live/30 bg-live/10 px-4 py-3 text-sm text-emerald-300">
            <Check size={16} /> Settings saved successfully.
          </motion.div>
        )}
        {downloaded && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 rounded-xl border border-live/30 bg-live/10 px-4 py-3 text-sm text-emerald-300">
            <Check size={16} /> Reports downloaded — check your Downloads folder.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Cafe timings */}
        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><Clock size={18} /></span>
            <h3 className="font-display text-sm font-bold text-white">Cafe Timings</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Opening Time"><input type="time" className="input-field" value={draft.openTime} onChange={(e) => up('openTime', e.target.value)} /></Field>
            <Field label="Closing Time"><input type="time" className="input-field" value={draft.closeTime} onChange={(e) => up('closeTime', e.target.value)} /></Field>
          </div>
        </GlassCard>

        {/* Slot pricing */}
        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><IndianRupee size={18} /></span>
            <h3 className="font-display text-sm font-bold text-white">Slot Pricing</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="PS5 / hour (₹)"><input type="number" className="input-field" value={draft.ps5Price} onChange={(e) => up('ps5Price', +e.target.value)} /></Field>
            <Field label="VR / hour (₹)"><input type="number" className="input-field" value={draft.vrPrice} onChange={(e) => up('vrPrice', +e.target.value)} /></Field>
          </div>
        </GlassCard>

        {/* Membership pricing */}
        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><Crown size={18} /></span>
            <h3 className="font-display text-sm font-bold text-white">Membership</h3>
          </div>
          <Field label={`Member discount (${draft.memberDiscount}%)`}>
            <input type="range" min="0" max="40" value={draft.memberDiscount} onChange={(e) => up('memberDiscount', +e.target.value)}
              className="w-full accent-[var(--accent)]" />
          </Field>
          <p className="mt-2 text-xs text-slate-400">Members get {draft.memberDiscount}% off all hourly rates.</p>
        </GlassCard>

        {/* Notifications */}
        <GlassCard hover={false}>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><Bell size={18} /></span>
            <h3 className="font-display text-sm font-bold text-white">Notifications</h3>
          </div>
          <div className="divide-y divide-white/5">
            <Toggle label="Booking confirmations" on={draft.notifyBookings} onClick={() => up('notifyBookings', !draft.notifyBookings)} />
            <Toggle label="Payment confirmations" on={draft.notifyPayments} onClick={() => up('notifyPayments', !draft.notifyPayments)} />
            <Toggle label="Membership expiry alerts" on={draft.notifyMembership} onClick={() => up('notifyMembership', !draft.notifyMembership)} />
          </div>
        </GlassCard>

        {/* Reports / Export */}
        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><FileSpreadsheet size={18} /></span>
            <div>
              <h3 className="font-display text-sm font-bold text-white">Reports</h3>
              <p className="text-[11px] text-slate-400">Export transactions, bookings, customers & members as CSV</p>
            </div>
          </div>
          <p className="mb-3 text-xs text-slate-400">
            Generates 4 CSV files you can open in Excel or Google Sheets — handy for your accountant or monthly review.
          </p>
          <NeonButton icon={Download} variant="solid" onClick={downloadReports}>Download Reports</NeonButton>
        </GlassCard>

        {/* Theme customization */}
        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><Palette size={18} /></span>
            <div>
              <h3 className="font-display text-sm font-bold text-white">Appearance</h3>
              <p className="text-[11px] text-slate-400">Mode &amp; accent color</p>
            </div>
          </div>

          {/* Light / Dark mode toggle */}
          <div className="mb-4">
            <span className="label mb-1.5 block">Mode</span>
            <div className="inline-flex rounded-xl border border-white/10 bg-black/20 p-1">
              {[
                { key: 'dark', label: 'Dark', Icon: Moon },
                { key: 'light', label: 'Light', Icon: Sun },
              ].map(({ key, label, Icon }) => (
                <button key={key} onClick={() => { if (mode !== key) toggleMode() }}
                  className={cx('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                    mode === key ? 'bg-accent text-void shadow-glow-sm' : 'text-slate-400 hover:text-white')}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
          </div>

          <span className="label mb-1.5 block">Accent Color</span>
          <div className="flex flex-wrap gap-3">
            {Object.entries(accents).map(([key, a]) => (
              <button key={key} onClick={() => setAccent(key)}
                className={cx('group relative flex items-center gap-2.5 rounded-xl border px-4 py-3 transition',
                  accent === key ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20')}>
                <span className="h-6 w-6 rounded-full shadow-lg" style={{ background: a.hex, boxShadow: `0 0 14px ${a.hex}` }} />
                <span className="text-sm font-semibold text-white">{a.label}</span>
                {accent === key && <Check size={15} className="text-white" />}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
