'use server'

import { supabase } from '@/lib/supabaseClient'
import { hashPassword, verifyPassword, signToken, setAuthCookie, removeAuthCookie, generateAccountNumber } from '@/lib/auth'

// ============= REGISTER =============
export async function registerAction(formData: {
  firstName: string; lastName: string; email: string; phone: string;
  country: string; password: string; employment?: string; income?: string;
  sourceOfFunds?: string; experience?: string; riskAck?: boolean; displayName?: string;
}) {
  try {
    // Check existing - use select + limit instead of .single() which throws on no match
    const { data: existingUsers } = await supabase.from('users').select('id').eq('email', formData.email).limit(1)
    if (existingUsers && existingUsers.length > 0) return { error: 'An account with this email already exists.' }

    const passwordHash = await hashPassword(formData.password)
    const userId = crypto.randomUUID()

    // Create user
    const { error: userErr } = await supabase.from('users').insert({
      id: userId, email: formData.email, password_hash: passwordHash,
      first_name: formData.firstName, last_name: formData.lastName,
      phone: formData.phone, country: formData.country,
    })
    if (userErr) throw userErr

    // Create profile
    await supabase.from('profiles').insert({
      id: crypto.randomUUID(), user_id: userId,
      employment_status: formData.employment, annual_income: formData.income,
      source_of_funds: formData.sourceOfFunds, trading_experience: formData.experience,
      risk_acknowledged: formData.riskAck || false,
    })

    // Create demo account
    const demoBalance = parseInt(process.env.NEXT_PUBLIC_DEMO_BALANCE || '0')
    const displayName = formData.displayName || `${formData.firstName}'s Account`
    await supabase.from('accounts').insert({
      id: crypto.randomUUID(), user_id: userId, account_number: generateAccountNumber(),
      account_type: 'CLASSIC', account_mode: 'DEMO', display_name: displayName,
      balance: demoBalance, equity: demoBalance, free_margin: demoBalance, leverage: 400,
    })

    // Create live account
    await supabase.from('accounts').insert({
      id: crypto.randomUUID(), user_id: userId, account_number: generateAccountNumber(),
      account_type: 'CLASSIC', account_mode: 'LIVE', display_name: displayName,
      balance: 0, equity: 0, free_margin: 0, leverage: 400,
    })

    // Welcome notification
    await supabase.from('notifications').insert({
      id: crypto.randomUUID(), user_id: userId,
      title: 'Welcome to TradePro!',
      message: 'Your account has been created. Start with the demo account to practice trading.',
      type: 'system',
    })

    // JWT + cookie
    const token = signToken({ userId, email: formData.email, role: 'USER' })
    await setAuthCookie(token)

    return { success: true, userId }
  } catch (error: any) {
    console.error('Registration error:', error)
    if (error?.message?.includes('fetch') || error?.message?.includes('network') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { error: 'NO_DATABASE' }
    }
    return { error: 'Registration failed. Please try again.' }
  }
}

// ============= LOGIN =============
export async function loginAction(email: string, password: string) {
  try {
    const { data: users, error } = await supabase.from('users').select('*').eq('email', email).order('created_at', { ascending: false }).limit(1)
    const user = users?.[0]
    if (error || !user) return { error: 'Invalid email or password.' }

    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) return { error: 'Invalid email or password.' }

    // Update last login
    await supabase.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', user.id)

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    await setAuthCookie(token)

    return { success: true, role: user.role }
  } catch (error: any) {
    console.error('Login error:', error)
    if (error?.message?.includes('fetch') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { error: 'NO_DATABASE' }
    }
    return { error: 'Login failed. Please try again.' }
  }
}

// ============= LOGOUT =============
export async function logoutAction() {
  await removeAuthCookie()
}

// ============= GET USER ACCOUNT =============
export async function getUserAccountAction() {
  try {
    const { cookies } = await import('next/headers')
    const { verifyToken } = await import('@/lib/auth')
    const token = cookies().get('auth-token')?.value
    if (!token) return { error: 'Not logged in' }
    const payload = verifyToken(token)
    if (!payload) return { error: 'Invalid token' }

    const { data: user } = await supabase.from('users').select('*').eq('id', payload.userId).single()
    if (!user) return { error: 'User not found' }

    const { data: accounts } = await supabase.from('accounts').select('*').eq('user_id', user.id).eq('is_active', true)

    const demoAccount = accounts?.find((a: any) => a.account_mode === 'DEMO')
    const activeAccount = demoAccount || accounts?.[0]

    return {
      success: true,
      user: { id: user.id, name: `${user.first_name} ${user.last_name}`, email: user.email, role: user.role },
      account: activeAccount ? {
        id: activeAccount.id, accountNumber: activeAccount.account_number,
        accountType: activeAccount.account_type, accountMode: activeAccount.account_mode,
        balance: Number(activeAccount.balance), equity: Number(activeAccount.equity),
        freeMargin: Number(activeAccount.free_margin), marginUsed: Number(activeAccount.margin_used),
        leverage: activeAccount.leverage, displayName: activeAccount.display_name,
      } : null,
    }
  } catch { return { error: 'Failed to load account' } }
}

