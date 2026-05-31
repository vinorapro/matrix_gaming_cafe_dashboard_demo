import {
  LayoutDashboard, CalendarClock, Wallet, BarChart3,
  Crown, Users, Settings,
} from 'lucide-react'

export const NAV = [
  { to: '/', label: 'Control Room', icon: LayoutDashboard, end: true },
  { to: '/bookings', label: 'Bookings', icon: CalendarClock },
  { to: '/billing', label: 'Payments & Billing', icon: Wallet },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/memberships', label: 'Memberships', icon: Crown },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
]
