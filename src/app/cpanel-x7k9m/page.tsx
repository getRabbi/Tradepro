'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Users, ArrowDownToLine, ArrowUpFromLine, FileCheck } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalDeposits: 0, totalWithdrawals: 0, pendingKyc: 0, pendingDeposits: 0, pendingWithdrawals: 0 })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentTxs, setRecentTxs] = useState<any[]>([])
  const [isReal, setIsReal] = useState(false)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    try {
      // Simple counts - no JOINs
      const { count: uc } = await supabase.from('users').select('*', { count: 'exact', head: true })
      const { count: pk } = await supabase.from('kyc_documents').select('*', { count: 'exact', head: true }).eq('status', 'PENDING')
      const { count: pd } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'PENDING').eq('type', 'DEPOSIT')
      const { count: pw } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'PENDING').eq('type', 'WITHDRAWAL')
      
      const { data: deps } = await supabase.from('transactions').select('amount').eq('type', 'DEPOSIT').eq('status', 'COMPLETED')
      const { data: wdrs } = await supabase.from('transactions').select('amount').eq('type', 'WITHDRAWAL')
      const td = (deps || []).reduce((a: number, d: any) => a + Number(d.amount), 0)
      const tw = (wdrs || []).reduce((a: number, w: any) => a + Number(w.amount), 0)

      setStats({ totalUsers: uc || 0, totalDeposits: td, totalWithdrawals: tw, pendingKyc: pk || 0, pendingDeposits: pd || 0, pendingWithdrawals: pw || 0 })

      // Recent users - simple query
      const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(5)
      if (users && users.length > 0) {
        // Fetch balances separately
        const userIds = users.map((u: any) => u.id)
        const { data: accs } = await supabase.from('accounts').select('*').in('user_id', userIds)
        
        setRecentUsers(users.map((u: any) => {
          const acc = (accs || []).find((a: any) => a.user_id === u.id)
          return { ...u, balance: acc ? Number(acc.balance) : 0, kycStatus: 'N/A' }
        }))
      }

      // Recent transactions - simple query
      const { data: txs } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(5)
      if (txs && txs.length > 0) {
        const txUserIds = [...new Set(txs.map((t: any) => t.user_id))]
        const { data: txUsers } = await supabase.from('users').select('id, first_name, last_name').in('id', txUserIds)
        
        setRecentTxs(txs.map((t: any) => {
          const u = (txUsers || []).find((u: any) => u.id === t.user_id)
          return { ...t, userName: u ? `${u.first_name} ${u.last_name}` : 'Unknown' }
        }))
      }

      setIsReal(true)
    } catch (e) { console.error('Dashboard load error:', e) }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div><h1 className="font-heading font-black text-2xl text-text-primary">Dashboard</h1>
        <p className="text-text-muted text-sm">Platform overview {isReal && <span className="text-accent-green">● Live Data</span>}</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'Total Deposits', value: `$${stats.totalDeposits.toLocaleString()}`, icon: ArrowDownToLine, color: 'text-accent-green', bg: 'bg-accent-green/10' },
          { label: 'Total Withdrawals', value: `$${stats.totalWithdrawals.toLocaleString()}`, icon: ArrowUpFromLine, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
          { label: 'Pending KYC', value: stats.pendingKyc, icon: FileCheck, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-text-muted/60 uppercase tracking-widest font-bold">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}><s.icon size={18} /></div>
            </div>
            <p className="font-heading font-black text-2xl text-text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Link href="/cpanel-x7k9m/finance" className="glass-card p-4 flex items-center gap-3 hover:border-white/[0.1]"><p className="text-2xl font-heading font-black text-text-primary">{stats.pendingDeposits}</p><p className="text-[10px] text-text-muted">Pending Deposits</p></Link>
        <Link href="/cpanel-x7k9m/finance" className="glass-card p-4 flex items-center gap-3 hover:border-white/[0.1]"><p className="text-2xl font-heading font-black text-text-primary">{stats.pendingWithdrawals}</p><p className="text-[10px] text-text-muted">Pending Withdrawals</p></Link>
        <Link href="/cpanel-x7k9m/kyc" className="glass-card p-4 flex items-center gap-3 hover:border-white/[0.1]"><p className="text-2xl font-heading font-black text-text-primary">{stats.pendingKyc}</p><p className="text-[10px] text-text-muted">Pending KYC</p></Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-sm text-text-primary">Recent Transactions</h2>
            <Link href="/cpanel-x7k9m/finance" className="text-[10px] text-brand-400">View all →</Link>
          </div>
          {recentTxs.length === 0 ? <p className="text-sm text-text-muted text-center py-6">No transactions yet</p> : (
            <div className="space-y-2">{recentTxs.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tx.type === 'DEPOSIT' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                    {tx.type === 'DEPOSIT' ? <ArrowDownToLine size={13} /> : <ArrowUpFromLine size={13} />}
                  </div>
                  <div><p className="text-xs font-medium text-text-primary">{tx.userName}</p><p className="text-[10px] text-text-muted">{new Date(tx.created_at).toLocaleDateString('en-GB')}</p></div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-mono font-bold ${tx.type === 'DEPOSIT' ? 'text-accent-green' : 'text-accent-red'}`}>{tx.type === 'DEPOSIT' ? '+' : '-'}${Number(tx.amount).toLocaleString()}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${tx.status === 'COMPLETED' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-orange/10 text-accent-orange'}`}>{tx.status}</span>
                </div>
              </div>
            ))}</div>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-sm text-text-primary">Recent Users</h2>
            <Link href="/cpanel-x7k9m/users" className="text-[10px] text-brand-400">View all →</Link>
          </div>
          {recentUsers.length === 0 ? <p className="text-sm text-text-muted text-center py-6">No users yet</p> : (
            <div className="space-y-2">{recentUsers.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 text-[10px] font-black">{u.first_name?.charAt(0)}</div>
                  <div><p className="text-xs font-medium text-text-primary">{u.first_name} {u.last_name}</p><p className="text-[10px] text-text-muted">{u.email}</p></div>
                </div>
                <p className="text-xs font-mono font-bold text-text-primary">${u.balance.toLocaleString()}</p>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  )
}
