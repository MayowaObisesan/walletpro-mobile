import { useEffect, useState } from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PageBody, PageContainer, PageHeader, PageHeading } from '@src/components/PageSection';
import { Text } from '@src/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';
import { Badge } from '@src/components/ui/badge';
import { Button } from '@src/components/ui/button';
import { Alert, AlertDescription } from '@src/components/ui/alert';
import { Icon } from '@src/components/ui/icon';
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
  Clock, AlertCircle
} from 'lucide-react-native';
import { useChain } from '@account-kit/react-native';
import { formatAddress, formatTxHash, formatValue, getBlockExplorerTxUrl, getBlockExplorerAddressUrl } from '@src/utils/helper';
import CopyToClipboard from '@src/components/CopyToClipboard';
import type { AlchemyTransfer } from '@src/types/account';

// Mock transaction data - in a real app, you'd fetch this based on the ID
const getMockTransaction = (id: string): AlchemyTransfer => {
  // This is a mock implementation - replace with actual data fetching
  return {
    blockNum: "0xb0eadc",
    uniqueId: `${id}:external`,
    hash: id,
    from: "0xef4396d9ff8107086d215a1c9f8866c54795d7c7",
    to: "0x5c43b1ed97e52d009611d89b74fa829fe4ac56b1",
    value: 0.5,
    erc721TokenId: null,
    erc1155Metadata: null,
    tokenId: null,
    asset: "ETH",
    category: "external",
    rawContract: {
      value: "0x6f05b59d3b20000",
      address: null,
      decimal: "0x12"
    }
  };
};

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

const getStatusIcon = (category: string) => {
  switch (category) {
    case 'external':
    case 'internal':
    case 'erc20':
      return CheckCircle;
    case 'erc721':
    case 'erc1155':
      return Clock;
    default:
      return CheckCircle;
  }
};

const getStatusColor = (category: string) => {
  switch (category) {
    case 'external':
    case 'internal':
    case 'erc20':
      return 'text-green-600';
    case 'erc721':
    case 'erc1155':
      return 'text-orange-600';
    default:
      return 'text-green-600';
  }
};

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { chain } = useChain();
  const [transaction, setTransaction] = useState<AlchemyTransfer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // In a real implementation, fetch transaction details
      const mockData = getMockTransaction(id as string);
      setTransaction(mockData);
      setLoading(false);
    }
  }, [id]);

  const handleViewOnExplorer = () => {
    if (transaction?.hash) {
      const url = getBlockExplorerTxUrl(transaction.hash, chain.id);
      Linking.openURL(url);
    }
  };

  const handleCopyAddress = (address: string) => {
    // CopyToClipboard component will handle this
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader showBackButton>
          <PageHeading>Transaction Details</PageHeading>
        </PageHeader>
        <PageBody>
          <View className="flex-1 justify-center">
            <Text className="text-center text-muted-foreground">Loading...</Text>
          </View>
        </PageBody>
      </PageContainer>
    );
  }

  if (!transaction) {
    return (
      <PageContainer>
        <PageHeader showBackButton>
          <PageHeading>Transaction Details</PageHeading>
        </PageHeader>
        <PageBody>
          <Alert icon={AlertCircle}>
            <AlertDescription>
              Transaction not found. The transaction ID may be invalid or transaction may not be available on this network.
            </AlertDescription>
          </Alert>
        </PageBody>
      </PageContainer>
    );
  }

  const StatusIcon = getStatusIcon(transaction.category);
  const statusColor = getStatusColor(transaction.category);

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Transaction Details</PageHeading>
      </PageHeader>

      <PageBody>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Transaction Status */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <View className="flex-row items-center gap-3">
                <View className={`w-12 h-12 rounded-full items-center justify-center ${
                  transaction.category === 'external' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <Icon
                    as={StatusIcon}
                    size={24}
                    className={statusColor}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    {transaction.category === 'external' ? 'Transaction Successful' :
                     transaction.category === 'erc721' ? 'NFT Transfer' :
                     transaction.category === 'erc1155' ? 'NFT Batch Transfer' :
                     'Transaction Confirmed'}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Badge variant={getCategoryVariant(transaction.category)}>
                      <Text className="text-xs">{transaction.asset}</Text>
                    </Badge>
                    <Text className="text-sm text-muted-foreground">
                      {transaction.category.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Transaction Amount */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-2xl font-bold text-foreground">
                {formatValue(transaction.value)} {transaction.asset}
              </Text>
              {(transaction.category === 'erc721' || transaction.category === 'erc1155') && (
                <Text className="text-sm text-muted-foreground mt-2">
                  {transaction.category === 'erc721' ? 'NFT Transfer' : 'NFT Batch Transfer'}
                  {transaction.tokenId && ` • Token ID: ${transaction.tokenId}`}
                </Text>
              )}
            </CardContent>
          </Card>

          {/* Transaction Hash */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Transaction Hash</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex-row items-center gap-2">
                <Text className="flex-1 font-mono text-sm text-foreground">
                  {formatTxHash(transaction.hash)}
                </Text>
                <CopyToClipboard text={transaction.hash}>
                  <Button variant="outline" size="sm">
                    <Icon as={Copy} size={14} />
                  </Button>
                </CopyToClipboard>
              </View>
            </CardContent>
          </Card>

          {/* From/To Addresses */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-muted-foreground mb-2">From</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="flex-1 font-mono text-sm text-foreground">
                    {formatAddress(transaction.from)}
                  </Text>
                  <CopyToClipboard text={transaction.from}>
                    <Button variant="outline" size="sm">
                      <Icon as={Copy} size={14} />
                    </Button>
                  </CopyToClipboard>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => Linking.openURL(getBlockExplorerAddressUrl(transaction.from, chain.id))}
                  >
                    <Icon as={ExternalLink} size={14} />
                  </Button>
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-muted-foreground mb-2">To</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="flex-1 font-mono text-sm text-foreground">
                    {formatAddress(transaction.to)}
                  </Text>
                  <CopyToClipboard text={transaction.to}>
                    <Button variant="outline" size="sm">
                      <Icon as={Copy} size={14} />
                    </Button>
                  </CopyToClipboard>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => Linking.openURL(getBlockExplorerAddressUrl(transaction.to, chain.id))}
                  >
                    <Icon as={ExternalLink} size={14} />
                  </Button>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">Block Number</Text>
                <Text className="text-sm font-medium text-foreground">
                  {parseInt(transaction.blockNum, 16).toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">Network</Text>
                <Text className="text-sm font-medium text-foreground">{chain.name}</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">Raw Value</Text>
                <Text className="text-sm font-medium text-foreground font-mono">
                  {transaction.rawContract.value}
                </Text>
              </View>

              {transaction.rawContract.decimal && (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted-foreground">Decimals</Text>
                  <Text className="text-sm font-medium text-foreground">
                    {parseInt(transaction.rawContract.decimal, 16)}
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4">
              <Button
                onPress={handleViewOnExplorer}
                className="w-full"
              >
                <Icon as={ExternalLink} size={16} className="mr-2" />
                <Text>View on Block Explorer</Text>
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </PageBody>
    </PageContainer>
  );
}
