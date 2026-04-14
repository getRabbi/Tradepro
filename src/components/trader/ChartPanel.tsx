'use client'

import { useEffect, useRef } from 'react'
import { useTraderStore } from '@/lib/traderStore'
import { symbolConfigs } from '@/lib/priceEngine'
import { TrendingUp, TrendingDown } from 'lucide-react'

const tvSymbolMap: Record<string, string> = {
  'EURUSD': 'FX:EURUSD', 'GBPUSD': 'FX:GBPUSD', 'USDJPY': 'FX:USDJPY',
  'AUDUSD': 'FX:AUDUSD', 'USDCAD': 'FX:USDCAD', 'NZDUSD': 'FX:NZDUSD',
  'USDCHF': 'FX:USDCHF', 'EURGBP': 'FX:EURGBP', 'EURJPY': 'FX:EURJPY',
  'GBPJPY': 'FX:GBPJPY',
  'BTCUSD': 'CRYPTO:BTCUSD', 'ETHUSD': 'CRYPTO:ETHUSD', 'XRPUSD': 'CRYPTO:XRPUSD',
  'LTCUSD': 'CRYPTO:LTCUSD', 'ADAUSD': 'CRYPTO:ADAUSD', 'SOLUSD': 'CRYPTO:SOLUSD',
  'DOTUSD': 'CRYPTO:DOTUSD', 'DOGEUSD': 'CRYPTO:DOGEUSD', 'BNBUSD': 'BINANCE:BNBUSDT',
  'AAPL': 'NASDAQ:AAPL', 'MSFT': 'NASDAQ:MSFT', 'GOOGL': 'NASDAQ:GOOGL',
  'AMZN': 'NASDAQ:AMZN', 'TSLA': 'NASDAQ:TSLA', 'META': 'NASDAQ:META',
  'NVDA': 'NASDAQ:NVDA', 'NFLX': 'NASDAQ:NFLX',
  'US500': 'FOREXCOM:SPXUSD', 'US30': 'FOREXCOM:DJI', 'USTEC': 'NASDAQ:NDX',
  'UK100': 'FOREXCOM:UKXGBP', 'DE40': 'FOREXCOM:DEUIDX', 'JP225': 'INDEX:NKY',
  'XAUUSD': 'FOREXCOM:XAUUSD', 'XAGUSD': 'FOREXCOM:XAGUSD', 'XPTUSD': 'TVC:PLATINUM',
  'USOIL': 'TVC:USOIL', 'UKOIL': 'TVC:UKOIL', 'NATGAS': 'TVC:NATGAS',
}

export default function ChartPanel() {
  const { selectedSymbol, prices } = useTraderStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const price = prices[selectedSymbol]
  const cfg = symbolConfigs[selectedSymbol]

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const tvSymbol = tvSymbolMap[selectedSymbol] || `FX:${selectedSymbol}`

    const widget = document.createElement('div')
    widget.className = 'tradingview-widget-container'
    widget.style.height = '100%'
    widget.style.width = '100%'

    const inner = document.createElement('div')
    inner.className = 'tradingview-widget-container__widget'
    inner.style.height = '100%'
    inner.style.width = '100%'

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: '15',
      timezone: 'Asia/Dhaka',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: '#080c17',
      gridColor: 'rgba(51, 97, 255, 0.03)',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
    })

    widget.appendChild(inner)
    widget.appendChild(script)
    containerRef.current.appendChild(widget)

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [selectedSymbol])

  const dec = cfg?.decimals || 5
  const isUp = (price?.changePercent || 0) >= 0

  return (
    <div className="h-full flex flex-col bg-[#080c17]">
      {/* Header */}
      {price && cfg && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.03] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="font-heading font-black text-[13px] text-text-primary tracking-tight">{selectedSymbol}</span>
            <span className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${isUp ? 'text-accent-green' : 'text-accent-red'}`}>
              {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isUp ? '+' : ''}{price.changePercent.toFixed(2)}%
            </span>
            <div className="hidden lg:flex items-center gap-2 ml-2 text-[9px] font-mono text-text-muted/50">
              <span>Bid <span className="text-accent-green/60">{price.bid.toFixed(dec)}</span></span>
              <span>Ask <span className="text-accent-red/60">{price.ask.toFixed(dec)}</span></span>
              <span>Spread <span className="text-text-muted">{((price.ask - price.bid) * Math.pow(10, dec)).toFixed(1)}</span></span>
            </div>
          </div>
          <span className={`font-mono font-black text-sm ${isUp ? 'text-accent-green' : 'text-accent-red'}`}>{price.bid.toFixed(dec)}</span>
        </div>
      )}

      {/* TradingView Chart - takes all remaining space */}
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, height: '100%' }} />
    </div>
  )
}
