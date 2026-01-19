import React from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { TokenCard } from '@src/components/TokenCard';
import { Empty } from '@src/components/Empty';
import { Text } from '@src/components/ui/text';
import { ActivityIndicator } from 'react-native';
import { Coins } from 'lucide-react-native';
import type { TokenBalance } from '@src/types/account';

interface TokenListProps {
  tokens: TokenBalance[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onTokenPress?: (token: TokenBalance) => void;
  onRefresh?: () => void;
  showAddresses?: boolean;
  variant?: 'default' | 'compact';
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  contentContainerStyle?: any;
}

export const TokenList: React.FC<TokenListProps> = ({
  tokens,
  isLoading = false,
  isRefreshing = false,
  onTokenPress,
  onRefresh,
  showAddresses = false,
  variant = 'default',
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle
}) => {
  // Loading state
  if (isLoading && tokens.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <ActivityIndicator size="large" className="mb-4" />
        <Text className="text-center text-muted-foreground">
          Loading tokens...
        </Text>
      </View>
    );
  }

  // Empty state
  if (tokens.length === 0 && !isLoading) {
    return (
      <Empty 
        title="No tokens found"
        description="You don't have any tokens in this wallet yet"
        icon={Coins}
      />
    );
  }

  // Token list with search results count
  const ListHeader = () => {
    if (ListHeaderComponent) {
      return ListHeaderComponent;
    }

    return (
      <View className="px-4 py-2 border-b border-border">
        <Text className="text-sm text-muted-foreground">
          {tokens.length} {tokens.length === 1 ? 'token' : 'tokens'} found
        </Text>
      </View>
    );
  };

  // Render individual token
  const renderItem = ({ item }: { item: TokenBalance }) => (
    <TokenCard 
      token={item} 
      onPress={() => onTokenPress?.(item)}
      showAddress={showAddresses}
      variant={variant}
    />
  );

  // Separator between items
  const ItemSeparator = () => (
    <View className="h-2" />
  );

  return (
    <FlatList
      data={tokens}
      keyExtractor={(item) => item.address}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooterComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#6b7280"
          />
        ) : undefined
      }
      contentContainerStyle={[
        { padding: 16 },
        contentContainerStyle
      ]}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
    />
  );
};

// Skeleton loader for tokens
export const TokenListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View className="flex-1 p-4 space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="flex-row items-center p-4 bg-card rounded-lg">
          <View className="w-10 h-10 bg-muted rounded-full mr-3" />
          <View className="flex-1">
            <View className="h-5 bg-muted rounded w-20 mb-2" />
            <View className="h-4 bg-muted rounded w-32 mb-2" />
          </View>
          <View className="items-end">
            <View className="h-5 bg-muted rounded w-16 mb-1" />
            <View className="h-4 bg-muted rounded w-12" />
          </View>
        </View>
      ))}
    </View>
  );
};
