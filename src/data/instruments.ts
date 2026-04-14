import { Instrument, AccountTier, Feature, EducationCard, NavItem, TickerItem } from '@/types'

export const instruments: Instrument[] = [
  { symbol: 'EURUSD', fullName: 'Euro vs US Dollar', category: 'forex', description: 'Engage in trading the most popular currency pair.', leverageMax: 400, minSpread: 0.9, minLot: 0.01, weekendTrading: false },
  { symbol: 'GBPUSD', fullName: 'Great Britain Pound vs US Dollar', category: 'forex', description: 'Trade one of the most popular currency pairs.', leverageMax: 400, minSpread: 1.0, minLot: 0.01, weekendTrading: false },
  { symbol: 'USDJPY', fullName: 'US Dollar vs Japanese Yen', category: 'forex', description: 'Trade movements between USD and JPY.', leverageMax: 400, minSpread: 1.0, minLot: 0.01, weekendTrading: false },
  { symbol: 'AUDUSD', fullName: 'Australian Dollar vs US Dollar', category: 'forex', description: 'Trade between the Australian Dollar and US Dollar.', leverageMax: 400, minSpread: 1.2, minLot: 0.01, weekendTrading: false },
  { symbol: 'USDCAD', fullName: 'US Dollar vs Canadian Dollar', category: 'forex', description: 'Trade USD vs CAD movements.', leverageMax: 400, minSpread: 1.3, minLot: 0.01, weekendTrading: false },
  { symbol: 'USDCHF', fullName: 'US Dollar vs Swiss Franc', category: 'forex', description: 'Trade the safe haven pair USD/CHF.', leverageMax: 400, minSpread: 1.2, minLot: 0.01, weekendTrading: false },
  { symbol: 'NZDUSD', fullName: 'New Zealand Dollar vs US Dollar', category: 'forex', description: 'Trade NZD against USD.', leverageMax: 400, minSpread: 1.4, minLot: 0.01, weekendTrading: false },
  { symbol: 'EURGBP', fullName: 'Euro vs British Pound', category: 'forex', description: 'Trade the EUR/GBP cross pair.', leverageMax: 400, minSpread: 1.5, minLot: 0.01, weekendTrading: false },
  { symbol: 'EURJPY', fullName: 'Euro vs Japanese Yen', category: 'forex', description: 'Trade the EUR/JPY cross pair.', leverageMax: 400, minSpread: 1.5, minLot: 0.01, weekendTrading: false },
  { symbol: 'GBPJPY', fullName: 'British Pound vs Japanese Yen', category: 'forex', description: 'A volatile GBP/JPY cross pair.', leverageMax: 400, minSpread: 2.0, minLot: 0.01, weekendTrading: false },
  { symbol: 'US500', fullName: 'S&P 500', category: 'indices', description: 'Trade the benchmark 500 largest US companies index.', leverageMax: 200, minSpread: 0.5, minLot: 0.01, weekendTrading: false },
  { symbol: 'USTEC', fullName: 'NASDAQ 100', category: 'indices', description: 'Access the top 100 NASDAQ tech companies.', leverageMax: 200, minSpread: 1.0, minLot: 0.01, weekendTrading: false },
  { symbol: 'DE40', fullName: 'DAX 40', category: 'indices', description: 'Trade Germany premier stock index.', leverageMax: 200, minSpread: 1.0, minLot: 0.01, weekendTrading: false },
  { symbol: 'UK100', fullName: 'FTSE 100', category: 'indices', description: 'Trade top 100 London Stock Exchange companies.', leverageMax: 200, minSpread: 1.0, minLot: 0.01, weekendTrading: false },
  { symbol: 'AAPL', fullName: 'Apple Inc.', category: 'stocks', description: 'Trade CFDs on one of the most valuable tech companies.', leverageMax: 50, minSpread: 0.1, minLot: 0.01, weekendTrading: false },
  { symbol: 'TSLA', fullName: 'Tesla Inc.', category: 'stocks', description: 'Trade CFDs on the leading EV manufacturer.', leverageMax: 50, minSpread: 0.2, minLot: 0.01, weekendTrading: false },
  { symbol: 'AMZN', fullName: 'Amazon.com Inc.', category: 'stocks', description: 'Trade CFDs on the largest e-commerce company.', leverageMax: 50, minSpread: 0.2, minLot: 0.01, weekendTrading: false },
  { symbol: 'MSFT', fullName: 'Microsoft Corp.', category: 'stocks', description: 'Trade CFDs on the global software giant.', leverageMax: 50, minSpread: 0.1, minLot: 0.01, weekendTrading: false },
  { symbol: 'NVDA', fullName: 'NVIDIA Corp.', category: 'stocks', description: 'Trade CFDs on the leading AI/GPU company.', leverageMax: 50, minSpread: 0.2, minLot: 0.01, weekendTrading: false },
  { symbol: 'USOIL', fullName: 'Crude Oil WTI', category: 'commodities', description: 'Trade the US crude oil benchmark.', leverageMax: 100, minSpread: 0.03, minLot: 0.01, weekendTrading: false },
  { symbol: 'UKOIL', fullName: 'Crude Oil Brent', category: 'commodities', description: 'Trade the global crude oil benchmark.', leverageMax: 100, minSpread: 0.03, minLot: 0.01, weekendTrading: false },
  { symbol: 'NATGAS', fullName: 'Natural Gas', category: 'commodities', description: 'Trade natural gas price movements.', leverageMax: 100, minSpread: 0.005, minLot: 0.01, weekendTrading: false },
  { symbol: 'BTCUSD', fullName: 'Bitcoin vs US Dollar', category: 'crypto', description: 'Trade the leading cryptocurrency.', leverageMax: 100, minSpread: 20, minLot: 0.01, weekendTrading: true },
  { symbol: 'ETHUSD', fullName: 'Ethereum vs US Dollar', category: 'crypto', description: 'Trade the second-largest crypto by market cap.', leverageMax: 100, minSpread: 2.0, minLot: 0.01, weekendTrading: true },
  { symbol: 'XRPUSD', fullName: 'Ripple vs US Dollar', category: 'crypto', description: 'Trade the cross-border payment crypto.', leverageMax: 50, minSpread: 0.001, minLot: 0.01, weekendTrading: true },
  { symbol: 'SOLUSD', fullName: 'Solana vs US Dollar', category: 'crypto', description: 'Trade the high-performance blockchain crypto.', leverageMax: 50, minSpread: 0.1, minLot: 0.01, weekendTrading: true },
  { symbol: 'XAUUSD', fullName: 'Gold vs US Dollar', category: 'metals', description: 'Trade the most popular precious metal.', leverageMax: 200, minSpread: 0.3, minLot: 0.01, weekendTrading: false },
  { symbol: 'XAGUSD', fullName: 'Silver vs US Dollar', category: 'metals', description: 'Trade silver with industrial and investment demand.', leverageMax: 200, minSpread: 0.02, minLot: 0.01, weekendTrading: false },
  { symbol: 'XPTUSD', fullName: 'Platinum vs US Dollar', category: 'metals', description: 'Trade the rare precious metal platinum.', leverageMax: 100, minSpread: 1.0, minLot: 0.01, weekendTrading: false },
]

