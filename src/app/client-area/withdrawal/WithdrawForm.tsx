'use client'

import { useState } from 'react'
import { Building2, Bitcoin, Wallet, Check, Info } from 'lucide-react'

const methods = [
  { id: 'bkash', label: 'bKash', icon: Wallet, min: 10, fields: [
    { key: 'number', label: 'bKash Number', placeholder: '01712-XXXXXX' },
  ]},
  { id: 'nagad', label: 'Nagad', icon: Wallet, min: 10, fields: [
    { key: 'number', label: 'Nagad Number', placeholder: '01612-XXXXXX' },
  ]},
  { id: 'bank', label: 'Bank Transfer', icon: Building2, min: 50, fields: [
    { key: 'bankName', label: 'Bank Name', placeholder: 'e.g. Dutch-Bangla Bank Ltd' },
    { key: 'accountName', label: 'Account Holder Name', placeholder: 'Full name as on account' },
    { key: 'accountNumber', label: 'Account Number', placeholder: '1234567890123' },
    { key: 'branch', label: 'Branch Name', placeholder: 'e.g. Dhaka Main Branch' },
    { key: 'routingNumber', label: 'Routing Number', placeholder: '090261234' },
  ]},
  { id: 'btc', label: 'Bitcoin (BTC)', icon: Bitcoin, min: 50, fields: [
    { key: 'address', label: 'BTC Wallet Address', placeholder: 'bc1qxy2kgd...' },
    { key: 'network', label: 'Network', placeholder: 'Bitcoin (BTC)' },
  ]},
  { id: 'usdt_trc20', label: 'USDT (TRC20)', icon: Wallet, min: 10, fields: [
    { key: 'address', label: 'USDT Wallet Address (TRC20)', placeholder: 'TN2xHGk8...' },
  ]},
  { id: 'usdt_erc20', label: 'USDT (ERC20)', icon: Wallet, min: 50, fields: [
    { key: 'address', label: 'USDT Wallet Address (ERC20)', placeholder: '0x742d35...' },
  ]},
]

export default function WithdrawForm({ userId, accountId, balance }: { userId: string; accountId: string; balance: number }) {
  const [method, setMethod] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const selectedMethod = methods.find((m) => m.id === method)

  const handleSubmit = async () => {
    const amt = parseFloat(amount)
    if (!method || !amt || amt <= 0) return
    if (amt > balance) { setError('Insufficient balance'); return }
    if (amt < (selectedMethod?.min || 10)) { setError(`Minimum: $${selectedMethod?.min}`); return }
    const missing = selectedMethod?.fields.filter((f) => !fieldValues[f.key]?.trim())
    if (missing && missing.length > 0) { setError(`Fill: ${missing.map((f) => f.label).join(', ')}`); return }

    setSubmitting(true); setError('')
    try {
      const details = JSON.stringify({ method: selectedMethod?.label, ...fieldValues })
      const { supabase } = await import('@/lib/supabaseClient')
      await supabase.from('transactions').insert({
        id: `wdr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        user_id: userId, account_id: accountId, type: 'WITHDRAWAL',
        amount: amt, fee_amount: 0, net_amount: amt, payment_method: method,
        status: 'PENDING', reference_number: `WDR-${Date.now()}`, rejection_reason: details,
      })
      setSubmitted(true)
    } catch (e: any) { setError(e.message || 'Failed') }
    setSubmitting(false)
  }

  if (submitted) return (
    <div className="glass-card p-10 text-center border-accent-green/20">
      <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto mb-5"><Check size={32} className="text-accent-green" /></div>
      <h2 className="font-heading font-bold text-xl text-text-primary mb-2">Request Submitted</h2>
      <p className="text-sm text-text-muted mb-1">Amount: <span className="font-bold">${parseFloat(amount).toLocaleString()}</span> via {selectedMethod?.label}</p>
      <p className="text-xs text-text-muted mt-3">Admin will review within 1-3 business days.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="glass-card p-4 border-brand-500/10 bg-brand-500/[0.03] flex items-start gap-3">
        <Info size={18} className="text-brand-400 shrink-0 mt-0.5" />
        <p className="text-xs text-text-secondary">Withdrawal requests are reviewed by admin. Processing: 1-3 business days.</p>
      </div>

      <div>
        <h2 className="font-heading font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">Select Method</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {methods.map((m) => (
            <button key={m.id} onClick={() => { setMethod(m.id); setFieldValues({}); setError('') }}
              className={`glass-card p-4 text-left transition-all ${method === m.id ? 'border-brand-500/40 bg-brand-500/5' : 'hover:border-white/[0.1]'}`}>
              <m.icon size={18} className={method === m.id ? 'text-brand-400' : 'text-text-muted'} />
              <p className="font-heading font-semibold text-xs text-text-primary mt-2">{m.label}</p>
              <p className="text-[10px] text-text-muted">Min: ${m.min}</p>
            </button>
          ))}
        </div>
      </div>

      {method && selectedMethod && (
        <div className="glass-card p-6">
          <div className="mb-4">
            <label className="text-xs text-text-muted mb-1.5 block">Withdrawal Amount (USD)</label>
            <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setError('') }}
              className="w-full px-4 py-3 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-lg font-mono focus:outline-none focus:border-brand-500/30"
              placeholder={`Min $${selectedMethod.min}`} />
          </div>
          <div className="space-y-3 mb-4">
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{selectedMethod.label} Details</p>
            {selectedMethod.fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-text-muted mb-1 block">{f.label} <span className="text-accent-red">*</span></label>
                <input type="text" value={fieldValues[f.key] || ''} onChange={(e) => setFieldValues((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm focus:outline-none focus:border-brand-500/30" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
          {error && <p className="text-xs text-accent-red mb-3 p-2 rounded bg-accent-red/5">{error}</p>}
          <button onClick={handleSubmit} disabled={!amount || submitting} className="btn-primary w-full justify-center disabled:opacity-40">
            {submitting ? 'Submitting...' : 'Submit Withdrawal Request'}
          </button>
        </div>
      )}
    </div>
  )
}
