import { motion } from 'framer-motion'
import AnimatedCounter from '../ui/AnimatedCounter'
import { cx } from '../../lib/format'

export default function KpiCard({ icon: Icon, label, value, prefix = '', suffix = '', trend, tone = 'accent', index = 0 }) {
  const tones = {
    accent: 'text-accent bg-accent-soft border-accent/30',
    green: 'text-emerald-300 bg-live/15 border-live/30',
    red: 'text-red-300 bg-busy/15 border-busy/30',
    amber: 'text-amber-300 bg-reserved/15 border-reserved/30',
    blue: 'text-blue-300 bg-maint/15 border-maint/30',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="glass-card neon-edge group p-4 sm:p-5"
    >
      <div className="flex items-start justify-between">
        <span className={cx('grid h-11 w-11 place-items-center rounded-xl border transition group-hover:shadow-glow-sm', tones[tone])}>
          <Icon size={20} strokeWidth={2.2} />
        </span>
        {trend && (
          <span className={cx('chip', trend.up ? 'text-emerald-300' : 'text-red-300')}>
            {trend.up ? '▲' : '▼'} {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="mt-1 label">{label}</div>
    </motion.div>
  )
}
