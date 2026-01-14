import { MMKV } from 'react-native-mmkv'
import type { Chain } from 'viem'
import type { WalletAccount } from '@src/types/account'
import type { CustomNetwork } from '@src/types/network'
import { E_NetworkType } from '@src/types/network'

// Standard storage for non-sensitive data
const storage = new MMKV({
  id: 'wallet-storage',
  encryptionKey: process.env.EXPO_PUBLIC_STORAGE_KEY || 'default-key'
})

// Storage keys (matching existing patterns)
const STORAGE_KEYS = {
  SELECTED_NETWORK: 'selected_network',
  NETWORK_TYPE: 'network_type',
  ACCOUNTS: 'wallet_accounts',
  ACTIVE_ACCOUNT_ID: 'active_account_id',
  CUSTOM_NETWORKS: 'custom_networks',
  THEME: 'theme',
  GAS_SPONSORSHIP: 'gas_sponsorship_enabled',
  WALLET_LOCKED: 'wallet_locked'
} as const

// Simple mobile storage interface
export const mobileStorage = {
  // Network storage
  getSelectedNetwork: (): number | null => {
    const network = storage.getString(STORAGE_KEYS.SELECTED_NETWORK)
    return network ? JSON.parse(network) : null
  },

  saveSelectedNetwork: (chainId: number): void => {
    storage.set(STORAGE_KEYS.SELECTED_NETWORK, JSON.stringify(chainId))
  },

  // Network type storage
  getNetworkType: (): E_NetworkType => {
    const type = storage.getString(STORAGE_KEYS.NETWORK_TYPE)
    return type ? JSON.parse(type) : E_NetworkType.MAINNET
  },

  saveNetworkType: (type: E_NetworkType): void => {
    storage.set(STORAGE_KEYS.NETWORK_TYPE, JSON.stringify(type))
  },

  // Accounts storage
  getAccounts: (): { accounts: WalletAccount[], activeAccountId: string | null } => {
    const accounts = storage.getString(STORAGE_KEYS.ACCOUNTS)
    const activeId = storage.getString(STORAGE_KEYS.ACTIVE_ACCOUNT_ID)
    
    return {
      accounts: accounts ? JSON.parse(accounts) : [],
      activeAccountId: activeId || null
    }
  },

  saveAccounts: (accounts: WalletAccount[], activeAccountId: string | null): void => {
    storage.set(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
    if (activeAccountId) {
      storage.set(STORAGE_KEYS.ACTIVE_ACCOUNT_ID, activeAccountId)
    }
  },

  // Custom networks storage
  getCustomNetworks: (): CustomNetwork[] => {
    const networks = storage.getString(STORAGE_KEYS.CUSTOM_NETWORKS)
    return networks ? JSON.parse(networks) : []
  },

  saveCustomNetworks: (networks: CustomNetwork[]): void => {
    storage.set(STORAGE_KEYS.CUSTOM_NETWORKS, JSON.stringify(networks))
  },

  // Theme storage
  getTheme: (): 'system' | 'light' | 'dark' => {
    const theme = storage.getString(STORAGE_KEYS.THEME)
    return theme ? JSON.parse(theme) : 'system'
  },

  saveTheme: (theme: 'system' | 'light' | 'dark'): void => {
    storage.set(STORAGE_KEYS.THEME, JSON.stringify(theme))
  },

  // Wallet lock state
  getWalletLocked: (): boolean => {
    const locked = storage.getString(STORAGE_KEYS.WALLET_LOCKED)
    return locked ? JSON.parse(locked) : false
  },

  saveWalletLocked: (locked: boolean): void => {
    storage.set(STORAGE_KEYS.WALLET_LOCKED, JSON.stringify(locked))
  },

  // Gas sponsorship preference
  getGasSponsorship: (): boolean => {
    const enabled = storage.getString(STORAGE_KEYS.GAS_SPONSORSHIP)
    return enabled ? JSON.parse(enabled) : false
  },

  saveGasSponsorship: (enabled: boolean): void => {
    storage.set(STORAGE_KEYS.GAS_SPONSORSHIP, JSON.stringify(enabled))
  },

  // Utility methods
  clear: (): void => {
    storage.clearAll()
  },

  remove: (key: string): void => {
    storage.delete(key)
  }
}
