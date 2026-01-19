import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useAccountTokens } from '@src/hooks/useAccountTokens';
import { usePortfolioValue } from '@src/hooks/useAccountTokens';
import { TokenList } from '@src/components/TokenList';
import { PageContainer, PageHeader, PageBody } from '@src/components/PageSection';
import { Text } from '@src/components/ui/text';
import { Input } from '@src/components/ui/input';
import { Button } from '@src/components/ui/button';
import { Card, CardContent } from '@src/components/ui/card';
import { Search, Filter, TrendingUp, List } from 'lucide-react-native';
import { router } from 'expo-router';
import { filterTokensByQuery, sortTokensByBalance, sortTokensByName } from '@src/utils/token';
import { VStack, HStack } from '@src/components/ui/layout';
import type { TokenBalance } from '@src/types/account';

type SortOption = 'balance' | 'name' | 'recent';
type FilterOption = 'all' | 'with-balance' | 'zero-balance';

export default function TokensScreen() {
  const { data: tokens = [], isLoading, refetch } = useAccountTokens();
  const { totalValue, tokenCount, tokensWithValue } = usePortfolioValue();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('balance');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort tokens
  const processedTokens = useMemo(() => {
    let filtered = [...tokens];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filterTokensByQuery(filtered, searchQuery);
    }

    // Apply balance filter
    if (filterBy === 'with-balance') {
      filtered = filtered.filter(token => {
        const balance = parseFloat(token.balance) / Math.pow(10, token.decimals);
        return balance > 0;
      });
    } else if (filterBy === 'zero-balance') {
      filtered = filtered.filter(token => {
        const balance = parseFloat(token.balance) / Math.pow(10, token.decimals);
        return balance === 0;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'balance':
        return sortTokensByBalance(filtered);
      case 'name':
        return sortTokensByName(filtered);
      case 'recent':
        return filtered; // Would need timestamp data for this
      default:
        return sortTokensByBalance(filtered);
    }
  }, [tokens, searchQuery, filterBy, sortBy]);

  const handleTokenPress = (token: TokenBalance) => {
    router.push(`/tokens/${token.address}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterBy('all');
    setSortBy('balance');
  };

  const activeFiltersCount = [
    searchQuery.trim() !== '',
    filterBy !== 'all',
    sortBy !== 'balance'
  ].filter(Boolean).length;

  return (
    <PageContainer>
      <PageHeader>
        <Text className="text-2xl font-bold">Tokens</Text>
        <Text className="text-sm text-muted-foreground mt-1">
          {tokenCount} tokens • {tokensWithValue} with value
        </Text>
      </PageHeader>

      <PageBody>
        {/* Portfolio Summary Card */}
        <Card className="m-4 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <VStack space={2}>
              <Text className="text-sm text-muted-foreground">Total Portfolio Value</Text>
              <Text className="text-2xl font-bold">
                ${totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Text>
            </VStack>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <View className="px-4">
          <VStack space={3}>
            {/* Search Bar */}
            <View className="relative">
              <Search size={20} className="absolute left-3 top-3.5 text-muted-foreground" />
              <Input
                placeholder="Search tokens by name, symbol, or address..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="h-12 pl-10"
              />
            </View>

            {/* Filter Options */}
            <View className="flex-row gap-2">
              <Button
                variant={filterBy === 'all' ? 'default' : 'outline'}
                size="sm"
                onPress={() => setFilterBy('all')}
                className="flex-1"
              >
                <Text className="text-xs">All</Text>
              </Button>
              <Button
                variant={filterBy === 'with-balance' ? 'default' : 'outline'}
                size="sm"
                onPress={() => setFilterBy('with-balance')}
                className="flex-1"
              >
                <Text className="text-xs">With Balance</Text>
              </Button>
              <Button
                variant={filterBy === 'zero-balance' ? 'default' : 'outline'}
                size="sm"
                onPress={() => setFilterBy('zero-balance')}
                className="flex-1"
              >
                <Text className="text-xs">Zero Balance</Text>
              </Button>
            </View>

            {/* Sort Options */}
            <View className="flex-row gap-2">
              <Button
                variant={sortBy === 'balance' ? 'default' : 'outline'}
                size="sm"
                onPress={() => setSortBy('balance')}
                className="flex-1"
              >
                <TrendingUp size={14} className="mr-1" />
                <Text className="text-xs">Value</Text>
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onPress={() => setSortBy('name')}
                className="flex-1"
              >
                <List size={14} className="mr-1" />
                <Text className="text-xs">Name</Text>
              </Button>
            </View>

            {/* Active Filters Indicator */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onPress={clearFilters}
                className="self-start"
              >
                <Text className="text-xs text-primary">
                  Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
                </Text>
              </Button>
            )}
          </VStack>
        </View>

        {/* Token List */}
        <TokenList
          tokens={processedTokens}
          isLoading={isLoading}
          onTokenPress={handleTokenPress}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            processedTokens.length > 0 && (
              <View className="px-4 py-2">
                <Text className="text-sm text-muted-foreground">
                  Showing {processedTokens.length} {processedTokens.length === 1 ? 'token' : 'tokens'}
                  {searchQuery && ` matching "${searchQuery}"`}
                </Text>
              </View>
            )
          }
        />
      </PageBody>
    </PageContainer>
  );
}
