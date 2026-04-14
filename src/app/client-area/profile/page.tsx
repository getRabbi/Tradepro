import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-text-primary">Profile</h1>
        <p className="text-text-muted text-sm">Your account information</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/15 flex items-center justify-center text-brand-400 font-heading font-black text-2xl">
            {user.firstName.charAt(0)}
          </div>
          <div>
            <p className="font-heading font-bold text-xl text-text-primary">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-text-muted">{user.email}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Row label="Full Name" value={`${user.firstName} ${user.lastName}`} />
          <Row label="Email" value={user.email} />
          <Row label="Phone" value={user.phone || 'Not set'} />
          <Row label="Country" value={user.country || 'Not set'} />
          <Row label="Currency" value={user.baseCurrency || 'USD'} />
          <Row label="Language" value={user.language || 'en'} />
          <Row label="Role" value={user.role} />
          <Row label="Email Verified" value={user.isEmailVerified ? 'Yes' : 'No'} />
          <Row label="Member Since" value={new Date(user.createdAt).toLocaleDateString('en-GB')} />
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-heading font-bold text-text-primary mb-4">Trading Accounts</h2>
        <div className="space-y-3">
          {user.accounts.map((acc: any) => (
            <div key={acc.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-700/30 border border-white/[0.03]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-text-primary">#{acc.accountNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${acc.accountMode === 'DEMO' ? 'bg-accent-green/10 text-accent-green' : 'bg-brand-500/10 text-brand-300'}`}>{acc.accountMode}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-surface-500/50 text-text-muted">{acc.accountType}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">Leverage: 1:{acc.leverage}</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-bold text-lg text-text-primary">${Number(acc.balance).toLocaleString('en', { minimumFractionDigits: 2 })}</p>
                <p className="text-[10px] text-text-muted">Balance</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.03]">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm text-text-primary font-medium">{value}</span>
    </div>
  )
}
