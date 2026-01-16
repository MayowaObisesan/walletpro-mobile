import { useAccountBalance } from './useAccountBalance';
import { useCalculatedUsdValue } from './useEthPrice';
import type { Address } from 'viem';

export const useAccountBalanceWithUsd = (address?: Address) => {
  const { data: balance, ...balanceQuery } = useAccountBalance(address);
  const { usdValue, ...priceQuery } = useCalculatedUsdValue(balance ?? undefined);

  return {
    balance,
    usdValue,
    isLoading: balanceQuery.isLoading || priceQuery.isLoading,
    error: balanceQuery.error || priceQuery.error,
    refetch: balanceQuery.refetch,
    isSuccess: balanceQuery.isSuccess && priceQuery.isSuccess,
  };
};
