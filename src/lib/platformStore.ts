import { create } from 'zustand'
import { supabase } from './supabaseClient'

export interface PaymentMethodConfig {
  id: string; label: string; icon: string; enabled: boolean; details: Record<string, string>
}

interface PlatformStore {
  paymentMethods: PaymentMethodConfig[]
  loaded: boolean
  loadPaymentMethods: () => Promise<void>
  updatePaymentDetail: (id: string, key: string, value: string) => void
  togglePaymentMethod: (id: string) => void
  saveToSupabase: () => Promise<void>
}

const defaults: PaymentMethodConfig[] = [
  { id: 'bkash', label: 'bKash', icon: '🟠', enabled: true, details: { number: '01712-XXXXXX', name: 'Rabbi Capital Ltd', type: 'Personal', instruction: 'Send Money to this bKash number. Use your account ID as reference.' } },
  { id: 'nagad', label: 'Nagad', icon: '🔴', enabled: true, details: { number: '01612-XXXXXX', name: 'Rabbi Capital Ltd', type: 'Personal', instruction: 'Send Money to this Nagad number. Use your account ID as reference.' } },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦', enabled: true, details: { bankName: 'Dutch-Bangla Bank Ltd', accountName: 'Rabbi Capital Ltd', accountNumber: '1234567890123', branch: 'Dhaka Main Branch', routingNumber: '090261234', instruction: 'Transfer to this bank account. Use account ID as reference.' } },
  { id: 'btc', label: 'Bitcoin (BTC)', icon: '₿', enabled: true, details: { network: 'Bitcoin', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', minAmount: '0.001 BTC', instruction: 'Send BTC to this address. Min 0.001 BTC.' } },
  { id: 'usdt_trc20', label: 'USDT (TRC20)', icon: '💲', enabled: true, details: { network: 'Tron (TRC20)', address: 'TN2xHGk8hxVbpNjYkJmJrYqvNqQVqjjjjj', minAmount: '10 USDT', instruction: 'Send USDT via TRC20 only.' } },
  { id: 'usdt_erc20', label: 'USDT (ERC20)', icon: '💲', enabled: false, details: { network: 'Ethereum (ERC20)', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18', minAmount: '50 USDT', instruction: 'Send USDT via ERC20. Higher gas fees.' } },
]

export const usePlatformStore = create<PlatformStore>((set, get) => ({
  paymentMethods: defaults,
  loaded: false,

  loadPaymentMethods: async () => {
    if (get().loaded) return
    try {
      const { data } = await supabase.from('platform_settings').select('value').eq('key', 'payment_methods').single()
      if (data?.value) {
        set({ paymentMethods: JSON.parse(data.value), loaded: true })
        return
      }
    } catch {}
    set({ loaded: true })
  },

  updatePaymentDetail: (id, key, value) => set((s) => ({
    paymentMethods: s.paymentMethods.map((m) => m.id === id ? { ...m, details: { ...m.details, [key]: value } } : m)
  })),

  togglePaymentMethod: (id) => set((s) => ({
    paymentMethods: s.paymentMethods.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m)
  })),

  saveToSupabase: async () => {
    const methods = get().paymentMethods
    try {
      const { data: existing } = await supabase.from('platform_settings').select('id').eq('key', 'payment_methods').single()
      if (existing) {
        await supabase.from('platform_settings').update({ value: JSON.stringify(methods) }).eq('key', 'payment_methods')
      } else {
        await supabase.from('platform_settings').insert({ id: crypto.randomUUID(), key: 'payment_methods', value: JSON.stringify(methods) })
      }
    } catch (e) { console.error('Save failed:', e) }
  },
}))
