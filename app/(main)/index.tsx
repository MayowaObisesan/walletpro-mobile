import {useUser, useSmartAccountClient, useChain, useAccount, useExportAccount} from "@account-kit/react-native";
import {StyleSheet, View, Linking, ScrollView, ActivityIndicator, Pressable} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {shortenAddress, formatUsdValue} from "@src/utils";
import {Link, router} from "expo-router";
import React from "react";
import {formatEther} from "viem";
import {Text} from "@src/components/ui/text";
import {BottomNavigation} from "@src/components/Navigation";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Button} from "@src/components/ui/button";
import {ThemeToggle} from "@src/components/ThemeToggle";
import Feather from "@expo/vector-icons/Feather";
import {Avatar, AvatarFallback, AvatarImage} from "@src/components/ui/avatar";
import {ChainSelect} from "@src/components/ChainSelect";
import {useAccountBalanceWithUsd} from "@src/hooks/useAccountBalanceWithUsd";
import {Ionicons} from "@expo/vector-icons";
import {toast} from "sonner-native";
import {Alert, AlertTitle} from "@src/components/ui/alert";
import {Info, Terminal} from "lucide-react-native";
import QRCode from 'react-native-qrcode-svg'
import QRCodeDialog from "@src/components/QRCode/QRCode";
import {ProfileDropDown} from "@src/components/ProfileDropDown";

export default function TabOneScreen() {
	const user = useUser();
	const { bottom } = useSafeAreaInsets();
	const { client, isLoadingClient } = useSmartAccountClient({
		type: "ModularAccountV2",
	});
	const { chain, setChain, isSettingChain } = useChain();
	const { balance: myBalance, usdValue, isLoading, error, refetch } = useAccountBalanceWithUsd();

	const account = client?.account;

	console.log("[Home Screen] account", client?.checkGasSponsorshipEligibility);

	if (!user) return null;

	if (isLoadingClient) {
		return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
			<ActivityIndicator size={'large'}></ActivityIndicator>
			<Text style={{ fontSize: 16, fontWeight: '500' }}>Initializing the App for you...</Text>
		</View>
	}

	return (
		<PageContainer>
			<PageHeader>
				<View className={'flex-1 flex flex-row items-center justify-between py-2'}>
					<View className={'flex-row items-center gap-2'}>
						{/* QR Code */}
						<QRCodeDialog />
						<ChainSelect />
					</View>
					<Button size={'icon'} variant={'ghost'}>
						<ThemeToggle />
					</Button>
					<View className={'flex flex-row items-center gap-2'}>
						<Pressable
							style={{
								marginLeft: "auto",
							}}
							// Workaround on Android: https://github.com/expo/expo/issues/33093#issuecomment-2587684514
							onPressIn={() => router.navigate("/menu")}
						>
							{({ pressed }) => (
								<Text>
									<Feather
										name="menu"
										size={25}
										style={{
											marginRight: 15,
											opacity: pressed ? 0.5 : 1,
										}}
									/>
								</Text>
							)}
						</Pressable>
						<ProfileDropDown />
					</View>
				</View>
			</PageHeader>
			<PageBody>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
					}}
				>
					<View style={styles.container}>
						{/*<Text style={styles.userText}>{user.email}</Text>*/}

						<View className={'hidden bg-secondary rounded-xl items-center my-4 p-4'}>
							<QRCode
								logoBorderRadius={16}
								value={user?.address}
								size={200}
								enableLinearGradient={true}
								linearGradient={['rgba(11,10,10,0.98)', 'rgba(40,122,206,0.88)']}
								quietZone={10}
							/>
						</View>

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

						{/* User Details */}
						<View className={'items-center py-8'}>
							<Text className={'font-bold text-xl'}>Account {"1"}</Text>
							<Button
								className={'rounded-full h-14'}
								size={'lg'}
								variant={'secondary'}
								// onPress={() => toast.info("Address copied to clipboard")}
							>
								<Text className={'font-bold text-2xl text-foreground/80 leading-tight'}>
									{shortenAddress(user.address)}
								</Text>
								<Text>
									<Ionicons name={'copy-outline'} size={18} />
								</Text>
							</Button>

							<View className={'my-12'}>
								{isLoading && (
									<Text style={styles.userText}>Loading balance...</Text>
								)}
								{error && (
									<Text style={styles.userText}>Balance unavailable</Text>
								)}
								{!isLoading && !error && !!myBalance?.toString() && (
									<View className={'flex flex-row items-baseline gap-1'}>
										<Text
											className={'font-bold text-7xl leading-tight'}
										>
											{formatEther(myBalance as bigint, 'wei')}
										</Text>
										<Text className={'font-bold text-3xl text-muted-foreground uppercase'}>
											{chain.nativeCurrency.symbol}
										</Text>
									</View>
								)}
								{!isLoading && !error && usdValue !== null && (
									<Text className={'text-2xl text-muted-foreground text-center leading-tight'}>
										≈ {formatUsdValue(usdValue)}
									</Text>
								)}
							</View>

							<Button size={'sm'} variant="secondary" onPress={() => refetch()}>
								<Text>Refresh Balance</Text>
							</Button>
							{/*<Text style={styles.userText}>OrgId: {user.orgId}</Text>*/}
							{/*<Text style={styles.userText}>Solana Address: {user.solanaAddress}</Text>*/}
							{/*<Text style={styles.userText}>
								Light Account Address: {account?.address}
							</Text>*/}
						</View>

						<View style={styles.separator}/>

						{/* Documentation Info */}
						<View className={'hidden'} style={{marginTop: "auto", marginBottom: bottom}}>
							<Text style={[styles.userText, {marginBottom: 20}]}>
								Now that you have a smart account setup, visit our docs
								to learn how to use this account to send sponsored and
								unsponsored user operatons 👇🏽
							</Text>

							<View>
								<Text
									onPress={() =>
										Linking.openURL(
											"https://accountkit.alchemy.com/react-native/using-smart-accounts/send-user-operations"
										)
									}
									style={[styles.userText, styles.documentationLink]}
								>
									https://accountkit.alchemy.com/react-native/using-smart-accounts/send-user-operations
								</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</PageBody>
			<BottomNavigation/>
		</PageContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		// fontFamily: "SpaceMono",
	},
	separator: {
		marginVertical: 20,
		height: 1,
		width: "80%",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "black",
	},
	userText: {
		marginBottom: 10,
		fontSize: 20,
		// fontFamily: "Muli",
	},
	documentationLink: {
		fontSize: 16,
		padding: 5,
		backgroundColor: "rgba(233,70,186,0.15)",
		borderRadius: 4,
		color: "#e946ba",
		textDecorationLine: "underline",
		textDecorationStyle: "solid",
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#e946ba",
	},
});
