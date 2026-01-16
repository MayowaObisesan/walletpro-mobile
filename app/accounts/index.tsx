import {ScrollView, View} from "react-native";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Button} from "@src/components/ui/button";
import {Text} from "@src/components/ui/text";
import {Ionicons} from "@expo/vector-icons";
import {Alert, AlertTitle} from "@src/components/ui/alert";
import {Info, Terminal} from 'lucide-react-native';
import {useChain, useUser} from "@account-kit/react-native";
import {Card, CardContent, CardDescription, CardTitle} from "@/src/components/ui/card";
import {useAccountBalanceWithUsd} from "@src/hooks/useAccountBalanceWithUsd";
import {Address, formatEther} from "viem";
import {Skeleton} from "@src/components/ui/skeleton";
import {shortenAddress} from "@src/utils";
import { Badge } from "@/src/components/ui/badge";
import {router} from "expo-router";

export function AccountBalance({ address}: { address?: Address }) {
  const { chain } = useChain();
  const { balance, usdValue, isLoading, error, refetch } = useAccountBalanceWithUsd(address);

  if (isLoading && !balance) {
    return (
      <Skeleton className="h-4 w-[80px]" />
    )
  }

  return (
    <Text className={'font-bold text-muted-foreground text-xl'}>
      {formatEther(balance as bigint, 'wei')} {chain.nativeCurrency.symbol}
    </Text>
  )
}

export default function AccountScreen() {
  const user = useUser();
  const { chain } = useChain();

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Your Accounts</PageHeading>
      </PageHeader>
      <PageBody>
        <View className={'gap-2 p-2'}>
          <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>
            <View className={'flex flex-row items-center'}>
              <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>Only Mainnet supported</AlertTitle>
              <Button
                className={'bg-green-600/20'}
                variant={'secondary'}
                onPress={() => router.push('/about')}
              >
                <Text className={"text-base text-[#3DD68C]"}>Learn More</Text>
              </Button>
            </View>
          </Alert>

          <Card className="w-full p-2 border-hairline border-muted-foreground/20">
            <CardContent className={'flex flex-row items-center justify-between gap-2 px-2 py-2 rounded-2xl'}>
              <View>
                <View className="">
                  <View className={'flex flex-row items-center gap-2'}>
                    <CardTitle className={'text-lg'}>
                      Account {"1"}
                    </CardTitle>
                    <Badge className={'bg-green-600'}>
                      <Text className={'font-semibold text-base text-foreground h-5 leading-tight'}>Active</Text>
                    </Badge>
                  </View>
                  <CardDescription>
                    <View className={'flex-row items-center gap-3'}>
                      <Text className={'font-bold text-muted-foreground text-xl gap-2'}>{shortenAddress(user?.address!)}</Text>
                      <Text className={'text-muted-foreground'}>
                        <Ionicons name={'copy-outline'} size={18} />
                      </Text>
                    </View>
                  </CardDescription>
                </View>
              </View>
              <View className="justify-center gap-4">
                <AccountBalance />
              </View>
            </CardContent>
          </Card>
        </View>
      </PageBody>
      <View className={'flex flex-row items-center gap-x-4 p-4'}>
        <Button className={'flex-1'}>
          <Text className={'font-medium'}>Add New Address</Text>
        </Button>
        <Button className={'bg-secondary'} variant={'secondary'}>
          <Text>
            <Ionicons name={'download'} size={16} />
          </Text>
          <Text>
            Import Wallet
          </Text>
        </Button>
      </View>
    </PageContainer>
  )
}
