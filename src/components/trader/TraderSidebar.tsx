'use client'

import { useTraderStore } from '@/lib/traderStore'
import { usePlatformStore } from '@/lib/platformStore'
import { ArrowDownToLine, ArrowUpFromLine, BarChart3, CreditCard, FileCheck, FileSpreadsheet, HelpCircle, X, Upload, CheckCircle, Clock, Copy, ArrowLeft } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const sideItems = [
  { icon: ArrowDownToLine, key: 'deposit', label: 'Deposit' },
  { icon: BarChart3, key: 'account', label: 'Account' },
  { icon: CreditCard, key: 'payment', label: 'Payment' },
  { icon: FileCheck, key: 'documents', label: 'Documents' },
  { icon: FileSpreadsheet, key: 'statements', label: 'Statements' },
]

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧', currency: 'USD', symbol: '$', rate: 1 },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩', currency: 'BDT', symbol: '৳', rate: 121.50 },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', currency: 'INR', symbol: '₹', rate: 83.50 },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩', currency: 'IDR', symbol: 'Rp', rate: 15750 },
  { code: 'ms', label: 'Melayu', flag: '🇲🇾', currency: 'MYR', symbol: 'RM', rate: 4.72 },
  { code: 'th', label: 'ไทย', flag: '🇹🇭', currency: 'THB', symbol: '฿', rate: 36.20 },
  { code: 'ko', label: '한국어', flag: '🇰🇷', currency: 'KRW', symbol: '₩', rate: 1365 },
  { code: 'tl', label: 'Tagalog', flag: '🇵🇭', currency: 'PHP', symbol: '₱', rate: 56.80 },
]

let depositRequests: any[] = []
let activeLang = languages[1] // default Bangla

function CopyRow({ label, value, onCopy, copied }: { label: string; value: string; onCopy: (v: string, l: string) => void; copied: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div><p className="text-[10px] text-text-muted">{label}</p><p className="text-sm text-text-primary font-mono font-bold">{value}</p></div>
      <button onClick={() => onCopy(value, label)} className="p-1.5 rounded bg-surface-500/50 text-text-muted hover:text-brand-400 transition-colors">
        {copied === label ? <CheckCircle size={12} className="text-accent-green" /> : <Copy size={12} />}
      </button>
    </div>
  )
}

