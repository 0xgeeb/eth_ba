"use client"

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AavePositionCard } from './AavePositionCard';

export function HomePage() {

    const { address, isConnected } = useAccount();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWalletData = async (walletAddress: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/wallet?address=${encodeURIComponent(walletAddress)}`);

            if (!response.ok) {
                let errorMessage = 'Failed to fetch data';
                try {
                    const result = await response.json();
                    errorMessage = result.error || errorMessage;
                    if (result.details) {
                        console.error('API Error Details:', result.details);
                    }
                } catch (jsonError) {
                    console.error('Failed to parse error response:', jsonError);
                }
                setError(errorMessage);
                setData(null);
            } else {
                const result = await response.json();
                console.log('API Response:', result);
                setData(result);
                setError(null);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Network error - failed to fetch wallet data';
            setError(errorMessage);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected && address) {
            fetchWalletData(address);
        } else {
            setData(null);
            setError(null);
        }
    }, [address, isConnected]);

    const wallet = Array.isArray(data) ? data[0] : null;
    const lendingPosition = wallet?.assetByProtocols?.aave3?.chains?.ethereum?.protocolPositions?.LENDING?.protocolPositions?.[0];
    const supplyAssets = lendingPosition?.supplyAssets || [];
    const borrowAssets = lendingPosition?.borrowAssets || [];
    const hasAavePositions = supplyAssets.length > 0 || borrowAssets.length > 0;

    return (
        <div className="flex flex-col items-center min-h-screen bg-white p-8">
            <h1 className="text-7xl text-red-600 mb-8">
                Octaave
            </h1>

            <div className="w-full max-w-4xl">
                <div className="flex justify-center mb-8">
                    <ConnectButton />
                </div>

                {loading && (
                    <div className="text-center text-gray-600 mb-4">
                        Loading wallet data...
                    </div>
                )}

                {error && (
                    <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {!isConnected && !loading && (
                    <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-600">
                        Connect your wallet to view your AAVE positions
                    </div>
                )}

                {isConnected && data && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">AAVE Positions</h2>
                        {hasAavePositions ? (
                            <div className="grid gap-6 md:grid-cols-2">
                                {supplyAssets.length > 0 && (
                                    <AavePositionCard assets={supplyAssets} type="supply" />
                                )}
                                {borrowAssets.length > 0 && (
                                    <AavePositionCard assets={borrowAssets} type="borrow" />
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-600">
                                No AAVE positions found for this wallet
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}