import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// Accent presets — value is an "r g b" string used by Tailwind's rgb(var(--accent))
export const ACCENTS = {
  cyan: { label: 'Cyan', rgb: '34 211 238', hex: '#22d3ee' },
  green: { label: 'Green', rgb: '34 197 94', hex: '#22c55e' },
  red: { label: 'Red', rgb: '244 63 94', hex: '#f43f5e' },
  blue: { label: 'Blue', rgb: '59 130 246', hex: '#3b82f6' },
  purple: { label: 'Purple', rgb: '168 85 247', hex: '#a855f7' },
}

export function ThemeProvider({ children }) {
  const [accent, setAccent] = useState(() => localStorage.getItem('mx-accent') || 'cyan')
  const [mode, setMode] = useState(() => localStorage.getItem('mx-mode') || 'dark')

  useEffect(() => {
    const a = ACCENTS[accent] || ACCENTS.cyan
    document.documentElement.style.setProperty('--accent', a.rgb)
    localStorage.setItem('mx-accent', accent)
  }, [accent])

  useEffect(() => {
    document.documentElement.classList.toggle('light', mode === 'light')
    localStorage.setItem('mx-mode', mode)
  }, [mode])

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ accent, setAccent, accents: ACCENTS, mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
