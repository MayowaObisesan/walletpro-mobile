import { useQuery } from '@tanstack/react-query';
import { useUser, useChain } from '@account-kit/react-native';
import type { Address } from 'viem';
import { TokenBalance } from '@src/types/account';

// Query key factory for type safety
export const accountTokensKeys = {
  all: ['accountTokens'] as const,
  tokens: (address: Address, chainId: number) => [...accountTokensKeys.all, 'tokens', address, chainId] as const,
};

// Transform Alchemy response to our TokenBalance format
const transformAlchemyToken = (alchemyToken: any): TokenBalance => {
  const usdPrice = alchemyToken.tokenPrices?.find((price: any) => price.currency === 'usd')?.value;
  const tokenBalance = alchemyToken.tokenBalance || 0;
  
  return {
    address: alchemyToken.tokenAddress as Address,
    symbol: alchemyToken.tokenMetadata?.symbol || 'UNKNOWN',
    name: alchemyToken.tokenMetadata?.name || 'Unknown Token',
    balance: tokenBalance.toString(),
    decimals: alchemyToken.tokenMetadata?.decimals || 18,
    usdPrice: usdPrice ? parseFloat(usdPrice) : undefined,
    usdValue: usdPrice ? tokenBalance * parseFloat(usdPrice) : undefined,
    logo: alchemyToken.tokenMetadata?.logo || undefined,
  };
};

// Chain mapping for Alchemy API
const getAlchemyNetwork = (chainId: number): string => {
  const chainMap: Record<number, string> = {
    1: 'eth-mainnet',
    11155111: 'eth-sepolia',
    8453: 'base-mainnet',
    84532: 'base-sepolia',
    137: 'polygon-mainnet',
    80001: 'polygon-mumbai',
    10: 'optimism-mainnet',
    69: 'optimism-sepolia',
    42161: 'arbitrum-mainnet',
    421614: 'arbitrum-sepolia',
  };
  
  return chainMap[chainId] || 'eth-mainnet';
};

export const useAccountTokens = (address?: Address) => {
  const user = useUser();
  const { chain } = useChain();
  const targetAddress = address || user?.address;

  return useQuery({
    queryKey: targetAddress ? accountTokensKeys.tokens(targetAddress, chain.id) : accountTokensKeys.all,
    queryFn: async () => {
      if (!targetAddress) return [];
      
      try {
        // For now, we'll use mock data until we can properly integrate with Alchemy MCP server
        // In a real implementation, you would use the Alchemy API directly
        const mockTokens: TokenBalance[] = [
          {
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address,
            symbol: 'USDC',
            name: 'USD Coin',
            balance: '610970',
            decimals: 6,
            usdPrice: 0.9997022402,
            usdValue: 610.97,
            logo: 'https://static.alchemyapi.io/images/assets/3408.png',
          },
          {
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as Address,
            symbol: 'DAI',
            name: 'Dai Stablecoin',
            balance: '544444444444444500000',
            decimals: 18,
            usdPrice: 0.9995974709,
            usdValue: 544.44,
            logo: 'https://static.alchemyapi.io/images/assets/4943.png',
          },
          {
            address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' as Address,
            symbol: 'WBTC',
            name: 'Wrapped Bitcoin',
            balance: '12401',
            decimals: 8,
            usdPrice: 92374.4265763159,
            usdValue: 1.15,
            logo: 'https://static.alchemyapi.io/images/assets/3717.png',
          },
          {
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as Address,
            symbol: 'WETH',
            name: 'Wrapped Ether',
            balance: '100000000000000',
            decimals: 18,
            usdPrice: 3209.5553511037,
            usdValue: 0.000321,
            logo: 'https://static.alchemyapi.io/images/assets/2396.png',
          },
        ];

        return mockTokens;
      } catch (error) {
        console.error('Error fetching tokens:', error);
        throw error;
      }
    },
    enabled: !!targetAddress,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for getting portfolio total value
export const usePortfolioValue = (address?: Address) => {
  const { data: tokens = [] } = useAccountTokens(address);
  
  const totalValue = tokens.reduce((sum, token) => {
    return sum + (token.usdValue || 0);
  }, 0);

  return {
    totalValue,
    tokenCount: tokens.length,
    tokensWithValue: tokens.filter(token => token.usdValue && token.usdValue > 0.01).length,
  };
};
