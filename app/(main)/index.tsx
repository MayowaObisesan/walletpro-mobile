import {useUser, useSmartAccountClient, useChain} from "@account-kit/react-native";
import {StyleSheet, View, Linking, ScrollView, ActivityIndicator, Pressable} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as AvatarPrimitive from '@rn-primitives/avatar';
import {shortenAddress} from "@src/utils";
import {Link, router} from "expo-router";
import React, {useEffect, useState} from "react";
import {formatEther} from "viem";
import {Text} from "@src/components/ui/text";
import {BottomNavigation} from "@src/components/Navigation";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Button} from "@src/components/ui/button";
import {ThemeToggle} from "@src/components/ThemeToggle";
import Feather from "@expo/vector-icons/Feather";
import {Avatar, AvatarFallback, AvatarImage} from "@src/components/ui/avatar";
import {ChainSelect} from "@src/components/ChainSelect";

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

	useEffect(() => {
		const _balance = async () => {
			const bal = await client?.getBalance({ address: user.address, blockTag: 'latest' });
			setMyBalance(bal);
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
		<PageContainer>
			<PageHeader>
				<View className={'flex-1 flex flex-row items-center justify-end p-2'}>
					<Button size={'icon'} variant={'ghost'}>
						<ThemeToggle />
					</Button>
					<ChainSelect />
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
					<Avatar
						alt="Zach Nugent's Avatar"
						className={'size-12'}
					>
						<AvatarImage source={{ uri: '' }} />
						<AvatarFallback>
							<Text>BM</Text>
						</AvatarFallback>
					</Avatar>
				</View>
			</PageHeader>
			<PageBody>
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
									lineHeight: 100,
								},
							]}
						>
							Welcome!
						</Text>
						{/*<Text style={styles.userText}>{user.email}</Text>*/}

						{/* User Details */}
						<View>
							{/*<Text style={styles.userText}>OrgId: {user.orgId}</Text>*/}
							<Text style={styles.userText}>Address: {shortenAddress(user.address)}</Text>
							<Text style={styles.userText}>Solana Address: {user.solanaAddress}</Text>
							{
								!!myBalance?.toString()
								&& <Text
									style={styles.userText}>Balance: {formatEther(myBalance as bigint, 'wei')} {chain.nativeCurrency.symbol}</Text>
							}
							<Text style={styles.userText}>Chain: {chain.name} - {chain.id} - {chain.nativeCurrency.name}</Text>
							{/*<Text style={styles.userText}>
								Light Account Address: {account?.address}
							</Text>*/}
						</View>

						<View style={styles.separator}/>

						{/* Documentation Info */}
						<View style={{marginTop: "auto", marginBottom: bottom}}>
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
		paddingHorizontal: 15,
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
		fontSize: 18,
		fontFamily: "MuliLight",
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
