'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Search, Eye, X, DollarSign, Save, RefreshCw } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [editBal, setEditBal] = useState<any>(null)
  const [newBal, setNewBal] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const { data: allUsers } = await supabase.from('users').select('*').order('created_at', { ascending: false })
      if (!allUsers || allUsers.length === 0) { setLoading(false); return }

      const ids = allUsers.map((u: any) => u.id)
      const { data: allAccounts } = await supabase.from('accounts').select('*').in('user_id', ids)
      const { data: allKyc } = await supabase.from('kyc_documents').select('user_id, status').in('user_id', ids)

      setUsers(allUsers.map((u: any) => {
        const acc = (allAccounts || []).find((a: any) => a.user_id === u.id)
        const kyc = (allKyc || []).filter((k: any) => k.user_id === u.id)
        const kycStatus = kyc.length > 0 ? (kyc.every((k: any) => k.status === 'APPROVED') ? 'APPROVED' : kyc[0].status) : 'NONE'
        return {
          id: u.id, name: `${u.first_name} ${u.last_name}`, email: u.email,
          phone: u.phone || '—', country: u.country || '—', role: u.role,
          accountId: acc?.id || '', accountNumber: acc?.account_number || '—',
          accountType: acc?.account_type || '—', mode: acc?.account_mode || '—',
          balance: Number(acc?.balance || 0), equity: Number(acc?.equity || 0),
          leverage: acc?.leverage || 400, kycStatus,
          registered: new Date(u.created_at).toLocaleDateString('en-GB'),
          lastLogin: u.last_login_at ? new Date(u.last_login_at).toLocaleString('en-GB') : '—',
        }
      }))
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const saveBalance = async () => {
    if (!editBal || !newBal) return
    const bal = parseFloat(newBal)
    if (isNaN(bal) || bal < 0) return
    await supabase.from('accounts').update({ balance: bal, equity: bal, free_margin: bal }).eq('id', editBal.accountId)
    setUsers(users.map((u) => u.id === editBal.id ? { ...u, balance: bal, equity: bal } : u))
    setEditBal(null)
  }

  const filtered = users.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-heading font-black text-2xl text-text-primary">User Management</h1>
          <p className="text-text-muted text-sm">{users.length} users <span className="text-accent-green">● Live</span></p></div>
        <button onClick={load} className="btn-outline !py-2 !px-4 text-xs flex items-center gap-2"><RefreshCw size={13} /> Refresh</button>
      </div>

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/40 focus:outline-none focus:border-brand-500/30" placeholder="Search..." />
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? <p className="text-center py-8 text-text-muted">Loading...</p> : (
        <table className="w-full text-[11px]">
          <thead><tr className="border-b border-white/[0.06] text-text-muted/50 uppercase tracking-wider text-[9px]">
            <th className="text-left px-4 py-3">User</th><th className="text-center px-2 py-3">Country</th>
            <th className="text-center px-2 py-3">Account</th><th className="text-center px-2 py-3">Leverage</th>
            <th className="text-right px-2 py-3">Balance</th><th className="text-right px-2 py-3">Equity</th><th className="text-center px-2 py-3">KYC</th>
            <th className="text-center px-2 py-3">Registered</th><th className="text-center px-2 py-3 w-24">Actions</th>
          </tr></thead>
          <tbody>{filtered.map((u) => (
            <tr key={u.id} className="border-b border-white/[0.02] hover:bg-white/[0.015]">
              <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 text-[10px] font-black">{u.name.charAt(0)}</div><div><p className="font-heading font-bold text-text-primary">{u.name}</p><p className="text-[10px] text-text-muted">{u.email}</p></div></div></td>
              <td className="text-center px-2 py-3 text-text-muted">{u.country}</td>
              <td className="text-center px-2 py-3"><span className="px-2 py-0.5 rounded text-[9px] font-bold bg-surface-600/50 text-text-secondary">{u.accountType}</span><br/><span className="text-[8px] text-text-muted">{u.mode}</span></td>
              <td className="text-center px-2 py-3 font-mono font-bold text-accent-cyan">1:{u.leverage}</td>
              <td className="text-right px-2 py-3 font-mono font-bold text-text-primary">${u.balance.toFixed(2)}</td>
              <td className="text-right px-2 py-3 font-mono font-bold text-accent-cyan">${u.equity.toFixed(2)}</td>
              <td className="text-center px-2 py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${u.kycStatus === 'APPROVED' ? 'bg-accent-green/10 text-accent-green' : u.kycStatus === 'PENDING' ? 'bg-accent-orange/10 text-accent-orange' : 'bg-surface-600/50 text-text-muted'}`}>{u.kycStatus}</span></td>
              <td className="text-center px-2 py-3 text-text-muted text-[10px]">{u.registered}</td>
              <td className="text-center px-2 py-3">
                <div className="flex items-center justify-center gap-1">
                  <button onClick={() => setSelected(u)} className="w-6 h-6 rounded flex items-center justify-center text-text-muted/40 hover:text-brand-400 hover:bg-brand-500/10"><Eye size={12} /></button>
                  <button onClick={() => { setEditBal(u); setNewBal(u.balance.toString()) }} className="w-6 h-6 rounded flex items-center justify-center text-text-muted/40 hover:text-accent-green hover:bg-accent-green/10" title="Edit Balance"><DollarSign size={12} /></button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>)}
        {!loading && filtered.length === 0 && <p className="text-center py-8 text-text-muted">No users found</p>}
      </div>

      {editBal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setEditBal(null)}>
          <div className="bg-surface-700 rounded-2xl p-6 w-full max-w-sm border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-text-primary mb-1">Edit Balance — {editBal.name}</h3>
            <p className="text-xs text-text-muted mb-4">Current: ${editBal.balance.toFixed(2)}</p>
            <input type="number" value={newBal} onChange={(e) => setNewBal(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-surface-600/50 border border-white/[0.06] text-text-primary text-sm font-mono focus:outline-none focus:border-brand-500/30" />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditBal(null)} className="flex-1 py-2.5 rounded-xl bg-surface-600 text-text-muted text-xs font-bold">Cancel</button>
              <button onClick={saveBalance} className="flex-1 py-2.5 rounded-xl bg-accent-green text-white text-xs font-bold flex items-center justify-center gap-1"><Save size={12} /> Update</button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-surface-700 rounded-2xl p-6 w-full max-w-lg border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h2 className="font-heading font-bold text-lg text-text-primary">User Details</h2><button onClick={() => setSelected(null)}><X size={20} className="text-text-muted" /></button></div>
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 font-black text-lg">{selected.name.charAt(0)}</div>
              <div><p className="font-heading font-bold text-text-primary">{selected.name}</p><p className="text-xs text-text-muted">{selected.email}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-surface-600/30 text-center"><p className="text-[9px] text-text-muted/50 uppercase font-bold">Balance</p><p className="font-heading font-black text-lg text-text-primary">${selected.balance.toFixed(2)}</p></div>
              <div className="p-3 rounded-xl bg-surface-600/30 text-center"><p className="text-[9px] text-text-muted/50 uppercase font-bold">Leverage</p><p className="font-heading font-black text-lg text-accent-cyan">1:{selected.leverage}</p></div>
            </div>
            {Object.entries({ Phone: selected.phone, Country: selected.country, Account: `${selected.accountType} (${selected.mode})`, 'Account #': selected.accountNumber, KYC: selected.kycStatus, Registered: selected.registered, 'Last Login': selected.lastLogin, Role: selected.role }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-white/[0.03] text-sm"><span className="text-text-muted">{k}</span><span className="text-text-primary font-medium">{v as string}</span></div>
            ))}
            <button onClick={() => { setSelected(null); setEditBal(selected); setNewBal(selected.balance.toString()) }} className="w-full mt-5 py-2.5 rounded-xl bg-accent-green/10 border border-accent-green/15 text-accent-green text-xs font-bold">Edit Balance</button>
          </div>
        </div>
      )}
    </div>
  )
}
