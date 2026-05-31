import { useEffect, useRef } from 'react'

// Lightweight canvas particle field. Capped particle count + DPR clamp keep it
// smooth on mobile. Honors prefers-reduced-motion by skipping the animation.
export default function ParticleField({ count = 46, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    let raf
    let w, h
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '34 211 238'

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const n = reduce ? Math.floor(count / 3) : count
    const parts = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.2,
    }))

    const draw = () => {
      const c = accent()
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.fillStyle = `rgba(${c.split(' ').join(',')}, ${p.a})`
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgba(${c.split(' ').join(',')}, 0.8)`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