// ============= DEPOSIT: Submit =============
export async function submitDepositAction(data: { amount: number; method: string; screenshotUrl: string }) {
  try {
    const { cookies } = await import('next/headers')
    const { verifyToken } = await import('@/lib/auth')
    const token = cookies().get('auth-token')?.value
    if (!token) return { error: 'Not logged in' }
    const payload = verifyToken(token)
    if (!payload) return { error: 'Invalid token' }

    const { data: account } = await supabase.from('accounts').select('id').eq('user_id', payload.userId).eq('is_active', true).limit(1).single()
    if (!account) return { error: 'No account found' }

    await supabase.from('transactions').insert({
      id: crypto.randomUUID(), user_id: payload.userId, account_id: account.id,
      type: 'DEPOSIT', amount: data.amount, fee_amount: 0, net_amount: data.amount,
      payment_method: data.method, status: 'PENDING',
      reference_number: `DEP-${Date.now()}`, rejection_reason: data.screenshotUrl,
    })

    return { success: true }
  } catch (error: any) {
    if (error?.message?.includes('fetch')) return { error: 'NO_DATABASE' }
    return { error: 'Deposit submission failed' }
  }
}

// ============= DEPOSIT: History =============
export async function getDepositHistoryAction() {
  try {
    const { cookies } = await import('next/headers')
    const { verifyToken } = await import('@/lib/auth')
    const token = cookies().get('auth-token')?.value
    if (!token) return { deposits: [] }
    const payload = verifyToken(token)
    if (!payload) return { deposits: [] }

    const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', payload.userId).order('created_at', { ascending: false }).limit(50)

    return {
      deposits: (txs || []).map((t: any) => ({
        id: t.id, type: t.type, amount: Number(t.amount), fee: Number(t.fee_amount),
        method: t.payment_method, status: t.status, date: t.created_at,
        reference: t.reference_number, screenshotUrl: t.rejection_reason,
      })),
    }
  } catch { return { deposits: [] } }
}

// ============= KYC: Submit =============
export async function submitKycAction(data: { documentType: string; fileUrl: string; fileName: string }) {
  try {
    const { cookies } = await import('next/headers')
    const { verifyToken } = await import('@/lib/auth')
    const token = cookies().get('auth-token')?.value
    if (!token) return { error: 'Not logged in' }
    const payload = verifyToken(token)
    if (!payload) return { error: 'Invalid token' }

    await supabase.from('kyc_documents').insert({
      id: crypto.randomUUID(), user_id: payload.userId,
      document_type: data.documentType, file_path: data.fileUrl,
      file_name: data.fileName, status: 'PENDING',
    })
    return { success: true }
  } catch (error: any) {
    if (error?.message?.includes('fetch')) return { error: 'NO_DATABASE' }
    return { error: 'KYC submission failed' }
  }
}

// ============= KYC: Status =============
export async function getKycStatusAction() {
  try {
    const { cookies } = await import('next/headers')
    const { verifyToken } = await import('@/lib/auth')
    const token = cookies().get('auth-token')?.value
    if (!token) return { documents: [] }
    const payload = verifyToken(token)
    if (!payload) return { documents: [] }

    const { data: docs } = await supabase.from('kyc_documents').select('*').eq('user_id', payload.userId).order('uploaded_at', { ascending: false })

    return {
      documents: (docs || []).map((d: any) => ({
        id: d.id, type: d.document_type, fileName: d.file_name,
        fileUrl: d.file_path, status: d.status, reason: d.rejection_reason, date: d.uploaded_at,
      })),
    }
  } catch { return { documents: [] } }
}

