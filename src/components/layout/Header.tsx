'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Globe } from 'lucide-react'
import { navItems } from '@/data/instruments'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    setLoggedIn(document.cookie.includes('auth-token'))
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-surface-900/90 backdrop-blur-xl border-b border-white/[0.04] shadow-lg shadow-black/20' : 'bg-transparent'}`}>
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-heading font-bold text-white text-sm shadow-glow-sm group-hover:shadow-glow-md transition-shadow">T</div>
            <span className="font-heading font-bold text-xl tracking-tight text-text-primary">Trade<span className="text-brand-400">Pro</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => item.children && setDropdown(item.label)} onMouseLeave={() => setDropdown(null)}>
                <Link href={item.href} className="nav-link flex items-center gap-1 px-4 py-2">
                  {item.label}
                  {item.children && <ChevronDown size={14} className="opacity-50" />}
                </Link>
                {item.children && dropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 animate-slide-down">
                    <div className="bg-surface-700/95 backdrop-blur-xl border border-white/[0.06] rounded-xl shadow-2xl shadow-black/40 py-2 min-w-[200px]">
                      {item.children.map((c) => (
                        <Link key={c.label} href={c.href} className="block px-5 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors">{c.label}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-text-muted hover:text-text-secondary transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/[0.03]"><Globe size={15} /><span>EN</span></button>
            {loggedIn ? (
              <>
                <Link href="/client-area/dashboard" className="btn-outline !px-5 !py-2.5 text-sm">Dashboard</Link>
                <Link href="/trader" className="btn-primary !px-5 !py-2.5 text-sm">Open WebTrader</Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-outline !px-5 !py-2.5 text-sm">Login</Link>
                <Link href="/auth/register" className="btn-primary !px-5 !py-2.5 text-sm">Open Account</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/[0.05] transition-colors">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-surface-800/98 backdrop-blur-xl border-t border-white/[0.04] animate-slide-down">
          <div className="px-6 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <div className="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">{item.label}</div>
                    {item.children.map((c) => (
                      <Link key={c.label} href={c.href} className="block px-6 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors" onClick={() => setMobileOpen(false)}>{c.label}</Link>
                    ))}
                  </>
                ) : (
                  <Link href={item.href} className="block px-4 py-3 text-text-primary font-medium" onClick={() => setMobileOpen(false)}>{item.label}</Link>
                )}
              </div>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-white/[0.06]">
              {loggedIn ? (
                <>
                  <Link href="/client-area/dashboard" className="btn-outline text-center text-sm" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link href="/trader" className="btn-primary text-center text-sm" onClick={() => setMobileOpen(false)}>Open WebTrader</Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-outline text-center text-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link href="/auth/register" className="btn-primary text-center text-sm" onClick={() => setMobileOpen(false)}>Open Account</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
