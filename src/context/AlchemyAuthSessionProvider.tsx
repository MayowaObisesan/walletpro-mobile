import {
	alchemy,
	sepolia,
} from "@account-kit/infra"
import { QueryClient } from "@tanstack/react-query";
import {
	AlchemyAccountProvider,
	createConfig,
} from "@account-kit/react-native";
import Constants from "expo-constants";
import {alchemyChains, defaultAlchemyChain} from "@src/config/chains";

const queryClient = new QueryClient();

const res = alchemyChains.map((it) => {
	return {
		chain: it,
		policyId: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_POLICY_ID!,
	}
});

export const AlchemyAuthSessionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const config = createConfig({
		chain: defaultAlchemyChain,
		chains: res,
		transport: alchemy({
			apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY!,
		}),
		signerConnection: {
			apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY!,
		},
		sessionConfig: {
			expirationTimeMs: 1000 * 60 * 60 * 24, // <-- Adjust the session expiration time as needed (currently 24 hours)
		},
		policyId: '1b26fa3c-8e1e-46c7-b96c-0fd876a23b2a',
	});

	return (
		<AlchemyAccountProvider config={config} queryClient={queryClient}>
			{children}
		</AlchemyAccountProvider>
	);
};
