import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// Store type definition
interface UIStore {
  // Theme state
  theme: 'system' | 'light' | 'dark'

  // Wallet state
  walletLocked: boolean
  hasAccounts: boolean

  // UI preferences
  gasSponsorshipEnabled: boolean

  // Balance refresh trigger (for reactive balance updates)
  balanceVersion: number

  // Theme actions
  setTheme: (theme: 'system' | 'light' | 'dark') => void

  // Wallet actions
  setWalletLocked: (locked: boolean) => void
  setHasAccounts: (hasAccounts: boolean) => void

  // UI preferences
  setGasSponsorshipEnabled: (enabled: boolean) => void
  toggleGasSponsorship: () => void

  // Balance actions
  refreshBalances: () => void
}

// Create the store with subscribeWithSelector middleware for optimized subscriptions
export const useUIStore = create<UIStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    theme: 'system' as const,
    walletLocked: false,
    hasAccounts: false,
    gasSponsorshipEnabled: false,
    balanceVersion: 0,

    // Theme actions
    setTheme: (theme) => set({ theme }),

    // Wallet actions
    setWalletLocked: (locked) => set({ walletLocked: locked }),
    setHasAccounts: (hasAccounts) => set({ hasAccounts }),

    // UI preferences
    setGasSponsorshipEnabled: (enabled) => set({ gasSponsorshipEnabled: enabled }),
    toggleGasSponsorship: () => set((state) => ({ gasSponsorshipEnabled: !state.gasSponsorshipEnabled })),

    // Balance actions
    refreshBalances: () => set((state) => ({ balanceVersion: state.balanceVersion + 1 })),
  }))
)

// Selectors for optimized re-renders
export const useTheme = () => useUIStore((state) => state.theme)
export const useWalletLocked = () => useUIStore((state) => state.walletLocked)
export const useBalanceVersion = () => useUIStore((state) => state.balanceVersion)
