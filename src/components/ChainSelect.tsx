import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select';
import type { TriggerRef } from '@rn-primitives/select';
import * as React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {alchemyChains, defaultAlchemyChain} from "@src/config/chains";
import {Text} from "@src/components/ui/text";
import {useChain} from "@account-kit/react-native";
import {useState} from "react";
import type {Chain} from "viem";

export function ChainSelect() {
  const { chain, setChain } = useChain();
  const ref = React.useRef<TriggerRef>(null);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 12,
    right: 12,
  };

  // Workaround for rn-primitives/select not opening on mobile
  function onTouchStart() {
    ref.current?.open();
  }

  return (
    <Select value={{ label: chain.name, value: chain.name }}>
      <SelectTrigger className="w-[180px]" onTouchStart={onTouchStart}>
        <Text>
          {chain.name}
        </Text>
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="bg-secondary w-[180px] mt-1">
        <NativeSelectScrollView>
          <SelectGroup>
            <SelectLabel className={'uppercase'}>Mainnet</SelectLabel>
            {alchemyChains.map((chain) => (
              <SelectItem key={chain.id} label={chain.name} value={chain.name} onPress={() => setChain({chain})}>
                {chain.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </NativeSelectScrollView>
      </SelectContent>
    </Select>
  );
}
