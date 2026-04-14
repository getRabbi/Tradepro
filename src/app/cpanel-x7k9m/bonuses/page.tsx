'use client'

import { useState } from 'react'
import { Gift, Plus, Users, DollarSign } from 'lucide-react'

const bonuses = [
  { id: '1', user: 'Ahmad Rizal', amount: 500, volumeReq: 50.0, volumeTraded: 32.5, status: 'active', created: '2026-03-20', expires: '2026-06-20' },
  { id: '2', user: 'Somchai Patel', amount: 1000, volumeReq: 100.0, volumeTraded: 100.0, status: 'completed', created: '2026-02-15', expires: '2026-05-15' },
  { id: '3', user: 'Sarah Lee', amount: 250, volumeReq: 25.0, volumeTraded: 8.2, status: 'active', created: '2026-04-01', expires: '2026-07-01' },
]

export default function AdminBonusesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-heading font-black text-2xl text-text-primary">Bonus Management</h1><p className="text-text-muted text-sm">Manage trading bonuses and volume requirements</p></div>
        <button className="btn-primary !py-2.5 !px-5 text-xs flex items-center gap-2"><Plus size={14} /> Create Bonus</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4"><p className="text-[9px] text-text-muted/50 uppercase tracking-wider font-bold">Active Bonuses</p><p className="font-heading font-black text-2xl text-brand-400 mt-1">{bonuses.filter((b) => b.status === 'active').length}</p></div>
        <div className="glass-card p-4"><p className="text-[9px] text-text-muted/50 uppercase tracking-wider font-bold">Total Allocated</p><p className="font-heading font-black text-2xl text-accent-green mt-1">${bonuses.reduce((a, b) => a + b.amount, 0).toLocaleString()}</p></div>
        <div className="glass-card p-4"><p className="text-[9px] text-text-muted/50 uppercase tracking-wider font-bold">Completed</p><p className="font-heading font-black text-2xl text-text-secondary mt-1">{bonuses.filter((b) => b.status === 'completed').length}</p></div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-[11px]">
          <thead><tr className="border-b border-white/[0.06] text-text-muted/50 uppercase tracking-wider text-[9px]">
            <th className="text-left px-4 py-3 font-bold">User</th>
            <th className="text-right px-3 py-3 font-bold">Bonus</th>
            <th className="text-center px-3 py-3 font-bold">Volume Progress</th>
            <th className="text-center px-3 py-3 font-bold">Status</th>
            <th className="text-left px-3 py-3 font-bold">Expires</th>
          </tr></thead>
          <tbody>
            {bonuses.map((b) => {
              const progress = Math.min((b.volumeTraded / b.volumeReq) * 100, 100)
              return (
                <tr key={b.id} className="border-b border-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-text-primary">{b.user}</td>
                  <td className="text-right px-3 py-3 font-mono font-bold text-accent-green">${b.amount}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-surface-600/50 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[10px] text-text-muted font-mono w-20 text-right">{b.volumeTraded}/{b.volumeReq} lots</span>
                    </div>
                  </td>
                  <td className="text-center px-3 py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${b.status === 'active' ? 'bg-accent-green/10 text-accent-green' : b.status === 'completed' ? 'bg-brand-500/10 text-brand-300' : 'bg-accent-red/10 text-accent-red'}`}>{b.status}</span></td>
                  <td className="px-3 py-3 text-text-muted">{b.expires}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="glass-card p-5 border-accent-orange/10 bg-accent-orange/[0.02]">
        <p className="text-xs text-text-secondary"><strong className="text-accent-orange">Note:</strong> Bonuses lock withdrawal capability until volume requirements are met. Users must trade the required volume before withdrawing bonus funds.</p>
      </div>
    </div>
  )
}
