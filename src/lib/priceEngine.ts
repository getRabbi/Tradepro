// ============= ADVANCED PRICE SIMULATION ENGINE =============
// 40+ instruments | 6 asset classes | Realistic per-asset volatility

export interface PriceTick {
  symbol: string
  bid: number
  ask: number
  spread: number
  high: number
  low: number
  open: number
  change: number
  changePercent: number
  timestamp: number
}

export type AssetClass = 'forex' | 'crypto' | 'stocks' | 'indices' | 'metals' | 'commodities'

export interface SymbolConfig {
  basePrice: number
  spread: number
  volatility: number
  decimals: number
  pipSize: number
  category: AssetClass
  displayName: string
  contractSize: number
  maxLeverage: number
  swapLong: number
  swapShort: number
  tradingHours: string
}

export const symbolConfigs: Record<string, SymbolConfig> = {
  // ========== FOREX (10 pairs) — April 2026 ==========
  'EURUSD':  { basePrice: 1.16800, spread: 0.00012, volatility: 0.00008, decimals: 5, pipSize: 0.0001, category: 'forex', displayName: 'Euro / US Dollar', contractSize: 100000, maxLeverage: 400, swapLong: -6.50, swapShort: 1.20, tradingHours: 'Mon-Fri 00:00-24:00' },
  'GBPUSD':  { basePrice: 1.32150, spread: 0.00015, volatility: 0.00012, decimals: 5, pipSize: 0.0001, category: 'forex', displayName: 'British Pound / US Dollar', contractSize: 100000, maxLeverage: 400, swapLong: -5.80, swapShort: 0.90, tradingHours: 'Mon-Fri 00:00-24:00' },
  'USDJPY':  { basePrice: 142.350, spread: 0.015, volatility: 0.012, decimals: 3, pipSize: 0.01, category: 'forex', displayName: 'US Dollar / Japanese Yen', contractSize: 100000, maxLeverage: 400, swapLong: 8.50, swapShort: -15.20, tradingHours: 'Mon-Fri 00:00-24:00' },
  'AUDUSD':  { basePrice: 0.64250, spread: 0.00018, volatility: 0.00007, decimals: 5, pipSize: 0.0001, category: 'forex', displayName: 'Australian Dollar / US Dollar', contractSize: 100000, maxLeverage: 400, swapLong: -3.20, swapShort: 0.40, tradingHours: 'Mon-Fri 00:00-24:00' },
  'USDCAD':  { basePrice: 1.38200, spread: 0.00018, volatility: 0.00009, decimals: 5, pipSize: 0.0001, category: 'forex', displayName: 'US Dollar / Canadian Dollar', contractSize: 100000, maxLeverage: 400, swapLong: -2.10, swapShort: -4.80, tradingHours: 'Mon-Fri 00:00-24:00' },
  'USDCHF':  { basePrice: 0.86500, spread: 0.00016, volatility: 0.00008, decimals: 5, pipSize: 0.0001, category: 'forex', displayName: 'US Dollar / Swiss Franc', contractSize: 100000, maxLeverage: 400, swapLong: 4.20, swapShort: -9.50, tradingHours: 'Mon-Fri 00:00-24:00' },
  'NZDUSD':  { basePrice: 0.59100, spread: 0.00020, volatility: 0.00006, decimals: 5, pipSize: 0.0001, category: 'forex', displayName: 'New Zealand Dollar / US Dollar', contractSize: 100000, maxLeverage: 400, swapLong: -2.80, swapShort: 0.30, tradingHours: 'Mon-Fri 00:00-24:00' },
  'EURGBP':  { basePrice: 0.88350, spread: 0.00016, volatility: 0.00006, decimals: 5, pipSize: 0.0001, category: 'forex', displayName: 'Euro / British Pound', contractSize: 100000, maxLeverage: 400, swapLong: -4.20, swapShort: 0.50, tradingHours: 'Mon-Fri 00:00-24:00' },
  'EURJPY':  { basePrice: 166.200, spread: 0.025, volatility: 0.018, decimals: 3, pipSize: 0.01, category: 'forex', displayName: 'Euro / Japanese Yen', contractSize: 100000, maxLeverage: 400, swapLong: 3.20, swapShort: -12.40, tradingHours: 'Mon-Fri 00:00-24:00' },
  'GBPJPY':  { basePrice: 188.100, spread: 0.030, volatility: 0.025, decimals: 3, pipSize: 0.01, category: 'forex', displayName: 'British Pound / Japanese Yen', contractSize: 100000, maxLeverage: 400, swapLong: 5.80, swapShort: -18.60, tradingHours: 'Mon-Fri 00:00-24:00' },

  // ========== CRYPTO (8 coins) — April 2026 ==========
  'BTCUSD':  { basePrice: 74415.00, spread: 22.00, volatility: 55.00, decimals: 2, pipSize: 0.01, category: 'crypto', displayName: 'Bitcoin / US Dollar', contractSize: 1, maxLeverage: 100, swapLong: -25.00, swapShort: -25.00, tradingHours: '24/7' },
  'ETHUSD':  { basePrice: 3245.00, spread: 1.50, volatility: 5.00, decimals: 2, pipSize: 0.01, category: 'crypto', displayName: 'Ethereum / US Dollar', contractSize: 1, maxLeverage: 100, swapLong: -18.00, swapShort: -18.00, tradingHours: '24/7' },
  'XRPUSD':  { basePrice: 2.1050, spread: 0.0015, volatility: 0.0060, decimals: 4, pipSize: 0.0001, category: 'crypto', displayName: 'Ripple / US Dollar', contractSize: 10000, maxLeverage: 50, swapLong: -15.00, swapShort: -15.00, tradingHours: '24/7' },
  'SOLUSD':  { basePrice: 135.80, spread: 0.30, volatility: 1.40, decimals: 2, pipSize: 0.01, category: 'crypto', displayName: 'Solana / US Dollar', contractSize: 1, maxLeverage: 50, swapLong: -20.00, swapShort: -20.00, tradingHours: '24/7' },
  'BNBUSD':  { basePrice: 615.00, spread: 0.50, volatility: 2.20, decimals: 2, pipSize: 0.01, category: 'crypto', displayName: 'BNB / US Dollar', contractSize: 1, maxLeverage: 50, swapLong: -18.00, swapShort: -18.00, tradingHours: '24/7' },
  'DOGEUSD': { basePrice: 0.1720, spread: 0.0003, volatility: 0.0014, decimals: 4, pipSize: 0.0001, category: 'crypto', displayName: 'Dogecoin / US Dollar', contractSize: 10000, maxLeverage: 50, swapLong: -15.00, swapShort: -15.00, tradingHours: '24/7' },
  'ADAUSD':  { basePrice: 0.6520, spread: 0.0006, volatility: 0.0020, decimals: 4, pipSize: 0.0001, category: 'crypto', displayName: 'Cardano / US Dollar', contractSize: 10000, maxLeverage: 50, swapLong: -15.00, swapShort: -15.00, tradingHours: '24/7' },
  'DOTUSD':  { basePrice: 6.45, spread: 0.02, volatility: 0.06, decimals: 2, pipSize: 0.01, category: 'crypto', displayName: 'Polkadot / US Dollar', contractSize: 100, maxLeverage: 50, swapLong: -15.00, swapShort: -15.00, tradingHours: '24/7' },

  // ========== STOCKS (8 companies) — April 2026 ==========
  'AAPL':  { basePrice: 212.50, spread: 0.10, volatility: 0.40, decimals: 2, pipSize: 0.01, category: 'stocks', displayName: 'Apple Inc.', contractSize: 1, maxLeverage: 50, swapLong: -3.50, swapShort: -1.20, tradingHours: 'Mon-Fri 14:30-21:00' },
  'TSLA':  { basePrice: 255.00, spread: 0.18, volatility: 2.00, decimals: 2, pipSize: 0.01, category: 'stocks', displayName: 'Tesla Inc.', contractSize: 1, maxLeverage: 50, swapLong: -4.20, swapShort: -1.50, tradingHours: 'Mon-Fri 14:30-21:00' },
  'AMZN':  { basePrice: 198.50, spread: 0.12, volatility: 0.50, decimals: 2, pipSize: 0.01, category: 'stocks', displayName: 'Amazon.com Inc.', contractSize: 1, maxLeverage: 50, swapLong: -3.80, swapShort: -1.30, tradingHours: 'Mon-Fri 14:30-21:00' },
  'MSFT':  { basePrice: 425.00, spread: 0.15, volatility: 0.65, decimals: 2, pipSize: 0.01, category: 'stocks', displayName: 'Microsoft Corp.', contractSize: 1, maxLeverage: 50, swapLong: -3.20, swapShort: -1.10, tradingHours: 'Mon-Fri 14:30-21:00' },
  'NVDA':  { basePrice: 112.50, spread: 0.12, volatility: 1.50, decimals: 2, pipSize: 0.01, category: 'stocks', displayName: 'NVIDIA Corp.', contractSize: 1, maxLeverage: 50, swapLong: -5.60, swapShort: -2.00, tradingHours: 'Mon-Fri 14:30-21:00' },
  'GOOGL': { basePrice: 178.00, spread: 0.10, volatility: 0.45, decimals: 2, pipSize: 0.01, category: 'stocks', displayName: 'Alphabet Inc.', contractSize: 1, maxLeverage: 50, swapLong: -3.40, swapShort: -1.20, tradingHours: 'Mon-Fri 14:30-21:00' },
  'META':  { basePrice: 585.00, spread: 0.25, volatility: 1.60, decimals: 2, pipSize: 0.01, category: 'stocks', displayName: 'Meta Platforms Inc.', contractSize: 1, maxLeverage: 50, swapLong: -4.00, swapShort: -1.40, tradingHours: 'Mon-Fri 14:30-21:00' },
  'NFLX':  { basePrice: 945.00, spread: 0.35, volatility: 2.50, decimals: 2, pipSize: 0.01, category: 'stocks', displayName: 'Netflix Inc.', contractSize: 1, maxLeverage: 50, swapLong: -4.50, swapShort: -1.60, tradingHours: 'Mon-Fri 14:30-21:00' },

  // ========== INDICES (6) — April 2026 ==========
  'US500':   { basePrice: 5420.00, spread: 0.45, volatility: 1.30, decimals: 2, pipSize: 0.01, category: 'indices', displayName: 'S&P 500', contractSize: 1, maxLeverage: 200, swapLong: -8.50, swapShort: -3.20, tradingHours: 'Mon-Fri 00:00-24:00' },
  'USTEC':   { basePrice: 18850.00, spread: 1.50, volatility: 5.50, decimals: 2, pipSize: 0.01, category: 'indices', displayName: 'NASDAQ 100', contractSize: 1, maxLeverage: 200, swapLong: -12.00, swapShort: -4.50, tradingHours: 'Mon-Fri 00:00-24:00' },
  'US30':    { basePrice: 40200.00, spread: 3.00, volatility: 14.00, decimals: 2, pipSize: 0.01, category: 'indices', displayName: 'Dow Jones 30', contractSize: 1, maxLeverage: 200, swapLong: -15.00, swapShort: -5.50, tradingHours: 'Mon-Fri 00:00-24:00' },
  'DE40':    { basePrice: 21500.00, spread: 1.80, volatility: 7.00, decimals: 2, pipSize: 0.01, category: 'indices', displayName: 'DAX 40 (Germany)', contractSize: 1, maxLeverage: 200, swapLong: -9.80, swapShort: -3.60, tradingHours: 'Mon-Fri 08:00-22:00' },
  'UK100':   { basePrice: 8250.00, spread: 1.20, volatility: 3.50, decimals: 2, pipSize: 0.01, category: 'indices', displayName: 'FTSE 100 (UK)', contractSize: 1, maxLeverage: 200, swapLong: -7.50, swapShort: -2.80, tradingHours: 'Mon-Fri 08:00-22:00' },
  'JP225':   { basePrice: 36200.00, spread: 10.00, volatility: 28.00, decimals: 0, pipSize: 1, category: 'indices', displayName: 'Nikkei 225 (Japan)', contractSize: 1, maxLeverage: 200, swapLong: -5.20, swapShort: -8.40, tradingHours: 'Mon-Fri 00:00-24:00' },

  // ========== METALS (3) — April 2026 ==========
  'XAUUSD':  { basePrice: 4748.00, spread: 0.80, volatility: 1.50, decimals: 2, pipSize: 0.01, category: 'metals', displayName: 'Gold / US Dollar', contractSize: 100, maxLeverage: 200, swapLong: -12.50, swapShort: 2.30, tradingHours: 'Mon-Fri 01:00-24:00' },
  'XAGUSD':  { basePrice: 36.250, spread: 0.025, volatility: 0.020, decimals: 3, pipSize: 0.001, category: 'metals', displayName: 'Silver / US Dollar', contractSize: 5000, maxLeverage: 200, swapLong: -5.80, swapShort: 0.90, tradingHours: 'Mon-Fri 01:00-24:00' },
  'XPTUSD':  { basePrice: 1020.00, spread: 1.50, volatility: 2.00, decimals: 2, pipSize: 0.01, category: 'metals', displayName: 'Platinum / US Dollar', contractSize: 100, maxLeverage: 100, swapLong: -8.40, swapShort: 1.50, tradingHours: 'Mon-Fri 01:00-24:00' },

  // ========== COMMODITIES (3) — April 2026 ==========
  'USOIL':   { basePrice: 90.50, spread: 0.05, volatility: 0.08, decimals: 2, pipSize: 0.01, category: 'commodities', displayName: 'Crude Oil WTI', contractSize: 1000, maxLeverage: 100, swapLong: -7.80, swapShort: 1.20, tradingHours: 'Mon-Fri 01:00-24:00' },
  'UKOIL':   { basePrice: 93.20, spread: 0.06, volatility: 0.08, decimals: 2, pipSize: 0.01, category: 'commodities', displayName: 'Crude Oil Brent', contractSize: 1000, maxLeverage: 100, swapLong: -8.20, swapShort: 1.40, tradingHours: 'Mon-Fri 01:00-24:00' },
  'NATGAS':  { basePrice: 3.820, spread: 0.005, volatility: 0.010, decimals: 3, pipSize: 0.001, category: 'commodities', displayName: 'Natural Gas', contractSize: 10000, maxLeverage: 100, swapLong: -4.50, swapShort: 0.80, tradingHours: 'Mon-Fri 01:00-24:00' },
}

