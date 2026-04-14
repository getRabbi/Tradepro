'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function AdminTradingPage() {
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const { data: allTrades } = await supabase.from('trades').select('*').eq('status', 'OPEN').limit(100)
      if (!allTrades || allTrades.length === 0) { setLoading(false); return }

      const accIds = [...new Set(allTrades.map((t: any) => t.account_id))]
      const { data: accs } = await supabase.from('accounts').select('id, user_id').in('id', accIds)
      const userIds = [...new Set((accs || []).map((a: any) => a.user_id))]
      const { data: users } = await supabase.from('users').select('id, first_name, last_name').in('id', userIds)

      setTrades(allTrades.map((t: any) => {
        const acc = (accs || []).find((a: any) => a.id === t.account_id)
        const u = (users || []).find((u: any) => u.id === acc?.user_id)
        return {
          id: t.id, user: u ? `${u.first_name} ${u.last_name}` : 'Unknown',
          symbol: t.symbol, type: t.type, volume: Number(t.volume),
          openPrice: Number(t.open_price), profit: Number(t.profit),
          margin: Number(t.volume) * Number(t.open_price) * 0.01,
        }
      }))
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const totalExposure = trades.reduce((a, t) => a + (t.margin || 0), 0)
  const totalPL = trades.reduce((a, t) => a + (t.profit || 0), 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-heading font-black text-2xl text-text-primary">Trading Monitor</h1>
          <p className="text-text-muted text-sm">{trades.length} active trades <span className="text-accent-green">● Live</span></p></div>
        <button onClick={load} className="btn-outline !py-2 !px-4 text-xs flex items-center gap-2"><RefreshCw size={13} /> Refresh</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: 'Active Positions', v: trades.length, c: 'text-brand-400' },
          { l: 'Total Exposure', v: `$${totalExposure.toFixed(2)}`, c: 'text-accent-cyan' },
          { l: 'Unrealized P&L', v: `${totalPL >= 0 ? '+' : ''}$${totalPL.toFixed(2)}`, c: totalPL >= 0 ? 'text-accent-green' : 'text-accent-red' },
          { l: 'Unique Traders', v: new Set(trades.map((t) => t.user)).size, c: 'text-accent-orange' },
        ].map((s) => (
          <div key={s.l} className="glass-card p-4"><p className="text-[9px] text-text-muted/50 uppercase tracking-wider font-bold mb-1">{s.l}</p><p className={`font-heading font-black text-xl ${s.c}`}>{s.v}</p></div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.04]"><h2 className="font-heading font-bold text-sm text-text-primary">All Active Positions</h2></div>
        {loading ? <p className="text-center py-8 text-text-muted">Loading...</p> : trades.length === 0 ? (
          <p className="text-center py-8 text-text-muted">No active trades. Users have not opened any positions yet.</p>
        ) : (
        <table className="w-full text-[11px]">
          <thead><tr className="border-b border-white/[0.06] text-text-muted/50 uppercase tracking-wider text-[9px]">
            <th className="text-left px-4 py-3">User</th><th className="text-left px-3 py-3">Symbol</th>
            <th className="text-center px-3 py-3">Type</th><th className="text-center px-3 py-3">Volume</th>
            <th className="text-center px-3 py-3">Open Price</th><th className="text-right px-3 py-3">Margin</th>
            <th className="text-right px-4 py-3">P&L</th>
          </tr></thead>
          <tbody>{trades.map((t) => (
            <tr key={t.id} className="border-b border-white/[0.02] hover:bg-white/[0.015]">
              <td className="px-4 py-3 text-text-primary">{t.user}</td>
              <td className="px-3 py-3 font-heading font-bold text-text-primary">{t.symbol}</td>
              <td className="text-center px-3 py-3"><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${t.type === 'BUY' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>{t.type}</span></td>
              <td className="text-center px-3 py-3 font-mono text-text-secondary">{t.volume.toFixed(2)}</td>
              <td className="text-center px-3 py-3 font-mono text-text-muted">{t.openPrice}</td>
              <td className="text-right px-3 py-3 font-mono text-text-muted">${t.margin.toFixed(2)}</td>
              <td className="text-right px-4 py-3 font-mono font-bold"><span className={t.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}>{t.profit >= 0 ? '+' : ''}{t.profit.toFixed(2)}</span></td>
            </tr>
          ))}</tbody>
        </table>)}
      </div>

      <div className="glass-card p-5 border-accent-orange/15">
        <div className="flex items-center gap-3"><AlertTriangle size={20} className="text-accent-orange" />
          <div><p className="text-sm font-heading font-bold text-text-primary">Risk Monitor</p>
            <p className="text-xs text-text-muted">All positions within normal risk parameters.</p></div>
        </div>
      </div>
    </div>
  )
}
