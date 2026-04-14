import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export const metadata = { title: 'Statements' }

export default async function StatementsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const account = user.accounts[0]
  const { data: trades } = await supabase.from('trades').select('*').eq('account_id', account?.id).eq('status', 'CLOSED').order('closed_at', { ascending: false }).limit(50)
  const closedTrades = trades || []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-text-primary">Statements</h1>
        <p className="text-text-muted text-sm">Closed trades and account history</p>
      </div>

      {/* Account summary */}
      {account && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Balance', `$${Number(account.balance).toLocaleString('en', { minimumFractionDigits: 2 })}`, 'text-text-primary'],
            ['Equity', `$${Number(account.equity).toLocaleString('en', { minimumFractionDigits: 2 })}`, 'text-text-primary'],
            ['Account', `#${account.accountNumber}`, 'text-brand-300'],
            ['Type', `${account.accountType} (${account.accountMode})`, 'text-text-secondary'],
          ].map(([l, v, c]) => (
            <div key={l as string} className="glass-card p-4">
              <p className="text-[10px] text-text-muted/50 uppercase tracking-wider font-bold">{l as string}</p>
              <p className={`font-heading font-bold text-lg mt-1 ${c}`}>{v as string}</p>
            </div>
          ))}
        </div>
      )}

      {closedTrades.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-text-muted">No closed trades yet. Start trading on the WebTrader.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/[0.06] text-text-muted/50 uppercase text-[10px] tracking-wider">
              <th className="text-left px-5 py-3">Symbol</th>
              <th className="text-center px-3 py-3">Type</th>
              <th className="text-center px-3 py-3">Volume</th>
              <th className="text-center px-3 py-3">Open</th>
              <th className="text-center px-3 py-3">Close</th>
              <th className="text-right px-5 py-3">Profit</th>
            </tr></thead>
            <tbody>
              {closedTrades.map((t: any) => (
                <tr key={t.id} className="border-b border-white/[0.02]">
                  <td className="px-5 py-3 font-heading font-bold text-text-primary">{t.symbol}</td>
                  <td className="text-center px-3 py-3"><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${t.type === 'BUY' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>{t.type}</span></td>
                  <td className="text-center px-3 py-3 font-mono text-text-muted">{Number(t.volume).toFixed(2)}</td>
                  <td className="text-center px-3 py-3 font-mono text-text-muted">{Number(t.open_price)}</td>
                  <td className="text-center px-3 py-3 font-mono text-text-secondary">{Number(t.close_price)}</td>
                  <td className="text-right px-5 py-3 font-mono font-bold"><span className={Number(t.profit) >= 0 ? 'text-accent-green' : 'text-accent-red'}>{Number(t.profit) >= 0 ? '+' : ''}${Number(t.profit).toFixed(2)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
