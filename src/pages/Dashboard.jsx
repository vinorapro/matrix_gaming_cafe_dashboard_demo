import { IndianRupee, Gamepad2, Headset, CircleDot, Clock4, CalendarCheck } from 'lucide-react'
import { useData } from '../context/DataContext'
import KpiCard from '../components/dashboard/KpiCard'
import SlotMonitor from '../components/dashboard/SlotMonitor'
import TransactionFeed from '../components/dashboard/TransactionFeed'
import BankSync from '../components/dashboard/BankSync'

export default function Dashboard() {
  const { kpis } = useData()

  const cards = [
    { icon: IndianRupee, label: "Today's Revenue", value: kpis.todayRevenue, prefix: '₹', tone: 'green', trend: { up: true, value: '12%' } },
    { icon: Gamepad2, label: 'Active PS5 Slots', value: kpis.activePs5, tone: 'accent' },
    { icon: Headset, label: 'Active VR Slots', value: kpis.activeVr, tone: 'blue' },
    { icon: CircleDot, label: 'Available Stations', value: kpis.available, tone: 'green' },
    { icon: Clock4, label: 'Pending Payments', value: kpis.pendingPayments, tone: 'amber' },
    { icon: CalendarCheck, label: 'Bookings Today', value: kpis.bookingsToday, tone: 'accent', trend: { up: true, value: '8%' } },
  ]

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c, i) => (
          <KpiCard key={c.label} {...c} index={i} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SlotMonitor />
        </div>
        <div className="space-y-5">
          <BankSync />
          <TransactionFeed />
        </div>
      </div>
    </div>
  )
}
