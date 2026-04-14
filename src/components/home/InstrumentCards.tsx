'use client'
import { useState } from 'react'
import Link from 'next/link'
import { instruments, marketCategories } from '@/data/instruments'
import { InstrumentCategory } from '@/types'

export default function InstrumentCards() {
  const [activeCategory, setActiveCategory] = useState<InstrumentCategory>('forex')
  const filtered = instruments.filter((i) => i.category === activeCategory).slice(0, 4)

  return (
    <section className="relative py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">Explore Global Markets</h2>
          <p className="section-subheading mx-auto">Access 160+ tradable instruments across 6 markets.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 mb-12 p-1.5 bg-surface-800/60 rounded-2xl border border-white/[0.04] max-w-fit mx-auto">
          {marketCategories.map((cat) => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key as InstrumentCategory)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat.key ? 'bg-brand-600 text-white shadow-glow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'}`}>
              {cat.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((inst, i) => (
            <div key={inst.symbol} className="instrument-card opacity-0 animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}>
              <div className="mb-4">
                <h3 className="font-heading font-bold text-xl text-text-primary mb-1">{inst.symbol}</h3>
                <p className="text-sm text-text-muted">{inst.fullName}</p>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-6 min-h-[60px]">{inst.description}</p>
              <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/[0.06]">
                <span className="text-xs text-text-muted uppercase tracking-wider">Leverage (Up to)</span>
                <span className="font-heading font-bold text-text-primary">1:{inst.leverageMax}</span>
              </div>
              <Link href="/auth/register" className="block w-full py-3 rounded-xl bg-surface-500/50 border border-white/[0.06] text-center font-heading font-semibold text-sm text-text-primary hover:bg-brand-600/20 hover:border-brand-500/30 hover:text-brand-300 transition-all">Trade</Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/cfds-list" className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium text-sm transition-colors">View all 160+ instruments →</Link>
        </div>
      </div>
    </section>
  )
}
