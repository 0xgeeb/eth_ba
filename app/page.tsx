"use client";

import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { rabbyWallet, rainbowWallet } from "@rainbow-me/rainbowkit/wallets"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

import { HomePage } from "./components/HomePage"

export default function Home() {

	const connectors = connectorsForWallets(
		[
			{
				groupName: "Wallets",
				wallets: [rabbyWallet, rainbowWallet]
			}
		],
		{
			appName: "Octaave",
			projectId: "YOUR_PROJECT_ID"
		}
	)

	const config = createConfig({
		connectors,
		chains: [mainnet],
		transports: {
			[mainnet.id]: http()
		},
		ssr: true
	});
	const queryClient = new QueryClient();

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<HomePage />
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
