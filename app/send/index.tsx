import {useState} from "react";
import {View} from "react-native";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Alert, AlertTitle} from "@src/components/ui/alert";
import {ArrowRight, Info, Terminal} from "lucide-react-native";
import {Button} from "@src/components/ui/button";
import {Text} from "@src/components/ui/text";
import {Ionicons} from "@expo/vector-icons";
import {useChain} from "@account-kit/react-native";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@src/components/ui/select";
import { shortenAddress } from "@/src/utils";
import {Input} from "@src/components/ui/input";
import { AccountBalance } from "../accounts";
import {router} from "expo-router";
import {useUIStore} from "@src/store/ui-store";
import {WalletAccount} from "@src/types/account";

export default function SendScreen() {
  const {chain} = useChain();
  const [fromAccountId, setFromAccountId] = useState<string>("")
  const [recipientAddress, setRecipientAddress] = useState<string>("")

  // Filter out the from account from available accounts for selection
  const availableToAccounts = accounts.filter(acc => acc.id !== fromAccountId)
  const fromAccount = accounts.find(acc => acc.id === fromAccountId)

  const canProceedWithAddress = fromAccountId && recipientAddress.trim() && recipientAddress.startsWith('0x') && recipientAddress.length === 42
  const canProceed = fromAccountId && (canProceedWithAddress || availableToAccounts.length > 0)

  const handleContinueWithAddress = () => {
    if (!fromAccount || !recipientAddress.trim()) return

    router.push(`/send/details?fromAccount=${fromAccount}&recipientAddres=${recipientAddress.trim()}`)
  }

  const handleContinueWithAccount = (toAccount: WalletAccount) => {
    if (!fromAccount) return

    router.push(`/send/details?fromAccount=${fromAccount}&toAccount=${toAccount}`)
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
          <View>
            {/* From Account */}
            <View className={'relative'}>
              <Text className={'font-bold'}>From</Text>
              <Select value={{ label: fromAccountId, value: fromAccountId}} onValueChange={setFromAccountId}>
                <SelectTrigger className="h-14 w-full">
                  {/*<SelectValue placeholder="Select account to send from" />*/}
                </SelectTrigger>
                <SelectContent position={'popper'}>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} label={account.name} value={account.id} className="h-14 w-full" onPress={() => setFromAccountId(account.address)}>
                      <View className="items-center justify-between">
                        <View>
                          <Text className={'font-medium text-muted-foreground'}>{account.name}</Text>
                          <Text className={'text-base'}>{shortenAddress(account.address)}</Text>
                        </View>
                      </View>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fromAccount && (
                <div className="absolute top-0 right-0 px-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    {/*<span className="text-sm font-medium">Balance:</span>*/}
                    <Text className={'font-bold text-green-600'}>
                      <AccountBalance address={fromAccount.address} />
                    </Text>
                  </div>
                </div>
              )}
            </View>

            {/* Manual Address Input */}
            <View className={'w-full mx-auto'}>
              <Text className={'font-bold'}>To</Text>
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
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full"
                />
              <Text className="mt-1 text-muted-foreground">
                  Enter an external Ethereum address to send to.
                </Text>

              {canProceedWithAddress && (
                <Button
                  onPress={handleContinueWithAddress}
                  className="mx-auto mt-6"
                  size="default"
                  variant={'secondary'}
                >
                  Continue with Address
                  <ArrowRight className="w-4 h-4 ml-2" />
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
