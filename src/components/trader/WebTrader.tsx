'use client'

import { useTraderStore } from '@/lib/traderStore'
import { usePriceEngine } from '@/hooks/usePriceEngine'
import TraderTopBar from './TraderTopBar'
import TraderSidebar from './TraderSidebar'
import InstrumentPanel from './InstrumentPanel'
import ChartPanel from './ChartPanel'
import OrderPanel from './OrderPanel'
import PositionsPanel from './PositionsPanel'
import CalendarPanel from './CalendarPanel'
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

const notifIcons = {
  success: <CheckCircle size={13} />,
  error: <XCircle size={13} />,
  warning: <AlertTriangle size={13} />,
  info: <Info size={13} />,
}

function NotificationToasts() {
  const { notifications, clearNotification } = useTraderStore()
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-14 right-3 z-[60] space-y-1.5 max-w-xs pointer-events-none">
      {notifications.slice(0, 4).map((n) => (
        <div key={n.id} className={`pointer-events-auto flex items-center gap-2 pl-3 pr-2 py-2 rounded-lg border backdrop-blur-xl animate-slide-down shadow-lg text-[11px] font-medium ${
          n.type === 'success' ? 'bg-accent-green/10 border-accent-green/15 text-accent-green' :
          n.type === 'error' ? 'bg-accent-red/10 border-accent-red/15 text-accent-red' :
          n.type === 'warning' ? 'bg-accent-orange/10 border-accent-orange/15 text-accent-orange' :
          'bg-brand-500/10 border-brand-500/15 text-brand-300'
        }`}>
          {notifIcons[n.type]}
          <span className="flex-1">{n.message}</span>
          <button onClick={() => clearNotification(n.id)} className="opacity-40 hover:opacity-80 p-0.5"><X size={12} /></button>
        </div>
      ))}
    </div>
  )
}

export default function WebTrader() {
  usePriceEngine()
  const loadFromDB = useTraderStore((s) => s.loadFromDB)
  const loadTradesFromDB = useTraderStore((s) => s.loadTradesFromDB)
  const [bottomH, setBottomH] = useState(280)
  const dragRef = useRef<{ active: boolean; startY: number; startH: number }>({ active: false, startY: 0, startH: 280 })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => { loadFromDB().then(() => loadTradesFromDB()) }, [])

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { active: true, startY: e.clientY, startH: bottomH }
    setIsDragging(true)
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return
      const delta = dragRef.current.startY - e.clientY
      setBottomH(Math.max(100, Math.min(600, dragRef.current.startH + delta)))
    }
    const onUp = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false
        setIsDragging(false)
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  return (
    <div className="h-screen w-screen bg-[#080c17] flex flex-col overflow-hidden select-none pb-14 md:pb-0" style={{ fontFeatureSettings: '"tnum"' }}>
      <TraderTopBar />
      <NotificationToasts />

      <div className="flex flex-1 overflow-hidden">
        <TraderSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* Left panel: Instruments + Order */}
            <div className="w-[280px] border-r border-white/[0.04] flex flex-col overflow-hidden shrink-0 hidden lg:flex">
              <InstrumentPanel />
              <OrderPanel />
            </div>

            {/* Center: Chart + Bottom panels */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div style={{ flex: '1 1 0%', minHeight: '400px', position: 'relative' }}>
                <ChartPanel />
              </div>
              {/* Drag handle + size buttons */}
              <div className="border-t border-white/[0.06] flex items-center shrink-0">
                <div onMouseDown={onDragStart} className="flex-1 h-[10px] cursor-row-resize hover:bg-brand-500/15 active:bg-brand-500/30 flex items-center justify-center group transition-colors">
                  <div className="w-16 h-[3px] rounded-full bg-white/[0.06] group-hover:bg-brand-400/40 transition-colors" />
                </div>
                <div className="flex items-center gap-0.5 px-2 shrink-0">
                  <button onClick={() => setBottomH(100)} className="px-1.5 py-0.5 rounded text-[8px] text-text-muted/40 hover:text-text-muted hover:bg-surface-600/50" title="Minimize">▼</button>
                  <button onClick={() => setBottomH(280)} className="px-1.5 py-0.5 rounded text-[8px] text-text-muted/40 hover:text-text-muted hover:bg-surface-600/50" title="Default">■</button>
                  <button onClick={() => setBottomH(450)} className="px-1.5 py-0.5 rounded text-[8px] text-text-muted/40 hover:text-text-muted hover:bg-surface-600/50" title="Maximize">▲</button>
                </div>
              </div>
              {/* Invisible overlay while dragging - prevents TradingView iframe from stealing mouse */}
              {isDragging && <div className="fixed inset-0 z-50 cursor-row-resize" />}
              <div style={{ height: `${bottomH}px` }} className="flex overflow-hidden shrink-0">
                <div className="w-[38%] border-r border-white/[0.04] hidden xl:block overflow-y-auto">
                  <CalendarPanel />
                </div>
                <div className="flex-1 relative overflow-y-auto">
                  <PositionsPanel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
