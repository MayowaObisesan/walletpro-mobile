import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Redirect, Stack, useRouter } from "expo-router";
import { Pressable, Platform, View, StyleSheet } from "react-native";

import { useSignerStatus } from "@account-kit/react-native";
import { AlchemySignerStatus } from "@account-kit/signer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLoadingIndicator } from "@/src/components/app-loading";
import {ThemeToggle} from "@src/components/ThemeToggle";
import {Button} from "@src/components/ui/button";
import {Text} from "@src/components/ui/text";

export default function MainLayout() {
	const { status, isAuthenticating } = useSignerStatus();
	const { top } = useSafeAreaInsets();
	const router = useRouter();

	if (isAuthenticating) {
		return <AppLoadingIndicator />;
	}

	if (status === AlchemySignerStatus.DISCONNECTED) {
		return <Redirect href={"/sign-in"} />;
	}

	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Welcome!",
					header: () => (
						<View className={'flex flex-row items-center justify-end'} style={[styles.header]}>
							<Button size={'icon'} variant={'ghost'}>
								<ThemeToggle />
							</Button>
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
						</View>
					),
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="menu"
				options={{
					header: () => (
						<View className={'flex flex-row items-center justify-end'} style={styles.menuHeaderContainer}>
							<Button size={'icon'} variant={'ghost'}>
								<ThemeToggle />
							</Button>
							<Pressable
								style={styles.closeButtonWrapper}
								onPressIn={() => router.dismiss()}
							>
								<Feather
									name="x"
									size={22}
									// color={"rgba(10, 10, 10, 0.75)"}
									className={'text-foreground'}
								/>
							</Pressable>
						</View>
					),
					headerShown: false,
					presentation:
						Platform.OS === "ios"
							? "formSheet"
							: "containedTransparentModal",
					animation:
						Platform.OS === "android"
							? "slide_from_bottom"
							: "default",
				}}
			/>
			<Stack.Screen
				name="oauth-callback"
				options={{
					headerShown: false,
				}}
			/>
			{/*<Stack.Screen
				name="accounts"
			/>
			<Stack.Screen
				name="send"
			/>
			<Stack.Screen
				name="history"
			/>
			<Stack.Screen
				name="settings"
			/>
			<Stack.Screen
				name="about"
			/>*/}
		</Stack>
	);
}

const styles = StyleSheet.create({
	menuHeaderContainer: {
		width: "100%",
		// backgroundColor: "white",
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	header: {
		width: "100%",
		// backgroundColor: "white",
		paddingVertical: 10,
		paddingHorizontal: 10,
		shadowColor: "#585757",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5.62,
		elevation: 8,
	},
	closeButtonWrapper: {
		width: 35,
		height: 35,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: "auto",

		borderRadius: 10,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "rgba(10, 10, 10, 0.5)",
	},
});
