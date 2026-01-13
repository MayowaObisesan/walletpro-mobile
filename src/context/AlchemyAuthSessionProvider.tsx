import {
	alchemy,
	defineAlchemyChain,
	arbitrum,
	arbitrumGoerli,
	arbitrumNova,
	arbitrumSepolia,
	base,
	baseSepolia,
	baseGoerli,
	beraChainBartio,
	bobaMainnet,
	bobaSepolia,
	celoSepolia,
	celoMainnet,
	fraxtal,
	fraxtalSepolia,
	goerli,
	gensynTestnet,
	inkMainnet,
	inkSepolia,
	mainnet,
	mekong,
	monadTestnet,
	optimism,
	optimismSepolia,
	optimismGoerli,
	opbnbMainnet,
	opbnbTestnet,
	openlootSepolia,
	polygon,
	polygonAmoy,
	polygonMumbai,
	riseTestnet,
	sepolia,
	shape,
	shapeSepolia,
	soneiumMainnet,
	soneiumMinato,
	storyAeneid,
	storyMainnet,
	teaSepolia,
	unichainMainnet,
	unichainSepolia,
	worldChain,
	worldChainSepolia,
	zora,
	zoraSepolia,
} from "@account-kit/infra"
import { QueryClient } from "@tanstack/react-query";
import {
	AlchemyAccountProvider,
	createConfig,
} from "@account-kit/react-native";
import Constants from "expo-constants";
import {defaultAlchemyChain} from "@src/config/chains";

const queryClient = new QueryClient();

export const AlchemyAuthSessionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const config = createConfig({
		chain: defaultAlchemyChain,
		chains: [
			{
				chain: sepolia,
				policyId: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_POLICY_ID!,
			},
			{
				chain: mainnet,
				policyId: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_POLICY_ID!,
			},
			{
				chain: arbitrum,
				policyId: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_POLICY_ID!,
			},
			{
				chain: base,
				policyId: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_POLICY_ID!,
			},
			{
				chain: baseSepolia,
				policyId: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_POLICY_ID!,
			},
			{
				chain: optimism,
				policyId: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_POLICY_ID!,
			},
			{
				chain: inkMainnet,
				policyId: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_POLICY_ID!,
			},
		],
		transport: alchemy({
			apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY!,
		}),
		signerConnection: {
			apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY!,
		},
		sessionConfig: {
			expirationTimeMs: 1000 * 60 * 60 * 24, // <-- Adjust the session expiration time as needed (currently 24 hours)
		},
	});

	return (
		<AlchemyAccountProvider config={config} queryClient={queryClient}>
			{children}
		</AlchemyAccountProvider>
	);
};
