'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

import { HomePage } from "./components/HomePage"

export default function Home() {

	const config = getDefaultConfig({
		appName: 'My RainbowKit App',
		projectId: 'YOUR_PROJECT_ID',
		chains: [mainnet],
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
