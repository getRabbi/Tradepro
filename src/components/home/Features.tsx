import { Shield, Zap, Headphones, BarChart3, TrendingUp, Globe } from 'lucide-react'
import { features } from '@/data/instruments'

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield size={24} />, Zap: <Zap size={24} />, Headphones: <Headphones size={24} />,
  BarChart3: <BarChart3 size={24} />, TrendingUp: <TrendingUp size={24} />, Globe: <Globe size={24} />,
}

export default function Features() {
  return (
    <section className="relative py-24 bg-surface-800/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-3">Why Choose Us</p>
          <h2 className="section-heading mb-4">Built for Traders Who Aim Higher</h2>
          <p className="section-subheading mx-auto">We offer a secure, fast and supportive environment built to empower every level of trader.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-8 group">
              <div className="feature-icon mb-5 text-brand-400 group-hover:text-accent-cyan transition-colors">{iconMap[feature.icon]}</div>
              <h3 className="font-heading font-semibold text-lg text-text-primary mb-3">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
