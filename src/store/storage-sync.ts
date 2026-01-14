import { useUIStore } from './ui-store'
import { mobileStorage } from './mobile-storage'
import { secureMobileStorage } from './secure-storage'
import { defaultAlchemyChain } from '@src/config/chains'
import { E_NetworkType } from '@src/types/network'

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
    console.log('[Storage Sync] Loading data from mobile storage...')

    // Load network type
    const networkType = mobileStorage.getNetworkType()
    useUIStore.getState().setNetworkType(networkType)

    // Load selected network
    const selectedNetworkId = mobileStorage.getSelectedNetwork()
    if (selectedNetworkId) {
      // Check if it's a custom network
      const customNetworks = mobileStorage.getCustomNetworks()
      const customNetwork = customNetworks.find(n => n.chainId === selectedNetworkId)

      /*if (customNetwork) {
        // Convert custom network to chain-like object
        const chain = {
          id: customNetwork.chainId,
          name: customNetwork.name,
          nativeCurrency: customNetwork.currency,
          rpcUrls: {
            default: { http: [customNetwork.rpcUrl] },
            public: { http: [customNetwork.rpcUrl] },
          },
          blockExplorers: customNetwork.blockExplorerUrl ? {
            default: { name: 'Explorer', url: customNetwork.blockExplorerUrl },
          } : undefined,
        }
        useUIStore.getState().setSelectedNetwork(chain)
        console.log('[Storage Sync] Set custom network:', customNetwork.name)
      } else {
        // Use predefined chain
        const chain = getChainById(selectedNetworkId) || defaultAlchemyChain
        useUIStore.getState().setSelectedNetwork(chain)
        console.log('[Storage Sync] Set predefined network:', chain.name)
      }*/
    } else {
      // Use default network
      useUIStore.getState().setSelectedNetwork(defaultAlchemyChain)
      console.log('[Storage Sync] Using default network')
    }

    // Load accounts
    const accountsData = mobileStorage.getAccounts()
    const activeAccount = accountsData.activeAccountId
      ? accountsData.accounts.find(acc => acc.id === accountsData.activeAccountId)
      : null

    useUIStore.getState().setActiveAccount(activeAccount)
    useUIStore.getState().setAccountsList(accountsData.accounts)
    useUIStore.getState().setHasAccounts(accountsData.accounts.length > 0)

    // Load custom networks
    const customNetworks = mobileStorage.getCustomNetworks()
    useUIStore.getState().setCustomNetworks(customNetworks)

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
    // Fallback to defaults
    useUIStore.getState().setSelectedNetwork(defaultAlchemyChain)
    useUIStore.getState().setNetworkType(E_NetworkType.MAINNET)
  }
}

// Watch store changes and save to mobile storage
function setupStoreSubscriptions() {
  console.log('[Storage Sync] Setting up store subscriptions...')

  // Subscribe to network changes
  const unsubscribeNetwork = useUIStore.subscribe(
    (state) => state.selectedNetwork,
    async (selectedNetwork) => {
      try {
        await mobileStorage.saveSelectedNetwork(selectedNetwork.id)
        console.log('[Storage Sync] Saved network to storage:', selectedNetwork.id)
      } catch (error) {
        console.error('[Storage Sync] Failed to save network:', error)
      }
    }
  )

  // Subscribe to network type changes
  const unsubscribeNetworkType = useUIStore.subscribe(
    (state) => state.networkType,
    (networkType) => {
      try {
        mobileStorage.saveNetworkType(networkType)
        console.log('[Storage Sync] Saved network type to storage:', networkType)
      } catch (error) {
        console.error('[Storage Sync] Failed to save network type:', error)
      }
    }
  )

  // Subscribe to account changes
  const unsubscribeAccounts = useUIStore.subscribe(
    (state) => ({
      accounts: state.accountsList,
      activeAccount: state.activeAccount
    }),
    async ({ accounts, activeAccount }) => {
      try {
        await mobileStorage.saveAccounts(accounts, activeAccount?.id || null)
        console.log('[Storage Sync] Saved accounts to storage')
      } catch (error) {
        console.error('[Storage Sync] Failed to save accounts:', error)
      }
    }
  )

  // Subscribe to custom networks changes
  const unsubscribeCustomNetworks = useUIStore.subscribe(
    (state) => state.customNetworks,
    (customNetworks) => {
      try {
        mobileStorage.saveCustomNetworks(customNetworks)
        console.log('[Storage Sync] Saved custom networks to storage')
      } catch (error) {
        console.error('[Storage Sync] Failed to save custom networks:', error)
      }
    }
  )

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
    unsubscribeNetwork()
    unsubscribeNetworkType()
    unsubscribeAccounts()
    unsubscribeCustomNetworks()
    unsubscribeTheme()
    unsubscribeWalletLock()
    unsubscribeGasSponsorship()
  }
}

// Export for compatibility with existing code
export const syncUiStoreWithStorage = initializeStorageSync

// Export mobile storage for direct access when needed
export { mobileStorage, secureMobileStorage }
