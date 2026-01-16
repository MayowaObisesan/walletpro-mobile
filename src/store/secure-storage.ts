import { MMKV } from 'react-native-mmkv'
import type { WalletAccount } from '@src/types/account'

// Secure storage for sensitive data (private keys, seeds, etc.)
const secureStorage = new MMKV({
  id: 'secure-wallet',
  encryptionKey: process.env.EXPO_PUBLIC_SECURE_STORAGE_KEY || 'secure-default-key'
})

const SECURE_KEYS = {
  PRIVATE_KEYS: 'private_keys',
  SEED_PHRASES: 'seed_phrases',
  ENCRYPTED_WALLETS: 'encrypted_wallets'
} as const

export const secureMobileStorage = {
  // Private key storage (encrypted)
  storePrivateKey: (address: string, privateKey: string): void => {
    // Note: In production, implement proper encryption before storage
    secureStorage.set(`private_key_${address}`, privateKey)
  },

  getPrivateKey: (address: string): string | null => {
    return secureStorage.getString(`private_key_${address}`) || null
  },

  removePrivateKey: (address: string): void => {
    secureStorage.delete(`private_key_${address}`)
  },

  // Seed phrase storage (encrypted)
  storeSeedPhrase: (walletId: string, seedPhrase: string): void => {
    secureStorage.set(`seed_${walletId}`, seedPhrase)
  },

  getSeedPhrase: (walletId: string): string | null => {
    return secureStorage.getString(`seed_${walletId}`) || null
  },

  removeSeedPhrase: (walletId: string): void => {
    secureStorage.delete(`seed_${walletId}`)
  },

  // Encrypted wallet data
  storeEncryptedWallet: (walletId: string, encryptedData: string): void => {
    secureStorage.set(`wallet_${walletId}`, encryptedData)
  },

  getEncryptedWallet: (walletId: string): string | null => {
    return secureStorage.getString(`wallet_${walletId}`) || null
  },

  // Security operations
  clearSecureData: (): void => {
    secureStorage.clearAll()
  },

  hasSensitiveData: (): boolean => {
    const keys = secureStorage.getAllKeys()
    return keys.some(key => 
      key.includes('private_key') || 
      key.includes('seed_') || 
      key.includes('wallet_')
    )
  }
}
