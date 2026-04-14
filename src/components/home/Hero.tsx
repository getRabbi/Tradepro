'use client'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-cyan/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-sm text-brand-300 font-medium">Markets are open — 160+ instruments available</span>
        </div>
        <h1 className="font-heading font-bold text-text-primary animate-slide-up mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.08, letterSpacing: '-0.035em' }}>
          Trade Global Markets<br /><span className="gradient-text-brand">with Confidence</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up stagger-1 leading-relaxed">
          Access 160+ instruments across Forex, Stocks, Crypto, Indices, Commodities, and Metals. Fast execution, tight spreads, and powerful tools.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up stagger-2">
          <Link href="/auth/register" className="btn-primary text-base px-10 py-4 group">Open Account <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
          <Link href="/platform" className="btn-outline text-base px-10 py-4">Trade Now</Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 animate-slide-up stagger-3">
          {[{ icon: Shield, text: 'Regulated & Secure' }, { icon: Zap, text: 'Ultra-Fast Execution' }, { icon: TrendingUp, text: 'Spreads from 0.9 pips' }].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-text-muted">
              <div className="w-8 h-8 rounded-lg bg-surface-700/60 border border-white/[0.06] flex items-center justify-center"><Icon size={15} className="text-brand-400" /></div>
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-900 to-transparent" />
    </section>
  )
}
