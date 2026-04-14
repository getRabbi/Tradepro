import Link from 'next/link'
import { Instagram, Twitter, Facebook, Linkedin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-surface-900">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-heading font-bold text-white text-sm">T</div>
              <span className="font-heading font-bold text-xl text-text-primary">Trade<span className="text-brand-400">Pro</span></span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm mb-6">Trade 160+ instruments across Forex, Stocks, Crypto, Indices, Commodities, and Metals. Fast, secure, and built for every level of trader.</p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-surface-700/60 flex items-center justify-center text-text-muted hover:text-brand-400 hover:bg-surface-600/60 transition-all"><Icon size={16} /></a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-text-primary text-sm mb-5 uppercase tracking-wider">Markets</h4>
            <ul className="space-y-3">
              {['Forex', 'Indices', 'Stocks', 'Commodities', 'Crypto', 'Metals'].map((m) => (
                <li key={m}><Link href={`/${m.toLowerCase()}`} className="text-sm text-text-muted hover:text-text-secondary transition-colors">{m}</Link></li>
              ))}
              <li><Link href="/cfds-list" className="text-sm text-text-muted hover:text-text-secondary transition-colors">Full CFD List</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-text-primary text-sm mb-5 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[['About Us', '/about-us'], ['Trading Accounts', '/trading-accounts'], ['Platform', '/platform'], ['Education', '/education'], ['Market News', '/market-news'], ['Contact Us', '/contact-us']].map(([l, h]) => (
                <li key={l}><Link href={h} className="text-sm text-text-muted hover:text-text-secondary transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-text-primary text-sm mb-5 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 mb-8">
              {[['Privacy Policy', '/privacy-policy'], ['Cookies Policy', '/cookies-privacy'], ['Terms & Conditions', '/terms'], ['Risk Disclosure', '/risk-disclosure'], ['AML Policy', '/aml-policy']].map(([l, h]) => (
                <li key={l}><Link href={h} className="text-sm text-text-muted hover:text-text-secondary transition-colors">{l}</Link></li>
              ))}
            </ul>
            <div className="space-y-2.5">
              <a href="mailto:info@tradepro.com" className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"><Mail size={14} /> info@tradepro.com</a>
              <a href="tel:+441234567890" className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"><Phone size={14} /> +44 123 456 7890</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.04] bg-surface-800/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <p className="text-[11px] leading-relaxed text-text-muted/70"><strong className="text-text-muted">Company Information:</strong> Your Company Ltd is a limited liability Company, holding an International Brokerage and Clearing House license. Regional Restrictions: We do not offer services to residents of the EU, UAE, GCC, USA, Canada, Japan.</p>
          <p className="text-[11px] leading-relaxed text-text-muted/70 mt-3"><strong className="text-text-muted">Risk Warning:</strong> Our products are traded on margin, carrying a high level of risk, and it is possible to lose your entire capital. These products may not be suitable for everyone.</p>
        </div>
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted/50">© {new Date().getFullYear()} TradePro. All rights reserved.</p>
          <p className="text-xs text-text-muted/50">This website uses cookies. <Link href="/cookies-privacy" className="underline hover:text-text-muted transition-colors">View Cookies Policy</Link></p>
        </div>
      </div>
    </footer>
  )
}
