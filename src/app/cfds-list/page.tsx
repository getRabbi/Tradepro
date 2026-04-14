'use client'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useState } from 'react'
import { instruments } from '@/data/instruments'
import { Search } from 'lucide-react'
import Link from 'next/link'

const categories = ['all','forex','indices','stocks','commodities','crypto','metals'] as const

export default function CFDsListPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const filtered = instruments.filter((i) => {
    const matchCat = category === 'all' || i.category === category
    const matchSearch = i.symbol.toLowerCase().includes(search.toLowerCase()) || i.fullName.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <><Header /><main>
      <section className="pt-32 pb-10 relative">
        <div className="absolute inset-0 bg-hero-glow opacity-50" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-4">Full CFD List</p>
          <h1 className="section-heading mb-5" style={{fontSize:'clamp(2rem,5vw,3rem)'}}>160+ Tradable <span className="gradient-text-brand">Instruments</span></h1>
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/40 transition-all" placeholder="Search instruments..." />
            </div>
            <div className="flex flex-wrap gap-1 p-1 bg-surface-800/60 rounded-xl border border-white/[0.04]">
              {categories.map((c)=>(<button key={c} onClick={()=>setCategory(c)} className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${category===c?'bg-brand-600 text-white':'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'}`}>{c==='all'?'All':c}</button>))}
            </div>
          </div>
          <div className="glass-card overflow-hidden"><div className="overflow-x-auto">
            <table className="w-full"><thead><tr className="border-b border-white/[0.06]">
              <th className="text-left px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-medium">Symbol</th>
              <th className="text-left px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-medium">Name</th>
              <th className="text-left px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-medium hidden md:table-cell">Category</th>
              <th className="text-center px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-medium">Leverage</th>
              <th className="text-center px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-medium hidden sm:table-cell">Min Spread</th>
              <th className="text-center px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-medium">Action</th>
            </tr></thead><tbody>
              {filtered.map((inst)=>(<tr key={inst.symbol} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-heading font-semibold text-sm text-text-primary">{inst.symbol}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{inst.fullName}</td>
                <td className="px-6 py-4 hidden md:table-cell"><span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-surface-500/50 text-text-secondary">{inst.category}</span></td>
                <td className="px-6 py-4 text-center text-sm text-text-primary font-mono">1:{inst.leverageMax}</td>
                <td className="px-6 py-4 text-center text-sm text-text-secondary font-mono hidden sm:table-cell">{inst.minSpread}</td>
                <td className="px-6 py-4 text-center"><Link href="/auth/register" className="px-4 py-1.5 rounded-lg bg-brand-600/20 border border-brand-500/20 text-xs font-medium text-brand-300 hover:bg-brand-600/30 transition-all">Trade</Link></td>
              </tr>))}
            </tbody></table>
          </div>{filtered.length===0&&<div className="text-center py-12 text-text-muted text-sm">No instruments found.</div>}</div>
          <p className="text-center text-xs text-text-muted mt-4">{filtered.length} instruments shown</p>
        </div>
      </section>
    </main><Footer /></>
  )
}
