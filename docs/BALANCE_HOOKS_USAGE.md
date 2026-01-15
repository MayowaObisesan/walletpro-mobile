# Balance Hooks Documentation

## Overview

The WalletPro mobile app now includes reusable balance hooks that eliminate code duplication and solve the JSIgnoredPromiseFromCall warning. These hooks use React Query for caching, error handling, and automatic refetching.

## Available Hooks

### 1. `useAccountBalance(address?)`

Fetches the native ETH balance for a given address or the current user.

**Features:**
- React Query caching with 30-second stale time
- Automatic refetch every minute
- Retry logic with exponential backoff
- Network-aware caching (separate cache per chain)
- Integrates with `balanceVersion` from UI store for reactive updates

**Usage:**
```typescript
import { useAccountBalance } from '@src/hooks/useAccountBalance';
import type { Address } from 'viem';

// For current user
const { data: balance, isLoading, error, refetch } = useAccountBalance();

// For specific address
const { data: balance, isLoading, error, refetch } = useAccountBalance(address as Address);
```

**Returns:**
```typescript
{
  data: bigint | null | undefined,  // Balance in wei
  isLoading: boolean,
  error: Error | null,
  refetch: () => void,
  // ... other React Query properties
}
```

### 2. `useAccountBalanceWithUsd(address?)`

Combines balance fetching with USD value calculation in a single hook.

**Features:**
- All features from `useAccountBalance`
- Automatic USD value calculation
- Combined loading and error states
- Single refetch function for both balance and price

**Usage:**
```typescript
import { useAccountBalanceWithUsd } from '@src/hooks/useAccountBalanceWithUsd';

// For current user
const { balance, usdValue, isLoading, error, refetch } = useAccountBalanceWithUsd();

// For specific address
const { balance, usdValue, isLoading, error, refetch } = useAccountBalanceWithUsd(address as Address);
```

**Returns:**
```typescript
{
  balance: bigint | null | undefined,      // Balance in wei
  usdValue: number | null,                // USD equivalent
  isLoading: boolean,                      // Combined loading state
  error: Error | null,                     // Combined error state
  refetch: () => void,                     // Refetch both balance and price
  isSuccess: boolean                       // Combined success state
}
```

## Migration Guide

### Before (Problematic Code)
```typescript
const [myBalance, setMyBalance] = useState<bigint | undefined>()
const { usdValue, isLoading: isLoadingPrice, error: priceError } = useCalculatedUsdValue(myBalance);

useEffect(() => {
  const _balance = async () => {
    const bal = await client?.getBalance({ address: user.address, blockTag: 'latest' });
    setMyBalance(bal);
  }
  _balance() // ❌ JSIgnoredPromiseFromCall warning
}, [client]);
```

### After (Using New Hooks)
```typescript
const { balance: myBalance, usdValue, isLoading, error, refetch } = useAccountBalanceWithUsd();

// No useEffect needed, no promise warnings, reusable across app
```

## Benefits

1. **Eliminates JSIgnoredPromiseFromCall Warning**: Proper async handling with React Query
2. **Reusable**: Can be used in any component without code duplication
3. **Cached**: Intelligent caching reduces unnecessary network requests
4. **Type Safe**: Proper TypeScript integration with Viem types
5. **Reactive**: Automatically updates when network changes or balanceVersion increments
6. **Error Handling**: Built-in error states and retry logic
7. **Performance**: Optimized re-renders with proper selectors

## React Query Configuration

Both hooks use the following React Query configuration:

- `staleTime: 30000` - Data considered fresh for 30 seconds
- `refetchInterval: 60000` - Auto-refetch every minute
- `refetchOnWindowFocus: true` - Refetch when app comes to foreground
- `retry: 3` - Retry failed requests up to 3 times
- `retryDelay: exponential backoff` - Smart retry timing

## Cache Keys

The hooks use type-safe query keys:

```typescript
// For current user: ['accountBalance', 'balance', address, chainId]
// For specific address: ['accountBalance', 'balance', customAddress, chainId]
```

## Integration with UI Store

The hooks automatically integrate with the `balanceVersion` from your UI store. When `refreshBalances()` is called, it increments `balanceVersion` which triggers a refetch across all components using these hooks.

```typescript
import { useUIStore } from '@src/store/ui-store';

// In any component:
const { refreshBalances } = useUIStore.getState();
refreshBalances(); // Triggers balance refetch app-wide
```

## Examples

### Basic Usage in Component
```typescript
import { useAccountBalanceWithUsd } from '@src/hooks/useAccountBalanceWithUsd';
import { formatEther } from 'viem';
import { formatUsdValue } from '@src/utils';

const BalanceDisplay = () => {
  const { balance, usdValue, isLoading, error, refetch } = useAccountBalanceWithUsd();

  if (isLoading) return <Text>Loading balance...</Text>;
  if (error) return <Text>Balance unavailable</Text>;
  if (!balance) return <Text>No balance data</Text>;

  return (
    <View>
      <Text>{formatEther(balance)} ETH</Text>
      <Text>≈ {formatUsdValue(usdValue)} USD</Text>
      <Button onPress={refetch}>
        <Text>Refresh</Text>
      </Button>
    </View>
  );
};
```

### Multiple Addresses
```typescript
const WalletBalances = ({ addresses }: { addresses: Address[] }) => {
  return (
    <View>
      {addresses.map((address) => (
        <BalanceRow key={address} address={address} />
      ))}
    </View>
  );
};

const BalanceRow = ({ address }: { address: Address }) => {
  const { balance, usdValue, isLoading } = useAccountBalanceWithUsd(address);
  
  if (isLoading) return <Text>Loading...</Text>;
  
  return (
    <Text>
      {shortenAddress(address)}: {balance ? formatEther(balance) : '0'} ETH
      {usdValue && ` (≈ ${formatUsdValue(usdValue)} USD)`}
    </Text>
  );
};
```

## Testing

A test component is available at `src/components/__tests__/BalanceHookTest.tsx` to demonstrate and test the hooks' functionality.

## Files Added/Modified

1. **New Files:**
   - `src/hooks/useAccountBalance.ts` - Core balance fetching hook
   - `src/hooks/useAccountBalanceWithUsd.ts` - Combined balance + USD hook
   - `src/components/__tests__/BalanceHookTest.tsx` - Test component
   - `docs/BALANCE_HOOKS_USAGE.md` - This documentation

2. **Modified Files:**
   - `app/(main)/index.tsx` - Refactored to use new hooks

This implementation follows all project rules and maintains consistency with existing patterns in the WalletPro mobile app.
