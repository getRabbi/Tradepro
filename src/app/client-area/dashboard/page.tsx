import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowDownToLine, ArrowUpFromLine, BarChart3, TrendingUp, Wallet, Shield, Clock, Bell } from 'lucide-react'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const demoAccount = user.accounts.find((a) => a.accountMode === 'DEMO')
  const liveAccount = user.accounts.find((a) => a.accountMode === 'LIVE')
  const activeAccount = demoAccount || liveAccount

  const kycStatus = user.kycDocuments.length > 0
    ? user.kycDocuments.every((d) => d.status === 'APPROVED') ? 'verified' : 'pending'
    : 'not_submitted'

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-text-primary mb-1">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-text-muted text-sm">Manage your trading accounts and portfolio</p>
      </div>

      {/* KYC Banner */}
      {kycStatus !== 'verified' && (
        <div className="glass-card p-5 border-accent-orange/20 bg-accent-orange/[0.03] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-accent-orange" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {kycStatus === 'not_submitted' ? 'Verify Your Identity' : 'Verification In Progress'}
              </p>
              <p className="text-xs text-text-muted">
                {kycStatus === 'not_submitted' ? 'Upload your documents to enable live trading and withdrawals.' : 'Your documents are being reviewed. Usually takes 1 business day.'}
              </p>
            </div>
          </div>
          {kycStatus === 'not_submitted' && (
            <Link href="/client-area/documents" className="btn-primary !py-2 !px-5 text-xs">Upload Documents</Link>
          )}
        </div>
      )}

      {/* Account Overview Cards */}
      {activeAccount && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Balance', value: `$${Number(activeAccount.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Wallet, color: 'text-brand-400' },
            { label: 'Equity', value: `$${Number(activeAccount.equity).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-accent-green' },
            { label: 'Free Margin', value: `$${Number(activeAccount.freeMargin).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: BarChart3, color: 'text-accent-cyan' },
            { label: 'Margin Used', value: `$${Number(activeAccount.marginUsed).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Clock, color: 'text-accent-orange' },
          ].map((card) => (
            <div key={card.label} className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-text-muted uppercase tracking-wider">{card.label}</span>
                <card.icon size={18} className={card.color} />
              </div>
              <p className="font-heading font-bold text-2xl text-text-primary">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Account Info + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="font-heading font-semibold text-lg text-text-primary mb-5">Account Details</h2>
          {activeAccount && (
            <div className="space-y-3">
              {[
                { label: 'Account Number', value: activeAccount.accountNumber },
                { label: 'Account Type', value: activeAccount.accountType },
                { label: 'Mode', value: activeAccount.accountMode },
                { label: 'Display Name', value: activeAccount.displayName || '—' },
                { label: 'Leverage', value: `1:${activeAccount.leverage}` },
                { label: 'Base Currency', value: activeAccount.baseCurrency },
                { label: 'Status', value: activeAccount.isActive ? 'Active' : 'Inactive' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-text-muted">{row.label}</span>
                  <span className="text-sm text-text-primary font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-5">
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold text-lg text-text-primary mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/client-area/deposit" className="flex items-center gap-3 p-3 rounded-xl bg-accent-green/5 border border-accent-green/10 hover:bg-accent-green/10 transition-all group">
                <ArrowDownToLine size={18} className="text-accent-green" />
                <span className="text-sm font-medium text-text-primary group-hover:text-accent-green transition-colors">Deposit Funds</span>
              </Link>
              <Link href="/client-area/withdrawal" className="flex items-center gap-3 p-3 rounded-xl bg-accent-orange/5 border border-accent-orange/10 hover:bg-accent-orange/10 transition-all group">
                <ArrowUpFromLine size={18} className="text-accent-orange" />
                <span className="text-sm font-medium text-text-primary group-hover:text-accent-orange transition-colors">Withdraw Funds</span>
              </Link>
              <Link href="/platform" className="flex items-center gap-3 p-3 rounded-xl bg-brand-500/5 border border-brand-500/10 hover:bg-brand-500/10 transition-all group">
                <BarChart3 size={18} className="text-brand-400" />
                <span className="text-sm font-medium text-text-primary group-hover:text-brand-400 transition-colors">Open WebTrader</span>
              </Link>
            </div>
          </div>

          {/* Accounts Switch */}
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold text-sm text-text-primary mb-4">Your Accounts</h2>
            <div className="space-y-2">
              {user.accounts.map((acc) => (
                <div key={acc.id} className={`p-3 rounded-xl border transition-all ${acc.id === activeAccount?.id ? 'bg-brand-500/10 border-brand-500/20' : 'bg-surface-700/30 border-white/[0.04] hover:border-white/[0.08]'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-text-primary">{acc.accountMode}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${acc.accountMode === 'DEMO' ? 'bg-accent-green/15 text-accent-green' : 'bg-brand-500/15 text-brand-400'}`}>
                      {acc.accountType}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">#{acc.accountNumber}</p>
                  <p className="text-sm font-heading font-bold text-text-primary mt-1">${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
