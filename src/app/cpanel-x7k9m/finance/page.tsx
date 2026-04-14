'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ArrowDownToLine, ArrowUpFromLine, CheckCircle, XCircle, Download, X, Image, RefreshCw } from 'lucide-react'

export default function AdminFinancePage() {
  const [txs, setTxs] = useState<any[]>([])
  const [tab, setTab] = useState('all')
  const [preview, setPreview] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const { data: allTxs } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(200)
      if (!allTxs) { setLoading(false); return }

      const userIds = [...new Set(allTxs.map((t: any) => t.user_id))]
      const { data: users } = await supabase.from('users').select('id, first_name, last_name, email').in('id', userIds)

      setTxs(allTxs.map((t: any) => {
        const u = (users || []).find((u: any) => u.id === t.user_id)
        return { ...t, userName: u ? `${u.first_name} ${u.last_name}` : 'Unknown', userEmail: u?.email || '' }
      }))
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const [approving, setApproving] = useState<string | null>(null)

  const approve = async (id: string) => {
    if (approving) return
    setApproving(id)
    const tx = txs.find((t) => t.id === id)
    if (!tx) { setApproving(null); return }

    // 1. Mark as completed
    await supabase.from('transactions').update({ status: 'COMPLETED', processed_at: new Date().toISOString() }).eq('id', id)

    // 2. Find account - try account_id first, then by user_id
    let acc: any = null
    if (tx.account_id) {
      const { data } = await supabase.from('accounts').select('*').eq('id', tx.account_id).single()
      acc = data
    }
    if (!acc && tx.user_id) {
      // Fallback: find any active account for this user
      const { data } = await supabase.from('accounts').select('*').eq('user_id', tx.user_id).eq('is_active', true).limit(1).single()
      acc = data
    }

    // 3. Update ALL accounts for this user (both DEMO and LIVE get the credit)
    if (acc) {
      const change = tx.type === 'DEPOSIT' ? Number(tx.amount) : -Number(tx.amount)
      // Update the specific account
      const nb = Math.max(0, Number(acc.balance) + change)
      const ne = Math.max(0, Number(acc.equity) + change)
      const nf = Math.max(0, ne - Number(acc.margin_used || 0))
      await supabase.from('accounts').update({ balance: nb, equity: ne, free_margin: nf }).eq('id', acc.id)

      // Also update LIVE account if deposit was on DEMO
      if (acc.account_mode === 'DEMO' && tx.type === 'DEPOSIT') {
        const { data: liveAcc } = await supabase.from('accounts').select('*').eq('user_id', acc.user_id).eq('account_mode', 'LIVE').limit(1).single()
        if (liveAcc) {
          const lb = Math.max(0, Number(liveAcc.balance) + Number(tx.amount))
          await supabase.from('accounts').update({ balance: lb, equity: lb, free_margin: lb }).eq('id', liveAcc.id)
        }
      }
    }

    await load()
    setApproving(null)
  }

  const reject = async (id: string) => {
    await supabase.from('transactions').update({ status: 'REJECTED', rejection_reason: rejectReason, processed_at: new Date().toISOString() }).eq('id', id)
    setRejectId(null); setRejectReason('')
    load()
  }

  const filtered = txs.filter((t: any) => {
    if (tab === 'pending') return t.status === 'PENDING'
    if (tab === 'deposits') return t.type === 'DEPOSIT'
    if (tab === 'withdrawals') return t.type === 'WITHDRAWAL'
    return true
  })

  const pending = txs.filter((t) => t.status === 'PENDING')

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-heading font-black text-2xl text-text-primary">Financial Management</h1>
          <p className="text-text-muted text-sm">{pending.length} pending <span className="text-accent-green">● Live</span></p></div>
        <button onClick={load} className="btn-outline !py-2 !px-4 text-xs flex items-center gap-2"><RefreshCw size={13} /> Refresh</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: 'Completed Deposits', v: `$${txs.filter((t) => t.type === 'DEPOSIT' && t.status === 'COMPLETED').reduce((a, t) => a + Number(t.amount), 0).toLocaleString()}`, c: 'text-accent-green' },
          { l: 'Withdrawals', v: `$${txs.filter((t) => t.type === 'WITHDRAWAL').reduce((a, t) => a + Number(t.amount), 0).toLocaleString()}`, c: 'text-accent-red' },
          { l: 'Pending Review', v: pending.length, c: 'text-accent-orange' },
          { l: 'Total Transactions', v: txs.length, c: 'text-brand-400' },
        ].map((s) => (
          <div key={s.l} className="glass-card p-4"><p className="text-[9px] text-text-muted/50 uppercase tracking-wider font-bold">{s.l}</p><p className={`font-heading font-black text-xl mt-1 ${s.c}`}>{s.v}</p></div>
        ))}
      </div>

      <div className="flex gap-1 p-1 bg-surface-800/60 rounded-xl border border-white/[0.04] max-w-fit">
        {[{ k: 'all', l: 'All' }, { k: 'pending', l: `Pending (${pending.length})` }, { k: 'deposits', l: 'Deposits' }, { k: 'withdrawals', l: 'Withdrawals' }].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${tab === t.k ? 'bg-brand-600 text-white' : 'text-text-muted hover:text-text-secondary'}`}>{t.l}</button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? <p className="text-center py-8 text-text-muted">Loading...</p> : (
        <table className="w-full text-[11px]">
          <thead><tr className="border-b border-white/[0.06] text-text-muted/50 uppercase tracking-wider text-[9px]">
            <th className="text-left px-4 py-3">User</th><th className="text-center px-3 py-3">Type</th>
            <th className="text-right px-3 py-3">Amount</th><th className="text-center px-3 py-3">Method</th>
            <th className="text-center px-3 py-3">Screenshot</th><th className="text-center px-3 py-3">Status</th>
            <th className="text-left px-3 py-3 hidden md:table-cell">Date</th><th className="text-center px-3 py-3 w-28">Actions</th>
          </tr></thead>
          <tbody>{filtered.map((tx) => (
            <tr key={tx.id} className={`border-b border-white/[0.02] hover:bg-white/[0.015] ${tx.status === 'PENDING' ? 'bg-accent-orange/[0.02]' : ''}`}>
              <td className="px-4 py-3"><p className="font-medium text-text-primary">{tx.userName}</p><p className="text-[9px] text-text-muted">{tx.userEmail}</p></td>
              <td className="text-center px-3 py-3"><span className={`flex items-center justify-center gap-1 text-[10px] font-bold ${tx.type === 'DEPOSIT' ? 'text-accent-green' : 'text-accent-red'}`}>{tx.type === 'DEPOSIT' ? <ArrowDownToLine size={11} /> : <ArrowUpFromLine size={11} />}{tx.type}</span></td>
              <td className="text-right px-3 py-3 font-mono font-bold text-text-primary">${Number(tx.amount).toLocaleString()}</td>
              <td className="text-center px-3 py-3"><span className="px-2 py-0.5 rounded bg-surface-600/50 text-text-secondary text-[9px]">{String(tx.payment_method || '').replace('_', ' ')}</span></td>
              <td className="text-center px-3 py-3">
                {tx.rejection_reason && tx.status === 'PENDING' ? (
                  tx.rejection_reason.startsWith('http') ? (
                    <button onClick={() => setPreview(tx.rejection_reason)} className="flex items-center justify-center gap-1 mx-auto px-2 py-1 rounded bg-brand-500/10 text-brand-300 text-[9px] font-bold hover:bg-brand-500/20"><Image size={10} /> View</button>
                  ) : <span className="text-[10px] text-text-muted" title={tx.rejection_reason}>📎 {tx.rejection_reason.slice(0, 15)}...</span>
                ) : tx.rejection_reason && tx.rejection_reason.startsWith('http') ? (
                  <button onClick={() => setPreview(tx.rejection_reason)} className="flex items-center justify-center gap-1 mx-auto px-2 py-1 rounded bg-brand-500/10 text-brand-300 text-[9px] font-bold hover:bg-brand-500/20"><Image size={10} /> View</button>
                ) : <span className="text-text-muted/30 text-[10px]">—</span>}
              </td>
              <td className="text-center px-3 py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${tx.status === 'COMPLETED' ? 'bg-accent-green/10 text-accent-green' : tx.status === 'PENDING' ? 'bg-accent-orange/10 text-accent-orange' : 'bg-accent-red/10 text-accent-red'}`}>{tx.status}</span></td>
              <td className="px-3 py-3 text-text-muted hidden md:table-cell text-[10px]">{new Date(tx.created_at).toLocaleString('en-GB')}</td>
              <td className="text-center px-3 py-3">
                {tx.status === 'PENDING' ? (
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => approve(tx.id)} disabled={!!approving} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-accent-green/10 text-accent-green text-[9px] font-bold hover:bg-accent-green/20 disabled:opacity-40"><CheckCircle size={11} /> {approving === tx.id ? '...' : 'Approve'}</button>
                    <button onClick={() => setRejectId(tx.id)} disabled={!!approving} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-accent-red/10 text-accent-red text-[9px] font-bold hover:bg-accent-red/20 disabled:opacity-40"><XCircle size={11} /> Reject</button>
                  </div>
                ) : <span className="text-[10px] text-text-muted/40">—</span>}
              </td>
            </tr>
          ))}</tbody>
        </table>)}
        {!loading && filtered.length === 0 && <p className="text-center py-8 text-text-muted">No transactions</p>}
      </div>

      {preview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute -top-10 right-0 text-white"><X size={24} /></button>
            <div className="bg-surface-700 rounded-2xl p-4 border border-white/[0.08]"><h3 className="font-heading font-bold text-text-primary mb-3">Payment Screenshot</h3><img src={preview} alt="Screenshot" className="w-full rounded-xl" /></div>
          </div>
        </div>
      )}

      {rejectId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setRejectId(null)}>
          <div className="bg-surface-700 rounded-2xl p-6 w-full max-w-sm border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-text-primary mb-4">Reject Deposit</h3>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="Reason..." className="w-full px-3 py-2 rounded-xl bg-surface-600/50 border border-white/[0.06] text-text-primary text-sm focus:outline-none resize-none" />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setRejectId(null)} className="flex-1 py-2.5 rounded-xl bg-surface-600 text-text-muted text-xs font-bold">Cancel</button>
              <button onClick={() => reject(rejectId)} disabled={!rejectReason.trim()} className="flex-1 py-2.5 rounded-xl bg-accent-red text-white text-xs font-bold disabled:opacity-40">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
