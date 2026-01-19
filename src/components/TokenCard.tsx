import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from '@src/components/ui/text';
import { Card, CardContent } from '@src/components/ui/card';
import { Avatar, AvatarFallback } from '@src/components/ui/avatar';
import { formatTokenBalance, formatUsdValue, getTokenColor, formatTokenAddress } from '@src/utils/token';
import { CopyToClipboard } from '@src/components/CopyToClipboard';
import type { TokenBalance } from '@src/types/account';

interface TokenCardProps {
  token: TokenBalance;
  onPress?: () => void;
  showAddress?: boolean;
  variant?: 'default' | 'compact';
}

export const TokenCard: React.FC<TokenCardProps> = ({ 
  token, 
  onPress, 
  showAddress = false,
  variant = 'default' 
}) => {
  const isCompact = variant === 'compact';
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const TokenAvatar = () => (
    <View className="relative">
      {token.logo ? (
        <Avatar 
          source={{ uri: token.logo }}
          className={`w-10 h-10 ${isCompact ? 'w-8 h-8' : ''}`}
        />
      ) : (
        <AvatarFallback 
          className={`w-10 h-10 ${isCompact ? 'w-8 h-8' : ''}`}
          style={{ backgroundColor: getTokenColor(token.symbol) }}
        >
          <Text className={`font-semibold text-white ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {token.symbol?.slice(0, 2)?.toUpperCase() || '??'}
          </Text>
        </AvatarFallback>
      )}
    </View>
  );

  const TokenInfo = () => (
    <View className="flex-1 min-w-0">
      <View className="flex-row items-center gap-2">
        <Text 
          className={`font-semibold ${isCompact ? 'text-sm' : 'text-lg'} text-foreground`}
          numberOfLines={1}
        >
          {token.symbol}
        </Text>
        {showAddress && (
          <CopyToClipboard 
            text={token.address}
            className="ml-auto"
          >
            <Text className="text-xs text-muted-foreground">
              {formatTokenAddress(token.address)}
            </Text>
          </CopyToClipboard>
        )}
      </View>
      {!isCompact && (
        <Text 
          className="text-sm text-muted-foreground" 
          numberOfLines={1}
        >
          {token.name}
        </Text>
      )}
    </View>
  );

  const TokenValues = () => (
    <View className="items-end min-w-0">
      <Text 
        className={`font-mono font-semibold ${isCompact ? 'text-sm' : 'text-lg'} text-foreground text-right`}
        numberOfLines={1}
      >
        {formatTokenBalance(token.balance, token.decimals)}
      </Text>
      {token.usdValue !== undefined && (
        <Text 
          className={`text-muted-foreground text-right ${isCompact ? 'text-xs' : 'text-sm'}`}
          numberOfLines={1}
        >
          {formatUsdValue(token.usdValue)}
        </Text>
      )}
    </View>
  );

  return (
    <Pressable onPress={handlePress} disabled={!onPress}>
      <Card className={`bg-card border-border ${onPress ? 'active:scale-[0.98]' : ''}`}>
        <CardContent className={`flex-row items-center ${isCompact ? 'p-3' : 'p-4'}`}>
          <TokenAvatar />
          <View className={`ml-3 flex-1 flex-row items-center`}>
            <TokenInfo />
            <TokenValues />
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
};
