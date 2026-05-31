import { motion } from 'framer-motion'
import { cx } from '../../lib/format'

const variants = {
  primary: 'bg-accent-soft text-white border border-accent/40 hover:shadow-glow hover:border-accent',
  ghost: 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:text-white',
  danger: 'bg-busy/15 text-red-300 border border-busy/30 hover:bg-busy/25 hover:shadow-[0_0_18px_rgba(239,68,68,0.4)]',
  success: 'bg-live/15 text-emerald-300 border border-live/30 hover:bg-live/25 hover:shadow-[0_0_18px_rgba(34,197,94,0.4)]',
  solid: 'bg-accent text-void font-bold border border-accent hover:shadow-glow',
}

export default function NeonButton({ children, variant = 'primary', className, icon: Icon, ...rest }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {Icon && <Icon size={16} strokeWidth={2.4} />}
      {children}
    </motion.button>
  )
}
