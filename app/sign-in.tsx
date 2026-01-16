import { useAuthenticate, useSignerStatus } from "@account-kit/react-native";

import { Redirect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
	View,
	ViewStyle,
	StyleProp,
	StyleSheet,
	Dimensions,
	TextInput,
	Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@src/components/ui/text"
import {ThemeToggle} from "@src/components/ThemeToggle";
import {Button} from "@src/components/ui/button";
import {Input} from "@src/components/ui/input";

const windowWidth = Dimensions.get("window").width;

export default function SignIn() {
	const [email, setEmail] = useState("");
	const router = useRouter();
	const { top, bottom } = useSafeAreaInsets();
	const { authenticateAsync } = useAuthenticate();
	const { isConnected } = useSignerStatus();

	const onSignIn = useCallback(async () => {
		try {
			authenticateAsync({
				type: "email",
				email,
				emailMode: "otp",
			});

			router.navigate("/otp-modal");
		} catch (e) {
			console.error(
				"Unable to send OTP to user. Ensure your credentials are properly set: ",
				e
			);
		}
	}, [email]);

	const onSignInGoogle = useCallback(async () => {
		try {
			authenticateAsync({
				type: "oauth",
				// NOTE: Ensure your app's scheme is properly whitelisted in your Alchemy dashboard. Refer to our docs here: https://accountkit.alchemy.com/react-native/signer/setup-guide#dashboard-setup for more details.
				redirectUrl: "account-kit-expo-quickstart://oauth-callback",
				mode: "redirect",
				authProviderId: "google",
			});
		} catch (e) {
			console.error("Error signing in with Google: ", e);
		}
	}, []);

	if (isConnected) {
		return <Redirect href={"/"} />;
	}

	const signInDisabled = email.length < 1;

	return (
		<View style={conatinerStyles({ top, bottom })}>
			<View className={'flex-1 justify-end items-center gap-4'}>
				<View className={'flex-1 items-center rounded-3xl bg-card p-4'}>
					<Text className={'text-center'}>{" "}</Text>
				</View>
				<Button className={'items-center mb-4 rounded-2xl size-12'} size={'icon'} variant={'secondary'}>
					<Text>
						<ThemeToggle />
					</Text>
				</Button>
			</View>
			<View className="items-center justify-center">
			</View>
			<View className={'gap-5'} style={styles.formContainer}>
				<View className={'items-center gap-1'}>
					<Text className={'font-medium text-xl text-muted-foreground'} style={styles.titleText}>
						Welcome
					</Text>
					<Text className={'font-semibold text-xl'} style={styles.titleText}>
						{/*Enter Your Email to Sign In.*/}
						Get started using your Email.
					</Text>
				</View>
				<View className={'gap-4'} style={styles.textInputContainer}>
					<Input
						className={'h-16 rounded-2xl px-5'}
						value={email}
						onChangeText={(val) => setEmail(val.toLowerCase())}
						placeholder={"john@doe.com"}
					/>
					<Button
						className={'h-14 rounded-2xl scale-90'}
						disabled={signInDisabled}
						size={'lg'}
						onPress={onSignIn}
					>
						<Text className={'text-lg leading-tight'}>Sign In</Text>
					</Button>

					{/*<TextInput
						style={styles.textInput}
						value={email}
						onChangeText={(val) => setEmail(val.toLowerCase())}
						placeholder="john@doe.com"
					/>*/}
					{/*<Pressable onPress={onSignIn} disabled={signInDisabled}>
						{({ pressed }) => (
							<View
								style={[
									styles.signInButton,
									{
										opacity:
											pressed || signInDisabled ? 0.5 : 1,
										transform: [
											{
												scale: pressed ? 0.98 : 1,
											},
										],
									},
								]}
							>
								<Text style={[styles.signInText]}>Sign In</Text>
							</View>
						)}
					</Pressable>*/}
				</View>
			</View>

			<View className={'hidden'} style={{ marginTop: 20 }}>
				<Text style={styles.orText}>Or</Text>
				<Pressable onPress={onSignInGoogle}>
					{({ pressed }) => (
						<View
							style={[
								styles.signInButtonGoogle,
								{ opacity: pressed ? 0.5 : 1 },
							]}
						>
							<Text style={styles.signInText}>
								Sign In with Google
							</Text>
						</View>
					)}
				</Pressable>
			</View>
		</View>
	);
}

interface StyleProps {
	top: number;
	bottom: number;
}
const conatinerStyles = ({
	top,
	bottom,
}: StyleProps): StyleProp<ViewStyle> => ({
	paddingTop: top + 10,
	paddingBottom: bottom,
	justifyContent: "center",
	alignItems: "center",
	flex: 1,
	// backgroundColor: "rgba(50, 50, 50, 0.2)",
});

const styles = StyleSheet.create({
	formContainer: {
		width: windowWidth * 0.8,
		// backgroundColor: "white",
		borderRadius: 20,
		// shadowColor: "#585757",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5.62,
		elevation: 8,
		paddingHorizontal: 20,
		paddingVertical: 30,
	},
	orText: {
		fontFamily: "Muli",
		textAlign: "center",
		marginBottom: 10,
		fontSize: 16,
	},

	titleText: {
		// fontFamily: "SpaceMono",
	},
	textInputContainer: {
		marginTop: 10,
		width: "100%",
	},

	textInput: {
		width: "100%",
		height: 40,
		borderColor: "rgba(0,0,0,0.095)",
		borderWidth: 1,
		paddingHorizontal: 10,
		backgroundColor: "rgba(0,0,0,0.025)",
		marginBottom: 10,
		borderRadius: 10,
	},

	signInButton: {
		width: "100%",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgb(0, 0, 0)",
	},

	signInButtonGoogle: {
		width: 250,
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgb(16, 133, 244)",
	},

	signInText: {
		color: "white",
		// fontFamily: "SpaceMono",
	},
});
