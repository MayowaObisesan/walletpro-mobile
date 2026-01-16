import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useUser, useChain } from '@account-kit/react-native';
import type {Address, Chain} from 'viem';
import type {
  AlchemyTransfersResponse,
  AlchemyTransfer,
  UseTransactionHistoryParams,
  TransactionCategory
} from '@src/types/account';
import { useMemo } from 'react';
import Constants from 'expo-constants';
import { client } from "../utils/client";
import {AlchemyChainConfig} from "@account-kit/infra";

// Query key factory for type safety
export const transactionHistoryKeys = {
  all: ['transactionHistory'] as const,
  history: (address: Address, chainId: number) =>
    [...transactionHistoryKeys.all, 'history', address, chainId] as const,
  infinite: (address: Address, chainId: number, params: Omit<UseTransactionHistoryParams, 'pageKey'>) =>
    [...transactionHistoryKeys.history(address, chainId), 'infinite', params] as const,
};

// Alchemy API helper
const fetchAlchemyTransfers = async (
  address: Address,
  chain: Chain,
  params: UseTransactionHistoryParams = {}
): Promise<AlchemyTransfersResponse> => {
  const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY;

  console.log("[FetchAlchemyTransfers] inside fetchAlchemyTransfers")

  if (!apiKey) {
    throw new Error('Alchemy API key not found in environment variables');
  }

  console.log("[FetchAlchemyTransfers] inside fetchAlchemyTransfers API KEY", chain.rpcBaseUrl);

  // Build request body
  const requestBody: any = {
    jsonrpc: "2.0",
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: params.fromBlock || "0x0",
        toAddress: address,
        excludeZeroValue: true,
        withMetadata: true,
        category: params.categories || ["external", "internal", "erc20", "erc721", "erc1155"],
        pageKey: params.pageKey,
        maxCount: "0x64", // 100 transactions per page
      }
    ],
    id: 1
  };

  // Determine the correct RPC URL based on chain
  let rpcUrl: string;
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
  }

  // const rpcUrl = chain.rpcUrls.default.http;
  console.log("[FetchAlchemyTransfers] rpcUrl", rpcUrl, chain.rpcBaseUrl);
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

  const data: AlchemyTransfersResponse = await response.json();

  return data;
};

// Filter transfers based on search query
const filterTransfers = (
  transfers: AlchemyTransfer[],
  searchQuery: string
): AlchemyTransfer[] => {
  if (!searchQuery.trim()) {
    return transfers;
  }

  const query = searchQuery.toLowerCase().trim();

  return transfers.filter(transfer => {
    // Search by transaction hash
    if (transfer.hash.toLowerCase().includes(query)) {
      return true;
    }

    // Search by from address
    if (transfer.from.toLowerCase().includes(query)) {
      return true;
    }

    // Search by to address
    if (transfer.to.toLowerCase().includes(query)) {
      return true;
    }

    // Search by asset/symbol
    if (transfer.asset.toLowerCase().includes(query)) {
      return true;
    }

    // Search by value (as string)
    if (transfer.value.toString().includes(query)) {
      return true;
    }

    return false;
  });
};

// Main hook for transaction history with infinite scroll
export const useTransactionHistory = (
  params: Omit<UseTransactionHistoryParams, 'address'> = {}
) => {
  const user = useUser();
  const { chain } = useChain();

  const targetAddress = user?.address;

  return useInfiniteQuery({
    queryKey: targetAddress
      ? transactionHistoryKeys.infinite(targetAddress, chain.id, params)
      : transactionHistoryKeys.all,
    queryFn: ({ pageParam }) => {
      if (!targetAddress) {
        throw new Error('No address available');
      }

      return fetchAlchemyTransfers(targetAddress, chain, {
        ...params,
        pageKey: pageParam as string | undefined,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.result?.pageKey || undefined;
    },
    enabled: !!targetAddress,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data) => {
      // Apply client-side search filtering to all pages
      if (!params.searchQuery?.trim()) {
        return data;
      }

      return {
        pages: data.pages.map(page => ({
          ...page,
          result: {
            ...page.result,
            transfers: filterTransfers(page.result.transfers, params.searchQuery!)
          }
        })),
        pageParams: data.pageParams,
      };
    },
  });
};

// Hook for getting filtered and flattened transaction list
export const useFlatTransactionList = (
  params: Omit<UseTransactionHistoryParams, 'address'> = {}
) => {
  const { data, ...rest } = useTransactionHistory(params);

  const flatTransactions = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.flatMap(page => page?.result?.transfers);
  }, [data?.pages]);

  return {
    transactions: flatTransactions,
    ...rest,
  };
};

// Hook for transaction statistics
export const useTransactionStats = (
  params: Omit<UseTransactionHistoryParams, 'address'> = {}
) => {
  const { transactions } = useFlatTransactionList(params);

  return useMemo(() => {
    const stats = {
      totalTransactions: transactions.length,
      totalValue: 0,
      categories: {} as Record<TransactionCategory, number>,
      assets: {} as Record<string, number>,
    };

    transactions.forEach(transfer => {
      // Count by category
      stats.categories[transfer.category] = (stats.categories[transfer.category] || 0) + 1;

      // Count by asset
      stats.assets[transfer.asset] = (stats.assets[transfer.asset] || 0) + 1;

      // Sum total value (for native assets only)
      if (transfer.asset === 'ETH') {
        stats.totalValue += transfer.value;
      }
    });

    return stats;
  }, [transactions]);
};
