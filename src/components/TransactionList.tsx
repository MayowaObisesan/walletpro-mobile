import React, { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useFlatTransactionList } from '@src/hooks/useTransactionHistory';
// import { TransactionItem, TransactionItemSkeleton, TransactionEmptyState } from './TransactionItem';
import { Text } from '@src/components/ui/text';
import { Alert, AlertDescription, AlertTitle } from '@src/components/ui/alert';
import { Button } from '@src/components/ui/button';
import { Icon } from '@src/components/ui/icon';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import type { AlchemyTransfer, UseTransactionHistoryParams } from '@src/types/account';
import {TransactionEmptyState, TransactionItem, TransactionItemSkeleton} from "@src/components/TransactionItem";

interface TransactionListProps {
  filters?: Partial<UseTransactionHistoryParams>;
  onTransactionPress: (transaction: AlchemyTransfer) => void;
  onClearFilters?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  filters = {},
  onTransactionPress,
  onClearFilters,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const {
    transactions,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useFlatTransactionList(filters);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: AlchemyTransfer }) => (
    <TransactionItem
      transaction={item}
      onPress={onTransactionPress}
    />
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4">
          <TransactionItemSkeleton />
          <TransactionItemSkeleton />
        </View>
      );
    }

    if (!hasNextPage && transactions.length > 0) {
      return (
        <View className="py-4 items-center">
          <Text className="text-sm text-muted-foreground">
            No more transactions to load
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderEmptyState = () => {
    const hasFilters = !!(filters.categories?.length || filters.searchQuery?.trim());

    return (
      <TransactionEmptyState
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
      />
    );
  };

  const renderError = () => {
    return (
      <View className="flex-1 justify-center p-6">
        <Alert icon={AlertCircle} variant="destructive">
          <AlertTitle>Error Loading Transactions</AlertTitle>
          <AlertDescription>
            {error?.message || 'Failed to load transaction history. Please try again.'}
          </AlertDescription>
        </Alert>

        <View className="mt-4 gap-2">
          <Button
            onPress={handleRefresh}
            disabled={isLoading}
            className="w-full"
          >
            <Icon as={RefreshCw} size={16} className="mr-2" />
            <Text>Try Again</Text>
          </Button>
        </View>
      </View>
    );
  };

  if (isError) {
    return renderError();
  }

  return (
    <FlatList<AlchemyTransfer>
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item?.uniqueId}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={isLoading ? renderLoadingSkeletons : renderEmptyState}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 20,
        ...(transactions.length === 0 && !isLoading && { flex: 1 })
      }}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
    />
  );
};

// Loading skeleton component for initial load
const renderLoadingSkeletons = () => (
  <View className="py-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <TransactionItemSkeleton key={index} />
    ))}
  </View>
);

export default TransactionList;
