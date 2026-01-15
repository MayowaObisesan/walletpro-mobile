import { useUIStore } from './ui-store'
import { mobileStorage } from './mobile-storage'
import { secureMobileStorage } from './secure-storage'

// Initialize sync between mobile storage and Zustand store
export function initializeStorageSync() {
  console.log('[Storage Sync] Initializing mobile storage sync...')

  // Load initial data from mobile storage
  loadFromStorage()

  // Set up store subscription to save changes back to storage
  setupStoreSubscriptions()
}

// Load initial state from mobile storage
function loadFromStorage() {
  try {
    // Load theme
    const theme = mobileStorage.getTheme()
    useUIStore.getState().setTheme(theme)

    // Load wallet lock state
    const walletLocked = mobileStorage.getWalletLocked()
    useUIStore.getState().setWalletLocked(walletLocked)

    // Load gas sponsorship preference
    const gasSponsorship = mobileStorage.getGasSponsorship()
    useUIStore.getState().setGasSponsorshipEnabled(gasSponsorship)

    console.log('[Storage Sync] Mobile storage initialization complete')
  } catch (error) {
    console.error('[Storage Sync] Failed to load data from storage:', error)
  }
}

// Watch store changes and save to mobile storage
function setupStoreSubscriptions() {
  console.log('[Storage Sync] Setting up store subscriptions...')

  // Subscribe to theme changes
  const unsubscribeTheme = useUIStore.subscribe(
    (state) => state.theme,
    (theme) => {
      try {
        mobileStorage.saveTheme(theme)
        console.log('[Storage Sync] Saved theme to storage:', theme)
      } catch (error) {
        console.error('[Storage Sync] Failed to save theme:', error)
      }
    }
  )

  // Subscribe to wallet lock changes
  const unsubscribeWalletLock = useUIStore.subscribe(
    (state) => state.walletLocked,
    (walletLocked) => {
      try {
        mobileStorage.saveWalletLocked(walletLocked)
        console.log('[Storage Sync] Saved wallet lock state to storage:', walletLocked)
      } catch (error) {
        console.error('[Storage Sync] Failed to save wallet lock state:', error)
      }
    }
  )

  // Subscribe to gas sponsorship changes
  const unsubscribeGasSponsorship = useUIStore.subscribe(
    (state) => state.gasSponsorshipEnabled,
    (gasSponsorshipEnabled) => {
      try {
        mobileStorage.saveGasSponsorship(gasSponsorshipEnabled)
        console.log('[Storage Sync] Saved gas sponsorship to storage:', gasSponsorshipEnabled)
      } catch (error) {
        console.error('[Storage Sync] Failed to save gas sponsorship:', error)
      }
    }
  )

  // Return cleanup function
  return () => {
    unsubscribeTheme()
    unsubscribeWalletLock()
    unsubscribeGasSponsorship()
  }
}

// Export for compatibility with existing code
export const syncUiStoreWithStorage = initializeStorageSync

// Export mobile storage for direct access when needed
export { mobileStorage, secureMobileStorage }
