import React, { useState, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Input } from '@src/components/ui/input';
import { Text } from '@src/components/ui/text';
import { Badge } from '@src/components/ui/badge';
import { Button } from '@src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@src/components/ui/dropdown-menu';
import { Icon } from '@src/components/ui/icon';
import { Search, Filter, X } from 'lucide-react-native';
import type { TransactionCategory, I_TransactionFilters } from '@src/types/account';
import {ALL_CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS} from "@src/config/constants";

interface TransactionFiltersProps {
  filters: I_TransactionFilters;
  onFiltersChange: (filters: I_TransactionFilters) => void;
  className?: string;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
  className = '',
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery || '');

  const handleSearchChange = (text: string) => {
    setLocalSearchQuery(text);

    // Debounce search update
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, searchQuery: text });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const toggleCategory = (category: TransactionCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    onFiltersChange({ ...filters, categories: newCategories });
  };

  const clearAllFilters = () => {
    setLocalSearchQuery('');
    onFiltersChange({ categories: [], searchQuery: '' });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.categories.length > 0 || filters.searchQuery.trim().length > 0;
  }, [filters.categories, filters.searchQuery]);

  const activeCategoriesCount = filters.categories.length;

  return (
    <View className={`p-4 ${className}`}>
      {/* Search Input */}
      <View className="mb-4">
        <View className="relative flex-row items-center justify-between gap-2">
          <Icon
            as={Search}
            size={16}
            className="absolute left-5 text-muted-foreground"
          />
          <Input
            placeholder="Search by hash, address, or amount..."
            value={localSearchQuery}
            onChangeText={handleSearchChange}
            className="px-4 pl-12 h-14 rounded-2xl flex-1"
            clearButtonMode="while-editing"
          />

          {/* Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={"items-center justify-center w-12 h-12 bg-card border-hairline border-muted-foreground/20 rounded-xl"}>
              {/*<Button variant="ghost" size="sm">*/}
              <Icon as={Filter} size={16} />
              {/*</Button>*/}
            </DropdownMenuTrigger>
            <DropdownMenuContent className={'bg-secondary border-hairline border-muted-foreground/20 mt-1'}>
              <DropdownMenuItem onPress={() => onFiltersChange({
                ...filters,
                categories: ALL_CATEGORIES
              })}>
                <Text>Select All</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={() => onFiltersChange({
                ...filters,
                categories: []
              })}>
                <Text>Deselect All</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={() => onFiltersChange({
                ...filters,
                categories: ['external', 'internal']
              })}>
                <Text>Native Only</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={() => onFiltersChange({
                ...filters,
                categories: ['erc20', 'erc721', 'erc1155']
              })}>
                <Text>Tokens Only</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </View>
      </View>

      {/* Category Filters */}
      <View className="mb-4">
        <View className="hidden flex-row items-center justify-between mb-2">
          <Text className="text-sm font-medium text-foreground">
            Categories
            {activeCategoriesCount > 0 && (
              <Text className="text-muted-foreground"> ({activeCategoriesCount})</Text>
            )}
          </Text>
        </View>

        {/* Category Pills */}
        <View className="flex-row flex-wrap gap-2">
          {ALL_CATEGORIES.map((category) => {
            const isActive = filters.categories.includes(category);

            return (
              <Pressable
                key={category}
                onPress={() => toggleCategory(category)}
                className="cursor-pointer"
              >
                <Badge
                  variant={isActive ? 'default' : 'secondary'}
                  className={`${
                    isActive 
                      ? CATEGORY_COLORS[category] 
                      : 'border-border'
                  }`}
                >
                  <Text className={`text-sm ${
                    isActive ? 'text-primary-foreground' : 'text-foreground'
                  }`}>
                    {CATEGORY_LABELS[category]}
                  </Text>
                </Badge>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-muted-foreground">
            {activeCategoriesCount} categor{activeCategoriesCount !== 1 ? 'ies' : 'y'} selected
            {filters.searchQuery.trim() && ' • Search active'}
          </Text>

          <Button
            variant="outline"
            size="sm"
            onPress={clearAllFilters}
          >
            <Icon as={X} size={14} className="mr-1" />
            <Text className="text-xs">Clear All</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default TransactionFilters;