// Price state per symbol
const priceState: Record<string, { current: number; open: number; high: number; low: number; trend: number; momentum: number; microTrend: number }> = {}

function initSymbol(symbol: string) {
  const c = symbolConfigs[symbol]
  if (!c) return
  // Start very close to base price
  const offset = (Math.random() - 0.5) * c.volatility * 2
  const startPrice = c.basePrice + offset
  priceState[symbol] = {
    current: startPrice,
    open: startPrice,
    high: startPrice + c.volatility,
    low: startPrice - c.volatility,
    trend: 0,
    momentum: 0,
    microTrend: 0,
  }
}

export function generateTick(symbol: string): PriceTick | null {
  const config = symbolConfigs[symbol]
  if (!config) return null
  if (!priceState[symbol]) initSymbol(symbol)
  const s = priceState[symbol]

  // Multi-layer random walk
  const r1 = (Math.random() - 0.5) * 2
  const r2 = (Math.random() - 0.5) * 2
  const r3 = Math.random()

  // Macro trend shift (rare)
  if (r3 < 0.008) s.trend = (Math.random() - 0.5) * config.volatility * 0.3
  // Micro trend (frequent small bias)
  if (r3 < 0.05) s.microTrend = (Math.random() - 0.5) * config.volatility * 0.1

  // Momentum smoothing
  s.momentum = s.momentum * 0.85 + r1 * 0.15

  // Strong mean reversion towards BASE PRICE (not open)
  const dev = (s.current - config.basePrice) / config.basePrice
  const revert = -dev * config.volatility * 2.0

  // Occasional small spike
  const spike = r3 < 0.003 ? (Math.random() - 0.5) * config.volatility * 3 : 0

  // Final price change
  const change = (s.momentum * config.volatility * 0.4) +
    (r2 * config.volatility * 0.25) +
    s.trend + s.microTrend + revert + spike

  s.current += change
  // Tight bounds: ±0.5% from base price
  s.current = Math.max(s.current, config.basePrice * 0.995)
  s.current = Math.min(s.current, config.basePrice * 1.005)

  if (s.current > s.high) s.high = s.current
  if (s.current < s.low) s.low = s.current

  const factor = Math.pow(10, config.decimals)
  const bid = Math.round(s.current * factor) / factor
  const ask = Math.round((s.current + config.spread) * factor) / factor
  const priceChange = s.current - s.open

  return {
    symbol, bid, ask,
    spread: config.spread,
    high: Math.round(s.high * factor) / factor,
    low: Math.round(s.low * factor) / factor,
    open: Math.round(s.open * factor) / factor,
    change: Math.round(priceChange * factor) / factor,
    changePercent: Math.round((priceChange / s.open) * 10000) / 100,
    timestamp: Date.now(),
  }
}

export function getSymbols(): string[] { return Object.keys(symbolConfigs) }
export function getSymbolsByCategory(cat: AssetClass): string[] { return Object.keys(symbolConfigs).filter((s) => symbolConfigs[s].category === cat) }
export function getSymbolConfig(symbol: string) { return symbolConfigs[symbol] }
export function getDecimals(symbol: string): number { return symbolConfigs[symbol]?.decimals || 5 }
export function getCategories(): AssetClass[] { return ['forex', 'crypto', 'stocks', 'indices', 'metals', 'commodities'] }

export const categoryLabels: Record<AssetClass, string> = {
  forex: 'Forex', crypto: 'Crypto', stocks: 'Stocks', indices: 'Indices', metals: 'Metals', commodities: 'Energy'
}

export const categoryIcons: Record<AssetClass, string> = {
  forex: '💱', crypto: '₿', stocks: '📈', indices: '📊', metals: '🥇', commodities: '🛢️'
}
