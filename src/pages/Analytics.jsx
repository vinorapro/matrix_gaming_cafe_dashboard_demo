import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from 'recharts'
import { TrendingUp, Clock, Trophy, PieChart as PieIcon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
import GlassCard from '../components/ui/GlassCard'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { revenueByDay, peakHours, popularGames, paymentBreakdown } from '../data/mockData'
import { inr } from '../lib/format'

const PIE_COLORS = ['#22d3ee', '#a855f7', '#22c55e', '#f59e0b']

function ChartTip({ active, payload, label, fmt = (v) => v }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-panel/95 px-3 py-2 text-xs shadow-card backdrop-blur">
      <div className="mb-1 font-semibold text-white">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-slate-300">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          {p.name}: <span className="font-semibold text-white">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { accent, accents } = useTheme()
  const hex = accents[accent].hex

  const weekTotal = revenueByDay.reduce((s, d) => s + d.revenue, 0)
  const peak = peakHours.reduce((m, h) => (h.plays > m.plays ? h : m), peakHours[0])

  const stat = [
    { label: "Today's Revenue", value: revenueByDay.at(-1).revenue, prefix: '₹', sub: '+12% vs yesterday' },
    { label: 'Weekly Revenue', value: weekTotal, prefix: '₹', sub: 'Last 7 days' },
    { label: 'Peak Hour', value: peak.plays, suffix: ' plays', sub: `Busiest at ${peak.hour}` },
    { label: 'Top Game', value: popularGames[0].plays, suffix: ' plays', sub: popularGames[0].name },
  ]

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Business performance at a glance" />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stat.map((s, i) => (
          <GlassCard key={s.label} className="p-4">
            <div className="label">{s.label}</div>
            <div className="mt-1 font-display text-2xl font-bold text-white">
              <AnimatedCounter value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
            </div>
            <div className="mt-1 text-[11px] text-accent">{s.sub}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Daily revenue area */}
        <GlassCard className="lg:col-span-2" hover={false}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><TrendingUp size={18} /></span>
            <div><h3 className="font-display text-sm font-bold text-white">Weekly Revenue Trend</h3>
              <p className="text-[11px] text-slate-400">Daily totals (₹)</p></div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueByDay} margin={{ left: -12, right: 8, top: 4 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={hex} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={hex} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<ChartTip fmt={inr} />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={hex} strokeWidth={2.5} fill="url(#rev)" dot={{ r: 3, fill: hex }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Payment breakdown donut */}
        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><PieIcon size={18} /></span>
            <div><h3 className="font-display text-sm font-bold text-white">Payment Methods</h3>
              <p className="text-[11px] text-slate-400">Share of payments</p></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={paymentBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                {paymentBreakdown.map((e, i) => <Cell key={e.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<ChartTip fmt={(v) => `${v}%`} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {paymentBreakdown.map((p, i) => (
              <div key={p.name} className="flex items-center gap-2 text-xs text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {p.name} <span className="ml-auto font-semibold text-white">{p.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Peak hours bar */}
        <GlassCard className="lg:col-span-2" hover={false}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><Clock size={18} /></span>
            <div><h3 className="font-display text-sm font-bold text-white">Peak Gaming Hours</h3>
              <p className="text-[11px] text-slate-400">Sessions started per hour</p></div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={peakHours} margin={{ left: -16, right: 8, top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="plays" name="Sessions" radius={[6, 6, 0, 0]} fill={hex} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Popular games */}
        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><Trophy size={18} /></span>
            <div><h3 className="font-display text-sm font-bold text-white">Most Popular Games</h3>
              <p className="text-[11px] text-slate-400">By total plays</p></div>
          </div>
          <div className="space-y-3">
            {popularGames.map((g, i) => {
              const pct = Math.round((g.plays / popularGames[0].plays) * 100)
              return (
                <div key={g.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-200">{i + 1}. {g.name}</span>
                    <span className="font-semibold text-white">{g.plays}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-accent shadow-glow-sm transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
