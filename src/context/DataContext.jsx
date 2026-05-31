import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import {
  seedStations, seedBookings, seedTransactions, seedCustomers,
  seedMembers, seedNotifications, PRICING, NAMES, GAMES,
} from '../data/mockData'

const DataContext = createContext(null)

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const pad = (n) => String(n).padStart(2, '0')
const nowStr = () => {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
let idSeq = 91000

export function DataProvider({ children }) {
  // --- auth ---
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('mx-user')
    return raw ? JSON.parse(raw) : null
  })

  // --- core state ---
  const [stations, setStations] = useState(seedStations)
  const [bookings, setBookings] = useState(seedBookings)
  const [transactions, setTransactions] = useState(seedTransactions)
  const [customers] = useState(seedCustomers)
  const [members, setMembers] = useState(seedMembers)
  const [notifications, setNotifications] = useState(seedNotifications)
  const [feed, setFeed] = useState([
    { id: 1, kind: 'payment', text: '₹400 received via UPI', time: nowStr() },
    { id: 2, kind: 'booking', text: 'PS5 Station 2 booked', time: nowStr() },
    { id: 3, kind: 'extend', text: 'VR Session extended by 1 hour', time: nowStr() },
  ])
  const [bankPulses, setBankPulses] = useState([])
  const [syncOnline, setSyncOnline] = useState(true)
  const [settings, setSettings] = useState({
    openTime: '10:00',
    closeTime: '23:30',
    ps5Price: PRICING.ps5,
    vrPrice: PRICING.vr,
    memberDiscount: 15,
    notifyBookings: true,
    notifyPayments: true,
    notifyMembership: true,
  })

  // --- auth actions ---
  const login = useCallback((email) => {
    const u = { email, name: 'Cafe Admin', role: 'Owner' }
    localStorage.setItem('mx-user', JSON.stringify(u))
    setUser(u)
  }, [])
  const logout = useCallback(() => {
    localStorage.removeItem('mx-user')
    setUser(null)
  }, [])

  // --- helpers ---
  const pushFeed = useCallback((kind, text) => {
    setFeed((f) => [{ id: ++idSeq, kind, text, time: nowStr() }, ...f].slice(0, 30))
  }, [])

  const pushNotification = useCallback((type, text) => {
    setNotifications((n) => [{ id: ++idSeq, type, text, time: 'just now', read: false }, ...n].slice(0, 20))
  }, [])

  const addTransaction = useCallback((txn) => {
    const full = {
      id: `TXN${++idSeq}`,
      time: nowStr(),
      ts: Date.now(),
      status: 'Confirmed',
      ...txn,
    }
    setTransactions((t) => [full, ...t].slice(0, 60))
    setBankPulses((p) => [...p, { id: full.id, amount: full.amount }].slice(-6))
    setTimeout(() => setBankPulses((p) => p.filter((x) => x.id !== full.id)), 2600)
    return full
  }, [])

  // --- station actions ---
  const markPayment = useCallback((stationId) => {
    setStations((s) => s.map((st) => (st.id === stationId ? { ...st, payment: 'paid' } : st)))
    const st = stations.find((x) => x.id === stationId)
    if (st) {
      const amt = Math.round(st.price * 1)
      addTransaction({ bookingId: 'WALK-IN', customer: st.customer || 'Walk-in', amount: amt, method: 'Cash' })
      pushFeed('payment', `₹${amt} marked received — ${st.label}`)
      pushNotification('payment', `Cash payment confirmed for ${st.label}`)
    }
  }, [stations, addTransaction, pushFeed, pushNotification])

  const extendSession = useCallback((stationId, mins = 30) => {
    setStations((s) => s.map((st) => (st.id === stationId ? { ...st, remaining: st.remaining + mins * 60 } : st)))
    const st = stations.find((x) => x.id === stationId)
    if (st) pushFeed('extend', `${st.label} extended by ${mins} min`)
  }, [stations, pushFeed])

  const endSession = useCallback((stationId) => {
    const st = stations.find((x) => x.id === stationId)
    setStations((s) => s.map((x) => (x.id === stationId
      ? { ...x, status: 'available', customer: null, game: null, startTime: null, remaining: 0, payment: null }
      : x)))
    if (st) pushFeed('cancel', `${st.label} session ended`)
  }, [stations, pushFeed])

  const startSession = useCallback((stationId, customer, mins = 60) => {
    setStations((s) => s.map((st) => (st.id === stationId
      ? { ...st, status: 'occupied', customer, game: rand(GAMES), startTime: nowStr(), remaining: mins * 60, payment: 'unpaid' }
      : st)))
    const st = stations.find((x) => x.id === stationId)
    if (st) {
      pushFeed('booking', `${st.label} booked — ${customer}`)
      pushNotification('booking', `${st.label} session started for ${customer}`)
    }
  }, [stations, pushFeed, pushNotification])

  // --- booking actions ---
  const updateBookingStatus = useCallback((id, status) => {
    setBookings((b) => b.map((bk) => (bk.id === id ? { ...bk, status } : bk)))
    if (status === 'Paid') {
      const bk = bookings.find((x) => x.id === id)
      if (bk) {
        addTransaction({ bookingId: id, customer: bk.customer, amount: bk.amount, method: bk.method })
        pushFeed('payment', `₹${bk.amount} received via ${bk.method} — ${id}`)
      }
    }
    if (status === 'Cancelled') pushFeed('cancel', `Booking ${id} cancelled`)
  }, [bookings, addTransaction, pushFeed])

  const confirmTransaction = useCallback((id) => {
    setTransactions((t) => t.map((x) => (x.id === id ? { ...x, status: 'Confirmed' } : x)))
    pushFeed('payment', `Transaction ${id} confirmed`)
  }, [pushFeed])

  // --- membership actions ---
  const renewMembership = useCallback((id, hours = 25) => {
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, hoursLeft: x.hoursLeft + hours } : x)))
  }, [])
  const addMember = useCallback((member) => {
    setMembers((m) => [{ id: `MBR-${300 + m.length + 1}`, hoursLeft: 25, totalHours: 25, ...member }, ...m])
    pushNotification('membership', `New member added: ${member.name}`)
  }, [pushNotification])

  // --- live countdown ticker (1s) ---
  useEffect(() => {
    const t = setInterval(() => {
      setStations((s) => s.map((st) => {
        if (st.status === 'occupied' && st.remaining > 0) {
          const remaining = st.remaining - 1
          return { ...st, remaining }
        }
        return st
      }))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  // --- simulated live activity (~8s) ---
  useEffect(() => {
    const t = setInterval(() => {
      const roll = Math.random()
      if (roll < 0.5) {
        const amount = rand([150, 300, 225, 450, 600, 375])
        const method = rand(['UPI', 'UPI', 'Razorpay', 'Cash', 'Card'])
        const customer = rand(NAMES)
        addTransaction({ bookingId: `MX-${1042 + Math.floor(Math.random() * 24)}`, customer, amount, method })
        pushFeed('payment', `₹${amount} received via ${method}`)
        if (settings.notifyPayments) pushNotification('payment', `₹${amount} received via ${method}`)
      } else if (roll < 0.8) {
        const label = `${rand(['PS5', 'VR'])} Station ${Math.floor(Math.random() * 5 + 1)}`
        pushFeed('booking', `${label} booked`)
        if (settings.notifyBookings) pushNotification('booking', `New booking: ${label}`)
      } else {
        pushFeed('extend', `${rand(['PS5', 'VR'])} session extended by 30 min`)
      }
      // occasional sync blip for realism
      if (Math.random() < 0.08) {
        setSyncOnline(false)
        setTimeout(() => setSyncOnline(true), 1800)
      }
    }, 8000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.notifyPayments, settings.notifyBookings])

  // --- derived KPIs ---
  const todayRevenue = transactions
    .filter((t) => t.status === 'Confirmed')
    .reduce((sum, t) => sum + t.amount, 0)
  const activePs5 = stations.filter((s) => s.type === 'PS5' && s.status === 'occupied').length
  const activeVr = stations.filter((s) => s.type === 'VR' && s.status === 'occupied').length
  const available = stations.filter((s) => s.status === 'available').length
  const pendingPayments = stations.filter((s) => s.status === 'occupied' && s.payment === 'unpaid').length
    + transactions.filter((t) => t.status === 'Pending').length
  const bookingsToday = bookings.length

  const markAllRead = useCallback(() => setNotifications((n) => n.map((x) => ({ ...x, read: true }))), [])

  const value = {
    user, login, logout,
    stations, bookings, transactions, customers, members, notifications, feed,
    bankPulses, syncOnline, settings, setSettings,
    markPayment, extendSession, endSession, startSession,
    updateBookingStatus, confirmTransaction, renewMembership, addMember,
    pushFeed, pushNotification, markAllRead,
    kpis: { todayRevenue, activePs5, activeVr, available, pendingPayments, bookingsToday },
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
