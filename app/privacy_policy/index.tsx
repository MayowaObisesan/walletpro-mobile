import {ScrollView, View} from "react-native";
import {Text} from "@src/components/ui/text";
import {PageBody, PageContainer, PageHeader, PageHeading } from "@/src/components/PageSection";
import {Card} from "@src/components/ui/card";
import {ExternalLink, Github, Mail} from "lucide-react-native";
import Constants from "expo-constants";

export default function PrivacyPolicyScreen() {
  // Get app info from package.json
  const appName = Constants.expoConfig?.name || "Walletpro-mobile"
  const appVersion = Constants.expoConfig?.version
  const buildDate = new Date().toLocaleDateString()

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader showBackButton>
        <PageHeading>About</PageHeading>
      </PageHeader>

      <PageBody>
        <ScrollView className="flex-1 gap-4">
          {/* App Info */}
          <View className={'items-center gap-2'}>
            <Text className={'font-bold text-3xl capitalize'}>{appName}</Text>
            <Text className={'text-xl text-muted-foreground'}>Version {appVersion}</Text>
            {/*<Text color="gray" size="1">Built on {buildDate}</Text>*/}
          </View>

          {/* Description */}
          <View>
            {/*<Heading size="4">About</Heading>*/}
            <Text className={"text-base text-muted-foreground text-pretty"}>
              WalletPro is a <Text className="font-bold underline underline-offset-2 decoration-grass10 decoration-wavy">developer-first</Text> wallet built exclusively for testnets,
              so you can explore, build, and break things without ever putting your valuable (mainnet) assets at risk.

              <View className={'my-2'} />

              Experience beautiful UX, gas sponsorship, secure, encrypted seed phrase backup and
              smart account features powered by Alchemy AA.
              {/*Wallet Pro simplifies blockchain interactions by abstracting gas fees through
              Account Abstraction. Experience secure, user-friendly Web3 with encrypted seed phrase
              backup and smart account features powered by Alchemy AA.*/}
            </Text>
          </View>

          {/* Vision */}
          <View>
            <Text className={'text-2xl'}>Our Vision</Text>
            <Text className={'text-muted-foreground'}>
              To create a safer web3 development ecosystem where developers can innovate confidently without risking their real assets. This empowers every builder with a dedicated, secure, and seamless testnet-only wallet.
            </Text>
          </View>

          {/* Mission */}
          <View>
            <Text className={'text-2xl'}>Our Mission</Text>
            {/*<Text color="gray" size={'2'}>
              Democratize access to Web3 by abstracting every complexity,
              making blockchain technology accessible to non-technical users worldwide.
            </Text>*/}
            <Text className={'text-muted-foreground'}>
              Our mission is to eliminate the risk of accidental mainnet exposure during development by
              providing a secure, intuitive, and developer-first wallet that connects exclusively to testnets.
            </Text>
            <View>
              <Text className={'text-muted-foreground'}>We strive to:</Text>
              {/*<ul className={'list-disc px-4'}>
                <li><Text color={'gray'} size='2'>Protect developers from scams, malicious DApps, and accidental mainnet interactions.</Text></li>
                <li><Text color={'gray'} size='2'>Simplify testing workflows with a clean, fast, and developer-oriented experience.</Text></li>
                <li><Text color={'gray'} size='2'>Promote safer web3 practices, ensuring that experimentation never threatens real funds.</Text></li>
                <li><Text color={'gray'} size='2'>Support the ecosystem by making testnet usage reliable, convenient, and foolproof.</Text></li>
              </ul>*/}
            </View>
          </View>

          {/* Features */}
          <View>
            <Text className={'text-xl'}>Features</Text>

            <View>
              <View>
                <Text className={'font-medium text-lg'}>Secure Backup</Text>
                <Text className={'text-muted-foreground'}>Encrypted seed phrases for account recovery</Text>
              </View>

              <View>
                <Text className={'font-medium text-lg'}>Gasless Transactions</Text>
                <Text className={'text-muted-foreground'}>Sponsored transactions up to $1</Text>
              </View>

              <View>
                <Text className={'font-medium text-lg'}>Multi-Chain Support</Text>
                <Text className={'text-muted-foreground'}>Works on 690+ testnets</Text>
              </View>

              <View>
                <Text className={'font-medium text-lg'}>Account Abstraction</Text>
                <Text className={'text-muted-foreground'}>EIP-7702 smart accounts with delegation</Text>
              </View>
            </View>
          </View>

          {/* Tech Stack */}
          <View className={'hidden'}>
            <Text className={'text-2xl'}>Technology</Text>

            <View>
              <View className={'items-center gap-1'}>
                <Text className={'text-2xl'}>🧪</Text>
                <View>
                  <Text className={'text-muted-foreground'}>Smart Accounts</Text>
                </View>
              </View>

              <View className={'items-center gap-1'}>
                <Text className={'text-2xl'}>🔷</Text>
                <View>
                  <Text className={'text-muted-foreground'}>Ethereum Library</Text>
                </View>
              </View>

              <View className={'items-center gap-1'}>
                <Text className={'text-2xl'}>⚛️</Text>
                <View>
                  <Text className={'text-muted-foreground'}>UI Framework</Text>
                </View>
              </View>

              <View className={'items-center gap-1'}>
                <Text className={'text-2xl'}>💎</Text>
                <View>
                  <Text className={'text-muted-foreground'}>Components</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Links */}
          <View>
            <Text className={'text-2xl'}>Links</Text>

            <View>
              <Card
                className="w-full justify-center cursor-pointer hover:bg-[--accent-2]"
                // onPress={() => window.open('https://github.com/MayowaObisesan/smart-wallet-pro', '_blank')}
              >
                <View className={'items-center gap-2'}>
                  <Github size={16} className="" />
                  <Text>View Source Code</Text>
                  <ExternalLink className="ml-auto" size={14} strokeWidth={3} />
                </View>
              </Card>

              <Card
                // variant="surface"
                className="w-full justify-center cursor-pointer hover:bg-[--accent-2]"
                // onClick={() => window.open('mailto:mayowaobi74@gmail.com', '_blank')}
              >
                <View className={'items-center gap-2'}>
                  <Mail size={16} className="" />
                  <Text>Contact Developer</Text>
                  <ExternalLink className="ml-auto" size={14} strokeWidth={3} />
                </View>
              </Card>
            </View>
          </View>

          {/* Disclaimer */}
          <View className={'hidden'}>
            <Text className={'text-2xl'}>Disclaimer</Text>
            <Text className={'text-muted-foreground'}>
              Always back up your accounts and use at your own risk.
              The developer assumes no liability.
            </Text>
          </View>


          {/* Footer */}
          <View>
            {/*<Separator size="4" className="mb-4" />*/}
            <Text className={'text-muted-foreground'}>Made with ❤️ by Mayowa Obisesan</Text>
            <Text className={'text-muted-foreground text-sm'}>&copy; 2025 {appName}. All rights reserved.</Text>
          </View>
        </ScrollView>
      </PageBody>
    </PageContainer>
  )
}
