import { Pressable } from 'react-native';
import { View } from 'react-native';
import { Card, CardContent } from '@src/components/ui/card';
import { Text } from '@src/components/ui/text';
import { Badge } from '@src/components/ui/badge';
import { Icon } from '@src/components/ui/icon';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react-native';
import type { AlchemyTransfer } from '@src/types/account';
import { useMemo } from 'react';
import { formatAddress, formatValue } from '@src/utils/helper';
import { useUser } from '@account-kit/react-native';

interface TransactionItemProps {
  transaction: AlchemyTransfer;
  onPress: (transaction: AlchemyTransfer) => void;
}

const getCategoryVariant = (category: string) => {
  switch (category) {
    case 'external':
      return 'default';
    case 'internal':
      return 'secondary';
    case 'erc20':
      return 'outline';
    case 'erc721':
      return 'destructive';
    case 'erc1155':
      return 'secondary';
    default:
      return 'default';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'external':
      return 'text-blue-600';
    case 'internal':
      return 'text-purple-600';
    case 'erc20':
      return 'text-green-600';
    case 'erc721':
      return 'text-orange-600';
    case 'erc1155':
      return 'text-pink-600';
    default:
      return 'text-gray-600';
  }
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress
}) => {
  const user = useUser();

  if (!transaction) return null;

  const isSent = useMemo(() => {
    return transaction?.from.toLowerCase() === user?.address?.toLowerCase();
  }, [transaction?.from, user?.address]);

  const formattedValue = useMemo(() => {
    if (transaction.value === 0) return '0';

    // Handle different decimal places based on value
    if (transaction.value < 0.001) {
      return `< 0.001 ${transaction.asset}`;
    } else if (transaction.value < 1) {
      return `${transaction.value.toFixed(6)} ${transaction.asset}`;
    } else {
      return `${transaction.value.toFixed(4)} ${transaction.asset}`;
    }
  }, [transaction.value, transaction.asset]);

  const formattedTime = useMemo(() => {
    // For now, show block number as a simple identifier
    // In a real implementation, you'd convert block number to timestamp
    const blockNum = parseInt(transaction.blockNum, 16);
    return `Block ${blockNum.toLocaleString()}`;
  }, [transaction.blockNum]);

  const handlePress = () => {
    onPress(transaction);
  };

  return (
    <Pressable onPress={handlePress} className="active:opacity-70">
      <Card className="mb-3">
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between">
            {/* Left side: Icon and transaction info */}
            <View className="flex-1 flex-row items-center gap-3">
              {/* Transaction direction icon */}
              <View className={`w-10 h-10 rounded-full items-center justify-center ${
                isSent ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <Icon
                  as={isSent ? ArrowUpRight : ArrowDownLeft}
                  size={20}
                  className={isSent ? 'text-red-600' : 'text-green-600'}
                />
              </View>

              {/* Transaction details */}
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="font-medium text-foreground">
                    {isSent ? 'Sent' : 'Received'}
                  </Text>
                  <Badge variant={getCategoryVariant(transaction.category)}>
                    <Text className="text-xs">{transaction.asset}</Text>
                  </Badge>
                </View>

                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-muted-foreground">
                    {isSent ? 'To: ' : 'From: '}
                    {formatAddress(isSent ? transaction.to : transaction.from)}
                  </Text>
                </View>

                <Text className="text-xs text-muted-foreground mt-1">
                  {formattedTime}
                </Text>
              </View>
            </View>

            {/* Right side: Amount and category */}
            <View className="items-end gap-2">
              <Text className={`font-semibold ${
                isSent ? 'text-red-600' : 'text-green-600'
              }`}>
                {isSent ? '-' : '+'}{formattedValue}
              </Text>

              <Text className={`text-xs ${getCategoryColor(transaction.category)}`}>
                {transaction.category.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Additional details for special transactions */}
          {(transaction.category === 'erc721' || transaction.category === 'erc1155') && (
            <View className="mt-3 pt-3 border-t border-border">
              <Text className="text-sm text-muted-foreground">
                {transaction.category === 'erc721' ? 'NFT Transfer' : 'NFT Batch Transfer'}
                {transaction.tokenId && ` - Token ID: ${transaction.tokenId}`}
              </Text>
            </View>
          )}
        </CardContent>
      </Card>
    </Pressable>
  );
};

// Transaction item for skeleton loading state
export const TransactionItemSkeleton: React.FC = () => {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            <View className="flex-1">
              <View className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
              <View className="h-3 w-32 bg-muted rounded animate-pulse" />
              <View className="h-3 w-20 bg-muted rounded animate-pulse mt-1" />
            </View>
          </View>
          <View className="items-end gap-2">
            <View className="h-4 w-16 bg-muted rounded animate-pulse" />
            <View className="h-3 w-12 bg-muted rounded animate-pulse" />
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

// Empty state component
export const TransactionEmptyState: React.FC<{
  hasFilters?: boolean;
  onClearFilters?: () => void;
}> = ({ hasFilters = false, onClearFilters }) => {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <View className="items-center gap-4">
        <View className="w-16 h-16 rounded-full bg-muted items-center justify-center">
          <Icon as={ExternalLink} size={24} className="text-muted-foreground" />
        </View>

        <View className="items-center gap-2">
          <Text className="text-lg font-semibold text-foreground">
            {hasFilters ? 'No transactions found' : 'No transactions yet'}
          </Text>

          <Text className="text-sm text-muted-foreground text-center">
            {hasFilters
              ? 'Try adjusting your filters or search query'
              : 'Your transaction history will appear here once you make your first transaction'
            }
          </Text>
        </View>

        {hasFilters && onClearFilters && (
          <Pressable
            onPress={onClearFilters}
            className="mt-4 px-4 py-2 bg-primary rounded-md active:opacity-70"
          >
            <Text className="text-primary-foreground text-sm font-medium">
              Clear filters
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
