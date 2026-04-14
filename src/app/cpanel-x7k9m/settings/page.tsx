'use client'

import { useState } from 'react'
import { usePlatformStore } from '@/lib/platformStore'
import { Settings, Save, Shield, DollarSign, Globe, Check, ChevronDown, ChevronUp, CreditCard, Pencil } from 'lucide-react'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null)
  const { paymentMethods, updatePaymentDetail, togglePaymentMethod, saveToSupabase } = usePlatformStore()

  const [fees, setFees] = useState({
    minDeposit: '250', withdrawalFeePct: '3.5', withdrawalFeeMin: '30',
    inactivity30: '100', inactivity60: '250', inactivity180: '500',
    classicSpread: '2.5', silverSpread: '2.5', goldSpread: '1.8', platinumSpread: '1.4', vipSpread: '0.9',
    maxLeverage: '400', marginCall: '100', stopOut: '20',
    maintenance: false,
  })

  const save = async () => { await saveToSupabase(); setSaved(true); setTimeout(() => setSaved(false), 3000) }
  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm font-mono focus:outline-none focus:border-brand-500/30 transition-all"

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-heading font-black text-2xl text-text-primary">Platform Settings</h1><p className="text-text-muted text-sm">Configure payments, fees, spreads, and system</p></div>
        <button onClick={save} className="btn-primary !py-2.5 !px-5 text-xs flex items-center gap-2"><Save size={14} /> Save All Changes</button>
      </div>

      {saved && <div className="glass-card p-4 border-accent-green/20 bg-accent-green/[0.03] flex items-center gap-2 animate-slide-down"><Check size={16} className="text-accent-green" /><p className="text-sm text-accent-green font-medium">All settings saved successfully!</p></div>}

      {/* ============ PAYMENT METHODS ============ */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={18} className="text-accent-green" />
          <h2 className="font-heading font-bold text-text-primary">Payment Methods</h2>
        </div>
        <p className="text-xs text-text-muted mb-5">Configure payment accounts that users see during deposit. Edit numbers, addresses, and instructions.</p>

        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const isExpanded = expandedMethod === method.id
            return (
              <div key={method.id} className={`rounded-xl border transition-all ${method.enabled ? 'bg-surface-700/20 border-white/[0.06]' : 'bg-surface-800/40 border-white/[0.03] opacity-60'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpandedMethod(isExpanded ? null : method.id)}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <p className="text-sm font-heading font-bold text-text-primary">{method.label}</p>
                      <p className="text-[10px] text-text-muted">
                        {method.id === 'bkash' || method.id === 'nagad' || method.id === 'rocket' ? method.details.number :
                         method.id === 'bank' ? method.details.accountNumber :
                         method.id === 'btc' || method.id.startsWith('usdt') ? method.details.address?.slice(0, 20) + '...' :
                         method.details.instruction?.slice(0, 40) + '...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Enable/Disable toggle */}
                    <button onClick={(e) => { e.stopPropagation(); togglePaymentMethod(method.id) }}
                      className="relative">
                      <div className={`w-10 h-5 rounded-full transition-colors ${method.enabled ? 'bg-accent-green' : 'bg-surface-500'}`} />
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${method.enabled ? 'translate-x-5' : ''}`} />
                    </button>
                    {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                  </div>
                </div>

                {/* Expanded edit form */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/[0.04] space-y-3 animate-slide-down">
                    {Object.entries(method.details).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                        </label>
                        {key === 'instruction' ? (
                          <textarea
                            value={value}
                            onChange={(e) => updatePaymentDetail(method.id, key, e.target.value)}
                            rows={2}
                            className={`${inputCls} resize-none !font-body`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updatePaymentDetail(method.id, key, e.target.value)}
                            className={inputCls}
                          />
                        )}
                      </div>
                    ))}

                    <div className="flex items-center gap-2 pt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${method.enabled ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                        {method.enabled ? 'ACTIVE — Users can see this method' : 'DISABLED — Hidden from users'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ============ FEES ============ */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5"><DollarSign size={18} className="text-accent-orange" /><h2 className="font-heading font-bold text-text-primary">Fee Configuration</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">Min Deposit ($)</label><input value={fees.minDeposit} onChange={(e) => setFees({ ...fees, minDeposit: e.target.value })} className={inputCls} /></div>
          <div><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">Withdrawal Fee (%)</label><input value={fees.withdrawalFeePct} onChange={(e) => setFees({ ...fees, withdrawalFeePct: e.target.value })} className={inputCls} /></div>
          <div><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">Min Withdrawal Fee ($)</label><input value={fees.withdrawalFeeMin} onChange={(e) => setFees({ ...fees, withdrawalFeeMin: e.target.value })} className={inputCls} /></div>
        </div>
        <h3 className="font-heading font-semibold text-sm text-text-secondary mt-6 mb-3">Inactivity Fees</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">After 30 Days ($)</label><input value={fees.inactivity30} onChange={(e) => setFees({ ...fees, inactivity30: e.target.value })} className={inputCls} /></div>
          <div><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">After 60 Days ($)</label><input value={fees.inactivity60} onChange={(e) => setFees({ ...fees, inactivity60: e.target.value })} className={inputCls} /></div>
          <div><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">After 180 Days ($)</label><input value={fees.inactivity180} onChange={(e) => setFees({ ...fees, inactivity180: e.target.value })} className={inputCls} /></div>
        </div>
      </div>

      {/* ============ SPREADS ============ */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5"><Settings size={18} className="text-brand-400" /><h2 className="font-heading font-bold text-text-primary">Spread Configuration (pips)</h2></div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {['classic', 'silver', 'gold', 'platinum', 'vip'].map((tier) => (
            <div key={tier}><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">{tier}</label>
              <input value={(fees as any)[`${tier}Spread`]} onChange={(e) => setFees({ ...fees, [`${tier}Spread`]: e.target.value })} className={inputCls} /></div>
          ))}
        </div>
      </div>

      {/* ============ RISK ============ */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5"><Shield size={18} className="text-accent-green" /><h2 className="font-heading font-bold text-text-primary">Risk Management</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">Max Leverage</label><input value={fees.maxLeverage} onChange={(e) => setFees({ ...fees, maxLeverage: e.target.value })} className={inputCls} /></div>
          <div><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">Margin Call (%)</label><input value={fees.marginCall} onChange={(e) => setFees({ ...fees, marginCall: e.target.value })} className={inputCls} /></div>
          <div><label className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1.5">Stop Out (%)</label><input value={fees.stopOut} onChange={(e) => setFees({ ...fees, stopOut: e.target.value })} className={inputCls} /></div>
        </div>
      </div>

      {/* ============ SYSTEM ============ */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5"><Globe size={18} className="text-accent-cyan" /><h2 className="font-heading font-bold text-text-primary">System</h2></div>
        <label className="flex items-center justify-between cursor-pointer mb-4">
          <div><p className="text-sm text-text-primary font-medium">Maintenance Mode</p><p className="text-[10px] text-text-muted">Temporarily disable the platform for all users</p></div>
          <div className="relative">
            <input type="checkbox" checked={fees.maintenance} onChange={(e) => setFees({ ...fees, maintenance: e.target.checked })} className="sr-only peer" />
            <div className="w-10 h-5 rounded-full bg-surface-500 peer-checked:bg-accent-red transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
          </div>
        </label>
        <div className="p-3 rounded-xl bg-surface-700/30 border border-white/[0.03]"><p className="text-[10px] text-text-muted"><strong>Restricted Countries:</strong> EU, UK, USA, Canada, Japan, UAE, GCC</p></div>
      </div>
    </div>
  )
}
