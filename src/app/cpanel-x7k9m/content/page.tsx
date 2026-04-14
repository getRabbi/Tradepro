'use client'

import { useState } from 'react'
import { FileText, Plus, Edit, Trash2, Eye, BookOpen, Radio, BookA, Newspaper } from 'lucide-react'

const contentItems = [
  { id: '1', type: 'news', title: 'Fed Holds Rates Steady Amid Inflation Concerns', status: 'published', date: '2026-04-05', views: 1240 },
  { id: '2', type: 'news', title: 'Gold Surges Past $2,340 on Safe Haven Demand', status: 'published', date: '2026-04-04', views: 890 },
  { id: '3', type: 'article', title: 'Understanding Leverage in Forex Trading', status: 'published', date: '2026-04-03', views: 2450 },
  { id: '4', type: 'signal', title: 'BUY EURUSD @ 1.0850 — TP: 1.0920 SL: 1.0810', status: 'active', date: '2026-04-06', views: 560 },
  { id: '5', type: 'signal', title: 'SELL XAUUSD @ 2345 — TP: 2310 SL: 2365', status: 'hit_tp', date: '2026-04-05', views: 780 },
  { id: '6', type: 'course', title: 'Beginner Guide to CFD Trading', status: 'published', date: '2026-03-15', views: 5670 },
  { id: '7', type: 'ebook', title: 'Risk Management Strategies 2026', status: 'published', date: '2026-03-01', views: 3200 },
  { id: '8', type: 'glossary', title: 'Trading Glossary (245 terms)', status: 'published', date: '2026-02-10', views: 8900 },
  { id: '9', type: 'news', title: 'Bitcoin ETF Inflows Reach Record High', status: 'draft', date: '2026-04-06', views: 0 },
]

const typeIcons: Record<string, React.ReactNode> = {
  news: <Newspaper size={14} />, article: <FileText size={14} />, signal: <Radio size={14} />,
  course: <BookOpen size={14} />, ebook: <BookA size={14} />, glossary: <BookA size={14} />,
}

const typeColors: Record<string, string> = {
  news: 'bg-brand-500/10 text-brand-300', article: 'bg-accent-cyan/10 text-accent-cyan',
  signal: 'bg-accent-green/10 text-accent-green', course: 'bg-accent-orange/10 text-accent-orange',
  ebook: 'bg-purple-500/10 text-purple-300', glossary: 'bg-pink-500/10 text-pink-300',
}

export default function AdminContentPage() {
  const [filter, setFilter] = useState('all')
  const filtered = contentItems.filter((c) => filter === 'all' || c.type === filter)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="font-heading font-black text-2xl text-text-primary">Content Manager</h1><p className="text-text-muted text-sm">Manage news, education, signals, and glossary</p></div>
        <button className="btn-primary !py-2.5 !px-5 text-xs flex items-center gap-2"><Plus size={14} /> New Content</button>
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-1 p-1 bg-surface-800/60 rounded-xl border border-white/[0.04]">
        {['all', 'news', 'article', 'signal', 'course', 'ebook', 'glossary'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${filter === f ? 'bg-brand-600 text-white' : 'text-text-muted hover:text-text-secondary'}`}>
            {f === 'all' ? `All (${contentItems.length})` : `${f} (${contentItems.filter((c) => c.type === f).length})`}
          </button>
        ))}
      </div>

      {/* Content list */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeColors[item.type]}`}>
                {typeIcons[item.type]}
              </div>
              <div className="min-w-0">
                <p className="font-heading font-bold text-sm text-text-primary truncate">{item.title}</p>
                <div className="flex items-center gap-3 text-[10px] text-text-muted mt-0.5">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${typeColors[item.type]}`}>{item.type}</span>
                  <span>{item.date}</span>
                  <span>{item.views.toLocaleString()} views</span>
                  <span className={`font-bold ${item.status === 'published' || item.status === 'active' ? 'text-accent-green' : item.status === 'draft' ? 'text-accent-orange' : 'text-text-muted'}`}>{item.status}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted/40 hover:text-brand-400 hover:bg-brand-500/10 transition-all"><Eye size={13} /></button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted/40 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all"><Edit size={13} /></button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted/40 hover:text-accent-red hover:bg-accent-red/10 transition-all"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
