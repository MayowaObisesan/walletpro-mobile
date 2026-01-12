import {useUser, useSmartAccountClient, useChain} from "@account-kit/react-native";
import {StyleSheet, View, Text, Linking, ScrollView, ActivityIndicator} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as AvatarPrimitive from '@rn-primitives/avatar';
import {shortenAddress} from "@src/utils";
import {Link} from "expo-router";
import {useEffect, useState} from "react";
import {formatEther} from "viem";

const GITHUB_AVATAR_URI = 'https://github.com/mrzachnugent.png';

export default function TabOneScreen() {
	const user = useUser();
	const { bottom } = useSafeAreaInsets();
	const { client, isLoadingClient } = useSmartAccountClient({
		type: "ModularAccountV2",
	});
	const { chain, setChain, isSettingChain } = useChain();
	const [myBalance, setMyBalance] = useState<bigint | undefined>()

	const account = client?.account;

	if (!user) return null;

	console.log("[Main Index] Wallet address", user?.address);

	useEffect(() => {
		const _balance = async () => {
			const bal = await client?.getBalance({ address: user.address, blockTag: 'latest' });
			setMyBalance(bal);
			console.log("[MAIN INDEX] Balance ", bal, Number(bal));
		}
		_balance()
	}, [client]);

	if (isLoadingClient) {
		return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
			<ActivityIndicator size={'large'}></ActivityIndicator>
			<Text style={{ fontSize: 16, fontWeight: '500' }}>Initializing the App for you...</Text>
		</View>
	}

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
			}}
		>
			<View style={styles.container}>
				<Text
					style={[
						styles.userText,
						{
							fontSize: 50,
						},
					]}
				>
					Welcome!
				</Text>
				{/*<Text style={styles.userText}>{user.email}</Text>*/}
				<View style={styles.separator} />

				<AvatarPrimitive.Root alt="Zach Nugent's Avatar">
					<AvatarPrimitive.Image source={{ uri: GITHUB_AVATAR_URI }} />
					<AvatarPrimitive.Fallback>
						<Text>ZN</Text>
					</AvatarPrimitive.Fallback>
				</AvatarPrimitive.Root>

				{/* User Details */}
				<View>
					<Text style={styles.userText}>OrgId: {user.orgId}</Text>
					<Text style={styles.userText}>Address: {shortenAddress(user.address)}</Text>
					<Text style={styles.userText}>Solana Address: {user.solanaAddress}</Text>
					{
						!!myBalance?.toString()
						&& <Text style={styles.userText}>Balance: {formatEther(myBalance as bigint, 'wei')} {chain.nativeCurrency.symbol}</Text>
					}
					<Text style={styles.userText}>Chain: {chain.name} - {chain.id} - {chain.nativeCurrency.name}</Text>
					<Text style={styles.userText}>
						Light Account Address: {account?.address}
					</Text>
				</View>

				<View style={styles.separator} />

				<View>
					<Link href={'/accounts'}>Accounts Screen</Link>
					<Link href={'/send'}>Send Screen</Link>
					<Link href={'/history'}>History Screen</Link>
					<Link href={'/settings'}>Settings Screen</Link>
				</View>

				{/* Documentation Info */}
				<View style={{ marginTop: "auto", marginBottom: bottom }}>
					<Text style={[styles.userText, { marginBottom: 20 }]}>
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
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingHorizontal: 15,
		backgroundColor: "white",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		fontFamily: "SpaceMono",
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
		fontSize: 18,
		fontFamily: "SpaceMono",
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
