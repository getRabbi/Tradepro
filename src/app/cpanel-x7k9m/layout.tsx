'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileCheck, Wallet, BarChart3, FileText, Settings, Gift, Shield, LogOut, Menu, X, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'

const navSections = [
  { title: 'Overview', items: [
    { label: 'Dashboard', href: '/cpanel-x7k9m', icon: LayoutDashboard },
  ]},
  { title: 'Management', items: [
    { label: 'Users', href: '/cpanel-x7k9m/users', icon: Users },
    { label: 'KYC Verification', href: '/cpanel-x7k9m/kyc', icon: FileCheck },
    { label: 'Finance', href: '/cpanel-x7k9m/finance', icon: Wallet },
    { label: 'Trading Monitor', href: '/cpanel-x7k9m/trading', icon: BarChart3 },
  ]},
  { title: 'Content', items: [
    { label: 'Content Manager', href: '/cpanel-x7k9m/content', icon: FileText },
    { label: 'Bonuses', href: '/cpanel-x7k9m/bonuses', icon: Gift },
  ]},
  { title: 'System', items: [
    { label: 'Settings', href: '/cpanel-x7k9m/settings', icon: Settings },
  ]},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [auth, setAuth] = useState<'loading' | 'ok' | 'denied'>('loading')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  // Admin PIN: change this to your secret PIN
  const ADMIN_PIN = 'admin2026'

  useEffect(() => {
    // Check if admin session exists in sessionStorage
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin-auth') === 'ok') {
      setAuth('ok')
    } else {
      setAuth('denied')
    }
  }, [])

  const handlePinLogin = () => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('admin-auth', 'ok')
      setAuth('ok')
    } else {
      setPinError('Incorrect PIN')
    }
  }

  if (auth === 'loading') return <div className="min-h-screen bg-surface-900 flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>

  if (auth === 'denied') return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <div className="glass-card p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-xl bg-accent-red/10 flex items-center justify-center mx-auto mb-4"><Shield size={28} className="text-accent-red" /></div>
        <h1 className="font-heading font-black text-xl text-text-primary mb-2">Admin Panel</h1>
        <p className="text-sm text-text-muted mb-6">Enter admin PIN to continue</p>
        <input type="password" value={pin} onChange={(e) => { setPin(e.target.value); setPinError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handlePinLogin()}
          className="w-full px-4 py-3 rounded-xl bg-surface-600/50 border border-white/[0.06] text-text-primary text-center text-lg font-mono tracking-widest mb-3 focus:outline-none focus:border-brand-500/30" placeholder="••••••••" />
        {pinError && <p className="text-xs text-accent-red mb-3">{pinError}</p>}
        <button onClick={handlePinLogin} className="btn-primary w-full justify-center text-sm">Access Panel</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-surface-800/95 backdrop-blur-xl border-r border-white/[0.04] flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center justify-between px-5 border-b border-white/[0.04]">
          <Link href="/cpanel-x7k9m" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent-red to-accent-orange flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-heading font-black text-sm text-text-primary">Admin<span className="text-accent-red">Panel</span></span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-text-muted"><X size={18} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="px-3 py-1 text-[9px] text-text-muted/40 uppercase tracking-[0.2em] font-black">{section.title}</p>
              {section.items.map((item) => {
                const active = pathname === item.href || (item.href !== '/cpanel-x7k9m' && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all mb-0.5 ${active ? 'bg-accent-red/10 text-accent-red border border-accent-red/15' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'}`}>
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-white/[0.04] space-y-1">
          <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-text-muted hover:text-brand-400 hover:bg-brand-500/5 transition-all">
            <BarChart3 size={16} /> View Site
          </Link>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-text-muted hover:text-accent-red hover:bg-accent-red/5 transition-all w-full text-left">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-60">
        <header className="sticky top-0 z-40 h-14 bg-surface-900/90 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-5">
          <button onClick={() => setOpen(true)} className="lg:hidden text-text-muted"><Menu size={20} /></button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg bg-surface-700/50 flex items-center justify-center text-text-muted hover:text-text-secondary"><Bell size={15} /></button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-red/15 flex items-center justify-center text-accent-red font-bold text-xs">A</div>
              <div className="hidden sm:block"><p className="text-xs font-medium text-text-primary">Admin</p><p className="text-[10px] text-text-muted">Super Admin</p></div>
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-6">{children}</main>
      </div>

      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  )
}
