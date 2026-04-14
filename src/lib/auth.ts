import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'
const TOKEN_EXPIRY = '7d'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value || null
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

export async function getCurrentUser() {
  const token = await getAuthCookie()
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload) return null

  try {
    const { supabase } = await import('@/lib/supabaseClient')

    const { data: user } = await supabase.from('users').select('*').eq('id', payload.userId).single()
    if (!user) return null

    const { data: accounts } = await supabase.from('accounts').select('*').eq('user_id', user.id)
    const { data: kycDocs } = await supabase.from('kyc_documents').select('*').eq('user_id', user.id)

    return {
      id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name,
      phone: user.phone, country: user.country, baseCurrency: user.base_currency,
      language: user.language, role: user.role, isEmailVerified: user.is_email_verified,
      createdAt: user.created_at,
      accounts: (accounts || []).map((a: any) => ({
        id: a.id, accountNumber: a.account_number, accountType: a.account_type,
        accountMode: a.account_mode, displayName: a.display_name, balance: a.balance,
        equity: a.equity, marginUsed: a.margin_used, freeMargin: a.free_margin,
        leverage: a.leverage, baseCurrency: a.base_currency, isActive: a.is_active,
      })),
      kycDocuments: (kycDocs || []).map((d: any) => ({
        id: d.id, documentType: d.document_type, status: d.status,
        rejectionReason: d.rejection_reason, uploadedAt: d.uploaded_at,
      })),
    }
  } catch { return null }
}

export function generateAccountNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