// ============= ADMIN: Get Deposits =============
export async function adminGetDepositsAction() {
  try {
    const { data: txs } = await supabase.from('transactions').select('*, users(first_name, last_name, email)').order('created_at', { ascending: false }).limit(100)

    return {
      deposits: (txs || []).map((t: any) => ({
        id: t.id, user: `${t.users?.first_name || ''} ${t.users?.last_name || ''}`,
        email: t.users?.email, type: t.type, amount: Number(t.amount), fee: Number(t.fee_amount),
        method: t.payment_method, status: t.status, date: t.created_at,
        reference: t.reference_number, screenshotUrl: t.rejection_reason,
      })),
    }
  } catch { return { deposits: [] } }
}

// ============= ADMIN: Approve Deposit =============
export async function adminApproveDepositAction(transactionId: string) {
  try {
    const { data: tx } = await supabase.from('transactions').select('*').eq('id', transactionId).single()
    if (!tx || tx.status !== 'PENDING') return { error: 'Invalid transaction' }

    // Update status
    await supabase.from('transactions').update({ status: 'COMPLETED', processed_at: new Date().toISOString() }).eq('id', transactionId)

    // Credit balance
    const { data: account } = await supabase.from('accounts').select('*').eq('id', tx.account_id).single()
    if (account) {
      const newBal = Number(account.balance) + Number(tx.amount)
      await supabase.from('accounts').update({
        balance: newBal, equity: newBal, free_margin: newBal - Number(account.margin_used),
      }).eq('id', account.id)
    }

    return { success: true }
  } catch { return { error: 'Approval failed' } }
}

// ============= ADMIN: Reject Deposit =============
export async function adminRejectDepositAction(transactionId: string, reason: string) {
  try {
    await supabase.from('transactions').update({ status: 'REJECTED', rejection_reason: reason, processed_at: new Date().toISOString() }).eq('id', transactionId)
    return { success: true }
  } catch { return { error: 'Rejection failed' } }
}

// ============= ADMIN: Get KYC =============
export async function adminGetKycAction() {
  try {
    const { data: docs } = await supabase.from('kyc_documents').select('*, users(first_name, last_name, email, country)').order('uploaded_at', { ascending: false }).limit(100)

    return {
      documents: (docs || []).map((d: any) => ({
        id: d.id, user: `${d.users?.first_name || ''} ${d.users?.last_name || ''}`,
        email: d.users?.email, country: d.users?.country, type: d.document_type,
        fileName: d.file_name, fileUrl: d.file_path, status: d.status,
        reason: d.rejection_reason, date: d.uploaded_at,
      })),
    }
  } catch { return { documents: [] } }
}

// ============= ADMIN: Approve KYC =============
export async function adminApproveKycAction(docId: string) {
  try {
    await supabase.from('kyc_documents').update({ status: 'APPROVED', reviewed_at: new Date().toISOString() }).eq('id', docId)
    return { success: true }
  } catch { return { error: 'Approval failed' } }
}

// ============= ADMIN: Reject KYC =============
export async function adminRejectKycAction(docId: string, reason: string) {
  try {
    await supabase.from('kyc_documents').update({ status: 'REJECTED', rejection_reason: reason, reviewed_at: new Date().toISOString() }).eq('id', docId)
    return { success: true }
  } catch { return { error: 'Rejection failed' } }
}

// ============= ADMIN: Update Balance =============
export async function adminUpdateBalanceAction(userId: string, accountId: string, newBalance: number) {
  try {
    await supabase.from('accounts').update({ balance: newBalance, equity: newBalance, free_margin: newBalance }).eq('id', accountId)
    return { success: true }
  } catch { return { error: 'Update failed' } }
}

// ============= ADMIN: Get All Users =============
export async function adminGetUsersAction() {
  try {
    const { data: users } = await supabase.from('users').select('*, accounts(*), profiles(*)').order('created_at', { ascending: false }).limit(200)
    return { users: users || [] }
  } catch { return { users: [] } }
}

// ============= UPDATE PROFILE =============
export async function updateProfileAction(data: Record<string, any>) {
  try {
    const { cookies } = await import('next/headers')
    const { verifyToken } = await import('@/lib/auth')
    const token = cookies().get('auth-token')?.value
    if (!token) return { error: 'Not logged in' }
    const payload = verifyToken(token)
    if (!payload) return { error: 'Invalid token' }

    if (data.firstName || data.lastName || data.phone) {
      await supabase.from('users').update({
        ...(data.firstName && { first_name: data.firstName }),
        ...(data.lastName && { last_name: data.lastName }),
        ...(data.phone && { phone: data.phone }),
      }).eq('id', payload.userId)
    }
    return { success: true }
  } catch { return { error: 'Update failed.' } }
}
