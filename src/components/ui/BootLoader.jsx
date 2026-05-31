import { motion } from 'framer-motion'

export default function BootLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-void"
    >
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" />
      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative grid h-20 w-20 place-items-center rounded-2xl border border-accent/40 bg-accent-soft shadow-glow"
        >
          <span className="font-display text-4xl font-extrabold neon-text">M</span>
          <span className="absolute inset-0 rounded-2xl border border-accent/30 animate-ping2" />
        </motion.div>

        <div className="text-center">
          <div className="font-display text-lg font-bold tracking-[0.3em] text-white">MATRIX</div>
          <div className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Gaming Cafe</div>
        </div>

        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="h-full w-full bg-accent shadow-glow"
          />
        </div>
        <p className="text-xs tracking-wide text-slate-500">Initializing control room…</p>
      </div>
    </motion.div>
  )
}
