import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Shield, Zap, Lock, Eye, HeartHandshake, Award } from 'lucide-react'

export const metadata = { title: 'About Us' }

const values = [
  { icon: <Shield size={24} />, title: 'Integrity', desc: 'We put traders first, building our services on trust, quality, and transparency.' },
  { icon: <HeartHandshake size={24} />, title: 'Client-First', desc: 'Every decision we make is guided by what is best for our clients and their trading success.' },
  { icon: <Award size={24} />, title: 'Education', desc: 'We empower our clients to reach their full potential through expert training and market insights.' },
  { icon: <Lock size={24} />, title: 'Security', desc: 'We maintain fully segregated accounts, ensuring your money is never mixed with company capital.' },
  { icon: <Zap size={24} />, title: 'Innovation', desc: 'Unlock market opportunities with cutting-edge tools and a platform built for speed.' },
  { icon: <Eye size={24} />, title: 'Transparency', desc: 'With no hidden costs and a clear fee structure, you always know exactly where your money is.' },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 relative">
          <div className="absolute inset-0 bg-hero-glow opacity-50" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-4">About Us</p>
            <h1 className="section-heading mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Built on Integrity.<br />Driven by <span className="gradient-text-brand">Innovation.</span>
            </h1>
            <p className="section-subheading mx-auto">
              We are committed to empowering traders with the tools, resources, and support to invest with confidence. Our mission is to provide a secure, innovative environment where education leads the way.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-surface-800/30">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h2 className="section-heading text-center mb-14">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="glass-card p-8">
                  <div className="feature-icon mb-5 text-brand-400">{v.icon}</div>
                  <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">{v.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regulatory */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
            <h2 className="section-heading mb-5">Regulated & Transparent</h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              We hold an International Brokerage and Clearing House license, ensuring all client operations, funds, and trading activities follow strict standards. Our commitment to compliance has played a major role in our global acceptance.
            </p>
            <div className="glass-card p-8 text-left space-y-3">
              <div className="flex justify-between border-b border-white/[0.06] pb-3">
                <span className="text-text-muted text-sm">Company Name</span>
                <span className="text-text-primary text-sm font-medium">Your Company Ltd</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-3">
                <span className="text-text-muted text-sm">Registration Number</span>
                <span className="text-text-primary text-sm font-medium">00000</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-3">
                <span className="text-text-muted text-sm">License Number</span>
                <span className="text-text-primary text-sm font-medium">L00000/MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted text-sm">Regulatory Authority</span>
                <span className="text-text-primary text-sm font-medium">Offshore Finance Authority</span>
              </div>
            </div>
            <Link href="/auth/register" className="btn-primary mt-10 inline-flex">Open Account</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
