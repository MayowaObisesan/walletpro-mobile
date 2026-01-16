import {useEffect, useState} from "react";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Alert as RNAlert, View} from "react-native";
import {ArrowRight, Check, Copy, Info, Loader2, Send} from "lucide-react-native";
import {Alert, AlertTitle} from "@src/components/ui/alert";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import {Tooltip, TooltipTrigger} from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";
import {shortenAddress, toDecimalPlace} from "@src/utils";
import {useLocalSearchParams} from "expo-router";
import CopyTextComponent from "@/src/components/CopyToClipboard";
import CustomNumericKeypad from "@src/components/CustomNumericKeypad";
import {useAccountBalanceWithUsd} from "@src/hooks/useAccountBalanceWithUsd";
import {useChain, useSendUserOperation, useSmartAccountClient} from "@account-kit/react-native";
// import {client} from "@src/utils/client";
import {Address, formatEther, parseEther} from "viem";
import {Icon} from "@src/components/ui/icon";

export default function SendDetailsScreen() {
  const { fromAccount, toAccount } = useLocalSearchParams<{ fromAccount?: string; toAccount?: string; }>();
  const {chain} = useChain();
  const { client, isLoadingClient } = useSmartAccountClient({});
  const { balance: myBalance, usdValue, isLoading, error, refetch } = useAccountBalanceWithUsd();
  const [amount, setAmount] = useState("");
  const [actualEthAmount, setActualEthAmount] = useState<string>("0")

  // Handle sending transaction Operations
  const { sendUserOperation, sendUserOperationAsync, isSendingUserOperation,  } = useSendUserOperation({
    client,
    // optional parameter that will wait for the transaction to be mined before returning
    waitForTxn: true,
    onSuccess: ({ hash, request }) => {
      // [optional] Do something with the hash and request
      RNAlert.alert("Transaction Successful", hash);
    },
    onError: (error) => {
      // [optional] Do something with the error
      RNAlert.alert("Transaction Failed", error.message);
      console.error("[Send Transaction Screen] Error sending Transaction", error);
    },
    // [optional] ...additional mutationArgs
  });

  const handleEthValueChange = (ethValue: string) => {
    setActualEthAmount(ethValue)
  }

  const handleSendTransaction = async () => {
    if (!client) {
      throw new Error("Smart account client not connected");
    }
    const gasPrice = await client.getGasPrice()

    console.log("[Send Transaction Screen] amount sent", parseEther(amount), `0x${parseEther(amount).toString(16)}`, gasPrice);

    sendUserOperation({
      uo: {
        target: toAccount! as Address,
        data: "0x",
        value: parseEther(amount),
      },
    })
  }

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>
          {/*<Button variant="ghost" size="sm" onClick={handleBack} className="p-0 h-auto mr-2">*/}
          {/*  <ArrowLeft className="h-4 w-4" />*/}
          {/*</Button>*/}
          Send to {shortenAddress(toAccount!)}
        </PageHeading>
      </PageHeader>

      <PageBody>
        {/*<div className="flex-1 overflow-auto pb-16">*/}
        <View className="px-4 max-w-md mx-auto">
          {/* Network qualification callouts */}
          {/*{networkQualifiesForSponsorship && !gasSponsorshipStatus?.enabled && !amount && validationErrors.length === 0 && (*/}
          {/*  <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>*/}
          {/*    <View className={'flex flex-row items-center'}>*/}
          {/*      <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>*/}
          {/*        We can sponsor the fee for this transaction.*/}
          {/*      </AlertTitle>*/}
          {/*    </View>*/}
          {/*    /!*<Callout.Root color="blue" size="1" className="mb-2">*/}
          {/*      <Callout.Text>*/}
          {/*        We can sponsor the fee for this transaction.*/}
          {/*        <br/>*/}
          {/*        <Text as="label" size="2">*/}
          {/*          <Flex gap="2">*/}
          {/*            Enable Gas Sponsorship*/}
          {/*            <Switch*/}
          {/*              size="1"*/}
          {/*              onCheckedChange={saveSettings}*/}
          {/*            />*/}
          {/*          </Flex>*/}
          {/*        </Text>*/}
          {/*      </Callout.Text>*/}
          {/*    </Callout.Root>*!/*/}
          {/*  </Alert>*/}
          {/*)}*/}

          {/*{!networkQualifiesForSponsorship && !amount && validationErrors.length === 0 && (*/}
          {/*  <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>*/}
          {/*    <View className={'flex flex-row items-center'}>*/}
          {/*      <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>*/}
          {/*        Gas sponsorship not supported for this network*/}
          {/*      </AlertTitle>*/}
          {/*    </View>*/}
          {/*    /!*<Callout.Root color="amber" size="1" className="mb-2">*/}
          {/*      <Callout.Text>*/}
          {/*        Gas sponsorship not supported for this network*/}
          {/*      </Callout.Text>*/}
          {/*    </Callout.Root>*!/*/}
          {/*  </Alert>*/}
          {/*)}*/}

          {/* Gas sponsorship notice */}
          {/*{networkQualifiesForSponsorship && gasSponsorshipStatus?.enabled && !amount && validationErrors.length === 0 && (*/}
          {/*  <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>*/}
          {/*    /!*<Callout.Root color="grass" size="1" className="mb-2">*/}
          {/*      <Callout.Text>*/}
          {/*        You won't pay for transactions fees less than $1*/}
          {/*      </Callout.Text>*/}
          {/*    </Callout.Root>*!/*/}
          {/*    <View className={'flex flex-row items-center'}>*/}
          {/*      <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>*/}
          {/*        You won't pay for transactions fees less than $1*/}
          {/*      </AlertTitle>*/}
          {/*    </View>*/}
          {/*  </Alert>*/}
          {/*)}*/}

          {/* Validation Errors */}
          {/*{validationErrors.length > 0 && (*/}
          {/*  <div className="space-y-2">*/}
          {/*    {validationErrors.map((error, index) => (*/}
          {/*      <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>*/}
          {/*        /!*<div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50 text-red-800 text-sm">*/}
          {/*          {error}*/}
          {/*        </div>*/}
          {/*        <Callout.Root color="red" size="1" className="mb-2">*/}
          {/*          <Callout.Text>{error}</Callout.Text>*/}
          {/*        </Callout.Root>*!/*/}
          {/*        <View className={'flex flex-row items-center'}>*/}
          {/*          <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>*/}
          {/*            {error}*/}
          {/*          </AlertTitle>*/}
          {/*        </View>*/}
          {/*      </Alert>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*)}*/}

          {/* Error Message */}
          {/*{sendError && (*/}
          {/*  <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>*/}
          {/*    /!*<div className="p-3 border border-red-200 rounded-lg bg-red-50 text-red-800 text-sm">*/}
          {/*      {sendError}*/}
          {/*    </div>*/}
          {/*    <Callout.Root color="red" size="1" className="mb-2">*/}
          {/*      <Callout.Text>{sendError}</Callout.Text>*/}
          {/*    </Callout.Root>*!/*/}
          {/*    <View className={'flex flex-row items-center'}>*/}
          {/*      <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>*/}
          {/*        {sendError}*/}
          {/*      </AlertTitle>*/}
          {/*    </View>*/}
          {/*  </Alert>*/}
          {/*)}*/}

          {/*{gasEstimate && sponsorshipCheck && (*/}
          {/*  <>*/}
          {/*    {sponsorshipCheck?.canSponsor ? (*/}
          {/*      <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>*/}
          {/*        /!*<Callout.Root color="green" size="1" className="mb-2">*/}
          {/*          <Callout.Text>Gas Sponsored! No fees for you.</Callout.Text>*/}
          {/*        </Callout.Root>*!/*/}
          {/*        <View className={'flex flex-row items-center'}>*/}
          {/*          <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>*/}
          {/*            Gas Sponsored! No fees for you.*/}
          {/*          </AlertTitle>*/}
          {/*        </View>*/}
          {/*      </Alert>*/}
          {/*    ) : (*/}
          {/*      <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>*/}
          {/*        /!*<Callout.Root color="amber" size="1" className="mb-2">*/}
          {/*          <Callout.Text>Gas fees will apply. {sponsorshipCheck?.reason}</Callout.Text>*/}
          {/*        </Callout.Root>*!/*/}
          {/*        <View className={'flex flex-row items-center'}>*/}
          {/*          <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>*/}
          {/*            Gas fees will apply. {sponsorshipCheck?.reason}*/}
          {/*          </AlertTitle>*/}
          {/*        </View>*/}
          {/*      </Alert>*/}
          {/*    )}*/}
          {/*  </>*/}
          {/*)}*/}

          <View className="gap-4">
            {/* Account info display */}
            {/*<Card>
              <View className={'flex-row items-center justify-between'}>
                <View className={'items-start justify-center'}>
                  <View className={'items-center gap-1'}>
                    <Text size="1" color="gray">From</Text>
                    <CopyTextComponent
                      textToCopy={fromAccount.address}
                      icon={
                        <Tooltip content={"Copy from address"}>
                          <Button
                            size="icon"
                            aria-label="Copy from address"
                            variant="ghost"
                          >
                            <Copy size={12}/>
                          </Button>
                        </Tooltip>
                      }
                      successIcon={
                        <Button
                          size="icon"
                          aria-label="Copy from address"
                          variant="ghost"
                        >
                          <Check className={'text-grass11'} size={12} strokeWidth={4}/>
                        </Button>
                      }
                    />
                  </View>
                  <View className={'items-start'}>
                    <Text className="font-medium text-muted-foreground text-sm">{fromAccount.name}</Text>
                    <Text className={''}>{shortenAddress(fromAccount.address)}</Text>
                  </View>
                </View>

                <div className="flex items-center justify-center bg-gray11 rounded-full p-1">
                  <ArrowRight size={16} strokeWidth={4} />
                </div>

                <View className={'items-end justify-center'}>
                  <View className={'flex flex-row items-center gap-1'}>
                    <CopyTextComponent
                      textToCopy={recipientAddress}
                      icon={
                        <Tooltip content={"Copy to Address"}>
                          <Button
                            size="icon"
                            aria-label="Copy to address"
                            variant="ghost"
                          >
                            <Copy size={12} />
                          </Button>
                        </Tooltip>
                      }
                      successIcon={<Button
                        size="icon"
                        aria-label="Copy to address"
                        variant="ghost"
                      >
                        <Check className={'text-grass11'} size={12} strokeWidth={4} />
                      </Button>}
                    />
                    <Text className={'text-muted-foreground text-sm'}>To</Text>
                  </View>
                  <View className={'items-end'}>
                    <Text className="font-medium text-muted-foreground text-sm">{recipientName}</Text>
                    <Text className={''}>{shortenAddress(recipientAddr)}</Text>
                  </View>
                </View>
              </View>
            </Card>*/}

            {/*<div hidden className="p-2 rounded-lg space-y-2">*/}
            {/*  <div className="flex items-center justify-between">*/}
            {/*    <Text size="2" color="gray">From:</Text>*/}
            {/*    /!*<div className="text-right">*/}
            {/*        <Text size="2" weight="bold">{fromAccount.name}</Text>*/}
            {/*        <Text size="1" color="gray">{shortenAddress(fromAccount.address)}</Text>*/}
            {/*      </div>*!/*/}
            {/*    <Flex align={'end'} direction={'column'} gap={'0'}>*/}
            {/*      <Text color={'gray'} size={'1'} className="font-medium">{fromAccount.name}</Text>*/}
            {/*      <Text size={'2'}>{shortenAddress(fromAccount.address)}</Text>*/}
            {/*    </Flex>*/}
            {/*  </div>*/}

            {/*  /!*<div className="flex items-center justify-center">*/}
            {/*      <ArrowUpDown className="h-4 w-4" />*/}
            {/*    </div>*!/*/}

            {/*  <div className="flex items-center justify-between">*/}
            {/*    <Text size="2" color="gray">To:</Text>*/}
            {/*    /!*<div className="text-right">*/}
            {/*        <Text size="2" weight="bold">{recipientName}</Text>*/}
            {/*        <Text size="1" color="gray">{shortenAddress(recipientAddr)}</Text>*/}
            {/*      </div>*!/*/}
            {/*    <Flex align={'end'} direction={'column'} gap={'0'}>*/}
            {/*      <Text color={'gray'} size={'1'} className="font-medium">{recipientName}</Text>*/}
            {/*      <Text size={'2'}>{shortenAddress(recipientAddr)}</Text>*/}
            {/*    </Flex>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/* Amount Input with CustomNumericKeypad */}
            <View className={''}>
              {/*<Text size="3" weight="bold" className="mb-3 block">Amount (ETH)</Text>*/}
              <CustomNumericKeypad
                maxValue={formatEther(myBalance!, 'wei')}
                inputValue={amount}
                setInputValue={setAmount}
                tokenSymbol={chain?.nativeCurrency?.symbol}
                maxLength={12}
                onEthValueChange={handleEthValueChange}
              />

              {/* Max Balance Display */}
              {/*<div className="mt-2 p-3 rounded-lg">
                  <Text size="2" className="text-center">
                    <Text size="2" color="blue" weight="bold">
                      Max Balance:
                      {maxBalance} ETH ({usdValue})
                    </Text>
                  </Text>
                </div>*/}
              <View className={'items-start px-2'}>
                <Text>Max Balance:</Text>
                <Text className={'text-2xl text-center'}>
                  {toDecimalPlace(Number(formatEther(myBalance!)), 6)}{" "}
                  {/*<Text size={"6"} color={"gray"}>*/}
                  {/*  {routeTokenSymbol?.toLocaleUpperCase()}*/}
                  {/*</Text>{" "}*/}
                  {/* Display the Dollar equivalent here in amber color */}
                  <Text className={'text-xl text-center text-muted-foreground opacity-80'}>
                    (${toDecimalPlace(usdValue!, 6)})
                  </Text>
                </Text>
              </View>
            </View>

            {/* Gas Estimate Display */}
            {/*{gasEstimate && sponsorshipCheck && (
              <View className="p-4 rounded-lg bg-muted/30 space-y-3">
                <View className="text-sm space-y-2">
                  <View className="flex flex-row justify-between">
                    <Text className="text-muted-foreground">Gas Cost (est.):</Text>
                    <Text className="font-medium">{gasEstimate.estimatedCost} ETH</Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-muted-foreground">Gas Cost (USD):</Text>
                    <Text className="font-medium">${gasEstimate.estimatedCostUSD}</Text>
                  </View>
                </View>
              </View>
            )}*/}
          </View>
        </View>
        {/*</div>*/}
      </PageBody>

      {/* Action Buttons */}
      <View className={'flex-row items-center h-auto gap-1 p-2 w-full'}>
        <View className={'w-full'}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={'h-12 w-full rounded-xl'}
                // disabled={!canSendTransaction}
                disabled={isSendingUserOperation}
                onPress={handleSendTransaction}
              >
                {
                  isSendingUserOperation
                  ? <View className="pointer-events-none animate-spin">
                      <Icon as={Loader2} className="text-primary-foreground"/>
                    </View>
                  : <Icon as={Send} className="w-5 h-5 text-primary-foreground" />
                }
                <Text className={'text-lg leading-tight'}>{isSendingUserOperation ? "Sending Transaction" : "Send Transaction"}</Text>
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </View>

        {/*<View className={'h-12'}>
          <Tooltip content={getEstimateGasDisabledReason()}>
            <Button
              onPress={handleEstimateGas}
              disabled={!canEstimateGas}
              variant="default"
              className={'w-full'}
            >
              {isLoading ? "Estimating..." : "Estimate Gas"}
            </Button>
          </Tooltip>
        </View>

        <View className={'h-12'}>
          <Tooltip content={getSendTransactionDisabledReason()}>
            <Button
              className={'w-full bg-green-600'}
              onPress={handleSendTransaction}
              disabled={!canSendTransaction}
            >
              <Send className="w-4 h-4" />
              {isLoading ? "Sending..." : "Send Transaction"}
            </Button>
          </Tooltip>
        </View>*/}
      </View>
      {/*<BottomNavigation />*/}
    </PageContainer>
  )
}
