import QRCode from 'react-native-qrcode-svg'
import { useUIStore } from "@src/store/ui-store"
// import {chainMetadata, isTestnetChain} from "@src/config/chains"
import {Copy, LucideCopy, LucideX, QrCode} from "lucide-react-native";
import React from "react";
// import CopyTextComponent from "@src/components/CopyToClipboard";
// import {getNetworkNameByChainId} from "@src/utils/helper";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogTrigger} from "@src/components/ui/dialog";
import { View } from "react-native";
import {useChain, useUser} from "@account-kit/react-native";
import {Card} from "@src/components/ui/card";
import {Text} from "@src/components/ui/text"
import {Button} from "@src/components/ui/button";
import {Ionicons} from "@expo/vector-icons";

export default function QRCodeDialog() {
  const { activeAccount, selectedNetwork } = useUIStore()
  const user = useUser();
  const {chain} = useChain();

  // Helper function to get current network type
  const getNetworkType = () => {
    // const metadata = chainMetadata[selectedNetwork.id]
    // return metadata?.isTestnet ? "testnet" : "mainnet"
    return chain?.testnet ? "testnet" : "mainnet"
  }

  // Helper function to get blockchain name
  const getBlockchainName = () => {
    // const metadata = chainMetadata[selectedNetwork.id]
    // return metadata?.shortName || "Unknown"
    // return getNetworkNameByChainId(selectedNetwork.id)
  }

  /*const QRCodeIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-qr-code"
      >
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
        <path d="M21 21v.01" />
        <path d="M12 7v3a2 2 0 0 1-2 2H7" />
        <path d="M3 12h.01" />
        <path d="M12 3h.01" />
        <path d="M12 16v.01" />
        <path d="M16 12h1" />
        <path d="M21 12v.01" />
        <path d="M12 21v-1" />
      </svg>
    )
  }*/

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'secondary'}>
          <QrCode />
        </Button>
      </DialogTrigger>

      <DialogContent className={'relative rounded-3xl border-hairline border-muted'}>
        {/*<DialogTitle>Address as QRCode</DialogTitle>*/}

        <View className={'items-center justify-center'}>
          <View
            className={'items-center justify-center gap-1'}
            style={{
              width: 220,
              height: 220,
              backgroundColor: "#f9f9f9",
              padding: 0,
              borderRadius: 12,
              // border: "1px solid #eaeaea",
            }}
          >
            {user?.address ? (
              // <QRCodeSVG className={'rounded-lg! p-4'} value={activeAccount.address} size={220} radius={8} />
              <QRCode
                logoBorderRadius={16}
                value={user?.address}
                size={200}
                enableLinearGradient={true}
                linearGradient={['rgba(11,10,10,0.98)', 'rgba(40,122,206,0.88)']}
                quietZone={10}
              />
            ) : (
              <View className="flex flex-row items-center justify-center h-[300px]">
                <Text>No active account</Text>
              </View>
            )}
          </View>
        </View>

        {/* Address Display */}
        <Card className={'mt-1 bg-background border-0'}>
          <View>
            <Text className="font-bold font-space-mono text-sm break-all">
              {user?.address}
            </Text>
          </View>
        </Card>

        {/* Copy Button */}
        <View className={'justify-center mt-1'}>
          <Button
            className="w-auto mx-auto"
            size={'sm'}
            variant="secondary"
          >
            <Text><Ionicons name={'copy-outline'} size={14} /></Text>
            <Text>Copy Address</Text>
          </Button>
          {/*<CopyTextComponent textToCopy={activeAccount?.address}>
          </CopyTextComponent>*/}
        </View>

        <Card className="mt-2 bg-background border-0 rounded-lg p-5">
          <Text className="mb-2 text-sm font-medium">Instructions</Text>
          <View className="list-decimal space-y-2 pl-4 text-sm">
            <Text>Scan this QRCode to copy your address</Text>
            {getNetworkType() === "mainnet" && (
              <Text>
                Send <Text className={'text-amber-400'}><Text className={'font-bold text-amber-400'}>{chain?.name}</Text></Text> to this
                address from another wallet or exchange
              </Text>
            )}
            {chain?.testnet && (
              <>
                <Text>
                  You are currently on {getNetworkType()}. Make sure you are only sending{" "}
                  <Text className={'text-green-600'}><Text className={'font-bold text-green-600'}>{chain?.name}</Text></Text>
                </Text>
                {/*<li>
                  You can also get {getNetworkType()} faucets from the{" "}
                  <Link
                    href="/faucet"
                    rel="noopener noreferrer"
                    className="underline text-primary-400 hover:text-primary-500"
                  >
                    Faucet Page
                  </Link>
                </li>*/}
              </>
            )}
          </View>
        </Card>

        <View className={'absolute top-2 justify-end gap-2 right-2'}>
          <DialogClose asChild className={'z-40 bg-destructive rounded-full'}>
            <Button className={'rounded-full size-8'} variant="destructive" size={'icon'}>
              <Text className={'text-lg'}><Ionicons name={'close'} size={20} strokeWidth={3} /></Text>
            </Button>
          </DialogClose>
        </View>
      </DialogContent>
    </Dialog>
  )
}
