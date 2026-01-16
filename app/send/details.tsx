import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {View} from "react-native";
import {ArrowRight, Check, Copy, Info, Send} from "lucide-react-native";
import {Alert, AlertTitle} from "@src/components/ui/alert";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { Tooltip } from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";
import {shortenAddress} from "@src/utils";
import {useLocalSearchParams} from "expo-router";
import CopyTextComponent from "@/src/components/CopyToClipboard";

export default function SendDetailsScreen() {
  const { fromAccount, toAccount } = useLocalSearchParams<{ fromAccount?: string; toAccount?: string; }>();

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>
          {/*<Button variant="ghost" size="sm" onClick={handleBack} className="p-0 h-auto mr-2">*/}
          {/*  <ArrowLeft className="h-4 w-4" />*/}
          {/*</Button>*/}
          Send to {fromAccount}
        </PageHeading>
      </PageHeader>

      <PageBody>
        {/*<div className="flex-1 overflow-auto pb-16">*/}
        <div className="px-4 max-w-md mx-auto">
          {/* Network qualification callouts */}
          {networkQualifiesForSponsorship && !gasSponsorshipStatus?.enabled && !amount && validationErrors.length === 0 && (
            <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>
              <View className={'flex flex-row items-center'}>
                <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>
                  We can sponsor the fee for this transaction.
                </AlertTitle>
              </View>
            </Alert>
            /*<Callout.Root color="blue" size="1" className="mb-2">
              <Callout.Text>
                We can sponsor the fee for this transaction.
                <br/>
                <Text as="label" size="2">
                  <Flex gap="2">
                    Enable Gas Sponsorship
                    <Switch
                      size="1"
                      onCheckedChange={saveSettings}
                    />
                  </Flex>
                </Text>
              </Callout.Text>
            </Callout.Root>*/
          )}
          {!networkQualifiesForSponsorship && !amount && validationErrors.length === 0 && (
            <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>
              <View className={'flex flex-row items-center'}>
                <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>
                  Gas sponsorship not supported for this network
                </AlertTitle>
              </View>
            </Alert>
            /*<Callout.Root color="amber" size="1" className="mb-2">
              <Callout.Text>
                Gas sponsorship not supported for this network
              </Callout.Text>
            </Callout.Root>*/
          )}
          {/* Gas sponsorship notice */}
          {networkQualifiesForSponsorship && gasSponsorshipStatus?.enabled && !amount && validationErrors.length === 0 && (
            /*<Callout.Root color="grass" size="1" className="mb-2">
              <Callout.Text>
                You won't pay for transactions fees less than $1
              </Callout.Text>
            </Callout.Root>*/
            <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>
              <View className={'flex flex-row items-center'}>
                <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>
                  You won't pay for transactions fees less than $1
                </AlertTitle>
              </View>
            </Alert>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                /*<div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50 text-red-800 text-sm">
                  {error}
                </div>*/
                /*<Callout.Root color="red" size="1" className="mb-2">
                  <Callout.Text>{error}</Callout.Text>
                </Callout.Root>*/
                <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>
                  <View className={'flex flex-row items-center'}>
                    <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>
                      {error}
                    </AlertTitle>
                  </View>
                </Alert>
              ))}
            </div>
          )}

          {/* Error Message */}
          {sendError && (
            /*<div className="p-3 border border-red-200 rounded-lg bg-red-50 text-red-800 text-sm">
              {sendError}
            </div>*/
            /*<Callout.Root color="red" size="1" className="mb-2">
              <Callout.Text>{sendError}</Callout.Text>
            </Callout.Root>*/
            <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>
              <View className={'flex flex-row items-center'}>
                <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>
                  {sendError}
                </AlertTitle>
              </View>
            </Alert>
          )}

          {gasEstimate && sponsorshipCheck && (
            <>
              {sponsorshipCheck?.canSponsor ? (
                /*<Callout.Root color="green" size="1" className="mb-2">
                  <Callout.Text>Gas Sponsored! No fees for you.</Callout.Text>
                </Callout.Root>*/
                <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>
                  <View className={'flex flex-row items-center'}>
                    <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>
                      Gas Sponsored! No fees for you.
                    </AlertTitle>
                  </View>
                </Alert>
              ) : (
                /*<Callout.Root color="amber" size="1" className="mb-2">
                  <Callout.Text>Gas fees will apply. {sponsorshipCheck?.reason}</Callout.Text>
                </Callout.Root>*/
                <Alert className={'flex flex-row items-center bg-[#132D21] pr-2.5 py-2 rounded-2xl'} icon={Info} iconClassName={'size-5 text-[#3DD68C] -mt-0.5'}>
                  <View className={'flex flex-row items-center'}>
                    <AlertTitle className={'flex-1 bg-transparent text-lg text-[#3DD68C]'}>
                      Gas fees will apply. {sponsorshipCheck?.reason}
                    </AlertTitle>
                  </View>
                </Alert>
              )}
            </>
          )}

          <View className="gap-4">
            {/* Account info display */}
            <Card>
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
            </Card>

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
                maxValue={maxBalance}
                inputValue={amount}
                setInputValue={setAmount}
                tokenSymbol="ETH"
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
                  {toDecimalPlace(Number(maxBalance), 6)}{" "}
                  {/*<Text size={"6"} color={"gray"}>*/}
                  {/*  {routeTokenSymbol?.toLocaleUpperCase()}*/}
                  {/*</Text>{" "}*/}
                  {/* Display the Dollar equivalent here in amber color */}
                  <Text className={'text-xl text-center text-muted-foreground opacity-80'}>
                    ({usdValue})
                  </Text>
                </Text>
              </View>
            </View>

            {/* Gas Estimate Display */}
            {gasEstimate && sponsorshipCheck && (
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
            )}
          </View>
        </div>
        {/*</div>*/}
      </PageBody>
      {/* Action Buttons */}
      <View className={'flex-row items-center h-auto gap-1 p-1 w-full'}>
        <View className={'h-12'}>
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
        </View>
      </View>
      {/*<BottomNavigation />*/}
    </PageContainer>
  )
}
