// Seed data for Matrix Gaming Cafe — Kharghar.
// In production this layer would be backed by Firebase Realtime DB; here it is
// simulated locally so the dashboard runs instantly and still feels "live".

export const CAFE = {
  name: 'Matrix Gaming Cafe',
  location: 'Kharghar, Navi Mumbai',
  tagline: 'PS5 • VR • Esports Arena',
}

const NAMES = [
  'Aarav Sharma', 'Vivaan Patel', 'Reyansh Gupta', 'Ishaan Mehta', 'Kabir Nair',
  'Ananya Rao', 'Diya Joshi', 'Saanvi Iyer', 'Aditya Verma', 'Rohan Desai',
  'Karan Malhotra', 'Neha Kulkarni', 'Arjun Reddy', 'Priya Menon', 'Siddharth Jain',
]

const GAMES = ['EA FC 25', 'Spider-Man 2', 'GT7', 'Mortal Kombat 1', 'Beat Saber VR', 'Tekken 8', 'COD: MW III', 'Half-Life: Alyx']

export const PRICING = {
  ps5: 150, // ₹ per hour
  vr: 300, // ₹ per hour
}

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const pad = (n) => String(n).padStart(2, '0')
const timeStr = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

// ---- Stations / Live slot monitor ----------------------------------------
function makeStation(id, type, label, status) {
  const base = { id, type, label, status, customer: null, game: null, startTime: null, remaining: 0, payment: null, price: type === 'PS5' ? PRICING.ps5 : PRICING.vr }
  if (status === 'occupied' || status === 'reserved') {
    const now = new Date()
    const start = new Date(now.getTime() - Math.floor(Math.random() * 40) * 60000)
    return {
      ...base,
      customer: rand(NAMES),
      game: rand(GAMES),
      startTime: timeStr(start),
      remaining: status === 'occupied' ? Math.floor(Math.random() * 55 + 5) * 60 : Math.floor(Math.random() * 30 + 10) * 60,
      payment: status === 'occupied' ? rand(['paid', 'unpaid']) : 'unpaid',
    }
  }
  return base
}

export const seedStations = [
  makeStation('ps5-1', 'PS5', 'PS5 Station 1', 'occupied'),
  makeStation('ps5-2', 'PS5', 'PS5 Station 2', 'occupied'),
  makeStation('ps5-3', 'PS5', 'PS5 Station 3', 'available'),
  makeStation('ps5-4', 'PS5', 'PS5 Station 4', 'reserved'),
  makeStation('ps5-5', 'PS5', 'PS5 Station 5', 'occupied'),
  makeStation('ps5-6', 'PS5', 'PS5 Station 6', 'available'),
  makeStation('vr-1', 'VR', 'VR Station 1', 'occupied'),
  makeStation('vr-2', 'VR', 'VR Station 2', 'available'),
  makeStation('vr-3', 'VR', 'VR Station 3', 'maintenance'),
]

// ---- Bookings -------------------------------------------------------------
function makeBookings(n) {
  const rows = []
  const statuses = ['Active', 'Paid', 'Unpaid', 'Completed', 'Cancelled']
  const methods = ['UPI', 'Cash', 'Razorpay', 'Card']
  for (let i = 0; i < n; i++) {
    const dur = rand([0.5, 1, 1.5, 2, 3])
    const type = rand(['PS5', 'VR'])
    const startH = 10 + Math.floor(Math.random() * 12)
    const startM = rand([0, 30])
    const status = rand(statuses)
    rows.push({
      id: `MX-${1042 + i}`,
      customer: rand(NAMES),
      phone: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
      type,
      slot: `${pad(startH)}:${pad(startM)} - ${pad(startH + Math.floor(dur))}:${pad((startM + (dur % 1) * 60) % 60)}`,
      duration: dur,
      method: rand(methods),
      amount: Math.round((type === 'PS5' ? PRICING.ps5 : PRICING.vr) * dur),
      status,
    })
  }
  return rows
}
export const seedBookings = makeBookings(24)

