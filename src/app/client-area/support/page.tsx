'use client'
import { useState } from 'react'
import { MessageCircle, Mail, Phone, ChevronDown, ChevronUp, Send } from 'lucide-react'

const faqs = [
  { q: 'How do I verify my account?', a: 'Upload a government-issued photo ID and proof of residence (within 6 months) from the Documents section. Verification usually takes 1 business day.' },
  { q: 'What is the minimum deposit?', a: 'The minimum deposit is $250. No deposit fees are charged.' },
  { q: 'How long do withdrawals take?', a: 'Withdrawals are processed within 8-10 business days. The first withdrawal is free. Subsequent withdrawals have a 3.5% fee (min $30) for cards or $30 flat for wire transfers.' },
  { q: 'What leverage is available?', a: 'All accounts offer leverage up to 1:400. Leverage varies by instrument type.' },
  { q: 'Can I have a demo account?', a: 'Yes! Every user gets a free demo account with $100,000 in virtual funds. No deposit required.' },
  { q: 'What payment methods are accepted?', a: 'Credit/debit cards (Visa, Mastercard), bank wire transfer, and cryptocurrency (BTC, ETH, USDT TRC20/ERC20).' },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div><h1 className="font-heading font-bold text-2xl text-text-primary mb-1">Help & Support</h1><p className="text-text-muted text-sm">Get help via chat, email, or browse our FAQ</p></div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <MessageCircle size={20} />, title: 'Live Chat', desc: 'Available 24/7', color: 'text-accent-green' },
          { icon: <Mail size={20} />, title: 'Email', desc: 'info@tradepro.com', color: 'text-brand-400' },
          { icon: <Phone size={20} />, title: 'Phone', desc: '+44 123 456 7890', color: 'text-accent-cyan' },
        ].map(c => (
          <div key={c.title} className="glass-card p-5 text-center group cursor-pointer hover:border-brand-500/20">
            <div className={`${c.color} mx-auto mb-3 w-12 h-12 rounded-xl bg-surface-700/60 flex items-center justify-center`}>{c.icon}</div>
            <h3 className="font-heading font-semibold text-sm text-text-primary mb-1">{c.title}</h3>
            <p className="text-xs text-text-muted">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Message */}
      <div className="glass-card p-6">
        <h2 className="font-heading font-semibold text-lg text-text-primary mb-4">Send a Message</h2>
        <div className="flex gap-3">
          <input type="text" value={message} onChange={e => setMessage(e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/40 transition-all" placeholder="Describe your issue..." />
          <button className="btn-primary !px-5"><Send size={16} /></button>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-heading font-semibold text-lg text-text-primary mb-5">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-5 flex items-center justify-between text-left">
                <span className="font-heading font-medium text-sm text-text-primary pr-4">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={18} className="text-brand-400 shrink-0" /> : <ChevronDown size={18} className="text-text-muted shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 animate-slide-down">
                  <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