function DepositPanel({ onClose }: { onClose: () => void }) {
  const { accountNumber, addNotification } = useTraderStore()
  // Read payment methods from shared store (admin can edit these)
  const { paymentMethods: allMethods, loadPaymentMethods } = usePlatformStore()
  const enabledMethods = allMethods.filter((m) => m.enabled)

  useEffect(() => { loadPaymentMethods() }, [])

  const [step, setStep] = useState<'select' | 'pay' | 'done'>('select')
  const [amount, setAmount] = useState('')
  const [methodId, setMethodId] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [copied, setCopied] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const selectedMethod = allMethods.find((m) => m.id === methodId)

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!screenshot || submitting) return
    setSubmitting(true)
    try {
      // 1. Upload screenshot to Supabase Storage
      let screenshotUrl = ''
      try {
        const { uploadFile } = await import('@/lib/storage')
        const result = await uploadFile('deposit-screenshots', screenshot, 'user_' + accountNumber)
        if ('url' in result) screenshotUrl = result.url
      } catch {}

      // 2. Save deposit to DB - try server action first, fallback to direct
      let saved = false
      try {
        const { submitDepositAction } = await import('@/lib/actions')
        const res = await submitDepositAction({ amount: parseFloat(amount), method: methodId, screenshotUrl: screenshotUrl || screenshot.name })
        if (res.success) saved = true
      } catch {}

      if (!saved) {
        // Fallback: save directly via Supabase
        try {
          const { supabase } = await import('@/lib/supabaseClient')
          const { data: acc } = await supabase.from('accounts').select('id, user_id').eq('account_number', accountNumber).limit(1).single()
          const accData = acc || (await supabase.from('accounts').select('id, user_id').neq('user_id', '').limit(1).single()).data
          if (accData) {
            await supabase.from('transactions').insert({
              id: `dep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              user_id: accData.user_id, account_id: accData.id,
              type: 'DEPOSIT', amount: parseFloat(amount), fee_amount: 0, net_amount: parseFloat(amount),
              payment_method: methodId, status: 'PENDING',
              reference_number: `DEP-${Date.now()}`, rejection_reason: screenshotUrl || screenshot.name,
            })
          }
        } catch (e) { console.error('Deposit fallback error:', e) }
      }

      addNotification(`Deposit $${amount} via ${selectedMethod?.label} submitted. Awaiting admin approval.`, 'info')
      setStep('done')
    } catch {}
    setSubmitting(false)
  }

  // Keys to hide from display (internal/system keys)
  const hiddenKeys = ['type']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {step !== 'select' && <button onClick={() => setStep('select')} className="text-text-muted hover:text-text-secondary"><ArrowLeft size={16} /></button>}
          <h2 className="font-heading font-bold text-lg text-text-primary">Deposit Funds</h2>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-secondary"><X size={18} /></button>
      </div>

      {/* STEP 1: Amount + Method */}
      {step === 'select' && (
        <>
          <p className="text-xs text-text-muted">Select amount and payment method</p>
          <div className="grid grid-cols-2 gap-2">
            {['250', '500', '1000', '5000'].map((a) => {
              const local = Math.round(parseInt(a) * activeLang.rate)
              return (
                <button key={a} onClick={() => setAmount(a)} className={`py-2.5 rounded-xl border text-center transition-all ${amount === a ? 'bg-brand-500/15 border-brand-500/30' : 'bg-surface-600/50 border-white/[0.04] hover:bg-surface-500/50'}`}>
                  <p className={`text-sm font-mono font-bold ${amount === a ? 'text-brand-300' : 'text-text-secondary'}`}>${parseInt(a).toLocaleString()}</p>
                  {activeLang.code !== 'en' && <p className="text-[9px] text-text-muted font-mono">≈ {activeLang.symbol}{local.toLocaleString()}</p>}
                </button>
              )
            })}
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Custom Amount (USD)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min $10" className="w-full px-4 py-3 rounded-xl bg-surface-600/50 border border-white/[0.04] text-text-primary text-sm font-mono focus:outline-none focus:border-brand-500/30" />
            {amount && parseFloat(amount) > 0 && activeLang.code !== 'en' && (
              <p className="text-[10px] text-accent-cyan mt-1.5 font-mono">≈ {activeLang.symbol}{Math.round(parseFloat(amount) * activeLang.rate).toLocaleString()} {activeLang.currency}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-text-muted mb-2 block">Payment Method</label>
            <div className="space-y-1.5">
              {enabledMethods.map((m) => (
                <button key={m.id} onClick={() => setMethodId(m.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all ${methodId === m.id ? 'bg-brand-500/10 border-brand-500/25 text-text-primary' : 'bg-surface-600/30 border-white/[0.03] text-text-secondary hover:bg-surface-500/30'}`}>
                  <span className="text-lg w-6 text-center">{m.icon}</span>
                  <span className="text-sm font-medium">{m.label}</span>
                  {methodId === m.id && <CheckCircle size={14} className="ml-auto text-brand-400" />}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => { if (amount && methodId && parseFloat(amount) >= 10) setStep('pay') }} disabled={!amount || !methodId || parseFloat(amount) < 10}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold text-sm disabled:opacity-30 transition-all hover:shadow-lg hover:shadow-brand-500/20">Continue →</button>
        </>
      )}

      {/* STEP 2: Payment Details + Upload */}
      {step === 'pay' && selectedMethod && (
        <>
          <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/10 text-center">
            <p className="text-[10px] text-text-muted">Amount to send</p>
            <p className="font-heading font-black text-2xl text-text-primary">${parseFloat(amount).toLocaleString()}</p>
            {activeLang.code !== 'en' && (
              <p className="text-sm text-accent-cyan font-mono font-bold">≈ {activeLang.symbol}{Math.round(parseFloat(amount) * activeLang.rate).toLocaleString()} {activeLang.currency}</p>
            )}
            <p className="text-xs text-brand-300 font-medium mt-0.5">via {selectedMethod.label}</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-600/30 border border-white/[0.04] space-y-2">
            <p className="text-xs text-accent-cyan font-bold uppercase tracking-wider mb-2">Payment Details</p>
            {Object.entries(selectedMethod.details)
              .filter(([key]) => key !== 'instruction' && !hiddenKeys.includes(key))
              .map(([key, value]) => (
                <CopyRow key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} value={value} onCopy={copy} copied={copied} />
              ))}
            <CopyRow label="Your Reference ID" value={accountNumber} onCopy={copy} copied={copied} />
          </div>

          {selectedMethod.details.instruction && (
            <div className="p-3 rounded-xl bg-accent-orange/5 border border-accent-orange/10">
              <p className="text-[11px] text-accent-orange leading-relaxed">{selectedMethod.details.instruction}</p>
            </div>
          )}

          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Upload Payment Screenshot *</label>
            <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size <= 5 * 1024 * 1024) setScreenshot(f) }} />
            {screenshot ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent-green/5 border border-accent-green/15">
                <CheckCircle size={18} className="text-accent-green shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-xs text-text-primary font-medium truncate">{screenshot.name}</p><p className="text-[10px] text-text-muted">{(screenshot.size / 1024).toFixed(0)} KB</p></div>
                <button onClick={() => setScreenshot(null)} className="text-text-muted hover:text-accent-red"><X size={14} /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center hover:border-brand-500/30 hover:bg-brand-500/[0.02] transition-all cursor-pointer group">
                <Upload size={24} className="mx-auto text-text-muted group-hover:text-brand-400 mb-2" />
                <p className="text-xs text-text-muted">Upload payment screenshot</p>
                <p className="text-[10px] text-text-muted/50 mt-0.5">PNG, JPG, PDF up to 5MB</p>
              </button>
            )}
          </div>

          <button onClick={handleSubmit} disabled={!screenshot || submitting} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-green to-emerald-600 text-white font-bold text-sm disabled:opacity-30 transition-all">{submitting ? 'Submitting...' : 'Submit Deposit Request'}</button>
        </>
      )}

      {/* STEP 3: Done */}
      {step === 'done' && (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mx-auto mb-4"><Clock size={28} className="text-accent-green" /></div>
          <h3 className="font-heading font-bold text-lg text-text-primary mb-2">Request Submitted!</h3>
          <p className="text-sm text-text-muted mb-1">Amount: <span className="text-text-primary font-bold">${parseFloat(amount).toLocaleString()}</span>
            {activeLang.code !== 'en' && <span className="text-accent-cyan ml-1">({activeLang.symbol}{Math.round(parseFloat(amount) * activeLang.rate).toLocaleString()})</span>}
          </p>
          <p className="text-sm text-text-muted mb-4">Method: <span className="text-text-primary">{selectedMethod?.label}</span></p>
          <div className="p-3 rounded-xl bg-accent-orange/5 border border-accent-orange/10 mb-6"><p className="text-xs text-accent-orange">Admin will review and credit your account within 1-24 hours.</p></div>
          <button onClick={() => { setStep('select'); setAmount(''); setMethodId(''); setScreenshot(null) }} className="w-full py-3 rounded-xl bg-surface-600/50 border border-white/[0.04] text-text-secondary text-sm font-bold hover:bg-surface-500/50 transition-all">Make Another Deposit</button>
        </div>
      )}
    </div>
  )
}

