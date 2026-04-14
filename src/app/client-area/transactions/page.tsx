import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'

export const metadata = { title: 'Transactions' }

export default async function TransactionsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
  const transactions = txs || []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-text-primary">Transactions</h1>
        <p className="text-text-muted text-sm">{transactions.length} transactions</p>
      </div>

      {transactions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-text-muted">No transactions yet. Make a deposit to get started.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/[0.06] text-text-muted/50 uppercase text-[10px] tracking-wider">
              <th className="text-left px-5 py-3">Type</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-center px-4 py-3">Method</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Reference</th>
            </tr></thead>
            <tbody>
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="border-b border-white/[0.02] hover:bg-white/[0.015]">
                  <td className="px-5 py-3">
                    <span className={`flex items-center gap-1.5 font-bold ${tx.type === 'DEPOSIT' ? 'text-accent-green' : 'text-accent-red'}`}>
                      {tx.type === 'DEPOSIT' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="text-right px-4 py-3 font-mono font-bold text-text-primary">${Number(tx.amount).toLocaleString()}</td>
                  <td className="text-center px-4 py-3"><span className="px-2 py-0.5 rounded bg-surface-600/50 text-text-secondary text-[10px]">{tx.payment_method?.replace('_', ' ')}</span></td>
                  <td className="text-center px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.status === 'COMPLETED' ? 'bg-accent-green/10 text-accent-green' : tx.status === 'PENDING' ? 'bg-accent-orange/10 text-accent-orange' : 'bg-accent-red/10 text-accent-red'}`}>{tx.status}</span></td>
                  <td className="px-4 py-3 text-text-muted text-xs">{new Date(tx.created_at).toLocaleString('en-GB')}</td>
                  <td className="px-4 py-3 text-text-muted text-xs font-mono">{tx.reference_number || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
