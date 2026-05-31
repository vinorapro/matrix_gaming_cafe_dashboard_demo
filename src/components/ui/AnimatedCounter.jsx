import { useEffect, useRef, useState } from 'react'

// Lightweight rAF tween — counts up/over to the target whenever it changes.
export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 900, decimals = 0 }) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef()

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return
    const start = performance.now()
    const ease = (t) => 1 - Math.pow(1 - t, 3)

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const cur = from + (to - from) * ease(p)
      setDisplay(cur)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  const formatted = Number(display).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span>{prefix}{formatted}{suffix}</span>
  )
}
