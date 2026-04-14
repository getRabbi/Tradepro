'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useTraderStore } from '@/lib/traderStore'
import { generateTick, getSymbols, getDecimals } from '@/lib/priceEngine'

const TICK_MS = 500

export function usePriceEngine() {
  const { updateAllPrices } = useTraderStore()

  useEffect(() => {
    const symbols = getSymbols()
    const init = symbols.map((s) => generateTick(s)).filter(Boolean) as any[]
    updateAllPrices(init)

    const iv = setInterval(() => {
      const ticks = symbols.map((s) => generateTick(s)).filter(Boolean) as any[]
      updateAllPrices(ticks)
    }, TICK_MS)

    return () => clearInterval(iv)
  }, [])
}

// Generate history ONCE per symbol, not on every tick
export function useChartHistory(symbol: string, count = 250) {
  const { prices } = useTraderStore()
  const p = prices[symbol]
  const cacheRef = useRef<{ symbol: string; data: any[] }>({ symbol: '', data: [] })

  // Only regenerate if symbol changes
  if (p && cacheRef.current.symbol !== symbol) {
    const base = p.bid
    const dec = getDecimals(symbol)
    const factor = Math.pow(10, dec)
    const vol = base * 0.0012
    const candles = []
    const now = Math.floor(Date.now() / 1000)
    let cur = base * 0.997

    for (let i = count; i > 0; i--) {
      const o = cur
      const c = o + (Math.random() - 0.48) * vol
      const h = Math.max(o, c) + Math.random() * vol * 0.4
      const l = Math.min(o, c) - Math.random() * vol * 0.4
      candles.push({
        time: now - i * 300,
        open: Math.round(o * factor) / factor,
        high: Math.round(h * factor) / factor,
        low: Math.round(l * factor) / factor,
        close: Math.round(c * factor) / factor,
      })
      cur = c
    }
    cacheRef.current = { symbol, data: candles }
  }

  return cacheRef.current.data
}
