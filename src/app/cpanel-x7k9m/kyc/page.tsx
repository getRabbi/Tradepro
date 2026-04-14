'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { CheckCircle, XCircle, Clock, X, Image, RefreshCw, AlertTriangle } from 'lucide-react'

export default function AdminKycPage() {
  const [docs, setDocs] = useState<any[]>([])
  const [filter, setFilter] = useState('PENDING')
  const [preview, setPreview] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const { data: allDocs } = await supabase.from('kyc_documents').select('*').order('uploaded_at', { ascending: false })
      if (!allDocs) { setLoading(false); return }

      const userIds = [...new Set(allDocs.map((d: any) => d.user_id))]
      const { data: users } = await supabase.from('users').select('id, first_name, last_name, email, country').in('id', userIds)

      setDocs(allDocs.map((d: any) => {
        const u = (users || []).find((u: any) => u.id === d.user_id)
        return { ...d, userName: u ? `${u.first_name} ${u.last_name}` : 'Unknown', userEmail: u?.email || '', userCountry: u?.country || '' }
      }))
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const approve = async (id: string) => {
    await supabase.from('kyc_documents').update({ status: 'APPROVED', reviewed_at: new Date().toISOString() }).eq('id', id)
    load()
  }

  const reject = async (id: string) => {
    await supabase.from('kyc_documents').update({ status: 'REJECTED', rejection_reason: rejectReason, reviewed_at: new Date().toISOString() }).eq('id', id)
    setRejectId(null); setRejectReason('')
    load()
  }

  const filtered = docs.filter((d) => filter === 'all' || d.status === filter)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-heading font-black text-2xl text-text-primary">KYC Verification</h1>
          <p className="text-text-muted text-sm">{docs.filter((d) => d.status === 'PENDING').length} pending <span className="text-accent-green">● Live</span></p></div>
        <button onClick={load} className="btn-outline !py-2 !px-4 text-xs flex items-center gap-2"><RefreshCw size={13} /> Refresh</button>
      </div>

      <div className="flex gap-1 p-1 bg-surface-800/60 rounded-xl border border-white/[0.04] max-w-fit">
        {['PENDING', 'APPROVED', 'REJECTED', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${filter === f ? 'bg-brand-600 text-white' : 'text-text-muted hover:text-text-secondary'}`}>
            {f === 'all' ? 'All' : f} ({docs.filter((d) => f === 'all' ? true : d.status === f).length})
          </button>
        ))}
      </div>

      {loading ? <p className="text-center py-8 text-text-muted">Loading...</p> : (
        <div className="space-y-4">
          {filtered.map((doc) => (
            <div key={doc.id} className={`glass-card p-5 ${doc.status === 'PENDING' ? 'border-accent-orange/15' : ''}`}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.status === 'PENDING' ? 'bg-accent-orange/10 text-accent-orange' : doc.status === 'APPROVED' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                    {doc.status === 'PENDING' ? <Clock size={22} /> : doc.status === 'APPROVED' ? <CheckCircle size={22} /> : <XCircle size={22} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-heading font-bold text-sm text-text-primary">{doc.userName}</p>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${doc.status === 'PENDING' ? 'bg-accent-orange/10 text-accent-orange' : doc.status === 'APPROVED' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>{doc.status}</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2">{doc.userEmail} • {doc.userCountry}</p>
                    <div className="flex items-center gap-4 text-[10px] text-text-muted/60">
                      <span>Type: <span className="text-text-secondary font-medium">{(doc.document_type || '').replace('_', ' ')}</span></span>
                      <span>File: <span className="text-text-secondary">{doc.file_name}</span></span>
                      <span>Date: <span className="text-text-secondary">{new Date(doc.uploaded_at).toLocaleDateString('en-GB')}</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.file_path && doc.file_path.startsWith('http') ? (
                    <button onClick={() => setPreview(doc.file_path)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-500/10 text-brand-300 text-xs font-bold hover:bg-brand-500/20"><Image size={13} /> View Doc</button>
                  ) : doc.file_path ? (
                    <span className="px-3 py-2 rounded-lg bg-surface-600/50 text-text-muted text-xs">📎 {doc.file_name || doc.file_path}</span>
                  ) : null}
                  {doc.status === 'PENDING' && (
                    <>
                      <button onClick={() => approve(doc.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/15 text-accent-green text-xs font-bold hover:bg-accent-green/20"><CheckCircle size={13} /> Approve</button>
                      <button onClick={() => { setRejectId(doc.id); setRejectReason('') }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-red/10 border border-accent-red/15 text-accent-red text-xs font-bold hover:bg-accent-red/20"><XCircle size={13} /> Reject</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center py-12 text-text-muted">No documents in this category</p>}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute -top-10 right-0 text-white"><X size={24} /></button>
            <div className="bg-surface-700 rounded-2xl p-4 border border-white/[0.08]"><h3 className="font-heading font-bold text-text-primary mb-3">KYC Document</h3>
              {preview.endsWith('.pdf') ? <iframe src={preview} className="w-full h-[70vh] rounded-xl" /> : <img src={preview} alt="KYC" className="w-full rounded-xl" />}
            </div>
          </div>
        </div>
      )}

      {rejectId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setRejectId(null)}>
          <div className="bg-surface-700 rounded-2xl p-6 w-full max-w-sm border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-text-primary mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-accent-red" /> Reject Document</h3>
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