export const accountTiers: AccountTier[] = [
  { type: 'classic', label: 'Classic', level: 'Beginner', spreadsFrom: '2.5 pips', leverage: '1:400', commission: 'Zero', marginCall: '100%', stopOut: '20%', negativeBalance: true, freeSupport: true, freeEducation: true, swapDiscount: 'None', color: '#64748b' },
  { type: 'silver', label: 'Silver', level: 'Intermediate', spreadsFrom: '2.5 pips', leverage: '1:400', commission: 'Zero', marginCall: '100%', stopOut: '20%', negativeBalance: true, freeSupport: true, freeEducation: true, swapDiscount: 'None', color: '#94a3b8' },
  { type: 'gold', label: 'Gold', level: 'Advanced', spreadsFrom: '1.8 pips', leverage: '1:400', commission: 'Zero', marginCall: '100%', stopOut: '20%', negativeBalance: true, freeSupport: true, freeEducation: true, swapDiscount: 'Basic', color: '#f59e0b' },
  { type: 'platinum', label: 'Platinum', level: 'Professional', spreadsFrom: '1.4 pips', leverage: '1:400', commission: 'Zero', marginCall: '100%', stopOut: '20%', negativeBalance: true, freeSupport: true, freeEducation: true, swapDiscount: 'Advanced', color: '#818cf8' },
  { type: 'vip', label: 'VIP', level: 'Expert', spreadsFrom: '0.9 pips', leverage: '1:400', commission: 'Zero', marginCall: '100%', stopOut: '20%', negativeBalance: true, freeSupport: true, freeEducation: true, swapDiscount: 'Premium', color: '#3361ff' },
]

