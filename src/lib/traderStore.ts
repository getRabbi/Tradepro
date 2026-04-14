import { create } from 'zustand'
import { PriceTick, symbolConfigs } from './priceEngine'
import { calculateProfit, calculateProfitPercent, calculateMarginForSymbol, shouldTriggerStopLoss, shouldTriggerTakeProfit, validateTrade, generateTradeId } from './tradeEngine'

export interface Position {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  volume: number
  openPrice: number
  currentPrice: number
  stopLoss: number | null
  takeProfit: number | null
  margin: number
  profit: number
  profitPercent: number
  openedAt: string
}

export interface ClosedPosition extends Omit<Position, 'currentPrice'> {
  closePrice: number
  closedAt: string
}

interface Notif { id: string; message: string; type: 'success' | 'error' | 'warning' | 'info'; timestamp: number }

interface TraderStore {
  selectedSymbol: string; setSelectedSymbol: (s: string) => void
  prices: Record<string, PriceTick>
  updatePrice: (t: PriceTick) => void
  updateAllPrices: (t: PriceTick[]) => void

  balance: number; equity: number; freeMargin: number; marginUsed: number; totalProfit: number
  accountMode: 'DEMO' | 'LIVE'; accountNumber: string; displayName: string

  openPositions: Position[]; closedPositions: ClosedPosition[]; pendingOrders: any[]
  executeTrade: (p: { symbol: string; type: 'BUY' | 'SELL'; volume: number; stopLoss: number | null; takeProfit: number | null }) => { success: boolean; error?: string }
  closePosition: (id: string) => void
  modifyPosition: (id: string, sl: number | null, tp: number | null) => void
  recalculatePositions: () => void
  checkTriggers: () => void

  volume: number; setVolume: (v: number) => void
  stopLoss: string; setStopLoss: (v: string) => void
  takeProfit: string; setTakeProfit: (v: string) => void

  activeBottomTab: string; setActiveBottomTab: (t: string) => void
  activeTopTab: string; setActiveTopTab: (t: string) => void

  notifications: Notif[]; addNotification: (msg: string, type: Notif['type']) => void; clearNotification: (id: string) => void

  candles: any[]; addCandle: (c: any) => void; updateLastCandle: (p: number) => void
  loadFromDB: () => Promise<void>
  loadTradesFromDB: () => Promise<void>
}

const BAL = parseInt(typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_DEMO_BALANCE || '0') : '0')

