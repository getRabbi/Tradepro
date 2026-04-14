'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MessageCircle, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-16 relative">
          <div className="absolute inset-0 bg-hero-glow opacity-50" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-4">Contact Us</p>
            <h1 className="section-heading mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              We&apos;re Here to <span className="gradient-text-brand">Help</span>
            </h1>
            <p className="section-subheading mx-auto">Our dedicated support team is available 24/7.</p>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-5">
                {[
                  { icon: <Mail size={22} />, title: 'Email', value: 'info@tradepro.com', href: 'mailto:info@tradepro.com' },
                  { icon: <Phone size={22} />, title: 'Phone', value: '+44 123 456 7890', href: 'tel:+441234567890' },
                  { icon: <MessageCircle size={22} />, title: 'Live Chat', value: 'Available 24/7', href: '#' },
                  { icon: <MapPin size={22} />, title: 'Address', value: 'Registered Office Address', href: '#' },
                ].map((c) => (
                  <a key={c.title} href={c.href} className="glass-card p-6 flex items-start gap-4 group block">
                    <div className="feature-icon text-brand-400 group-hover:text-accent-cyan transition-colors shrink-0">{c.icon}</div>
                    <div>
                      <h3 className="font-heading font-semibold text-text-primary mb-1">{c.title}</h3>
                      <p className="text-sm text-text-secondary">{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="lg:col-span-2">
                <div className="glass-card p-8">
                  <h2 className="font-heading font-bold text-xl text-text-primary mb-6">Send Us a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm text-text-muted mb-2">Full Name</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/40 transition-all" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm text-text-muted mb-2">Email Address</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/40 transition-all" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm text-text-muted mb-2">Subject</label>
                    <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/40 transition-all" placeholder="How can we help?" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm text-text-muted mb-2">Message</label>
                    <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/40 transition-all resize-none" placeholder="Describe your inquiry..." />
                  </div>
                  <button className="btn-primary group">Send Message <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
