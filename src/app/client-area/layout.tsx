'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, FileCheck, History, FileSpreadsheet, User, HelpCircle, LogOut, BarChart3, Menu, X } from 'lucide-react'
import { useState } from 'react'

const sidebarItems = [
  { label: 'Dashboard', href: '/client-area/dashboard', icon: LayoutDashboard },
  { label: 'Deposit', href: '/client-area/deposit', icon: ArrowDownToLine },
  { label: 'Withdrawal', href: '/client-area/withdrawal', icon: ArrowUpFromLine },
  { label: 'Documents', href: '/client-area/documents', icon: FileCheck },
  { label: 'Transactions', href: '/client-area/transactions', icon: History },
  { label: 'Statements', href: '/client-area/statements', icon: FileSpreadsheet },
  { label: 'Profile', href: '/client-area/profile', icon: User },
  { label: 'Support', href: '/client-area/support', icon: HelpCircle },
]

export default function ClientAreaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-800/95 backdrop-blur-xl border-r border-white/[0.04] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.04]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-heading font-bold text-white text-xs">T</div>
            <span className="font-heading font-bold text-lg text-text-primary">Trade<span className="text-brand-400">Pro</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-muted"><X size={20} /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'}`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* WebTrader button */}
        <div className="px-3 py-2">
          <Link href="/trader" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-600/20 border border-brand-500/25 text-brand-300 text-sm font-heading font-semibold hover:bg-brand-600/30 transition-all">
            <BarChart3 size={16} /> Open WebTrader
          </Link>
        </div>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/[0.04]">
          <button onClick={() => {
            document.cookie = 'auth-token=; path=/; max-age=0'
            window.location.href = '/auth/login'
          }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-muted hover:text-accent-red hover:bg-accent-red/5 transition-all w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 bg-surface-900/90 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-text-muted hover:text-text-primary">
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-lg bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-bold">DEMO</div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
