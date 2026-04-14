'use client'
import { sampleTicker } from '@/data/instruments'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function LiveTicker() {
  const doubled = [...sampleTicker, ...sampleTicker]
  return (
    <div className="ticker-strip py-3 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="inline-flex items-center gap-4 px-8 border-r border-white/[0.04]">
            <span className="font-heading font-semibold text-sm text-text-primary">{item.symbol}</span>
            <span className="font-mono text-sm text-text-secondary">{item.price}</span>
            <span className={`flex items-center gap-1 font-mono text-xs ${item.isUp ? 'price-up' : 'price-down'}`}>
              {item.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {item.change} ({item.changePercent})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
