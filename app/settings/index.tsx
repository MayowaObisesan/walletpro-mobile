import {Alert, Pressable, ScrollView, View} from 'react-native';
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Button} from "@src/components/ui/button";
import {Text} from "@src/components/ui/text";
import {Ionicons} from "@expo/vector-icons";
import {Card} from "@src/components/ui/card";
import {
  ChevronRight,
  Info, LucideCloud, LucideCloudBackup,
  LucideFingerprint,
  LucideIcon,
  LucideLockKeyhole,
  LucideMoonStar, LucideScanEye,
  LucideUserStar, LucideZap, ShieldCheck
} from "lucide-react-native";
import {Icon} from "@src/components/ui/icon";
import {router} from "expo-router";
import {cn} from "@src/lib/utils";
import {useEffect, useState} from "react";
import {Badge} from "@src/components/ui/badge";
import {formatAutoLockTimeout} from "@src/utils";
import {Address, parseEther} from "viem";
import {useSmartAccountClient, useUser} from "@account-kit/react-native";

interface I_SettingsSection {
  title: string;
  children: React.ReactNode;
}

interface I_SettingsItem {
  icon: LucideIcon;
  title: string;
  description?: string;
  showArrow?: boolean;
  onPress: () => void;
}

function SettingsSection({title, children}: I_SettingsSection) {
  return (
    <View className={'gap-1 py-2'}>
      <Text className={'font-bold text-xl mb-2'}>{title}</Text>
      <View className={'gap-2'}>
        {children}
      </View>
    </View>
  )
}

function SettingsItem(
  {
    icon,
    title,
    description,
    showArrow = true,
    onPress,
  }: I_SettingsItem
) {
  return (
    <Pressable onPress={onPress}>
      <Card
        className="w-full justify-between border-hairline border-muted-foreground/20 rounded-2xl px-4"
      >
        <View className={'flex-row items-center justify-between'}>
          <View className={'flex-row items-center gap-4'}>
            <Text>
              <Icon as={icon} size={20} />
            </Text>
            <Text className={'font-medium text-foreground text-lg'}>{title}</Text>
          </View>
          {showArrow && <Icon as={ChevronRight} size={20}/>}
        </View>
      </Card>
    </Pressable>
  )
}

