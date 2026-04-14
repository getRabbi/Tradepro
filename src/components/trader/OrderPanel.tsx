'use client'

import { useTraderStore } from '@/lib/traderStore'
import { symbolConfigs, getDecimals } from '@/lib/priceEngine'
import { calculateMargin } from '@/lib/tradeEngine'
import { Minus, Plus, ChevronDown, ChevronUp, Lock, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export default function OrderPanel() {
  const { selectedSymbol, prices, volume, setVolume, stopLoss, setStopLoss, takeProfit, setTakeProfit, executeTrade, freeMargin } = useTraderStore()
  const [showSLTP, setShowSLTP] = useState(false)
  const price = prices[selectedSymbol]
  const cfg = symbolConfigs[selectedSymbol]
  if (!price || !cfg) return null

  const decimals = cfg.decimals
  const leverage = cfg.maxLeverage
  const margin = calculateMargin(volume, price.bid, leverage, cfg.contractSize)
  const canTrade = margin <= freeMargin
  const spreadPips = ((price.ask - price.bid) / cfg.pipSize).toFixed(1)
  const pipValue = (volume * cfg.contractSize * cfg.pipSize).toFixed(2)

  const handleTrade = (type: 'BUY' | 'SELL') => {
    const sl = stopLoss ? parseFloat(stopLoss) : null
    const tp = takeProfit ? parseFloat(takeProfit) : null
    const r = executeTrade({ symbol: selectedSymbol, type, volume, stopLoss: sl, takeProfit: tp })
    if (r.error) alert(r.error)
  }

  return (
    <div className="border-t border-white/[0.06] shrink-0 bg-surface-800/30">
      {/* Symbol + Category badge */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <div className="min-w-0">
          <p className="text-[10px] text-text-muted truncate">{cfg.displayName}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-300 font-bold">
            <Lock size={7} /> 1:{leverage}
          </span>
        </div>
      </div>

      {/* BUY / Volume / SELL */}
      <div className="flex items-stretch gap-1.5 px-3 py-2">
        <button onClick={() => handleTrade('SELL')} disabled={!canTrade}
          className="flex-1 py-2.5 rounded-lg bg-gradient-to-b from-accent-red/15 to-accent-red/5 border border-accent-red/15 text-center hover:from-accent-red/25 hover:to-accent-red/10 active:scale-[0.97] transition-all disabled:opacity-30 disabled:pointer-events-none">
          <p className="text-[8px] text-accent-red/50 uppercase tracking-[0.15em] font-black">SELL</p>
          <p className="text-[15px] font-heading font-black text-accent-red tabular-nums tracking-tight">{price.bid.toFixed(decimals)}</p>
        </button>

        <div className="flex flex-col items-center justify-center min-w-[72px] gap-0.5">
          <div className="flex items-center">
            <button onClick={() => setVolume(volume - 0.01)} className="w-5 h-5 rounded-l bg-surface-600/80 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-500 active:scale-90 transition-all">
              <Minus size={9} />
            </button>
            <input type="number" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value) || 0.01)}
              className="w-12 text-center bg-surface-700/60 text-sm font-heading font-black text-text-primary focus:outline-none py-1 border-y border-white/[0.04] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              step="0.01" min="0.01" />
            <button onClick={() => setVolume(volume + 0.01)} className="w-5 h-5 rounded-r bg-surface-600/80 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-500 active:scale-90 transition-all">
              <Plus size={9} />
            </button>
          </div>
          <p className="text-[8px] text-text-muted/50">LOT</p>
        </div>

        <button onClick={() => handleTrade('BUY')} disabled={!canTrade}
          className="flex-1 py-2.5 rounded-lg bg-gradient-to-b from-accent-green/15 to-accent-green/5 border border-accent-green/15 text-center hover:from-accent-green/25 hover:to-accent-green/10 active:scale-[0.97] transition-all disabled:opacity-30 disabled:pointer-events-none">
          <p className="text-[8px] text-accent-green/50 uppercase tracking-[0.15em] font-black">BUY</p>
          <p className="text-[15px] font-heading font-black text-accent-green tabular-nums tracking-tight">{price.ask.toFixed(decimals)}</p>
        </button>
      </div>

      {/* Quick lots */}
      <div className="flex gap-0.5 px-3 pb-2">
        {[0.01, 0.05, 0.10, 0.50, 1.00, 5.00].map((v) => (
          <button key={v} onClick={() => setVolume(v)}
            className={`flex-1 py-1 rounded text-[8px] font-mono font-bold transition-all ${volume === v ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30' : 'bg-surface-700/30 text-text-muted/50 hover:text-text-muted hover:bg-surface-600/30'}`}>
            {v}
          </button>
        ))}
      </div>

      {/* SL/TP toggle */}
      <button onClick={() => setShowSLTP(!showSLTP)} className="w-full flex items-center justify-center gap-1 py-1.5 text-[9px] text-text-muted/50 hover:text-text-muted border-t border-white/[0.03] transition-colors">
        {showSLTP ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        SL / TP
      </button>

      {showSLTP && (
        <div className="flex gap-2 px-3 pb-2 animate-slide-down">
          <div className="flex-1">
            <label className="text-[8px] text-accent-red/60 font-black uppercase tracking-wider block mb-0.5">SL</label>
            <input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-surface-700/40 border border-accent-red/8 text-[11px] text-text-primary font-mono focus:outline-none focus:border-accent-red/25 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="—" step="any" />
          </div>
          <div className="flex-1">
            <label className="text-[8px] text-accent-green/60 font-black uppercase tracking-wider block mb-0.5">TP</label>
            <input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-surface-700/40 border border-accent-green/8 text-[11px] text-text-primary font-mono focus:outline-none focus:border-accent-green/25 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="—" step="any" />
          </div>
        </div>
      )}

      {/* Trade info grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-3 py-2 border-t border-white/[0.03] text-[9px]">
        <div className="flex justify-between"><span className="text-text-muted/40">Spread</span><span className="text-text-muted font-mono">{spreadPips} pips</span></div>
        <div className="flex justify-between"><span className="text-text-muted/40">Pip Value</span><span className="text-text-muted font-mono">${pipValue}</span></div>
        <div className="flex justify-between"><span className="text-text-muted/40">Margin</span><span className="text-text-secondary font-mono font-bold">${margin.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-text-muted/40">Free</span><span className={`font-mono font-bold ${canTrade ? 'text-accent-green/70' : 'text-accent-red'}`}>${freeMargin.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-text-muted/40">Swap L/S</span><span className="text-text-muted/60 font-mono">{cfg.swapLong}/{cfg.swapShort}</span></div>
        <div className="flex justify-between"><span className="text-text-muted/40">Hours</span><span className="text-text-muted/60 font-mono text-[8px]">{cfg.tradingHours}</span></div>
      </div>

      {!canTrade && (
        <div className="mx-3 mb-2 flex items-center gap-1.5 px-2 py-1.5 rounded bg-accent-red/5 border border-accent-red/10">
          <AlertTriangle size={10} className="text-accent-red shrink-0" />
          <p className="text-[8px] text-accent-red">Insufficient margin</p>
        </div>
      )}
    </div>
  )
}
