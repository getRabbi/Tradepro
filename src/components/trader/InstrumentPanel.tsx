'use client'

import { useState } from 'react'
import { useTraderStore } from '@/lib/traderStore'
import { getSymbolsByCategory, getCategories, categoryLabels, categoryIcons, symbolConfigs, AssetClass } from '@/lib/priceEngine'
import { Star, Search, TrendingUp, TrendingDown } from 'lucide-react'

export default function InstrumentPanel() {
  const { prices, selectedSymbol, setSelectedSymbol } = useTraderStore()
  const [category, setCategory] = useState<AssetClass | 'all'>('forex')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'categories' | 'favorites' | 'movers'>('categories')

  const categories = getCategories()
  const symbols = category === 'all' ? Object.keys(symbolConfigs) : getSymbolsByCategory(category as AssetClass)
  const filtered = symbols.filter((s) => !search || s.toLowerCase().includes(search.toLowerCase()) || symbolConfigs[s]?.displayName.toLowerCase().includes(search.toLowerCase()))

  // Sort by change% for movers
  const sorted = tab === 'movers'
    ? [...filtered].sort((a, b) => Math.abs(prices[b]?.changePercent || 0) - Math.abs(prices[a]?.changePercent || 0))
    : filtered

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface-800/20">
      {/* Top tabs */}
      <div className="flex items-center border-b border-white/[0.04] shrink-0">
        {[
          { key: 'categories', icon: '📊', label: 'Markets' },
          { key: 'favorites', icon: '⭐', label: 'Favorites' },
          { key: 'movers', icon: '🔥', label: 'Movers' },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium border-b-2 transition-all ${tab === t.key ? 'text-text-primary border-brand-500' : 'text-text-muted border-transparent hover:text-text-secondary'}`}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Category pills */}
      {tab === 'categories' && (
        <div className="flex items-center gap-1 px-2 py-2 border-b border-white/[0.04] overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                category === cat ? 'bg-brand-600/20 text-brand-300 border border-brand-500/25' : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03]'
              }`}>
              <span className="text-xs">{categoryIcons[cat]}</span>
              {categoryLabels[cat]}
              <span className="text-[8px] opacity-50">{getSymbolsByCategory(cat).length}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="px-2 py-1.5 shrink-0">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/50" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-surface-700/40 border border-white/[0.03] text-[11px] text-text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-brand-500/20 transition-all"
            placeholder="Search symbol or name..." />
        </div>
      </div>

      {/* Column header */}
      <div className="flex items-center px-3 py-1 text-[9px] text-text-muted/60 uppercase tracking-widest border-b border-white/[0.03] shrink-0">
        <span className="flex-1">Symbol</span>
        <span className="w-20 text-right">Bid</span>
        <span className="w-16 text-right">Chg%</span>
      </div>

      {/* Instrument list */}
      <div className="flex-1 overflow-y-auto">
        {sorted.map((symbol) => {
          const p = prices[symbol]
          const cfg = symbolConfigs[symbol]
          if (!p || !cfg) return null
          const isSelected = symbol === selectedSymbol
          const isUp = p.changePercent >= 0

          return (
            <button key={symbol} onClick={() => setSelectedSymbol(symbol)}
              className={`w-full flex items-center px-3 py-[7px] text-left transition-all border-l-[3px] ${
                isSelected ? 'bg-brand-500/8 border-brand-500' : 'border-transparent hover:bg-white/[0.015]'
              }`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-heading font-bold ${isSelected ? 'text-brand-300' : 'text-text-primary'}`}>{symbol}</span>
                  <span className="text-[8px] px-1 py-0.5 rounded bg-surface-600/40 text-text-muted/60 uppercase">{cfg.category}</span>
                </div>
                <p className="text-[9px] text-text-muted/50 truncate mt-0.5">{cfg.displayName}</p>
              </div>
              <div className="w-20 text-right">
                <p className={`text-[11px] font-mono font-semibold tabular-nums ${isUp ? 'text-accent-green' : 'text-accent-red'}`}>
                  {p.bid.toFixed(cfg.decimals)}
                </p>
              </div>
              <div className="w-16 text-right">
                <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                  isUp ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'
                }`}>
                  {isUp ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                  {isUp ? '+' : ''}{p.changePercent.toFixed(2)}%
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Bottom stats */}
      <div className="px-3 py-1.5 border-t border-white/[0.04] text-[9px] text-text-muted/40 flex justify-between shrink-0">
        <span>{sorted.length} instruments</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          LIVE
        </span>
      </div>
    </div>
  )
}
