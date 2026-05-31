# 🎮 Matrix Gaming Cafe — Control Room

A modern, futuristic admin dashboard for **Matrix Gaming Cafe**, a premium PS5 & VR gaming cafe in Kharghar, Navi Mumbai.

Cyberpunk / neon UI, glassmorphism panels, RGB glow, smooth animations — built to feel like a real esports operating system while staying lightweight and practical for daily staff use. Fully responsive (mobile-first), so the owner can check bookings, view revenue and mark payments straight from a phone.

---

## ✨ Features

| Section | What it does |
|---|---|
| **Login** | Animated neon background, floating particles, glass login card, "Enter Control Room" |
| **Control Room (Home)** | 6 live animated KPI cards, live slot monitor, live activity feed, bank settlement panel |
| **Live Slot Monitor** | Every PS5 / VR station with status (Available / Occupied / Reserved / Maintenance), customer, game, **live countdown timer**, start time, payment status, and Extend / Mark Paid / End-Session actions |
| **Bookings** | Searchable, filterable, sortable table (+ mobile card view) with quick Pay / Cancel actions |
| **Payments & Billing** | Live transactions by method (UPI / Cash / Razorpay / Card), confirm payments, printable receipts |
| **Bank Integration** | Simulated live bank sync — incoming payment pulses, animated revenue counter, settlement summary |
| **Analytics** | Weekly revenue trend, peak gaming hours, most-popular games, payment-method breakdown (Recharts) |
| **Memberships** | Tiered members, hours-remaining bars, add / renew / deduct hours |
| **Customers** | Searchable directory with visits, spend, favourite game and booking history |
| **Notifications** | Dropdown notification center with unread badge counter |
| **Settings** | Cafe timings, slot & membership pricing, notification toggles, and **live theme accent switching** (Cyan / Green / Red / Blue / Purple) |

---

## 🧱 Tech Stack

- **React 18** + **Vite** (fast dev/build)
- **Tailwind CSS** (custom cyberpunk theme, CSS-variable-driven accent colors)
- **Framer Motion** (page transitions, micro-interactions)
- **Recharts** (analytics charts, lazy-loaded)
- **lucide-react** (icons)
- **react-router-dom** (routing + auth guard)

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start the dev server (opens http://localhost:5173)
npm run dev

# production build
npm run build

# preview the production build
npm run preview
```

### Demo login
The login form is pre-filled — just click **Enter Control Room**.
(Email `admin@matrixcafe.in`, password `matrix2026`.)

---

## ⚡ Performance

- Route pages are **code-split** (`React.lazy`) — the Analytics/Recharts bundle only loads when you open that page.
- Vendor libraries are split into cacheable chunks (`react`, `charts`, `motion`, `icons`).
- The particle field caps particle count, clamps device-pixel-ratio, and **respects `prefers-reduced-motion`**.
- One shared 1-second ticker drives all live countdowns; activity is simulated on an 8-second interval.

---

## 🔌 About the "live" data

To keep the dashboard **runnable instantly with zero setup**, the real-time layer is
**simulated locally** in [`src/context/DataContext.jsx`](src/context/DataContext.jsx):
countdowns tick, payments stream into the feed, the bank panel pulses, and KPIs update live.

Swapping in **Firebase Realtime Database** later is straightforward — replace the
`useState(seed…)` initializers and the simulation `setInterval`s in `DataContext`
with Firebase listeners (`onValue`) and writes (`update` / `set`). Every page reads
from the same context, so the UI needs no changes.

Seed/mock data lives in [`src/data/mockData.js`](src/data/mockData.js).

---

## 📁 Project Structure

```
src/
├── main.jsx                 # app entry + providers
├── App.jsx                  # routes, auth guard, lazy pages
├── index.css                # cyberpunk theme, fonts, utilities
├── context/
│   ├── ThemeContext.jsx     # accent-color theming (CSS variables)
│   └── DataContext.jsx      # simulated real-time store + actions
├── data/mockData.js         # seed data
├── lib/format.js            # ₹ formatting, countdown clock, cx()
├── components/
│   ├── layout/              # Sidebar, Topbar (notifications), Layout, nav
│   ├── ui/                  # GlassCard, NeonButton, AnimatedCounter, Modal, ParticleField, …
│   └── dashboard/           # KpiCard, SlotMonitor, StationCard, TransactionFeed, BankSync
└── pages/                   # Login, Dashboard, Bookings, Billing, Analytics, Memberships, Customers, Settings
```

---

© 2026 Matrix Gaming Cafe • Kharghar, Navi Mumbai