export const useTraderStore = create<TraderStore>((set, get) => ({
  selectedSymbol: 'EURUSD',
  setSelectedSymbol: (s) => set({ selectedSymbol: s, candles: [] }),

  prices: {},
  updatePrice: (t) => { set((s) => ({ prices: { ...s.prices, [t.symbol]: t } })); if (get().openPositions.some((p) => p.symbol === t.symbol)) { get().recalculatePositions(); get().checkTriggers() } },
  updateAllPrices: (ticks) => {
    const np: Record<string, PriceTick> = { ...get().prices }
    ticks.forEach((t) => { np[t.symbol] = t })
    set({ prices: np })
    if (get().openPositions.length > 0) { get().recalculatePositions(); get().checkTriggers() }
  },

  balance: BAL, equity: BAL, freeMargin: BAL, marginUsed: 0, totalProfit: 0,
  accountMode: 'DEMO', accountNumber: '728625', displayName: 'Demo Account',

  loadFromDB: async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient')
      const { getUserAccountAction } = await import('@/lib/actions')
      const res = await getUserAccountAction()
      if (!res.success || !res.user) return

      // Check if user has completed deposits → use LIVE account
      const { data: deposits } = await supabase.from('transactions').select('id').eq('user_id', res.user.id).eq('type', 'DEPOSIT').eq('status', 'COMPLETED').limit(1)
      const hasDeposit = deposits && deposits.length > 0

      // Get correct account
      const { data: accounts } = await supabase.from('accounts').select('*').eq('user_id', res.user.id).eq('is_active', true)
      const liveAcc = (accounts || []).find((a: any) => a.account_mode === 'LIVE')
      const demoAcc = (accounts || []).find((a: any) => a.account_mode === 'DEMO')
      const acc = hasDeposit && liveAcc ? liveAcc : (demoAcc || liveAcc || (accounts || [])[0])

      if (acc) {
        set({
          balance: Number(acc.balance),
          equity: Number(acc.equity),
          freeMargin: Number(acc.free_margin),
          marginUsed: Number(acc.margin_used),
          accountMode: hasDeposit ? 'LIVE' : acc.account_mode,
          accountNumber: acc.account_number,
          displayName: acc.display_name || res.user.name || 'Account',
        })
      }
    } catch {}
  },

  loadTradesFromDB: async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient')
      const accNum = get().accountNumber
      if (!accNum || accNum === '728625') return // default = not loaded yet

      const { data: acc } = await supabase.from('accounts').select('id').eq('account_number', accNum).limit(1).single()
      if (!acc) return

      // Load open trades
      const { data: openTrades } = await supabase.from('trades').select('*').eq('account_id', acc.id).eq('status', 'OPEN').order('opened_at', { ascending: false })
      if (openTrades && openTrades.length > 0) {
        const positions = openTrades.map((t: any) => ({
          id: t.id, symbol: t.symbol, type: t.type, volume: Number(t.volume),
          openPrice: Number(t.open_price), currentPrice: Number(t.open_price),
          stopLoss: t.stop_loss ? Number(t.stop_loss) : null,
          takeProfit: t.take_profit ? Number(t.take_profit) : null,
          margin: Number(t.volume) * Number(t.open_price) * 0.01,
          profit: Number(t.profit), profitPercent: 0,
          openedAt: t.opened_at ? new Date(t.opened_at).toLocaleString('en-GB', { hour12: false }) : '',
        }))
        set({ openPositions: positions })
      }

      // Load closed trades
      const { data: closedTrades } = await supabase.from('trades').select('*').eq('account_id', acc.id).eq('status', 'CLOSED').order('closed_at', { ascending: false }).limit(50)
      if (closedTrades && closedTrades.length > 0) {
        const closed = closedTrades.map((t: any) => ({
          id: t.id, symbol: t.symbol, type: t.type, volume: Number(t.volume),
          openPrice: Number(t.open_price), currentPrice: Number(t.close_price || t.open_price),
          closePrice: Number(t.close_price || 0),
          stopLoss: t.stop_loss ? Number(t.stop_loss) : null,
          takeProfit: t.take_profit ? Number(t.take_profit) : null,
          margin: Number(t.volume) * Number(t.open_price) * 0.01,
          profit: Number(t.profit), profitPercent: 0,
          openedAt: t.opened_at ? new Date(t.opened_at).toLocaleString('en-GB', { hour12: false }) : '',
          closedAt: t.closed_at ? new Date(t.closed_at).toLocaleString('en-GB', { hour12: false }) : '',
        }))
        set({ closedPositions: closed })
      }
    } catch (e) { console.error('Load trades error:', e) }
  },

  openPositions: [], closedPositions: [], pendingOrders: [],

  executeTrade: ({ symbol, type, volume, stopLoss, takeProfit }) => {
    const s = get()
    const p = s.prices[symbol]
    if (!p) return { success: false, error: 'Price unavailable' }

    const execPrice = type === 'BUY' ? p.ask : p.bid
    const margin = calculateMarginForSymbol(volume, execPrice, symbol)
    const v = validateTrade(s.balance, s.freeMargin, margin, volume)
    if (!v.valid) return { success: false, error: v.error }

    const curPrice = type === 'BUY' ? p.bid : p.ask
    const profit = calculateProfit(type, execPrice, curPrice, volume, symbol)

    const pos: Position = {
      id: generateTradeId(), symbol, type, volume, openPrice: execPrice, currentPrice: curPrice,
      stopLoss, takeProfit, margin, profit, profitPercent: calculateProfitPercent(profit, margin),
      openedAt: new Date().toLocaleString('en-GB', { hour12: false }),
    }

    const nm = s.marginUsed + margin
    const tp2 = s.openPositions.reduce((a, x) => a + x.profit, 0) + profit
    const ne = s.balance + tp2
    set({ openPositions: [...s.openPositions, pos], marginUsed: r(nm), totalProfit: r(tp2), equity: r(ne), freeMargin: r(ne - nm) })
    get().addNotification(`${type} ${volume} ${symbol} @ ${execPrice.toFixed(symbolConfigs[symbol]?.decimals || 5)}`, 'success')

    // Save trade to Supabase (fire-and-forget)
    const accNum = get().accountNumber
    ;(async () => {
      try {
        const { supabase } = await import('@/lib/supabaseClient')
        const { data: acc } = await supabase.from('accounts').select('id').eq('account_number', accNum).limit(1).single()
        const accId = acc?.id
        if (accId) {
          await supabase.from('trades').insert({
            id: pos.id, account_id: accId, symbol, type, volume,
            open_price: execPrice, stop_loss: stopLoss || null, take_profit: takeProfit || null,
            profit: 0, status: 'OPEN',
          })
        }
      } catch (e) { console.error('Trade save:', e) }
    })()

    return { success: true }
  },

  closePosition: (id) => {
    const s = get()
    const pos = s.openPositions.find((x) => x.id === id)
    if (!pos) return
    const p = s.prices[pos.symbol]
    if (!p) return
    const cp = pos.type === 'BUY' ? p.bid : p.ask
    const fp = calculateProfit(pos.type, pos.openPrice, cp, pos.volume, pos.symbol)
    const closed: ClosedPosition = { ...pos, closePrice: cp, profit: fp, profitPercent: calculateProfitPercent(fp, pos.margin), closedAt: new Date().toLocaleString('en-GB', { hour12: false }) }
    const rem = s.openPositions.filter((x) => x.id !== id)
    let tp = 0, tm = 0; rem.forEach((x) => { tp += x.profit; tm += x.margin })
    const nb = s.balance + fp
    set({ openPositions: rem, closedPositions: [closed, ...s.closedPositions], balance: r(nb), marginUsed: r(tm), totalProfit: r(tp), equity: r(nb + tp), freeMargin: r(nb + tp - tm) })
    const ps = fp >= 0 ? `+$${fp.toFixed(2)}` : `-$${Math.abs(fp).toFixed(2)}`
    get().addNotification(`Closed ${pos.symbol} ${pos.type} — ${ps}`, fp >= 0 ? 'success' : 'warning')

    // Update trade + balance in Supabase (fire-and-forget)
    const accNum2 = get().accountNumber
    ;(async () => {
      try {
        const { supabase } = await import('@/lib/supabaseClient')
        await supabase.from('trades').update({
          close_price: cp, profit: fp, status: 'CLOSED', closed_at: new Date().toISOString()
        }).eq('id', id)
        const { data: acc } = await supabase.from('accounts').select('id').eq('account_number', accNum2).limit(1).single()
        if (acc) {
          await supabase.from('accounts').update({
            balance: r(nb), equity: r(nb + tp), free_margin: r(nb + tp - tm)
          }).eq('id', acc.id)
        }
      } catch (e) { console.error('Trade close save:', e) }
    })()
  },

  modifyPosition: (id, sl, tp) => {
    set((s) => ({ openPositions: s.openPositions.map((x) => x.id === id ? { ...x, stopLoss: sl, takeProfit: tp } : x) }))
    get().addNotification('Position modified', 'info')
  },

  recalculatePositions: () => {
    const s = get()
    let tp = 0, tm = 0
    const up = s.openPositions.map((pos) => {
      const p = s.prices[pos.symbol]
      if (!p) { tp += pos.profit; tm += pos.margin; return pos }
      const cur = pos.type === 'BUY' ? p.bid : p.ask
      const profit = calculateProfit(pos.type, pos.openPrice, cur, pos.volume, pos.symbol)
      const pp = calculateProfitPercent(profit, pos.margin)
      tp += profit; tm += pos.margin
      return { ...pos, currentPrice: cur, profit: r(profit), profitPercent: r2(pp) }
    })
    const ne = s.balance + tp
    set({ openPositions: up, totalProfit: r(tp), equity: r(ne), freeMargin: r(ne - tm), marginUsed: r(tm) })
  },

  checkTriggers: () => {
    const s = get()
    const toClose: string[] = []
    s.openPositions.forEach((pos) => {
      const p = s.prices[pos.symbol]
      if (!p) return
      if (shouldTriggerStopLoss(pos.type, pos.stopLoss, p.bid, p.ask)) {
        get().addNotification(`⛔ SL hit: ${pos.symbol} ${pos.type}`, 'warning')
        toClose.push(pos.id)
      } else if (shouldTriggerTakeProfit(pos.type, pos.takeProfit, p.bid, p.ask)) {
        get().addNotification(`🎯 TP hit: ${pos.symbol} ${pos.type}`, 'success')
        toClose.push(pos.id)
      }
    })
    toClose.forEach((id) => get().closePosition(id))
  },

  volume: 0.01, setVolume: (v) => set({ volume: Math.max(0.01, Math.min(100, r2(v))) }),
  stopLoss: '', setStopLoss: (v) => set({ stopLoss: v }),
  takeProfit: '', setTakeProfit: (v) => set({ takeProfit: v }),
  activeBottomTab: 'positions', setActiveBottomTab: (t) => set({ activeBottomTab: t }),
  activeTopTab: 'trade', setActiveTopTab: (t) => set({ activeTopTab: t }),

  notifications: [],
  addNotification: (message, type) => {
    const n: Notif = { id: Date.now().toString() + Math.random(), message, type, timestamp: Date.now() }
    set((s) => ({ notifications: [n, ...s.notifications].slice(0, 15) }))
    setTimeout(() => get().clearNotification(n.id), 4000)
  },
  clearNotification: (id) => set((s) => ({ notifications: s.notifications.filter((x) => x.id !== id) })),

  candles: [], addCandle: (c) => set((s) => ({ candles: [...s.candles, c].slice(-500) })),
  updateLastCandle: (p) => set((s) => { if (!s.candles.length) return s; const l = { ...s.candles[s.candles.length - 1] }; l.close = p; if (p > l.high) l.high = p; if (p < l.low) l.low = p; return { candles: [...s.candles.slice(0, -1), l] } }),
}))

function r(n: number) { return Math.round(n * 100) / 100 }
function r2(n: number) { return Math.round(n * 100) / 100 }
