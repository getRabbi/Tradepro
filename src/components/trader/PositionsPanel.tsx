'use client'

import { useTraderStore } from '@/lib/traderStore'
import { symbolConfigs } from '@/lib/priceEngine'
import { Pencil, X, Filter, Download, XCircle } from 'lucide-react'
import { useState } from 'react'

const tabs = [
  { key: 'positions', label: 'Open Positions' },
  { key: 'pending', label: 'Pending Orders' },
  { key: 'closed', label: 'Closed Positions' },
  { key: 'finance', label: 'Finance' },
]

export default function PositionsPanel() {
  const { activeBottomTab, setActiveBottomTab, openPositions, closedPositions, pendingOrders, closePosition, modifyPosition, prices, balance, equity, freeMargin, marginUsed, totalProfit } = useTraderStore()
  const [editId, setEditId] = useState<string | null>(null)
  const [editSL, setEditSL] = useState('')
  const [editTP, setEditTP] = useState('')

  const handleModify = (id: string) => {
    modifyPosition(id, editSL ? parseFloat(editSL) : null, editTP ? parseFloat(editTP) : null)
    setEditId(null)
  }

  const closeAll = () => { openPositions.forEach((p) => closePosition(p.id)) }

  const totalOpenPL = openPositions.reduce((s, p) => s + p.profit, 0)

  return (
    <div className="h-full flex flex-col bg-surface-800/10">
      {/* Tabs */}
      <div className="flex items-center justify-between px-2 border-b border-white/[0.04] shrink-0">
        <div className="flex items-center">
          {tabs.map((t) => {
            const cnt = t.key === 'positions' ? openPositions.length : t.key === 'pending' ? pendingOrders.length : t.key === 'closed' ? closedPositions.length : 0
            return (
              <button key={t.key} onClick={() => setActiveBottomTab(t.key)}
                className={`px-2.5 py-2 text-[10px] font-bold border-b-2 transition-all ${activeBottomTab === t.key ? 'text-text-primary border-brand-500' : 'text-text-muted/40 border-transparent hover:text-text-muted'}`}>
                {t.label}
                {cnt > 0 && <span className={`ml-1 px-1 py-px rounded text-[8px] ${activeBottomTab === t.key ? 'bg-brand-500/20 text-brand-300' : 'bg-surface-600/50 text-text-muted/50'}`}>{cnt}</span>}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-0.5">
          {activeBottomTab === 'positions' && openPositions.length > 0 && (
            <>
              <span className={`text-[10px] font-mono font-bold mr-2 ${totalOpenPL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                Σ {totalOpenPL >= 0 ? '+' : ''}{totalOpenPL.toFixed(2)}
              </span>
              <button onClick={closeAll} className="flex items-center gap-0.5 px-2 py-1 rounded text-[9px] text-accent-red/60 hover:text-accent-red hover:bg-accent-red/5 transition-all font-bold">
                <XCircle size={10} /> Close All
              </button>
            </>
          )}
          <button className="w-6 h-6 rounded flex items-center justify-center text-text-muted/30 hover:text-text-muted"><Filter size={11} /></button>
          <button className="w-6 h-6 rounded flex items-center justify-center text-text-muted/30 hover:text-text-muted"><Download size={11} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeBottomTab === 'positions' && (
          openPositions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-text-muted/30 gap-1">
              <p className="text-xs font-medium">No open positions</p>
              <p className="text-[10px]">Place a trade to get started</p>
            </div>
          ) : (
            <table className="w-full text-[10px]">
              <thead><tr className="text-text-muted/40 uppercase tracking-wider text-[8px]">
                <th className="text-left px-2 py-1.5 font-bold">Symbol</th>
                <th className="text-center px-1 py-1.5 font-bold">Vol</th>
                <th className="text-center px-1 py-1.5 font-bold">Open</th>
                <th className="text-center px-1 py-1.5 font-bold">Current</th>
                <th className="text-center px-1 py-1.5 font-bold">SL/TP</th>
                <th className="text-right px-1 py-1.5 font-bold">Margin</th>
                <th className="text-right px-1 py-1.5 font-bold">P&L</th>
                <th className="text-center px-1 py-1.5 font-bold w-14"></th>
              </tr></thead>
              <tbody>
                {openPositions.map((pos) => {
                  const cfg = symbolConfigs[pos.symbol]
                  const dec = cfg?.decimals || 5
                  return (
                    <tr key={pos.id} className="border-t border-white/[0.02] hover:bg-white/[0.015] transition-colors">
                      <td className="px-2 py-1.5">
                        <div className="flex items-center gap-1">
                          <span className="font-heading font-bold text-text-primary">{pos.symbol}</span>
                          <span className={`px-1 py-px rounded text-[7px] font-black ${pos.type === 'BUY' ? 'bg-accent-green/12 text-accent-green' : 'bg-accent-red/12 text-accent-red'}`}>{pos.type === 'BUY' ? 'B' : 'S'}</span>
                        </div>
                      </td>
                      <td className="text-center px-1 py-1.5 font-mono text-text-muted">{pos.volume.toFixed(2)}</td>
                      <td className="text-center px-1 py-1.5 font-mono text-text-muted">{pos.openPrice.toFixed(dec)}</td>
                      <td className="text-center px-1 py-1.5 font-mono text-text-secondary font-bold">{pos.currentPrice.toFixed(dec)}</td>
                      <td className="text-center px-1 py-1.5 font-mono text-text-muted/50 text-[8px]">
                        {pos.stopLoss ? <span className="text-accent-red/50">{pos.stopLoss.toFixed(dec)}</span> : '—'}
                        {' / '}
                        {pos.takeProfit ? <span className="text-accent-green/50">{pos.takeProfit.toFixed(dec)}</span> : '—'}
                      </td>
                      <td className="text-right px-1 py-1.5 font-mono text-text-muted/40">${pos.margin.toFixed(2)}</td>
                      <td className="text-right px-1 py-1.5">
                        <span className={`font-mono font-black ${pos.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                          {pos.profit >= 0 ? '+' : ''}{pos.profit.toFixed(2)}
                        </span>
                        <span className={`block text-[8px] font-mono ${pos.profitPercent >= 0 ? 'text-accent-green/50' : 'text-accent-red/50'}`}>
                          {pos.profitPercent >= 0 ? '+' : ''}{pos.profitPercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-center px-1 py-1.5">
                        <div className="flex items-center justify-center gap-px">
                          <button onClick={() => { setEditId(pos.id); setEditSL(pos.stopLoss?.toString() || ''); setEditTP(pos.takeProfit?.toString() || '') }}
                            className="w-5 h-5 rounded flex items-center justify-center text-text-muted/30 hover:text-brand-400 hover:bg-brand-500/10 transition-all"><Pencil size={9} /></button>
                          <button onClick={() => closePosition(pos.id)}
                            className="w-5 h-5 rounded flex items-center justify-center text-text-muted/30 hover:text-accent-red hover:bg-accent-red/10 transition-all"><X size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        )}

        {activeBottomTab === 'pending' && <div className="flex items-center justify-center h-full text-text-muted/30 text-[10px]">No pending orders</div>}

        {activeBottomTab === 'closed' && (
          closedPositions.length === 0 ? <div className="flex items-center justify-center h-full text-text-muted/30 text-[10px]">No closed positions yet</div> : (
            <table className="w-full text-[10px]">
              <thead><tr className="text-text-muted/40 uppercase tracking-wider text-[8px]">
                <th className="text-left px-2 py-1.5 font-bold">Symbol</th>
                <th className="text-center px-1 py-1.5 font-bold">Type</th>
                <th className="text-center px-1 py-1.5 font-bold">Vol</th>
                <th className="text-center px-1 py-1.5 font-bold">Open</th>
                <th className="text-center px-1 py-1.5 font-bold">Close</th>
                <th className="text-right px-2 py-1.5 font-bold">P&L</th>
              </tr></thead>
              <tbody>
                {closedPositions.map((p) => (
                  <tr key={p.id} className="border-t border-white/[0.02]">
                    <td className="px-2 py-1.5 font-heading font-bold text-text-primary">{p.symbol}</td>
                    <td className="text-center px-1 py-1.5"><span className={`px-1 py-px rounded text-[7px] font-black ${p.type === 'BUY' ? 'bg-accent-green/12 text-accent-green' : 'bg-accent-red/12 text-accent-red'}`}>{p.type}</span></td>
                    <td className="text-center px-1 py-1.5 font-mono text-text-muted">{p.volume.toFixed(2)}</td>
                    <td className="text-center px-1 py-1.5 font-mono text-text-muted">{p.openPrice.toFixed(symbolConfigs[p.symbol]?.decimals || 5)}</td>
                    <td className="text-center px-1 py-1.5 font-mono text-text-secondary">{p.closePrice.toFixed(symbolConfigs[p.symbol]?.decimals || 5)}</td>
                    <td className="text-right px-2 py-1.5 font-mono font-black"><span className={p.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}>{p.profit >= 0 ? '+' : ''}{p.profit.toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {activeBottomTab === 'finance' && (
          <div className="p-3 grid grid-cols-2 gap-2">
            {[
              { label: 'Balance', value: balance, color: 'text-text-primary', prefix: '$' },
              { label: 'Equity', value: equity, color: 'text-text-primary', prefix: '$' },
              { label: 'Free Margin', value: freeMargin, color: 'text-accent-cyan', prefix: '$' },
              { label: 'Margin Used', value: marginUsed, color: 'text-accent-orange', prefix: '$' },
              { label: 'Unrealized P&L', value: totalProfit, color: totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red', prefix: totalProfit >= 0 ? '+$' : '-$', abs: true },
              { label: 'Open Positions', value: openPositions.length, color: 'text-brand-300', prefix: '' },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30 border border-white/[0.02]">
                <span className="text-[9px] text-text-muted/50 uppercase tracking-wider">{r.label}</span>
                <span className={`text-[11px] font-mono font-black ${r.color}`}>
                  {r.prefix}{typeof r.value === 'number' && r.label !== 'Open Positions' ? (r.abs ? Math.abs(r.value) : r.value).toFixed(2) : r.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit SL/TP modal */}
      {editId && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditId(null)}>
          <div className="bg-surface-700 rounded-xl p-5 w-72 border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-sm text-text-primary mb-4">Modify Position</h3>
            <div className="space-y-3">
              <div><label className="text-[9px] text-text-muted uppercase tracking-wider font-bold block mb-1">Stop Loss</label>
                <input type="number" value={editSL} onChange={(e) => setEditSL(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface-600/50 border border-white/[0.06] text-sm text-text-primary font-mono focus:outline-none focus:border-brand-500/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="—" step="any" /></div>
              <div><label className="text-[9px] text-text-muted uppercase tracking-wider font-bold block mb-1">Take Profit</label>
                <input type="number" value={editTP} onChange={(e) => setEditTP(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface-600/50 border border-white/[0.06] text-sm text-text-primary font-mono focus:outline-none focus:border-brand-500/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="—" step="any" /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditId(null)} className="flex-1 py-2 rounded-lg bg-surface-600 text-text-muted text-xs font-bold">Cancel</button>
              <button onClick={() => handleModify(editId)} className="flex-1 py-2 rounded-lg bg-brand-600 text-white text-xs font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
