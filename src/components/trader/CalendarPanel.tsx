'use client'

import { useState } from 'react'
import { BarChart3, Globe, Info } from 'lucide-react'

const calendarEvents = [
  { time: '01:45', country: '🇨🇳', event: 'Caixin Services PMI', pv: '52.10', prev: '56.70', forecast: '53.70', impact: 'high' },
  { time: '12:30', country: '🇺🇸', event: 'Average Hourly Earnings (YoY)', pv: '-', prev: '3.80', forecast: '3.70', impact: 'medium' },
  { time: '12:30', country: '🇺🇸', event: 'Nonfarm Payrolls', pv: '-', prev: '-92.00', forecast: '60.00', impact: 'high' },
  { time: '12:30', country: '🇺🇸', event: 'Average Hourly Earnings (MoM)', pv: '-', prev: '0.40', forecast: '0.30', impact: 'medium' },
  { time: '14:00', country: '🇺🇸', event: 'ISM Non-Manufacturing PMI', pv: '-', prev: '53.80', forecast: '54.20', impact: 'high' },
  { time: '14:00', country: '🇺🇸', event: 'ISM Non-Manufacturing Employment', pv: '-', prev: '53.90', forecast: '-', impact: 'low' },
  { time: '16:00', country: '🇺🇸', event: 'Baker Hughes Oil Rig Count', pv: '-', prev: '484', forecast: '-', impact: 'low' },
  { time: '19:00', country: '🇺🇸', event: 'Consumer Credit Change', pv: '-', prev: '18.08B', forecast: '15.00B', impact: 'low' },
]

const impactColors = {
  high: 'bg-accent-red/60',
  medium: 'bg-accent-orange/60',
  low: 'bg-accent-green/40',
}

const tabs = ['Calendar', 'Market', 'Symbol Info']

export default function CalendarPanel() {
  const [activeTab, setActiveTab] = useState('Calendar')

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-0.5 px-3 border-b border-white/[0.04] shrink-0">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-2.5 text-[11px] font-medium transition-all border-b-2 flex items-center gap-1.5 ${activeTab === tab ? 'text-text-primary border-brand-500' : 'text-text-muted border-transparent hover:text-text-secondary'}`}>
            {tab === 'Calendar' && '📅'}
            {tab === 'Market' && '📊'}
            {tab === 'Symbol Info' && 'ℹ️'}
            {tab}
          </button>
        ))}
      </div>

      {/* Calendar content */}
      {activeTab === 'Calendar' && (
        <div className="flex-1 overflow-y-auto">
          {calendarEvents.map((ev, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-2 w-[45%]">
                <span className="text-lg">{ev.country}</span>
                <div>
                  <p className="text-[11px] font-medium text-text-primary leading-tight">{ev.time} &nbsp;{ev.event}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-text-muted font-mono flex-1">
                <span>PV:{ev.pv}</span>
                <span>Prev:{ev.prev}</span>
                <span>Forecast:{ev.forecast}</span>
              </div>
              <div className={`w-5 h-5 rounded flex items-center justify-center ${impactColors[ev.impact as keyof typeof impactColors]}`}>
                <BarChart3 size={10} className="text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Market' && (
        <div className="flex-1 flex items-center justify-center text-text-muted text-xs">
          <Globe size={16} className="mr-2" /> Market overview coming soon
        </div>
      )}

      {activeTab === 'Symbol Info' && (
        <div className="flex-1 flex items-center justify-center text-text-muted text-xs">
          <Info size={16} className="mr-2" /> Select a symbol to view details
        </div>
      )}
    </div>
  )
}