// ---- Transactions / billing ----------------------------------------------
function makeTransactions(n) {
  const rows = []
  const methods = ['UPI', 'Cash', 'Razorpay', 'Card']
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.now() - i * (Math.random() * 25 + 5) * 60000)
    rows.push({
      id: `TXN${90210 - i}`,
      bookingId: `MX-${1042 + Math.floor(Math.random() * 24)}`,
      customer: rand(NAMES),
      amount: rand([150, 225, 300, 375, 450, 600, 750, 300, 150]),
      method: rand(methods),
      time: timeStr(d),
      ts: d.getTime(),
      status: rand(['Confirmed', 'Confirmed', 'Confirmed', 'Pending']),
    })
  }
  return rows.sort((a, b) => b.ts - a.ts)
}
export const seedTransactions = makeTransactions(18)

// ---- Customers ------------------------------------------------------------
export const seedCustomers = NAMES.map((name, i) => ({
  id: `CUST-${201 + i}`,
  name,
  phone: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
  visits: Math.floor(Math.random() * 40 + 1),
  spend: Math.floor(Math.random() * 18000 + 600),
  lastVisit: `${Math.floor(Math.random() * 14 + 1)} days ago`,
  member: Math.random() > 0.55,
  favGame: rand(GAMES),
}))

// ---- Memberships ----------------------------------------------------------
export const seedMembers = seedCustomers
  .filter((c) => c.member)
  .map((c, i) => ({
    id: `MBR-${301 + i}`,
    name: c.name,
    phone: c.phone,
    type: rand(['Bronze', 'Silver', 'Gold', 'Platinum']),
    hoursLeft: Math.floor(Math.random() * 40 + 2),
    totalHours: 50,
    expiry: `2026-${pad(Math.floor(Math.random() * 6 + 6))}-${pad(Math.floor(Math.random() * 27 + 1))}`,
  }))

// ---- Analytics ------------------------------------------------------------
export const revenueByDay = [
  { day: 'Mon', revenue: 8400, bookings: 21 },
  { day: 'Tue', revenue: 7200, bookings: 18 },
  { day: 'Wed', revenue: 9600, bookings: 26 },
  { day: 'Thu', revenue: 11200, bookings: 31 },
  { day: 'Fri', revenue: 15800, bookings: 44 },
  { day: 'Sat', revenue: 22400, bookings: 61 },
  { day: 'Sun', revenue: 19600, bookings: 52 },
]

export const peakHours = [
  { hour: '10a', plays: 4 }, { hour: '12p', plays: 9 }, { hour: '2p', plays: 14 },
  { hour: '4p', plays: 22 }, { hour: '6p', plays: 38 }, { hour: '8p', plays: 47 },
  { hour: '10p', plays: 33 }, { hour: '12a', plays: 12 },
]

export const popularGames = [
  { name: 'EA FC 25', plays: 142 },
  { name: 'Spider-Man 2', plays: 118 },
  { name: 'Beat Saber VR', plays: 96 },
  { name: 'Tekken 8', plays: 81 },
  { name: 'GT7', plays: 64 },
]

export const paymentBreakdown = [
  { name: 'UPI', value: 52 },
  { name: 'Cash', value: 24 },
  { name: 'Razorpay', value: 16 },
  { name: 'Card', value: 8 },
]

// ---- Notifications --------------------------------------------------------
export const seedNotifications = [
  { id: 1, type: 'payment', text: '₹400 received via UPI — MX-1051', time: '2m ago', read: false },
  { id: 2, type: 'booking', text: 'New booking: VR Station 1 at 8:30 PM', time: '11m ago', read: false },
  { id: 3, type: 'alert', text: 'Low availability — only 2 PS5 stations free', time: '26m ago', read: false },
  { id: 4, type: 'membership', text: "Karan Malhotra's Gold membership expires in 3 days", time: '1h ago', read: true },
  { id: 5, type: 'payment', text: '₹600 confirmed via Razorpay — MX-1048', time: '2h ago', read: true },
]

export { NAMES, GAMES }