export default function SettingScreen() {
  const user = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const { client, isLoadingClient } = useSmartAccountClient({
    type: "ModularAccountV2",
  });
  const [hasBackup, setHasBackup] = useState(false);
  const [autoLockTimeout, setAutoLockTimeout] = useState<number>(5 * 60 * 1000) // default fallback
  const [gasSponsorshipStatus, setGasSponsorshipStatus] = useState<{
    enabled: boolean
    status: "active" | "inactive" | "not-configured"
    message: string
    icon: string
  } | null>(null)

  useEffect(() => {
    client?.checkGasSponsorshipEligibility({
      uo: {
        target: "0x20da05400E7Dd3b76793469658CF34f6F3e7B31E",
        data: "0x",
        value: 0n,
      }
    }).then(res => {
      // console.log("[Settings Screen] GasSponsorship", res);
      setGasSponsorshipStatus({
        enabled: res.eligible,
        status: "active",
        message: "Gas sponsorship is active",
        icon: "zap",
      })
    })
  }, [user]);

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Settings</PageHeading>
      </PageHeader>
      <PageBody>
        <ScrollView>
          <View className={'gap-6 p-3'}>
            {/* Security Status */}
            <Card className="rounded-lg p-4 space-y-3">
              <View className={'flex-row items-center gap-1 mb-3'}>
                <Icon as={ShieldCheck} className={cn("w-5 h-5 text-green-600", isInitialized ? "fill-green-500/20 text-green-600" : "fill-red-500 text-red-400")} />
                <Text className={'font-bold text-xl'}>Security Status</Text>
              </View>

              <View className="gap-2 text-sm">
                <View className={'flex-row items-center justify-between'}>
                  <Text className={'text-muted-foreground'}>Password Protection</Text>
                  <Text className={cn('text-muted-foreground', isInitialized ? 'text-green-600': 'text-red-600')}>
                    {
                      isInitialized
                        ? (
                          <View className={'flex-row items-center gap-1'}>
                            {/*<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M256,72V184a16,16,0,0,1-16,16H16A16,16,0,0,1,0,184V72A16,16,0,0,1,16,56H240A16,16,0,0,1,256,72Z" opacity="0.2"></path><path d="M48,56V200a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0Zm92,54.5L120,117V96a8,8,0,0,0-16,0v21L84,110.5a8,8,0,0,0-5,15.22l20,6.49-12.34,17a8,8,0,1,0,12.94,9.4l12.34-17,12.34,17a8,8,0,1,0,12.94-9.4l-12.34-17,20-6.49A8,8,0,0,0,140,110.5ZM246,115.64A8,8,0,0,0,236,110.5L216,117V96a8,8,0,0,0-16,0v21l-20-6.49a8,8,0,0,0-4.95,15.22l20,6.49-12.34,17a8,8,0,1,0,12.94,9.4l12.34-17,12.34,17a8,8,0,1,0,12.94-9.4l-12.34-17,20-6.49A8,8,0,0,0,246,115.64Z"></path></svg>*/}
                            <Icon as={LucideFingerprint} size={18} />
                            <Text>Enabled</Text>
                          </View>
                        )
                        : (
                          <View className={'flex-row items-center gap-1'}>
                            {/*<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>*/}
                            <Icon as={LucideScanEye} size={18} />
                            <Text>Not Enabled</Text>
                          </View>
                        )
                    }
                  </Text>
                </View>
                <View className={'flex-row items-center justify-between'}>
                  <Text className={'text-muted-foreground'}>Seed Phrase Backup</Text>
                  <Text className={cn(hasBackup ? "text-green-600" : "text-amber-600")}>
                    {
                      hasBackup
                        ? (
                          <View className={'flex-row items-center gap-1'}>
                            {/*<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M240,128a80,80,0,0,1-80,80H72A56,56,0,1,1,85.92,97.74l0,.1A80,80,0,0,1,240,128Z" opacity="0.2"></path><path d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Zm37.66-93.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L144,148.69l42.34-42.35A8,8,0,0,1,197.66,106.34Z"></path></svg>*/}
                            <Icon as={LucideCloudBackup} size={18} />
                            <Text>Backed Up</Text>
                          </View>
                        )
                        : (
                          <View className={'flex-row items-center gap-1'}>
                            {/*<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M240,127.62a80,80,0,0,1-80,80H72A56,56,0,1,1,85.92,97.36l0,.1A80,80,0,0,1,240,127.62Z" opacity="0.2"></path><path d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Zm-8-72V88a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,172,164Z"></path></svg>*/}
                            <Icon as={LucideCloud} size={18} />
                            <Text>Not Backed Up</Text>
                          </View>
                        )
                    }
                  </Text>
                </View>
                <View className={'flex-row items-center justify-between'}>
                  <Text className={'text-muted-foreground'}>Auto-Lock</Text>
                  <Text className={'text-green-600'}>
                    <View className={'flex-row items-center gap-1'}>
                      {/*<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M232,136.66A104.12,104.12,0,1,1,119.34,24,8,8,0,0,1,120.66,40,88.12,88.12,0,1,0,216,135.34,8,8,0,0,1,232,136.66ZM120,72v56a8,8,0,0,0,8,8h56a8,8,0,0,0,0-16H136V72a8,8,0,0,0-16,0Zm40-24a12,12,0,1,0-12-12A12,12,0,0,0,160,48Zm36,24a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm24,36a12,12,0,1,0-12-12A12,12,0,0,0,220,108Z"></path></svg>*/}
                      <Icon as={LucideLockKeyhole} size={18} />
                      <Text>{formatAutoLockTimeout(autoLockTimeout)}</Text>
                    </View>
                  </Text>
                </View>
                <View className={'flex-row items-center justify-between'}>
                  <Text className={'text-muted-foreground'}>Gas Sponsorship</Text>
                  <Badge
                    className={cn(gasSponsorshipStatus?.enabled ? "bg-green-600" : "bg-muted-foreground")}
                  >
                    {gasSponsorshipStatus?.enabled ? (
                      <>
                        <Icon as={LucideZap} size={10} />
                        <Text>Active</Text>
                      </>
                    ) : (
                      <Text>Inactive</Text>
                    )}
                  </Badge>
                </View>
              </View>
            </Card>

            {/* Information */}
            <View className={'gap-1 py-2'}>
              <Text className={'font-bold text-xl mb-2'}>Information</Text>
              <View className={'gap-2'}>
                <SettingsItem icon={Info} title={"About"} onPress={() => router.push('/about')} />
                <SettingsItem icon={Info} title={"Privacy Policy"} onPress={() => router.push('/privacy_policy')} />
              </View>
            </View>

            {/* Preferences */}
            <SettingsSection title={"Preferences"}>
              <SettingsItem icon={LucideUserStar} title={"Auto Lock Duration"} onPress={() => router.push('/settings/lock')} />
              <SettingsItem icon={LucideMoonStar} title={"Change Theme"} onPress={() => router.push('/settings/theme')} />
            </SettingsSection>

            {/* Security */}
            <SettingsSection title={"Security"}>
              <SettingsItem icon={LucideLockKeyhole} title={"Lock Wallet"} onPress={() => Alert.alert("I will lock the wallet")} />
              <SettingsItem icon={LucideFingerprint} title={"Set Passkey"} onPress={() => router.push('/settings/passkey')} />
            </SettingsSection>
          </View>
        </ScrollView>
      </PageBody>
    </PageContainer>
  )
}