export const marketCategories = [
  { key: 'forex', label: 'Forex' }, { key: 'indices', label: 'Indices' },
  { key: 'stocks', label: 'Stocks' }, { key: 'commodities', label: 'Commodities' },
  { key: 'crypto', label: 'Cryptocurrencies CFDs' }, { key: 'metals', label: 'Metals' },
] as const

export const features: Feature[] = [
  { icon: 'Shield', title: 'Secure & Regulated', description: 'Your funds and data are protected with top-tier security measures.' },
  { icon: 'Zap', title: 'Ultra-Fast Execution', description: 'Orders placed in real-time, minimizing slippage.' },
  { icon: 'Headphones', title: '24/7 Support', description: 'Our team is available around the clock in multiple languages.' },
  { icon: 'BarChart3', title: 'Advanced Tools', description: 'Powerful charts and precise risk controls.' },
  { icon: 'TrendingUp', title: 'Tight Spreads', description: 'Spreads from 0.9 pips with zero hidden charges.' },
  { icon: 'Globe', title: 'Trade Anywhere', description: 'Web-based platform. No downloads needed.' },
]

export const educationCards: EducationCard[] = [
  { title: 'Articles & Insights', description: 'Beginner tips to expert insights to stay sharp.', href: '/education', icon: 'BookOpen' },
  { title: 'Guided Courses', description: 'Structured courses tailored to your goals.', href: '/education', icon: 'GraduationCap' },
  { title: 'Trading Glossary', description: 'Clear definitions of essential trading terms.', href: '/education', icon: 'FileText' },
  { title: 'Portfolio Guide', description: 'Build and manage a strong trading portfolio.', href: '/education', icon: 'PieChart' },
]

export const navItems: NavItem[] = [
  { label: 'Markets', href: '#', children: [
    { label: 'Forex', href: '/forex' }, { label: 'Indices', href: '/indices' },
    { label: 'Stocks', href: '/stocks' }, { label: 'Commodities', href: '/commodities' },
    { label: 'Cryptocurrencies', href: '/crypto' }, { label: 'Metals', href: '/metals' },
    { label: 'Full CFD List', href: '/cfds-list' },
  ]},
  { label: 'Accounts', href: '/trading-accounts' },
  { label: 'Platform', href: '/platform' },
  { label: 'Education', href: '/education' },
  { label: 'About', href: '/about-us' },
  { label: 'Contact', href: '/contact-us' },
]

export const sampleTicker: TickerItem[] = [
  { symbol: 'EUR/USD', price: '1.08542', change: '+0.00034', changePercent: '+0.03%', isUp: true },
  { symbol: 'GBP/USD', price: '1.29183', change: '-0.00121', changePercent: '-0.09%', isUp: false },
  { symbol: 'BTC/USD', price: '67,432.50', change: '+1,234.20', changePercent: '+1.86%', isUp: true },
  { symbol: 'XAU/USD', price: '2,341.80', change: '+12.40', changePercent: '+0.53%', isUp: true },
  { symbol: 'US500', price: '5,234.67', change: '+23.45', changePercent: '+0.45%', isUp: true },
  { symbol: 'ETH/USD', price: '3,567.40', change: '-45.20', changePercent: '-1.25%', isUp: false },
  { symbol: 'USD/JPY', price: '151.234', change: '+0.345', changePercent: '+0.23%', isUp: true },
  { symbol: 'AAPL', price: '178.92', change: '+2.34', changePercent: '+1.33%', isUp: true },
]
