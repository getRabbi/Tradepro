import Link from 'next/link'
import { BookOpen, GraduationCap, FileText, PieChart, ArrowRight } from 'lucide-react'
import { educationCards } from '@/data/instruments'

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen size={22} />, GraduationCap: <GraduationCap size={22} />,
  FileText: <FileText size={22} />, PieChart: <PieChart size={22} />,
}

export function Education() {
  return (
    <section className="relative py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-3">Education Center</p>
          <h2 className="section-heading mb-4">Sharpen Your Trading Edge</h2>
          <p className="section-subheading mx-auto">Enhance your skills with advanced tools, educational resources, and daily market insights.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {educationCards.map((card) => (
            <Link key={card.title} href={card.href} className="glass-card p-7 group block">
              <div className="feature-icon mb-5 text-brand-400 group-hover:text-accent-cyan transition-colors">{iconMap[card.icon]}</div>
              <h3 className="font-heading font-semibold text-text-primary mb-2 group-hover:text-brand-300 transition-colors">{card.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{card.description}</p>
              <span className="text-sm text-brand-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-900 via-brand-950/20 to-surface-900" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[120px]" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <h2 className="section-heading mb-5">Start Trading in <span className="gradient-text-brand">Minutes</span></h2>
        <p className="text-text-secondary text-lg mb-10 leading-relaxed">Join thousands of traders worldwide. Register, fund, and trade — all from one powerful platform.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          {[
            { step: '01', label: 'Register', desc: 'Quick sign-up & verify' },
            { step: '02', label: 'Fund', desc: 'Add funds securely' },
            { step: '03', label: 'Trade', desc: 'Access global markets' },
          ].map(({ step, label, desc }, i) => (
            <div key={step} className="flex items-center gap-3">
              {i > 0 && <div className="hidden sm:block w-12 h-px bg-gradient-to-r from-brand-500/40 to-transparent" />}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center font-mono text-sm text-brand-400 font-bold">{step}</div>
                <div className="text-left">
                  <p className="font-heading font-semibold text-text-primary text-sm">{label}</p>
                  <p className="text-xs text-text-muted">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/auth/register" className="btn-primary text-lg px-12 py-5 group">Open Account <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
      </div>
    </section>
  )
}
