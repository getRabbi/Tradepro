import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Documents' }

export default async function DocumentsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const docs = user.kycDocuments || []
  const hasId = docs.some((d: any) => d.documentType === 'ID_CARD' || d.documentType === 'PASSPORT' || d.documentType === 'DRIVERS_LICENSE')
  const hasProof = docs.some((d: any) => d.documentType === 'PROOF_OF_RESIDENCE')
  const allApproved = docs.length >= 2 && docs.every((d: any) => d.status === 'APPROVED')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-text-primary">Documents and KYC</h1>
        <p className="text-text-muted text-sm">Verify your identity for live trading</p>
      </div>

      <div className={`glass-card p-5 ${allApproved ? 'border-accent-green/20' : 'border-accent-orange/20'}`}>
        <p className={`font-heading font-bold ${allApproved ? 'text-accent-green' : 'text-accent-orange'}`}>
          {allApproved ? 'Identity Verified' : 'Verification Required'}
        </p>
        <p className="text-xs text-text-muted mt-1">
          {allApproved ? 'Your account is fully verified for live trading and withdrawals.' : 'Upload required documents to enable live trading and withdrawals.'}
        </p>
      </div>

      <div className="space-y-3">
        <DocRow
          label="Government-Issued Photo ID"
          desc="Passport, National ID, or Drivers License"
          doc={docs.find((d: any) => d.documentType === 'ID_CARD' || d.documentType === 'PASSPORT' || d.documentType === 'DRIVERS_LICENSE')}
        />
        <DocRow
          label="Proof of Residence"
          desc="Bank statement or utility bill (within 6 months)"
          doc={docs.find((d: any) => d.documentType === 'PROOF_OF_RESIDENCE')}
        />
      </div>

      {(!hasId || !hasProof) && (
        <div className="glass-card p-5 text-center">
          <p className="text-sm text-text-muted mb-4">Upload your documents from the WebTrader sidebar or registration page.</p>
          <Link href="/trader" className="btn-primary !py-3 !px-6 text-sm">Open WebTrader to Upload</Link>
        </div>
      )}
    </div>
  )
}

function DocRow({ label, desc, doc }: { label: string; desc: string; doc: any }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-heading font-bold text-text-primary">{label}</p>
          <p className="text-xs text-text-muted mt-0.5">{desc}</p>
        </div>
        {doc ? (
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${doc.status === 'APPROVED' ? 'bg-accent-green/10 text-accent-green' : doc.status === 'REJECTED' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-orange/10 text-accent-orange'}`}>
            {doc.status === 'APPROVED' ? 'Approved' : doc.status === 'REJECTED' ? 'Rejected' : 'Pending Review'}
          </span>
        ) : (
          <span className="px-3 py-1 rounded-lg bg-surface-600/50 text-text-muted text-xs font-bold">Not Uploaded</span>
        )}
      </div>
      {doc && doc.status === 'REJECTED' && doc.rejectionReason && (
        <p className="text-xs text-accent-red mt-2 p-2 rounded bg-accent-red/5">Reason: {doc.rejectionReason}</p>
      )}
      {doc && (
        <p className="text-[10px] text-text-muted mt-2">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}</p>
      )}
    </div>
  )
}
