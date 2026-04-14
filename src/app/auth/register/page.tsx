'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, Upload, FileCheck, X, SkipForward } from 'lucide-react'

const steps = ['Personal Details', 'Questionnaire', 'Verification']

export default function RegisterPage() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (window.location.search.includes('force')) {
      document.cookie = 'auth-token=; path=/; max-age=0'
    }
  }, [])
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: '', password: '',
    employment: '', income: '', sourceOfFunds: '', experience: '', riskAck: false,
  })
  const [idFile, setIdFile] = useState<File | null>(null)
  const [residenceFile, setResidenceFile] = useState<File | null>(null)
  const idInputRef = useRef<HTMLInputElement>(null)
  const residenceInputRef = useRef<HTMLInputElement>(null)

  const update = (key: string, val: string | boolean) => { setForm((p) => ({ ...p, [key]: val })); setError('') }
  const inputCls = "w-full px-4 py-3.5 rounded-xl bg-surface-700/50 border border-white/[0.06] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all"
  const selectCls = `${inputCls} appearance-none cursor-pointer`

  // Validate step before moving forward
  const canProceed = () => {
    if (step === 0) {
      if (!form.firstName.trim()) { setError('First name is required'); return false }
      if (!form.lastName.trim()) { setError('Last name is required'); return false }
      if (!form.email.trim() || !form.email.includes('@')) { setError('Valid email is required'); return false }
      if (!form.password || form.password.length < 6) { setError('Password must be at least 6 characters'); return false }
    }
    return true
  }

  const nextStep = () => {
    if (canProceed()) { setError(''); setStep(step + 1) }
  }

  // Handle registration - works with or without database
  const handleRegister = async () => {
    setLoading(true)
    setError('')

    try {
      // Try server action first (needs PostgreSQL)
      const { registerAction } = await import('@/lib/actions')
      const res = await registerAction({
        firstName: form.firstName, lastName: form.lastName, email: form.email,
        phone: form.phone, country: form.country, password: form.password,
        employment: form.employment, income: form.income,
        sourceOfFunds: form.sourceOfFunds, experience: form.experience,
        riskAck: form.riskAck,
      })

      if (res.error) {
        if (res.error === 'NO_DATABASE') {
          // No database — go straight to demo trader
          window.location.href = '/trader'
          return
        }
        setError(res.error)
        setLoading(false)
        return
      }

      if (res.success) {
        window.location.href = '/client-area/dashboard'
        return
      }
    } catch (err: any) {
      console.warn('DB not available, using demo mode:', err.message)
      // If DB fails, redirect to trader in demo mode
      window.location.href = '/trader'
      return
    }

    setLoading(false)
  }

  const handleFileSelect = (type: 'id' | 'residence', file: File) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']

    if (!allowed.includes(file.type)) {
      setError('Only PNG, JPG, and PDF files are accepted')
      return
    }
    if (file.size > maxSize) {
      setError('File size must be under 5MB')
      return
    }
    setError('')

    if (type === 'id') setIdFile(file)
    else setResidenceFile(file)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-6 py-12">
      <div className="absolute inset-0 bg-hero-glow opacity-40" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      <div className="relative w-full max-w-lg">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-heading font-bold text-white">T</div>
          <span className="font-heading font-bold text-2xl text-text-primary">Trade<span className="text-brand-400">Pro</span></span>
        </Link>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-accent-green text-white' : i === step ? 'bg-brand-500 text-white' : 'bg-surface-600 text-text-muted'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${i === step ? 'text-text-primary font-medium' : 'text-text-muted'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-accent-green' : 'bg-surface-500'}`} />}
            </div>
          ))}
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm flex items-center gap-2 animate-slide-down">
            <X size={16} /> {error}
          </div>
        )}

        <div className="glass-card p-8 border-brand-500/10">
          {/* ===== Step 1: Personal Details ===== */}
          {step === 0 && (
            <>
              <h1 className="font-heading font-bold text-2xl text-text-primary text-center mb-2">Create Your Account</h1>
              <p className="text-text-muted text-sm text-center mb-8">Start trading in minutes</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-muted mb-2">First Name *</label>
                    <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className={inputCls} placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-muted mb-2">Last Name *</label>
                    <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className={inputCls} placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Email Address *</label>
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputCls} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputCls} placeholder="+880 1XXXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Country of Residence</label>
                  <select value={form.country} onChange={(e) => update('country', e.target.value)} className={selectCls}>
                    <option value="">Select country</option>
                    <option value="BD">Bangladesh</option>
                    <option value="IN">India</option>
                    <option value="PK">Pakistan</option>
                    <option value="ID">Indonesia</option>
                    <option value="MY">Malaysia</option>
                    <option value="TH">Thailand</option>
                    <option value="PH">Philippines</option>
                    <option value="KR">South Korea</option>
                    <option value="NG">Nigeria</option>
                    <option value="ZA">South Africa</option>
                    <option value="BR">Brazil</option>
                    <option value="MX">Mexico</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Password *</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} className={`${inputCls} pr-12`} placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <input type="checkbox" id="terms" className="w-4 h-4 rounded border-white/[0.1] bg-surface-700 text-brand-500 mt-0.5" />
                  <label htmlFor="terms" className="text-xs text-text-muted leading-relaxed">
                    I agree to the <Link href="/terms" className="text-brand-400 hover:underline">Terms & Conditions</Link> and <Link href="/privacy-policy" className="text-brand-400 hover:underline">Privacy Policy</Link>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* ===== Step 2: Questionnaire ===== */}
          {step === 1 && (
            <>
              <h1 className="font-heading font-bold text-xl text-text-primary text-center mb-2">Trading Profile</h1>
              <p className="text-text-muted text-sm text-center mb-8">Help us understand your trading background</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-muted mb-2">Employment Status</label>
                  <select value={form.employment} onChange={(e) => update('employment', e.target.value)} className={selectCls}>
                    <option value="">Select</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Annual Income</label>
                  <select value={form.income} onChange={(e) => update('income', e.target.value)} className={selectCls}>
                    <option value="">Select range</option>
                    <option value="lt25k">Less than $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k-250k">$100,000 - $250,000</option>
                    <option value="gt250k">More than $250,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Source of Funds</label>
                  <select value={form.sourceOfFunds} onChange={(e) => update('sourceOfFunds', e.target.value)} className={selectCls}>
                    <option value="">Select</option>
                    <option value="salary">Salary / Employment</option>
                    <option value="savings">Savings</option>
                    <option value="investments">Investments</option>
                    <option value="inheritance">Inheritance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Trading Experience</label>
                  <select value={form.experience} onChange={(e) => update('experience', e.target.value)} className={selectCls}>
                    <option value="">Select</option>
                    <option value="none">No experience</option>
                    <option value="lt1y">Less than 1 year</option>
                    <option value="1-3y">1 - 3 years</option>
                    <option value="gt3y">More than 3 years</option>
                  </select>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <input type="checkbox" id="risk" checked={form.riskAck} onChange={(e) => update('riskAck', e.target.checked)} className="w-4 h-4 rounded border-white/[0.1] bg-surface-700 text-brand-500 mt-0.5" />
                  <label htmlFor="risk" className="text-xs text-text-muted leading-relaxed">
                    I understand that trading CFDs carries a high level of risk and I may lose my entire capital.
                  </label>
                </div>
              </div>
            </>
          )}

          {/* ===== Step 3: KYC Verification ===== */}
          {step === 2 && (
            <>
              <h1 className="font-heading font-bold text-xl text-text-primary text-center mb-2">Verify Your Identity</h1>
              <p className="text-text-muted text-sm text-center mb-8">Upload documents for KYC verification</p>
              <div className="space-y-6">
                {/* ID Upload */}
                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-medium">Government-Issued Photo ID</label>
                  <p className="text-xs text-text-muted mb-3">Passport, Driver&apos;s License, or National ID Card</p>

                  {/* Hidden file input */}
                  <input
                    ref={idInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect('id', file)
                    }}
                  />

                  {idFile ? (
                    <div className="p-4 rounded-xl bg-accent-green/5 border border-accent-green/15 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileCheck size={20} className="text-accent-green" />
                        <div>
                          <p className="text-sm text-text-primary font-medium">{idFile.name}</p>
                          <p className="text-xs text-text-muted">{(idFile.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => setIdFile(null)} className="text-text-muted hover:text-accent-red transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => idInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/[0.08] rounded-xl p-8 text-center hover:border-brand-500/30 hover:bg-brand-500/[0.02] transition-all cursor-pointer group"
                    >
                      <Upload size={32} className="mx-auto text-text-muted group-hover:text-brand-400 transition-colors mb-3" />
                      <p className="text-sm text-text-muted group-hover:text-text-secondary">Click to upload or drag and drop</p>
                      <p className="text-xs text-text-muted/60 mt-1">PNG, JPG, PDF up to 5MB</p>
                    </button>
                  )}
                </div>

                {/* Residence Upload */}
                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-medium">Proof of Residence</label>
                  <p className="text-xs text-text-muted mb-3">Bank statement, credit card statement, or utility bill (within 6 months). Mobile phone bills are NOT accepted.</p>

                  <input
                    ref={residenceInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect('residence', file)
                    }}
                  />

                  {residenceFile ? (
                    <div className="p-4 rounded-xl bg-accent-green/5 border border-accent-green/15 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileCheck size={20} className="text-accent-green" />
                        <div>
                          <p className="text-sm text-text-primary font-medium">{residenceFile.name}</p>
                          <p className="text-xs text-text-muted">{(residenceFile.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => setResidenceFile(null)} className="text-text-muted hover:text-accent-red transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => residenceInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/[0.08] rounded-xl p-8 text-center hover:border-brand-500/30 hover:bg-brand-500/[0.02] transition-all cursor-pointer group"
                    >
                      <Upload size={32} className="mx-auto text-text-muted group-hover:text-brand-400 transition-colors mb-3" />
                      <p className="text-sm text-text-muted group-hover:text-text-secondary">Click to upload or drag and drop</p>
                      <p className="text-xs text-text-muted/60 mt-1">PNG, JPG, PDF up to 5MB</p>
                    </button>
                  )}
                </div>

                {/* Info box */}
                <div className="p-4 rounded-xl bg-brand-500/[0.04] border border-brand-500/10">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    You can skip this step and upload documents later from your Client Area. KYC verification is required before live trading and withdrawals. <strong className="text-brand-300">Demo trading is available immediately.</strong>
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ===== Navigation Buttons ===== */}
          <div className="flex items-center justify-between mt-8 gap-3">
            {step > 0 ? (
              <button onClick={() => { setStep(step - 1); setError('') }} className="btn-outline !px-5 !py-3 text-sm flex items-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}

            <div className="flex items-center gap-2 ml-auto">
              {/* Skip button on step 2 (KYC) */}
              {step === 2 && (
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="btn-outline !px-5 !py-3 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <SkipForward size={14} /> Skip & Finish
                </button>
              )}

              {step < steps.length - 1 ? (
                <button onClick={nextStep} className="btn-primary !py-3 text-sm group">
                  Continue <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="btn-primary !py-3 text-sm group disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Registering...
                    </span>
                  ) : (
                    <>Complete Registration <Check size={16} className="ml-1" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Login</Link>
        </p>
      </div>
    </div>
  )
}
