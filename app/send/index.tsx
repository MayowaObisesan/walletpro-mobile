import {useState} from "react";
import {View} from "react-native";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Alert, AlertTitle} from "@src/components/ui/alert";
import {ArrowRight, Info, Terminal} from "lucide-react-native";
import {Button} from "@src/components/ui/button";
import {Text} from "@src/components/ui/text";
import {Ionicons} from "@expo/vector-icons";
import {useChain, useUser} from "@account-kit/react-native";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@src/components/ui/select";
import { shortenAddress } from "@/src/utils";
import {Input} from "@src/components/ui/input";
import { AccountBalance } from "../accounts";
import {router} from "expo-router";
import {useUIStore} from "@src/store/ui-store";
import {WalletAccount} from "@src/types/account";
import {client} from "@src/utils/client";

export default function SendScreen() {
  const user = useUser()
  const {chain} = useChain();
  const [fromAccountId, setFromAccountId] = useState<string>("")
  const [recipientAddress, setRecipientAddress] = useState<string>("")
  const account = user;

  // Filter out the from account from available accounts for selection
  const availableToAccounts = [account].filter(acc => acc?.address !== fromAccountId)
  const fromAccount = [account].find(acc => acc?.address === fromAccountId)

  const canProceedWithAddress = fromAccountId && recipientAddress.trim() && recipientAddress.startsWith('0x') && recipientAddress.length === 42
  const canProceed = fromAccountId && (canProceedWithAddress || availableToAccounts.length > 0)

  const handleContinueWithAddress = () => {
    if (!fromAccount || !recipientAddress.trim()) return

    router.push(`/send/details?fromAccount=${fromAccount}&recipientAddres=${recipientAddress.trim()}`)
  }

  const handleContinueWithAccount = (toAccount: WalletAccount) => {
    if (!fromAccount) return

    router.push(`/send/details?fromAccount=${fromAccount}&toAccount=${toAccount}`)
    // router.push(`/contact-details/${contact.id}?threadId=${thread.id}&tab=chat`);
  }

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Send Transactions</PageHeading>
      </PageHeader>
      <PageBody>
        <View className={'gap-2 p-2'}>
          <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>
            <View className={'flex flex-row items-center'}>
              <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>You are on {chain?.name} {chain?.testnet ? "testnet" : "mainnet"}</AlertTitle>
            </View>
          </Alert>
          <View className={'gap-8'}>
            {/* From Account */}
            <View className={'relative gap-1'}>
              <Text className={'font-bold px-2'}>From</Text>
              <Select value={{ label: fromAccountId, value: account?.address!}}>
                <SelectTrigger className="h-20 w-full rounded-2xl px-5 dark:bg-secondary">
                  {/*<SelectValue placeholder="Select account to send from" />*/}
                  <View className={''}>
                    <Text className={'font-medium text-muted-foreground'}>Account 1</Text>
                    <Text className={'font-medium text-lg'}>{shortenAddress(account?.address!)}</Text>
                  </View>
                </SelectTrigger>
                <SelectContent className={'bg-card mt-1'} position={'item-aligned'}>
                  {[account].map((eachAccount) => (
                    <SelectItem
                      className="h-20 w-full"
                      key={eachAccount?.address}
                      label={eachAccount?.address!}
                      value={eachAccount?.address!}
                      onPress={() => setFromAccountId(account?.address!)}
                    >
                      <View className={''}>
                        <Text className={'font-medium text-muted-foreground'}>Account 1</Text>
                        <Text className={'font-medium text-lg'}>{shortenAddress(account?.address!)}</Text>
                      </View>
                      {/*<View className="h-20 flex-1 items-center justify-between">*/}
                      {/*</View>*/}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fromAccount && (
                <View className="absolute top-0 right-0 px-3 rounded-lg">
                  <View className="flex justify-between items-center">
                    {/*<span className="text-sm font-medium">Balance:</span>*/}
                    <Text className={'font-bold text-green-600'}>
                      <AccountBalance address={fromAccount.address} />
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Manual Address Input */}
            <View className={'w-full mx-auto gap-1'}>
              <Text className={'font-bold px-2'}>To</Text>
              {/*<TextField.Root
                variant={"soft"}
                size={"3"}
                placeholder="Recipient Address or ENS..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                style={{ width: "100%" }}
              />*/}
              <Input
                id="recipient"
                placeholder="Recipient Address or ENS..."
                value={recipientAddress}
                onChangeText={(value) => setRecipientAddress(value)}
                className="h-16 w-full px-5 rounded-2xl text-xl leading-tight"
              />
              <Text className="px-2 text-muted-foreground/60">
                Paste an Ethereum address to send to.
              </Text>

              {canProceedWithAddress && (
                <Button
                  onPress={handleContinueWithAddress}
                  className="mx-auto mt-6"
                  size="default"
                  variant={'secondary'}
                >
                  <Text className={'text-lg leading-tight'}>
                    Continue with Address
                  </Text>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </View>

            {/*{recipientAddress.length < 1 && <Flex direction={"column"} width={'100%'} gap={'5'}>
                <Separator size="4"/>
                <Flex direction={"column"} gap={'2'}>
                    <Heading size={"3"}>Or from your Accounts</Heading>
                    <AccountList
                        accounts={availableToAccounts}
                        onAccountSelect={handleContinueWithAccount}
                    />
                </Flex>
            </Flex>}*/}
          </View>
        </View>
      </PageBody>
    </PageContainer>
  )
}
