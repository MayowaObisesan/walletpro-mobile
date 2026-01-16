import { useQuery } from '@tanstack/react-query';
import { useUser, useSmartAccountClient, useChain } from '@account-kit/react-native';
import { useBalanceVersion } from '@src/store/ui-store';
import type { Address } from 'viem';

// Query key factory for type safety
export const accountBalanceKeys = {
  all: ['accountBalance'] as const,
  balance: (address: Address, chainId: number) => [...accountBalanceKeys.all, 'balance', address, chainId] as const,
};

export const useAccountBalance = (address?: Address) => {
  const user = useUser();
  const { client } = useSmartAccountClient({ type: "ModularAccountV2" });
  const { chain } = useChain();
  const balanceVersion = useBalanceVersion();
  
  const targetAddress = address || user?.address;

  return useQuery({
    queryKey: targetAddress ? accountBalanceKeys.balance(targetAddress, chain.id) : accountBalanceKeys.all,
    queryFn: async () => {
      if (!client || !targetAddress) return null;
      return client.getBalance({ address: targetAddress, blockTag: 'latest' });
    },
    enabled: !!client && !!targetAddress,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
