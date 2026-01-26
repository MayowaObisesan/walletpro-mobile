import { useQuery } from '@tanstack/react-query';
import { useUser, useChain } from '@account-kit/react-native';
import type { Address, Chain } from 'viem';
import { TokenBalance } from '@src/types/account';
import Constants from 'expo-constants';

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

// Alchemy API helper to get token balances
const fetchAlchemyTokenBalances = async (
  address: Address,
  chain: Chain
): Promise<TokenBalance[]> => {
  const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY;

  if (!apiKey) {
    throw new Error('Alchemy API key not found in environment variables');
  }

  // Determine the correct RPC URL based on chain
  console.log("[fetch Alchemy Token Balances] rpcurl", chain.rpcUrls.alchemy);
  /*let rpcUrl: string;
  switch (chain.id) {
    case 1: // Ethereum Mainnet
      rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    case 11155111: // Sepolia
      rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;
      break;
    case 137: // Polygon
      rpcUrl = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    case 10: // Optimism
      rpcUrl = `https://opt-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    case 42161: // Arbitrum
      rpcUrl = `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    case 8453: // Base
      rpcUrl = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    default:
      throw new Error(`Unsupported chain ID: ${chain.id}`);
  }*/

  const rpcUrl = `${chain.rpcUrls.alchemy.http[0]}/${apiKey}`;
  // Request body for alchemy_getTokenBalances
  const requestBody = {
    jsonrpc: "2.0",
    method: "alchemy_getTokenBalances",
    params: [address, ["erc20", "NATIVE"]],
    id: 1
  };

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(requestBody),
    body: JSON.stringify([address, ["erc20", "NATIVE"]]),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Alchemy API error: ${data.error.message}`);
  }

  return data.result?.tokenBalances || [];
};

// Alchemy API helper to get token metadata
const fetchAlchemyTokenMetadata = async (
  contractAddress: string,
  chain: Chain
): Promise<any> => {
  const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY;

  if (!apiKey) {
    throw new Error('Alchemy API key not found in environment variables');
  }

  // Determine the correct RPC URL based on chain
  /*let rpcUrl: string;
  switch (chain.id) {
    case 1: // Ethereum Mainnet
      rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    case 11155111: // Sepolia
      rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;
      break;
    case 137: // Polygon
      rpcUrl = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    case 10: // Optimism
      rpcUrl = `https://opt-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    case 42161: // Arbitrum
      rpcUrl = `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    case 8453: // Base
      rpcUrl = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;
      break;
    default:
      throw new Error(`Unsupported chain ID: ${chain.id}`);
  }*/

  const rpcUrl = `${chain.rpcUrls.alchemy.http[0]}/${apiKey}`

  // Request body for alchemy_getTokenMetadata
  const requestBody = {
    jsonrpc: "2.0",
    method: "alchemy_getTokenMetadata",
    params: [contractAddress],
    id: 1
  };

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Alchemy API error: ${data.error.message}`);
  }

  return data.result;
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
        // Step 1: Fetch token balances
        console.log("[fetch Alchemy Token Balances] targetAddress", targetAddress);
        const tokenBalances = await fetchAlchemyTokenBalances(targetAddress, chain);
        console.log("[fetch Alchemy Token Balances] tokenBalances", tokenBalances);

        // Step 2: Fetch metadata for each token
        const tokensWithMetadata = await Promise.all(
          tokenBalances.map(async (token: any) => {
            // Skip tokens with errors
            if (token.error || !token.contractAddress) {
              return null;
            }

            try {
              const metadata = await fetchAlchemyTokenMetadata(token.contractAddress, chain);

              // Convert hex balance to decimal string
              const balance = parseInt(token.tokenBalance, 16).toString();

              return {
                address: token.contractAddress as Address,
                symbol: metadata.symbol || 'UNKNOWN',
                name: metadata.name || 'Unknown Token',
                balance: balance,
                decimals: metadata.decimals || 18,
                usdPrice: 0, // We can add price data later if needed
                usdValue: 0, // We can calculate this later if we have price data
                logo: metadata.logo || undefined,
              };
            } catch (error) {
              console.error(`Error fetching metadata for token ${token.contractAddress}:`, error);
              return null;
            }
          })
        );

        // Filter out null values (tokens with errors)
        const validTokens = tokensWithMetadata.filter((token): token is TokenBalance => token !== null);

        // Filter out tokens with zero balance
        return validTokens.filter(token => {
          const numericBalance = parseInt(token?.balance!);
          return numericBalance > 0;
        });
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
