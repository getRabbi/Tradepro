'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTraderStore } from '@/lib/traderStore'
import { calculateMarginLevel } from '@/lib/tradeEngine'
import { Settings, User, Bell, Wifi, X } from 'lucide-react'

export default function TraderTopBar() {
  const { accountMode, accountNumber, totalProfit, balance, equity, freeMargin, marginUsed, activeTopTab, setActiveTopTab, openPositions } = useTraderStore()
  const [showVip, setShowVip] = useState(false)

  const marginLevel = marginUsed > 0 ? calculateMarginLevel(equity, marginUsed) : Infinity
  const marginLevelStr = marginLevel === Infinity ? '—' : `${marginLevel.toFixed(0)}%`
  const marginColor = marginLevel > 500 ? 'text-accent-green' : marginLevel > 100 ? 'text-accent-orange' : 'text-accent-red'

  return (
    <div className="h-11 bg-surface-800/95 backdrop-blur-sm border-b border-white/[0.06] flex items-center justify-between px-3 shrink-0">
      {/* Left - Logo + Account */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-1.5 mr-1">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-heading font-black text-white text-[9px] shadow-glow-sm">T</div>
          <span className="font-heading font-black text-[13px] text-text-primary hidden sm:inline tracking-tight">Trade<span className="text-brand-400">Pro</span></span>
        </Link>

        <div className="h-5 w-px bg-white/[0.06]" />

        <div className="flex items-center gap-1.5">
          <span className={`px-1.5 py-[2px] rounded text-[9px] font-black tracking-wider ${accountMode === 'DEMO' ? 'bg-accent-green/15 text-accent-green ring-1 ring-accent-green/20' : 'bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/20'}`}>
            {accountMode}
          </span>
          <span className="text-[10px] text-text-muted/60 font-mono">{accountNumber}</span>
        </div>
      </div>

      {/* Center - Tabs */}
      <div className="flex items-center gap-0.5 bg-surface-900/50 rounded-lg p-[3px] border border-white/[0.03]">
        {[
          { key: 'trade', label: 'Trade', icon: '📊', vip: false },
          { key: 'analytics', label: 'Analytics', icon: '📈', vip: true },
          { key: 'explore', label: 'Explore', icon: '🔍', vip: true },
        ].map((t) => (
          <button key={t.key} onClick={() => { if (t.vip) { setShowVip(true) } else { setActiveTopTab(t.key) } }}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTopTab === t.key ? 'bg-surface-600/80 text-text-primary shadow-sm' : 'text-text-muted/50 hover:text-text-muted'}`}>
            <span className="mr-1">{t.icon}</span>{t.label}{t.vip && <span className="ml-1 text-[8px] text-accent-orange">VIP</span>}
          </button>
        ))}
      </div>

      {/* Right - Account stats + P&L */}
      <div className="flex items-center gap-4">
        {/* Account stats (hidden on small screens) */}
        <div className="hidden xl:flex items-center gap-4 text-[9px]">
          <div className="text-right"><p className="text-text-muted/40 uppercase tracking-wider">Balance</p><p className="font-mono font-bold text-text-primary">${balance.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
          <div className="h-5 w-px bg-white/[0.04]" />
          <div className="text-right"><p className="text-text-muted/40 uppercase tracking-wider">Equity</p><p className="font-mono font-bold text-text-secondary">${equity.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
          <div className="h-5 w-px bg-white/[0.04]" />
          <div className="text-right"><p className="text-text-muted/40 uppercase tracking-wider">Margin Lvl</p><p className={`font-mono font-bold ${marginColor}`}>{marginLevelStr}</p></div>
          <div className="h-5 w-px bg-white/[0.04]" />
        </div>

        {/* Profit */}
        <div className="text-right min-w-[90px]">
          <p className="text-[8px] text-text-muted/40 uppercase tracking-wider">P&L</p>
          <p className={`text-[14px] font-heading font-black tabular-nums ${totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
            <span className="text-[8px] ml-0.5 opacity-50">USD</span>
          </p>
        </div>

        <div className="h-5 w-px bg-white/[0.04]" />

        {/* Icons */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 mr-1">
            <Wifi size={10} className="text-accent-green" />
            <span className="text-[8px] text-accent-green/60 font-mono">LIVE</span>
          </div>
          {[Bell, Settings, User].map((Icon, i) => (
            <button key={i} className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted/40 hover:text-text-secondary hover:bg-surface-600/40 transition-all">
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* VIP Popup */}
      {showVip && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowVip(false)}>
          <div className="bg-surface-700 rounded-2xl p-8 w-full max-w-sm border border-white/[0.08] text-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowVip(false)} className="absolute top-4 right-4 text-text-muted"><X size={18} /></button>
            <div className="w-16 h-16 rounded-full bg-accent-orange/10 flex items-center justify-center mx-auto mb-4"><span className="text-3xl">👑</span></div>
            <h2 className="font-heading font-black text-xl text-text-primary mb-2">VIP Only Feature</h2>
            <p className="text-sm text-text-muted mb-4">Analytics and Explore are available for VIP account holders. Upgrade your account to access advanced trading tools, market insights, and exclusive signals.</p>
            <div className="p-3 rounded-xl bg-accent-orange/5 border border-accent-orange/15 mb-4"><p className="text-xs text-accent-orange font-bold">Contact admin or deposit to upgrade</p></div>
            <button onClick={() => setShowVip(false)} className="w-full py-3 rounded-xl bg-surface-600 text-text-secondary text-sm font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
