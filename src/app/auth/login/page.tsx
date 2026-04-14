'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, ArrowRight, X } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Clear old cookie if ?force param present
  useEffect(() => {
    if (window.location.search.includes('force')) {
      document.cookie = 'auth-token=; path=/; max-age=0'
    }
  }, [])

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { loginAction } = await import('@/lib/actions')
      const res = await loginAction(email, password)
      if (res.error) {
        if (res.error === 'NO_DATABASE') {
          window.location.href = '/trader'
          return
        }
        setError(res.error)
        setLoading(false)
        return
      }
      if (res.success) {
        window.location.href = res.role === 'ADMIN' ? '/cpanel-x7k9m' : '/client-area/dashboard'
        return
      }
    } catch (err: any) {
      console.warn('DB not available:', err.message)
      // Fallback to demo mode
      window.location.href = '/trader'
      return
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-6">
      <div className="absolute inset-0 bg-hero-glow opacity-40" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-heading font-bold text-white">T</div>
          <span className="font-heading font-bold text-2xl text-text-primary">Trade<span className="text-brand-400">Pro</span></span>
        </Link>

        <div className="glass-card p-8 border-brand-500/10">
          <h1 className="font-heading font-bold text-2xl text-text-primary text-center mb-2">Welcome Back</h1>
          <p className="text-text-muted text-sm text-center mb-8">Login to your trading account</p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm flex items-center gap-2 animate-slide-down">
              <X size={16} /> {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-text-muted mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }}
                className="w-full px-4 py-3.5 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="your@email.com" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-text-muted">Password</label>
                <Link href="#" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError('') }}
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all pr-12"
                  placeholder="Enter your password"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary w-full justify-center group text-base py-4 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Logging in...
                </span>
              ) : (
                <>Login <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>

          {/* Demo mode quick access */}
          <div className="mt-5 pt-5 border-t border-white/[0.06]">
            <Link href="/trader" className="block w-full py-3 rounded-xl bg-accent-green/10 border border-accent-green/15 text-center text-sm font-medium text-accent-green hover:bg-accent-green/15 transition-all">
              Try Demo Account →
            </Link>
          </div>

          <p className="text-center text-sm text-text-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
