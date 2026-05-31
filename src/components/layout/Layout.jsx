import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { NAV } from './nav'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const current = NAV.find((n) => (n.end ? n.to === location.pathname : location.pathname.startsWith(n.to)))
  const title = current?.label || 'Control Room'

  return (
    <div className="relative flex min-h-screen">
      {/* Ambient animated grid + slow scan line */}
      <div className="pointer-events-none fixed inset-0 cyber-grid opacity-[0.35] animate-gridmove" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-scan" />
      </div>

      <Sidebar open={open} setOpen={setOpen} />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} title={title} />
        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
