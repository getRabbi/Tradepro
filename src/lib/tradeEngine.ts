// ============= ADVANCED TRADE EXECUTION ENGINE =============
import { symbolConfigs } from './priceEngine'

export function calculateMargin(volume: number, price: number, leverage: number, contractSize?: number): number {
  const cs = contractSize || 100000
  return Math.round(((volume * cs * price) / leverage) * 100) / 100
}

export function calculateProfit(type: 'BUY' | 'SELL', openPrice: number, currentPrice: number, volume: number, symbol: string): number {
  const cfg = symbolConfigs[symbol]
  if (!cfg) return 0
  const direction = type === 'BUY' ? 1 : -1
  const diff = (currentPrice - openPrice) * direction
  return Math.round(diff * volume * cfg.contractSize * 100) / 100
}

export function calculateProfitPercent(profit: number, margin: number): number {
  if (margin === 0) return 0
  return Math.round((profit / margin) * 10000) / 100
}

export function calculateMarginForSymbol(volume: number, price: number, symbol: string): number {
  const cfg = symbolConfigs[symbol]
  if (!cfg) return 0
  return calculateMargin(volume, price, cfg.maxLeverage, cfg.contractSize)
}

export function shouldTriggerStopLoss(type: 'BUY' | 'SELL', sl: number | null, bid: number, ask: number): boolean {
  if (!sl) return false
  return type === 'BUY' ? bid <= sl : ask >= sl
}

export function shouldTriggerTakeProfit(type: 'BUY' | 'SELL', tp: number | null, bid: number, ask: number): boolean {
  if (!tp) return false
  return type === 'BUY' ? bid >= tp : ask <= tp
}

export function calculateMarginLevel(equity: number, marginUsed: number): number {
  if (marginUsed === 0) return Infinity
  return (equity / marginUsed) * 100
}

export function isMarginCall(equity: number, marginUsed: number): boolean {
  return marginUsed > 0 && calculateMarginLevel(equity, marginUsed) <= 100
}

export function isStopOut(equity: number, marginUsed: number): boolean {
  return marginUsed > 0 && calculateMarginLevel(equity, marginUsed) <= 20
}

export function validateTrade(balance: number, freeMargin: number, requiredMargin: number, volume: number): { valid: boolean; error?: string } {
  if (volume < 0.01) return { valid: false, error: 'Minimum volume is 0.01 lots' }
  if (volume > 100) return { valid: false, error: 'Maximum volume is 100 lots' }
  if (requiredMargin > freeMargin) return { valid: false, error: `Insufficient margin. Required: $${requiredMargin.toFixed(2)}, Available: $${freeMargin.toFixed(2)}` }
  if (balance <= 0) return { valid: false, error: 'Insufficient balance' }
  return { valid: true }
}

export function generateTradeId(): string {
  return `T${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
}

export function calculatePipValue(volume: number, symbol: string): number {
  const cfg = symbolConfigs[symbol]
  if (!cfg) return 0
  return Math.round(volume * cfg.contractSize * cfg.pipSize * 100) / 100
}

export function getSpreadPips(bid: number, ask: number, symbol: string): number {
  const cfg = symbolConfigs[symbol]
  if (!cfg) return 0
  return Math.round(((ask - bid) / cfg.pipSize) * 10) / 10
}
