export type InstrumentCategory = 'forex' | 'indices' | 'stocks' | 'commodities' | 'crypto' | 'metals'

export interface Instrument {
  symbol: string; fullName: string; category: InstrumentCategory; description: string
  leverageMax: number; minSpread: number; minLot: number; weekendTrading: boolean
}

export type AccountType = 'classic' | 'silver' | 'gold' | 'platinum' | 'vip'

export interface AccountTier {
  type: AccountType; label: string; level: string; spreadsFrom: string; leverage: string
  commission: string; marginCall: string; stopOut: string; negativeBalance: boolean
  freeSupport: boolean; freeEducation: boolean; swapDiscount: string; color: string
}

export interface TickerItem {
  symbol: string; price: string; change: string; changePercent: string; isUp: boolean
}

export interface NavItem {
  label: string; href: string; children?: NavItem[]
}

export interface Feature {
  icon: string; title: string; description: string
}

export interface EducationCard {
  title: string; description: string; href: string; icon: string
}
