import { motion } from 'framer-motion'
import { cx } from '../../lib/format'

export default function GlassCard({ children, className, neon = true, hover = true, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { y: -3 } : undefined}
      className={cx('glass-card p-5', neon && 'neon-edge', hover && 'hover:shadow-glow-sm transition-shadow', className)}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
