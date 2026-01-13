import "node-libs-react-native/globals.js";
import "react-native-get-random-values";
// Add global shims
import "@account-kit/react-native";
import "react-native-reanimated";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AlchemyAuthSessionProvider } from "@src/context/AlchemyAuthSessionProvider";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import { Platform } from "react-native";
import '../global.css'
import {PortalHost} from "@rn-primitives/portal";
import {useColorScheme} from "@src/hooks/useColorScheme";
import {DARK_THEME, LIGHT_THEME} from "@/src/lib/theme";
import {ThemeProvider} from "@react-navigation/native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "(main)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	// Feel free to load and use whatever fonts of your choosing.
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		MuliLight: require("../assets/fonts/muli/Muli-Light.ttf"),
		Muli: require("../assets/fonts/muli/Muli.ttf"),
		MuliBold: require("../assets/fonts/muli/Muli-Bold.ttf"),
		MuliSemiBold: require("../assets/fonts/muli/Muli-SemiBold.ttf"),
		...FontAwesome.font,
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const {colorScheme, isDarkColorScheme} = useColorScheme();
	const theme = isDarkColorScheme ? DARK_THEME : LIGHT_THEME

	return (
		<AlchemyAuthSessionProvider>
			<ThemeProvider value={theme}>
				<SafeAreaProvider>
					<SafeAreaView style={{ flex: 1, backgroundColor: isDarkColorScheme ? DARK_THEME.colors.background : LIGHT_THEME.colors.background }}>
						<Stack
							screenOptions={{
								headerShown: false,
								// contentStyle: { backgroundColor: isDarkColorScheme ? DARK_THEME.colors.background : LIGHT_THEME.colors.background }
							}}
						>
							<Stack.Screen
								name="otp-modal"
								options={{
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
								name="accounts/index"
								options={{
									animation:
										Platform.OS === "android"
											? "slide_from_bottom"
											: "default",
								}}
							/>
						</Stack>
					</SafeAreaView>
				</SafeAreaProvider>
				<PortalHost />
			</ThemeProvider>
		</AlchemyAuthSessionProvider>
	);
}
