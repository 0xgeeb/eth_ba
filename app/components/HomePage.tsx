"use client"

import { useState } from 'react';
import { AavePositionCard } from './AavePositionCard';

export function HomePage() {

    const [address, setAddress] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWalletData = async () => {
        if (!address) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/wallet?address=${encodeURIComponent(address)}`);
            const result = await response.json();

            console.log('API Response:', result);

            if (!response.ok) {
                setError(result.error || 'Failed to fetch data');
                setData(null);
            } else {
                setData(result);
                setError(null);
            }
        } catch (err) {
            setError('Failed to fetch wallet data');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

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
                <div className="flex gap-2 mb-8">
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter wallet address"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded"
                    />
                    <button
                        onClick={fetchWalletData}
                        disabled={loading || !address}
                        className="px-6 py-2 bg-red-600 text-white rounded disabled:bg-gray-400"
                    >
                        {loading ? 'Loading...' : 'Fetch'}
                    </button>
                </div>

                {error && (
                    <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {data && (
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