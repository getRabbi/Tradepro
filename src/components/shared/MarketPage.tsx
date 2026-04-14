'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { instruments } from '@/data/instruments'
import { InstrumentCategory } from '@/types'

interface MarketPageProps {
  category: InstrumentCategory
  title: string
  subtitle: string
  description: string
}

export default function MarketPage({ category, title, subtitle, description }: MarketPageProps) {
  const filtered = instruments.filter((i) => i.category === category)

  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-16 relative">
          <div className="absolute inset-0 bg-hero-glow opacity-50" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-4">{subtitle}</p>
            <h1 className="section-heading mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              {title}
            </h1>
            <p className="section-subheading mx-auto">{description}</p>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((inst) => (
                <div key={inst.symbol} className="instrument-card">
                  <div className="mb-4">
                    <h3 className="font-heading font-bold text-xl text-text-primary mb-1">{inst.symbol}</h3>
                    <p className="text-sm text-text-muted">{inst.fullName}</p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6 min-h-[60px]">{inst.description}</p>
                  <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/[0.06]">
                    <span className="text-xs text-text-muted uppercase tracking-wider">Leverage (Up to)</span>
                    <span className="font-heading font-bold text-text-primary">1:{inst.leverageMax}</span>
                  </div>
                  <Link href="/auth/register" className="block w-full py-3 rounded-xl bg-surface-500/50 border border-white/[0.06] text-center font-heading font-semibold text-sm text-text-primary hover:bg-brand-600/20 hover:border-brand-500/30 hover:text-brand-300 transition-all">
                    Trade
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education CTA */}
        <section className="pb-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="glass-card p-10 border-brand-500/10">
              <h3 className="font-heading font-bold text-xl text-text-primary mb-3">Enhance Your Trading Knowledge</h3>
              <p className="text-text-secondary text-sm mb-6">
                Successful trading starts with knowledge. Access our free Education Center for insights, strategies, and market analysis.
              </p>
              <Link href="/education" className="btn-primary inline-flex text-sm">Explore Education Center</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
