import MarketPage from '@/components/shared/MarketPage'
export const metadata = { title: 'Metals Trading' }
export default function MetalsPage() {
  return <MarketPage category="metals" title="Trade Precious Metals" subtitle="Metals" description="Trade Gold, Silver, and Platinum against the US Dollar. Safe haven assets with leverage up to 1:200." />
}