function AccountPanel({ onClose }: { onClose: () => void }) {
  const { balance, equity, freeMargin, marginUsed, totalProfit, accountNumber, accountMode, openPositions, loadFromDB } = useTraderStore()
  const [reqAmount, setReqAmount] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [reqDone, setReqDone] = useState(false)
  const [reqError, setReqError] = useState('')

  const handleDemoRequest = async () => {
    const amt = parseInt(reqAmount)
    if (!amt || amt <= 0) return
    if (amt > 50000) { setReqError('Maximum $50,000 per request'); return }
    if (balance + amt > 50000) { setReqError(`Max total demo balance: $50,000. You can add up to $${(50000 - balance).toLocaleString()}`); return }
    setRequesting(true); setReqError('')
    try {
      const { supabase } = await import('@/lib/supabaseClient')
      const { data: acc } = await supabase.from('accounts').select('id, balance').eq('account_number', accountNumber).limit(1).single()
      if (acc) {
        const nb = Number(acc.balance) + amt
        await supabase.from('accounts').update({ balance: nb, equity: nb, free_margin: nb }).eq('id', acc.id)
        await loadFromDB()
        setReqDone(true)
      }
    } catch (e: any) { setReqError(e.message || 'Failed') }
    setRequesting(false)
  }

  const rows = [['Balance', `$${balance.toLocaleString('en', { minimumFractionDigits: 2 })}`, 'text-text-primary'], ['Equity', `$${equity.toLocaleString('en', { minimumFractionDigits: 2 })}`, 'text-text-primary'], ['Free Margin', `$${freeMargin.toLocaleString('en', { minimumFractionDigits: 2 })}`, 'text-accent-cyan'], ['Margin Used', `$${marginUsed.toFixed(2)}`, 'text-accent-orange'], ['P&L', `${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`, totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'], ['Open Positions', `${openPositions.length}`, 'text-brand-300'], ['Account Type', 'CLASSIC', 'text-text-secondary'], ['Leverage', '1:400', 'text-text-secondary']]
  return (<div><div className="flex items-center justify-between mb-3"><h2 className="font-heading font-bold text-lg text-text-primary">Trading Account</h2><button onClick={onClose} className="text-text-muted hover:text-text-secondary"><X size={18} /></button></div><div className="flex items-center gap-2 mb-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-green/15 text-accent-green">{accountMode}</span><span className="text-xs text-text-muted font-mono">#{accountNumber}</span></div>{rows.map(([l, v, c]) => (<div key={l as string} className="flex justify-between py-2.5 border-b border-white/[0.03] text-sm"><span className="text-text-muted">{l}</span><span className={`font-mono font-bold ${c}`}>{v}</span></div>))}

    {/* Demo Balance Request */}
    {accountMode === 'DEMO' && (
      <div className="mt-4 p-3 rounded-xl bg-brand-500/5 border border-brand-500/10">
        <p className="text-xs text-text-muted mb-2 font-bold">Request Demo Balance (max $50,000)</p>
        {reqDone ? (
          <div className="text-center py-2"><CheckCircle size={20} className="text-accent-green mx-auto mb-1" /><p className="text-xs text-accent-green font-bold">Balance added!</p></div>
        ) : (<>
          <div className="flex gap-2 mb-2">
            {[10000, 25000, 50000].map((a) => (
              <button key={a} onClick={() => setReqAmount(a.toString())} className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${reqAmount === a.toString() ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30' : 'bg-surface-600/50 text-text-muted border border-white/[0.04]'}`}>${(a/1000)}K</button>
            ))}
          </div>
          <input type="number" value={reqAmount} onChange={(e) => { setReqAmount(e.target.value); setReqError('') }} placeholder="Custom amount" className="w-full px-3 py-2 rounded-lg bg-surface-600/50 border border-white/[0.04] text-text-primary text-sm font-mono mb-2 focus:outline-none focus:border-brand-500/30" />
          {reqError && <p className="text-[10px] text-accent-red mb-2">{reqError}</p>}
          <button onClick={handleDemoRequest} disabled={!reqAmount || requesting} className="w-full py-2 rounded-lg bg-brand-600 text-white text-xs font-bold disabled:opacity-30">{requesting ? 'Adding...' : 'Add Demo Balance'}</button>
        </>)}
      </div>
    )}
  </div>)
}

function PaymentPanel({ onClose }: { onClose: () => void }) {
  const [txs, setTxs] = useState<any[]>([])
  const { accountNumber } = useTraderStore()

  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import('@/lib/supabaseClient')
        const { data: acc } = await supabase.from('accounts').select('user_id').eq('account_number', accountNumber).limit(1).single()
        if (acc) {
          const { data } = await supabase.from('transactions').select('*').eq('user_id', acc.user_id).order('created_at', { ascending: false }).limit(20)
          if (data) setTxs(data)
        }
      } catch {}
    })()
  }, [accountNumber])

  return (<div><div className="flex items-center justify-between mb-3"><h2 className="font-heading font-bold text-lg text-text-primary">Transactions</h2><button onClick={onClose} className="text-text-muted hover:text-text-secondary"><X size={18} /></button></div>
    {txs.length > 0 ? (<div className="space-y-2 max-h-72 overflow-y-auto">{txs.map((t) => (<div key={t.id} className="p-3 rounded-xl bg-surface-600/30 border border-white/[0.03]"><div className="flex justify-between"><span className="text-sm text-text-primary font-medium">{t.type}</span><span className={`font-mono font-bold text-sm ${t.status === 'COMPLETED' ? 'text-accent-green' : t.status === 'REJECTED' ? 'text-accent-red' : 'text-accent-orange'}`}>{t.type === 'DEPOSIT' ? '+' : '-'}${Number(t.amount).toLocaleString()}</span></div><div className="flex justify-between mt-1"><span className="text-[10px] text-text-muted">{(t.payment_method || '').replace('_', ' ')} • {new Date(t.created_at).toLocaleDateString('en-GB')}</span><span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${t.status === 'COMPLETED' ? 'bg-accent-green/10 text-accent-green' : t.status === 'REJECTED' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-orange/10 text-accent-orange'}`}>{t.status}</span></div></div>))}</div>)
    : (<div className="p-3 rounded-xl bg-surface-600/30 border border-white/[0.03]"><div className="flex justify-between"><span className="text-sm text-text-primary">Initial Demo Credit</span><span className="font-mono font-bold text-sm text-accent-green">+$100,000</span></div><div className="flex justify-between mt-1"><span className="text-[10px] text-text-muted">Today</span><span className="text-[10px] text-accent-green font-bold">Completed</span></div></div>)}
  </div>)
}

function DocumentsPanel({ onClose }: { onClose: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [kycDocs, setKycDocs] = useState<any[]>([])
  const kycFileRef = useRef<HTMLInputElement>(null)
  const { accountNumber } = useTraderStore()

  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import('@/lib/supabaseClient')
        const { data: acc } = await supabase.from('accounts').select('user_id').eq('account_number', accountNumber).limit(1).single()
        if (acc) {
          const { data: docs } = await supabase.from('kyc_documents').select('*').eq('user_id', acc.user_id)
          if (docs) setKycDocs(docs)
        }
      } catch {}
    })()
  }, [accountNumber])

  const getDocStatus = (type: string) => {
    const types = type === 'Government ID' ? ['ID_CARD', 'PASSPORT', 'DRIVERS_LICENSE'] : ['PROOF_OF_RESIDENCE']
    return kycDocs.find((d: any) => types.includes(d.document_type))
  }

  const allVerified = kycDocs.length >= 2 && kycDocs.every((d: any) => d.status === 'APPROVED')

  const handleUpload = async (file: File) => {
    if (!docType || !file) return
    setUploading(true)
    setUploadError('')
    try {
      let fileUrl = file.name
      try {
        const { uploadFile } = await import('@/lib/storage')
        const result = await uploadFile('kyc-documents', file, 'acc_' + accountNumber)
        if ('url' in result) fileUrl = result.url
      } catch {}

      const { supabase } = await import('@/lib/supabaseClient')
      const { data: acc } = await supabase.from('accounts').select('user_id').eq('account_number', accountNumber).limit(1).single()
      let userId = acc?.user_id
      if (!userId) {
        const { data: u } = await supabase.from('users').select('id').neq('role', 'ADMIN').limit(1).single()
        userId = u?.id
      }
      if (!userId) { setUploadError('User not found'); setUploading(false); return }

      const docTypeVal = docType === 'Government ID' ? 'ID_CARD' : 'PROOF_OF_RESIDENCE'
      const { error } = await supabase.from('kyc_documents').insert({
        id: `kyc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        user_id: userId, document_type: docTypeVal,
        file_path: fileUrl, file_name: file.name, status: 'PENDING',
      })
      if (error) { setUploadError(error.message) }
      else { setKycDocs([...kycDocs, { document_type: docTypeVal, status: 'PENDING', file_name: file.name, rejection_reason: null }]) }
    } catch (e: any) { setUploadError(e.message || 'Failed') }
    setUploading(false)
    setDocType(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading font-bold text-lg text-text-primary">Documents & KYC</h2>
        <button onClick={onClose} className="text-text-muted hover:text-text-secondary"><X size={18} /></button>
      </div>
      <div className={`p-4 rounded-xl mb-4 ${allVerified ? 'bg-accent-green/5 border border-accent-green/15' : 'bg-accent-orange/5 border border-accent-orange/15'}`}>
        <p className={`text-sm font-medium mb-1 ${allVerified ? 'text-accent-green' : 'text-accent-orange'}`}>{allVerified ? '✓ Identity Verified' : 'Verification Pending'}</p>
        <p className="text-xs text-text-muted">{allVerified ? 'Your account is fully verified.' : 'Upload ID and proof of residence for live trading.'}</p>
      </div>
      <input ref={kycFileRef} type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
      {['Government ID', 'Proof of Residence'].map((d) => {
        const doc = getDocStatus(d)
        return (
          <div key={d} className="p-3 rounded-xl bg-surface-600/30 border border-white/[0.03] mb-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">{d}</span>
              {doc ? (
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${doc.status === 'APPROVED' ? 'bg-accent-green/10 text-accent-green' : doc.status === 'REJECTED' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-orange/10 text-accent-orange'}`}>
                  {doc.status === 'APPROVED' ? '✓ Verified' : doc.status === 'REJECTED' ? '✗ Rejected' : '⏳ Pending'}
                </span>
              ) : (
                <button onClick={() => { setDocType(d); setUploadError(''); kycFileRef.current?.click() }} disabled={uploading}
                  className="text-[10px] px-3 py-1 rounded bg-brand-500/15 text-brand-300 font-bold hover:bg-brand-500/25 disabled:opacity-50">
                  {uploading && docType === d ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>
            {doc?.status === 'REJECTED' && doc.rejection_reason && <p className="text-[10px] text-accent-red mt-1">Reason: {doc.rejection_reason}</p>}
            {doc?.status === 'PENDING' && <p className="text-[10px] text-text-muted mt-1">Awaiting admin review</p>}
          </div>
        )
      })}
      {uploadError && <p className="text-xs text-accent-red mt-2 p-2 rounded bg-accent-red/5">{uploadError}</p>}
    </div>
  )
}

