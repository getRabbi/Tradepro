import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { ArrowDownToLine } from 'lucide-react'

export const metadata = { title: 'Deposit Funds' }

export default async function DepositPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const account = user.accounts[0]
  const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', user.id).eq('type', 'DEPOSIT').order('created_at', { ascending: false }).limit(20)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-text-primary mb-1">Deposit Funds</h1>
        <p className="text-text-muted text-sm">Current balance: <span className="text-accent-green font-bold">${Number(account?.balance || 0).toLocaleString('en', { minimumFractionDigits: 2 })}</span></p>
      </div>

      <div className="glass-card p-8 text-center">
        <ArrowDownToLine size={40} className="text-brand-400 mx-auto mb-4" />
        <h2 className="font-heading font-bold text-xl text-text-primary mb-2">Make a Deposit</h2>
        <p className="text-sm text-text-muted mb-6">Deposit via bKash, Nagad, Bank Transfer, Bitcoin, or USDT from the WebTrader. Select amount, view payment details, and upload your payment screenshot.</p>
        <Link href="/trader" className="btn-primary !px-8 !py-3 text-sm inline-flex items-center gap-2">
          <ArrowDownToLine size={16} /> Open WebTrader to Deposit
        </Link>
      </div>

      {/* Deposit History */}
      <div className="glass-card p-5">
        <h2 className="font-heading font-bold text-sm text-text-primary mb-4">Deposit History</h2>
        {(!txs || txs.length === 0) ? (
          <p className="text-sm text-text-muted text-center py-4">No deposits yet</p>
        ) : (
          <div className="space-y-2">
            {txs.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-3 border-b border-white/[0.03]">
                <div>
                  <p className="text-sm text-text-primary font-medium">${Number(t.amount).toLocaleString()}</p>
                  <p className="text-[10px] text-text-muted">{(t.payment_method || '').replace('_', ' ')} • {new Date(t.created_at).toLocaleDateString('en-GB')}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'COMPLETED' ? 'bg-accent-green/10 text-accent-green' : t.status === 'REJECTED' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-orange/10 text-accent-orange'}`}>{t.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
