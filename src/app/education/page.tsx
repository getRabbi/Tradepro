import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { BookOpen, GraduationCap, FileText, Play, BarChart3, Calculator, Globe, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Education Center' }

const sections = [
  { icon: <GraduationCap size={24}/>, title: 'Trading Courses', desc: 'Structured video lessons from beginner to advanced strategies.', href: '#' },
  { icon: <BookOpen size={24}/>, title: 'eBooks Library', desc: 'In-depth eBooks covering market analysis, strategies, and risk management.', href: '#' },
  { icon: <FileText size={24}/>, title: 'Trading Glossary', desc: 'A-Z definitions of essential trading terms in plain language.', href: '#' },
  { icon: <Play size={24}/>, title: 'Daily Market Videos', desc: 'Daily analysis videos for data-driven trading insights.', href: '#' },
  { icon: <TrendingUp size={24}/>, title: 'Live Signals', desc: 'Real-time trading signals with entry, stop-loss and take-profit levels.', href: '#' },
  { icon: <Globe size={24}/>, title: 'Economic Calendar', desc: 'Track upcoming economic events and their potential market impact.', href: '#' },
  { icon: <BarChart3 size={24}/>, title: 'Chart Analysis', desc: 'Technical analysis tools and strategy builder powered by Trading Central.', href: '#' },
  { icon: <Calculator size={24}/>, title: 'Risk Management Tools', desc: 'Position size, margin, pip value, and risk/reward calculators.', href: '#' },
]

export default function EducationPage() {
  return (
    <><Header /><main>
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-hero-glow opacity-50" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-4">Education Center</p>
          <h1 className="section-heading mb-5" style={{fontSize:'clamp(2rem,5vw,3.5rem)'}}>Sharpen Your <span className="gradient-text-brand">Trading Edge</span></h1>
          <p className="section-subheading mx-auto">Enhance your skills with advanced tools, educational resources, and daily market insights.</p>
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sections.map((s)=>(<Link key={s.title} href={s.href} className="glass-card p-7 group block">
              <div className="feature-icon mb-5 text-brand-400 group-hover:text-accent-cyan transition-colors">{s.icon}</div>
              <h3 className="font-heading font-semibold text-text-primary mb-2 group-hover:text-brand-300 transition-colors">{s.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
            </Link>))}
          </div>
          <div className="mt-16 max-w-3xl mx-auto glass-card p-10 text-center border-brand-500/10">
            <h3 className="font-heading font-bold text-xl text-text-primary mb-3">Practice Risk-Free</h3>
            <p className="text-text-secondary text-sm mb-6">Open a free demo account with $100,000 virtual funds. Learn, practice, and refine your strategies before going live.</p>
            <Link href="/auth/register" className="btn-primary inline-flex text-sm">Open Demo Account</Link>
          </div>
        </div>
      </section>
    </main><Footer /></>
  )
}