function StatementsPanel({ onClose }: { onClose: () => void }) {
  const { closedPositions } = useTraderStore()
  return (<div><div className="flex items-center justify-between mb-3"><h2 className="font-heading font-bold text-lg text-text-primary">Statements</h2><button onClick={onClose} className="text-text-muted hover:text-text-secondary"><X size={18} /></button></div>
    {closedPositions.length === 0 ? <div className="py-10 text-center text-text-muted/40 text-sm">No closed trades yet</div> : (<div className="space-y-2 max-h-72 overflow-y-auto">{closedPositions.slice(0, 15).map((p) => (<div key={p.id} className="p-3 rounded-xl bg-surface-600/30 border border-white/[0.03]"><div className="flex justify-between"><span className="text-sm font-heading font-bold text-text-primary">{p.symbol} <span className={`text-[10px] ${p.type === 'BUY' ? 'text-accent-green' : 'text-accent-red'}`}>{p.type}</span></span><span className={`font-mono font-bold text-sm ${p.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>{p.profit >= 0 ? '+' : ''}${p.profit.toFixed(2)}</span></div><p className="text-[10px] text-text-muted mt-1">{p.volume} lots • {p.closedAt}</p></div>))}</div>)}
  </div>)
}

function HelpPanel({ onClose }: { onClose: () => void }) {
  return (<div><div className="flex items-center justify-between mb-4"><h2 className="font-heading font-bold text-lg text-text-primary">Help & Support</h2><button onClick={onClose} className="text-text-muted hover:text-text-secondary"><X size={18} /></button></div>
    {[['Live Chat', 'Chat with support 24/7'], ['Email', 'support@tradepro.com'], ['FAQ', 'Frequently asked questions'], ['Trading Guide', 'Learn CFD trading basics']].map(([t, d]) => (<div key={t} className="p-3 rounded-xl bg-surface-600/30 border border-white/[0.03] mb-2 hover:bg-surface-500/30 cursor-pointer transition-all"><p className="text-sm text-text-primary font-medium">{t}</p><p className="text-xs text-text-muted">{d}</p></div>))}
  </div>)
}

function WithdrawPanel({ onClose }: { onClose: () => void }) {
  const { accountNumber, balance } = useTraderStore()
  const [method, setMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const amt = parseFloat(amount)
    if (!method || !amt || amt <= 0) return
    if (amt > balance) { setError('Insufficient balance'); return }
    setSubmitting(true); setError('')
    try {
      const { supabase } = await import('@/lib/supabaseClient')
      const { data: acc } = await supabase.from('accounts').select('id, user_id').eq('account_number', accountNumber).limit(1).single()
      if (acc) {
        await supabase.from('transactions').insert({
          id: `wdr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          user_id: acc.user_id, account_id: acc.id, type: 'WITHDRAWAL',
          amount: amt, fee_amount: 0, net_amount: amt, payment_method: method,
          status: 'PENDING', reference_number: `WDR-${Date.now()}`,
          rejection_reason: details || null,
        })
        setSubmitted(true)
      } else { setError('Account not found') }
    } catch (e: any) { setError(e.message || 'Failed') }
    setSubmitting(false)
  }

  if (submitted) return (<div><div className="flex items-center justify-between mb-3"><h2 className="font-heading font-bold text-lg text-text-primary">Withdraw</h2><button onClick={onClose} className="text-text-muted"><X size={18} /></button></div><div className="text-center py-6"><div className="w-14 h-14 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto mb-3"><CheckCircle size={24} className="text-accent-green" /></div><p className="font-heading font-bold text-text-primary mb-1">Request Submitted</p><p className="text-xs text-text-muted">Admin will review your withdrawal.</p></div></div>)

  return (<div>
    <div className="flex items-center justify-between mb-3"><h2 className="font-heading font-bold text-lg text-text-primary">Withdraw Funds</h2><button onClick={onClose} className="text-text-muted"><X size={18} /></button></div>
    <p className="text-xs text-text-muted mb-3">Balance: <span className="text-accent-green font-bold">${balance.toLocaleString('en', { minimumFractionDigits: 2 })}</span></p>
    <div className="space-y-2 mb-3">{[['bkash', 'bKash'], ['nagad', 'Nagad'], ['bank', 'Bank Transfer'], ['btc', 'Bitcoin'], ['usdt', 'USDT TRC20']].map(([id, label]) => (
      <button key={id} onClick={() => setMethod(id)} className={`w-full p-3 rounded-xl text-left text-sm transition-all ${method === id ? 'bg-brand-500/10 border border-brand-500/30 text-brand-300' : 'bg-surface-600/30 border border-white/[0.03] text-text-secondary hover:bg-surface-500/30'}`}>{label}</button>
    ))}</div>
    {method && (<>
      <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setError('') }} placeholder="Amount (USD)" className="w-full px-4 py-3 rounded-xl bg-surface-600/50 border border-white/[0.04] text-text-primary text-sm font-mono mb-2 focus:outline-none focus:border-brand-500/30" />
      <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Payment details (number/address)" className="w-full px-4 py-3 rounded-xl bg-surface-600/50 border border-white/[0.04] text-text-primary text-sm mb-3 focus:outline-none focus:border-brand-500/30" />
      {error && <p className="text-xs text-accent-red mb-2">{error}</p>}
      <button onClick={handleSubmit} disabled={!amount || submitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-red to-red-600 text-white font-bold text-sm disabled:opacity-30">{submitting ? 'Submitting...' : 'Submit Withdrawal'}</button>
    </>)}
  </div>)
}

const panelMap: Record<string, React.FC<{ onClose: () => void }>> = { deposit: DepositPanel, account: AccountPanel, payment: PaymentPanel, documents: DocumentsPanel, statements: StatementsPanel, help: HelpPanel }

export default function TraderSidebar() {
  const { displayName, balance, accountMode } = useTraderStore()
  const [panel, setPanel] = useState<string | null>(null)
  const [showLang, setShowLang] = useState(false)
  const [lang, setLang] = useState(languages[1]) // default Bangla
  const changeLang = (l: typeof languages[0]) => { setLang(l); activeLang = l }
  const toggle = (key: string) => setPanel(panel === key ? null : key)
  const Panel = panel ? panelMap[panel] : null

  return (
    <>
      <div className="w-16 bg-surface-800/80 border-r border-white/[0.04] flex flex-col items-center py-3 shrink-0 hidden md:flex">
        <div className="flex-1 space-y-1 w-full px-1.5">{sideItems.map((item) => (<button key={item.key} onClick={() => toggle(item.key)} className={`w-full flex flex-col items-center gap-0.5 py-2.5 rounded-lg transition-all group ${panel === item.key ? 'bg-brand-500/10 text-brand-400' : 'text-text-muted hover:text-brand-400 hover:bg-brand-500/5'}`} title={item.label}><item.icon size={18} /><span className="text-[8px] leading-tight text-center opacity-70 group-hover:opacity-100">{item.label}</span></button>))}</div>
        <a href="/client-area/dashboard" className="w-full px-1.5 mb-2 cursor-pointer hover:opacity-80 transition-all" title="Go to Dashboard"><div className="py-2 text-center border-t border-white/[0.06]"><div className="w-8 h-8 rounded-full bg-brand-500/15 flex items-center justify-center mx-auto mb-1"><span className="text-xs font-bold text-brand-400">{displayName.charAt(0)}</span></div><p className="text-[7px] text-text-muted leading-tight truncate">{displayName}</p><p className="text-[8px] font-mono font-bold text-accent-green mt-0.5">${balance.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p></div></a>
        <button onClick={() => toggle('help')} className={`flex flex-col items-center gap-0.5 py-2 transition-all ${panel === 'help' ? 'text-brand-400' : 'text-text-muted hover:text-brand-400'}`}><HelpCircle size={18} /><span className="text-[8px] opacity-70">Help</span></button>
        <div className="relative mt-2">
          <button onClick={() => setShowLang(!showLang)} className="flex flex-col items-center gap-0.5 text-text-muted hover:text-text-secondary transition-all"><span className="text-lg">{lang.flag}</span><span className="text-[8px] opacity-70">{lang.code.toUpperCase()}</span></button>
          {showLang && (<div className="absolute bottom-full left-full ml-1 mb-1 bg-surface-700/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl py-1.5 min-w-[140px] animate-slide-down z-50">{languages.map((l) => (<button key={l.code} onClick={() => { changeLang(l); setShowLang(false) }} className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${lang.code === l.code ? 'bg-brand-500/10 text-brand-300' : 'text-text-secondary hover:bg-white/[0.04]'}`}><span className="text-base">{l.flag}</span><span>{l.label}</span></button>))}</div>)}
        </div>
      </div>
      {Panel && (<div className="w-[300px] bg-surface-800/95 backdrop-blur-xl border-r border-white/[0.04] p-5 overflow-y-auto hidden md:block z-30"><Panel onClose={() => setPanel(null)} /></div>)}
    </>
  )
}
