import React, { useMemo } from 'react';
import { View, ScrollView, Share, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAccountTokens } from '@src/hooks/useAccountTokens';
import { PageContainer, PageHeader, PageBody } from '@src/components/PageSection';
import { Text } from '@src/components/ui/text';
import { Avatar, AvatarFallback } from '@src/components/ui/avatar';
import { Button } from '@src/components/ui/button';
import { Card, CardContent } from '@src/components/ui/card';
import { CopyToClipboard } from '@src/components/CopyToClipboard';
import { 
  formatTokenBalance, 
  formatUsdValue, 
  getTokenColor, 
  formatTokenAddress,
  isValidTokenAddress 
} from '@src/utils/token';
import { 
  Send, 
  Download, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Share as ShareIcon,
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';
import { VStack, HStack, Divider } from '@src/components/ui/layout';
import { Badge } from '@src/components/ui/badge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TokenBalance } from '@src/types/account';

export default function TokenDetailScreen() {
  const { address } = useLocalSearchParams<{ address: string }>();
  const { bottom } = useSafeAreaInsets();
  const { data: tokens = [], refetch } = useAccountTokens();
  
  const token = useMemo(() => {
    if (!address) return null;
    return tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
  }, [tokens, address]);

  if (!address || !isValidTokenAddress(address)) {
    return (
      <PageContainer>
        <PageBody>
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-center text-muted-foreground">
              Invalid token address
            </Text>
          </View>
        </PageBody>
      </PageContainer>
    );
  }

  if (!token) {
    return (
      <PageContainer>
        <PageBody>
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-center text-muted-foreground">
              Token not found in your wallet
            </Text>
            <Button 
              variant="outline" 
              onPress={() => refetch()}
              className="mt-4"
            >
              <Text>Refresh</Text>
            </Button>
          </View>
        </PageBody>
      </PageContainer>
    );
  }

  const formattedBalance = formatTokenBalance(token.balance, token.decimals);
  const balanceNumber = parseFloat(token.balance) / Math.pow(10, token.decimals);
  const hasBalance = balanceNumber > 0;
  const hasPrice = token.usdPrice !== undefined;

  const handleSend = () => {
    router.push(`/send?token=${address}&symbol=${token.symbol}`);
  };

  const handleReceive = () => {
    router.push(`/receive?token=${address}`);
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: `${token.symbol} Token`,
        message: `Check out this ${token.name} token: ${token.address}`,
        url: `https://etherscan.io/token/${address}`
      };
      
      await Share.share(shareData);
    } catch (error) {
      console.error('Error sharing token:', error);
      Alert.alert('Error', 'Could not share token information');
    }
  };

  const handleViewOnExplorer = () => {
    // Open in block explorer based on current chain
    const explorerUrl = `https://etherscan.io/token/${address}`;
    router.push(`/webview?url=${encodeURIComponent(explorerUrl)}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <Text className="text-2xl font-bold">{token.symbol}</Text>
      </PageHeader>
      
      <PageBody>
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: bottom + 20 }}
        >
          <VStack space={4}>
            {/* Token Header Card */}
            <Card className="m-4">
              <CardContent className="p-6">
                <HStack className="items-center">
                  {/* Token Avatar */}
                  {token.logo ? (
                    <Avatar 
                      source={{ uri: token.logo }}
                      className="w-20 h-20 mr-4"
                    />
                  ) : (
                    <AvatarFallback 
                      className="w-20 h-20 mr-4"
                      style={{ backgroundColor: getTokenColor(token.symbol) }}
                    >
                      <Text className="text-2xl font-bold text-white">
                        {token.symbol?.slice(0, 2)?.toUpperCase() || '??'}
                      </Text>
                    </AvatarFallback>
                  )}
                  
                  {/* Token Info */}
                  <View className="flex-1">
                    <VStack space={1}>
                      <Text className="text-2xl font-bold">{token.name}</Text>
                      <Text className="text-lg text-muted-foreground">{token.symbol}</Text>
                      
                      {/* Balance */}
                      <View className="mt-4">
                        <Text className="text-3xl font-bold">
                          {formattedBalance}
                        </Text>
                        {token.usdValue !== undefined && (
                          <Text className="text-xl text-muted-foreground">
                            {formatUsdValue(token.usdValue)}
                          </Text>
                        )}
                      </View>
                    </VStack>
                  </View>
                </HStack>
              </CardContent>
            </Card>

            {/* Contract Information */}
            <Card className="mx-4">
              <CardContent className="p-4">
                <VStack space={3}>
                  <Text className="font-semibold text-lg">Contract Information</Text>
                  
                  <VStack space={2}>
                    <View>
                      <Text className="text-sm text-muted-foreground">Contract Address</Text>
                      <HStack className="items-center justify-between">
                        <Text className="font-mono text-sm">{formatTokenAddress(token.address)}</Text>
                        <CopyToClipboard text={token.address}>
                          <Text className="text-xs text-primary">Copy</Text>
                        </CopyToClipboard>
                      </HStack>
                    </View>
                    
                    <View>
                      <Text className="text-sm text-muted-foreground">Decimals</Text>
                      <Text className="font-mono text-sm">{token.decimals}</Text>
                    </View>
                    
                    {hasPrice && (
                      <View>
                        <Text className="text-sm text-muted-foreground">Current Price</Text>
                        <HStack className="items-center">
                          <Text className="font-semibold">
                            ${token.usdPrice?.toFixed(6)}
                          </Text>
                          <View className="ml-2">
                            <Badge variant="secondary">
                              <Text className="text-xs">USD</Text>
                            </Badge>
                          </View>
                        </HStack>
                      </View>
                    )}
                  </VStack>
                </VStack>
              </CardContent>
            </Card>

            {/* Actions */}
            <View className="mx-4">
              <VStack space={3}>
                <HStack className="gap-3">
                  <Button 
                    className="flex-1"
                    onPress={handleSend}
                    disabled={!hasBalance}
                  >
                    <Send size={20} className="mr-2" />
                    <Text>Send</Text>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onPress={handleReceive}
                  >
                    <Download size={20} className="mr-2" />
                    <Text>Receive</Text>
                  </Button>
                </HStack>
                
                <Button 
                  variant="outline" 
                  onPress={handleViewOnExplorer}
                  className="w-full"
                >
                  <ExternalLink size={20} className="mr-2" />
                  <Text>View on Etherscan</Text>
                  <ChevronRight size={16} className="ml-auto" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  onPress={handleShare}
                  className="w-full"
                >
                  <ShareIcon size={20} className="mr-2" />
                  <Text>Share Token</Text>
                </Button>
              </VStack>
            </View>
          </VStack>
        </ScrollView>
      </PageBody>
    </PageContainer>
  );
}
