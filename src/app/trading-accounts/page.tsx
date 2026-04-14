'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { accountTiers } from '@/data/instruments'
import { Check, ArrowRight } from 'lucide-react'

export default function TradingAccountsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 relative">
          <div className="absolute inset-0 bg-hero-glow opacity-50" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-4">Trading Accounts</p>
            <h1 className="section-heading mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Flexible Options for <span className="gradient-text-brand">Every Trader</span>
            </h1>
            <p className="section-subheading mx-auto">
              From beginner to expert, our range of accounts is designed to match your goals. Enjoy tailored features and dedicated support to help you grow.
            </p>
          </div>
        </section>

        {/* Account Tiers */}
        <section className="pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {accountTiers.map((tier) => (
                <div
                  key={tier.type}
                  className={`glass-card p-7 relative overflow-hidden ${
                    tier.type === 'vip' ? 'border-brand-500/30 shadow-glow-sm' : ''
                  }`}
                >
                  {tier.type === 'vip' && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-accent-cyan" />
                  )}

                  {/* Badge */}
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                    style={{
                      backgroundColor: `${tier.color}15`,
                      color: tier.color,
                      border: `1px solid ${tier.color}30`,
                    }}
                  >
                    {tier.label}
                  </div>

                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{tier.level}</p>

                  <div className="mb-6">
                    <span className="font-heading font-bold text-2xl text-text-primary">{tier.spreadsFrom}</span>
                    <span className="text-text-muted text-sm ml-1">spreads</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {[
                      `Leverage ${tier.leverage}`,
                      `Commission: ${tier.commission}`,
                      `Margin Call: ${tier.marginCall}`,
                      `Stop Out: ${tier.stopOut}`,
                      `Swap Discount: ${tier.swapDiscount}`,
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <Check size={14} className="text-accent-green mt-0.5 shrink-0" />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </div>
                    ))}
                    {tier.negativeBalance && (
                      <div className="flex items-start gap-2.5">
                        <Check size={14} className="text-accent-green mt-0.5 shrink-0" />
                        <span className="text-sm text-text-secondary">Negative Balance Protection</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2.5">
                      <Check size={14} className="text-accent-green mt-0.5 shrink-0" />
                      <span className="text-sm text-text-secondary">Free Support & Education</span>
                    </div>
                  </div>

                  <Link
                    href="/auth/register"
                    className={`block w-full py-3 rounded-xl text-center font-heading font-semibold text-sm transition-all duration-300 ${
                      tier.type === 'vip'
                        ? 'btn-primary !py-3'
                        : 'bg-surface-500/50 border border-white/[0.06] text-text-primary hover:bg-brand-600/20 hover:border-brand-500/30'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Account Banner */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <div className="glass-card p-10 text-center border-brand-500/10">
              <h3 className="font-heading font-bold text-2xl text-text-primary mb-3">
                Try Risk-Free with a Demo Account
              </h3>
              <p className="text-text-secondary mb-6 max-w-xl mx-auto">
                Practice trading with $100,000 in virtual funds. No deposit required. Full access to all platform features.
              </p>
              <Link href="/auth/register" className="btn-primary inline-flex group">
                Open Demo Account
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Steps */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
            <h2 className="section-heading mb-12">Get Started in 3 Easy Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Register', desc: 'Complete a quick registration and verify your details.' },
                { step: '02', title: 'Fund', desc: 'Add funds easily through trusted payment options.' },
                { step: '03', title: 'Trade', desc: 'Access the markets and trade with confidence.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center font-mono text-lg text-brand-400 font-bold mx-auto mb-4">
                    {step}
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">{title}</h3>
                  <p className="text-sm text-text-secondary">{desc}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/register" className="btn-primary mt-10 inline-flex">Open Account</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
