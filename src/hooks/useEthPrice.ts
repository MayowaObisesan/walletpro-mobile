import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { fetchEthPrice } from '@src/utils';

// Query key factory for type safety
export const ethPriceKeys = {
  all: ['ethPrice'] as const,
  price: () => [...ethPriceKeys.all, 'price'] as const,
};

export const useEthPrice = () => {
  return useQuery({
    queryKey: ethPriceKeys.price(),
    queryFn: fetchEthPrice,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCalculatedUsdValue = (ethAmount: bigint | undefined) => {
  const { data: ethPrice, ...priceQuery } = useEthPrice();
  
  const usdValue = React.useMemo(() => {
    if (!ethPrice || !ethAmount) return null;
    const ethValue = parseFloat(ethAmount.toString()) / 1e18;
    return ethValue * ethPrice;
  }, [ethPrice, ethAmount]);

  return { usdValue, ...priceQuery };
};
