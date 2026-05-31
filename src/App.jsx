import { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useData } from './context/DataContext'
import Layout from './components/layout/Layout'
import BootLoader from './components/ui/BootLoader'
import PageSpinner from './components/ui/PageSpinner'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

// Heavier / less-frequent pages are code-split so the first paint stays light.
const Bookings = lazy(() => import('./pages/Bookings'))
const Billing = lazy(() => import('./pages/Billing'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Memberships = lazy(() => import('./pages/Memberships'))
const Customers = lazy(() => import('./pages/Customers'))
const Settings = lazy(() => import('./pages/Settings'))

function RequireAuth({ children }) {
  const { user } = useData()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

export default function App() {
  const { user } = useData()
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1700)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence>{booting && <BootLoader key="boot" />}</AnimatePresence>

      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/memberships" element={<Memberships />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
