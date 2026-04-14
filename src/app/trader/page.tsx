'use client'

import dynamic from 'next/dynamic'

const WebTrader = dynamic(() => import('@/components/trader/WebTrader'), { ssr: false })

export default function TraderPage() {
  return <WebTrader />
}
