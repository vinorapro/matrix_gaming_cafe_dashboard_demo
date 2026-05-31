import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Gamepad2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import ParticleField from '../components/ui/ParticleField'
import { CAFE } from '../data/mockData'

export default function Login() {
  const { login } = useData()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@matrixcafe.in')
  const [password, setPassword] = useState('matrix2026')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setTimeout(() => {
      login(email)
      navigate('/', { replace: true })
    }, 850)
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      {/* animated neon background */}
      <div className="absolute inset-0 cyber-grid opacity-40 animate-gridmove" />
      <ParticleField count={60} />
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-500/15 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-accent/40 bg-accent-soft shadow-glow"
          >
            <Gamepad2 className="neon-text" size={30} />
            <span className="absolute inset-0 rounded-2xl border border-accent/40 animate-ping2" />
          </motion.div>
          <h1 className="font-display text-2xl font-extrabold tracking-[0.2em] text-white">MATRIX</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">{CAFE.tagline}</p>
        </div>

        {/* glass card */}
        <div className="glass-card neon-edge p-7 shadow-glow-lg">
          <h2 className="font-display text-lg font-bold text-white">Welcome back, Operator</h2>
          <p className="mt-1 text-sm text-slate-400">Sign in to access the control room.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10" placeholder="you@matrixcafe.in" autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-field px-10" placeholder="••••••••" autoComplete="current-password"
                />
                <button type="button" onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" defaultChecked className="accent-[var(--accent)]" /> Remember me
              </label>
              <a href="#" className="text-accent hover:underline">Forgot password?</a>
            </div>

            <motion.button
              type="submit" whileTap={{ scale: 0.98 }} disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent py-3 font-display text-sm font-bold uppercase tracking-wider text-void shadow-glow transition hover:shadow-glow-lg disabled:opacity-70"
            >
              <span className="absolute inset-0 -translate-x-full bg-white/30 group-hover:animate-shimmer" />
              {loading ? 'Authenticating…' : 'Enter Control Room'}
              {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
            </motion.button>
          </form>

          <div className="mt-5 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 text-center text-[11px] text-slate-400">
            Demo access is pre-filled — just hit <span className="text-accent font-semibold">Enter Control Room</span>.
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          © 2026 Matrix Gaming Cafe • {CAFE.location}
        </p>
      </motion.div>
    </div>
  )
}
