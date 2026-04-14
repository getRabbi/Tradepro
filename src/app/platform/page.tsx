import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Monitor, Smartphone, Tablet, BarChart3, Bell, Sliders, Target, Timer, Shield } from 'lucide-react'

export const metadata = { title: 'Platform' }

const platformFeatures = [
  { icon: <Sliders size={22} />, title: 'Customizable Interface', desc: 'Tailor your trading layout, set price change notifications, and personalize preferences.' },
  { icon: <BarChart3 size={22} />, title: 'Advanced Charting', desc: 'Fibonacci, trend lines, support/resistance levels, and 20+ technical indicators.' },
  { icon: <Target size={22} />, title: 'Smart Trading', desc: 'Stop-loss, take-profit, trailing stop, and instant order execution for precise trading.' },
  { icon: <Bell size={22} />, title: 'Real-Time Alerts', desc: 'Get notified on price movements, market events, and trade executions instantly.' },
  { icon: <Timer size={22} />, title: 'Fast Execution', desc: 'Ultra-fast order placement with minimal slippage, maximizing your trading opportunities.' },
  { icon: <Shield size={22} />, title: 'Secure & Regulated', desc: 'All trades executed in a protected environment with industry-standard encryption.' },
]

export default function PlatformPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-16 relative">
          <div className="absolute inset-0 bg-hero-glow opacity-50" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-4">WebTrader Platform</p>
            <h1 className="section-heading mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Trade Anytime, <span className="gradient-text-brand">Anywhere</span>
            </h1>
            <p className="section-subheading mx-auto mb-10">
              Our browser-based platform gives you the tools and resources to trade with confidence. No downloads, no limits — just seamless trading.
            </p>
            <div className="flex items-center justify-center gap-6 mb-10">
              {[
                { icon: <Monitor size={20} />, label: 'Desktop' },
                { icon: <Tablet size={20} />, label: 'Tablet' },
                { icon: <Smartphone size={20} />, label: 'Mobile' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-text-secondary">
                  <div className="w-10 h-10 rounded-xl bg-surface-700/60 border border-white/[0.06] flex items-center justify-center text-brand-400">
                    {icon}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/register" className="btn-primary inline-flex">Start Trading Now</Link>
          </div>
        </section>

        {/* Platform mockup placeholder */}
        <section className="pb-10">
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass-card p-4 aspect-video flex items-center justify-center border-brand-500/10">
              <div className="text-center">
                <BarChart3 size={64} className="text-brand-500/30 mx-auto mb-4" />
                <p className="text-text-muted text-sm">WebTrader Platform Preview</p>
                <p className="text-text-muted/50 text-xs mt-1">Full interactive WebTrader coming in Phase 3</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h2 className="section-heading text-center mb-14">Powerful Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformFeatures.map((f) => (
                <div key={f.title} className="glass-card p-8 group">
                  <div className="feature-icon mb-5 text-brand-400 group-hover:text-accent-cyan transition-colors">{f.icon}</div>
                  <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
