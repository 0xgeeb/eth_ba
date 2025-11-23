"use client";

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { parseEther, formatEther } from 'viem';

const AAVE_ETH_STAKING_CONTRACT = '0xd01607c3C5eCABa394D8be377a08590149325722';
const AAVE_ETH_POOL = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'

const STAKING_ABI = [
    {
        inputs: [
            { name: '', type: 'address' },
            { name: 'onBehalfOf', type: 'address' },
            { name: 'referralCode', type: 'uint16' }
        ],
        name: 'depositETH',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    }
] as const;

interface Asset {
    symbol: string;
    name: string;
    value: number;
    price: number;
}

interface LoanManagementProps {
    currentCollateralValue: number;
    currentDebtValue: number;
    currentHealthFactor: number;
    liquidationThreshold: number;
    supplyAssets?: Asset[];
    borrowAssets?: Asset[];
    onTransactionSuccess?: () => void;
}

export function LoanManagement({
    currentCollateralValue,
    currentDebtValue,
    currentHealthFactor,
    liquidationThreshold,
    supplyAssets = [],
    borrowAssets = [],
    onTransactionSuccess
}: LoanManagementProps) {
    const [ethAmount, setEthAmount] = useState('');
    const [priceChange, setPriceChange] = useState(0);

    
    // Extract ETH price from assets
    const getEthPrice = () => {
        // Look for WETH in supply or borrow assets
        const wethAsset = [...supplyAssets, ...borrowAssets].find(
            asset => asset.symbol.toLowerCase() === 'weth' || asset.symbol.toLowerCase() === 'eth'
        );
        return wethAsset.price
    };

    const ethPrice = getEthPrice();

    const { address } = useAccount();
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });
    const { data: balanceData } = useBalance({
        address: address,
    });
    
    // Handle transaction success
    useEffect(() => {
        if (isSuccess) {
            // Clear inputs
            setEthAmount('');
            setPriceChange(0);
            // Refetch wallet data
            if (onTransactionSuccess) {
                onTransactionSuccess();
            }
        }
    }, [isSuccess, onTransactionSuccess]);

    // Calculate simulated values - ensure all values are numbers
    const ethValue = ethAmount ? parseFloat(ethAmount) * Number(ethPrice) : 0;
    const simulatedCollateral = Number(currentCollateralValue) * (1 + priceChange / 100) + ethValue;
    const simulatedDebt = Number(currentDebtValue);
    const simulatedHealthFactor = simulatedDebt > 0
        ? (simulatedCollateral * (Number(liquidationThreshold) / 100)) / simulatedDebt
        : 0;


    const getHealthColor = (hf: number) => {
        if (hf < 1.0) return 'text-red-600';
        if (hf >= 2) return 'text-green-600';
        if (hf >= 1.5) return 'text-yellow-600';
        if (hf >= 1.0) return 'text-orange-600';
        return 'text-red-600';
    };

    const getHealthStatus = (hf: number) => {
        if (hf < 1.0) return '🚨 LIQUIDATED';
        if (hf >= 2) return '✅ Safe';
        if (hf >= 1.5) return '⚠️ Moderate Risk';
        if (hf >= 1.0) return '⚠️ High Risk';
        return '🚨 Critical';
    };

    const getBgColor = (hf: number) => {
        if (hf < 1.0) return 'bg-red-100 border-red-400';
        if (hf >= 2) return 'bg-green-50 border-green-200';
        if (hf >= 1.5) return 'bg-yellow-50 border-yellow-200';
        if (hf >= 1.0) return 'bg-orange-50 border-orange-200';
        return 'bg-red-50 border-red-200';
    };

    // Calculate position on the health bar
    const getBarPosition = (hf: number) => {
        if (hf <= 0.5) return 0;
        if (hf >= 3) return 100;

        if (hf < 1.0) {
            return ((hf - 0.5) / 0.5) * 25;
        } else if (hf < 2.0) {
            return 25 + ((hf - 1.0) / 1.0) * 50;
        } else {
            return 75 + ((hf - 2.0) / 1.0) * 25;
        }
    };

    const currentPosition = getBarPosition(currentHealthFactor);
    const simulatedPosition = getBarPosition(simulatedHealthFactor);

    const healthFactorChange = simulatedHealthFactor - currentHealthFactor;
    const isImproving = healthFactorChange > 0;

    const handleTopUp = async () => {
        if (!ethAmount || parseFloat(ethAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!address) {
            alert('Please connect your wallet');
            return;
        }

        try {
            writeContract({
                address: AAVE_ETH_STAKING_CONTRACT,
                abi: STAKING_ABI,
                functionName: 'depositETH',
                args: [
                    AAVE_ETH_POOL as `0x${string}`,
                    address as `0x${string}`,
                    0
                ],
                value: parseEther(ethAmount),
                account: address,
                chain: mainnet
            });
        } catch (err) {
            console.error('Error topping up:', err);
        }
    };

    return (
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-2xl font-bold text-red-900 mb-4">Manage Your Loan</h3>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Current & Simulated Health */}
                <div className="space-y-4">
                    {/* Current Health Factor */}
                    <div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
                        <div className="text-sm text-red-900 font-semibold mb-1">Current Health Factor</div>
                        <div className={`text-3xl font-bold ${getHealthColor(currentHealthFactor)}`}>
                            {currentHealthFactor.toFixed(2)}
                        </div>
                        <div className="text-sm mt-1">{getHealthStatus(currentHealthFactor)}</div>
                    </div>

                    {/* Health Factor Bar */}
                    <div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
                        <div className="text-sm font-semibold text-red-900 mb-3">Health Factor Visualization</div>
                        <div className="relative w-full h-6 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 shadow-inner mb-2">
                            {/* Current position indicator */}
                            <div
                                className="absolute top-0 h-full w-1 bg-gray-800 shadow-lg transition-all duration-500"
                                style={{ left: `${currentPosition}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-bold">
                                    Current: {currentHealthFactor.toFixed(2)}
                                </div>
                            </div>
                            {/* Simulated position indicator */}
                            {(ethAmount || priceChange !== 0) && (
                                <div
                                    className="absolute top-0 h-full w-1 bg-blue-600 shadow-lg transition-all duration-500"
                                    style={{ left: `${simulatedPosition}%` }}
                                >
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-bold">
                                        After: {simulatedHealthFactor.toFixed(2)}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between text-xs text-red-900 font-semibold mt-3">
                            <span>Liquidation (&lt;1.0)</span>
                            <span>Safe (&gt;2.0)</span>
                        </div>
                    </div>

                    {/* Simulated Result */}
                    {(ethAmount || priceChange !== 0) && (
                        <div className={`rounded-lg p-4 border-2 ${getBgColor(simulatedHealthFactor)}`}>
                            <div className="text-sm font-semibold text-gray-700 mb-1">Simulated Health Factor</div>
                            <div className={`text-3xl font-bold ${getHealthColor(simulatedHealthFactor)}`}>
                                {simulatedHealthFactor.toFixed(2)}
                            </div>
                            <div className="text-sm font-bold mt-1">
                                {getHealthStatus(simulatedHealthFactor)}
                            </div>
                            <div className="mt-2">
                                {isImproving ? (
                                    <span className="text-sm font-semibold text-green-600">
                                        ↑ +{Math.abs(healthFactorChange).toFixed(2)} (Better)
                                    </span>
                                ) : healthFactorChange < 0 ? (
                                    <span className="text-sm font-semibold text-red-600">
                                        ↓ {healthFactorChange.toFixed(2)} (Worse)
                                    </span>
                                ) : (
                                    <span className="text-sm font-semibold text-gray-600">
                                        No change
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Liquidation Warning */}
                    {simulatedHealthFactor < 1.0 && simulatedHealthFactor > 0 && (
                        <div className="bg-red-600 text-white border-2 border-red-800 rounded-lg p-4 animate-pulse">
                            <div className="text-base font-bold">🚨 LIQUIDATION!</div>
                            <div className="text-sm mt-1 font-semibold">
                                Health Factor below 1.0 - Your position will be liquidated!
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Controls */}
                <div className="space-y-4">
                    {/* Price Change Slider */}
                    <div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-semibold text-red-900">📊 Simulate ETH Price Change</label>
                            <span className={`text-sm font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {priceChange > 0 ? '+' : ''}{priceChange}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-50"
                            max="50"
                            step="1"
                            value={priceChange}
                            onChange={(e) => setPriceChange(Number(e.target.value))}
                            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                        />
                        <div className="flex justify-between text-xs text-red-800 font-medium mt-1">
                            <span>-50%</span>
                            <span>0%</span>
                            <span>+50%</span>
                        </div>
                    </div>

                    {/* Add Collateral Input */}
                    <div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
                        <label className="block text-sm font-semibold text-red-900 mb-2">
                            Add ETH Collateral
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            min="0"
                            value={ethAmount}
                            onChange={(e) => setEthAmount(e.target.value)}
                            placeholder="0.0"
                            className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-lg font-semibold"
                        />
                        <div className="text-xs text-gray-600 mt-2 space-y-1">
                            <div>ETH Price: ${ethPrice.toLocaleString()}</div>
                            <div>Value: ${(parseFloat(ethAmount || '0') * ethPrice).toFixed(2)}</div>
                            {balanceData && (
                                <div className="font-semibold text-gray-800">
                                    Wallet Balance: {parseFloat(formatEther(balanceData.value)).toFixed(4)} ETH
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Transaction Status */}
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm font-medium">
                            Error: {error.message}
                        </div>
                    )}

                    {isSuccess && (
                        <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm font-medium">
                            Success! Transaction confirmed.
                        </div>
                    )}

                    {/* Top Up Button */}
                    <button
                        onClick={handleTopUp}
                        disabled={isPending || isConfirming || !ethAmount || parseFloat(ethAmount) <= 0}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg text-lg"
                    >
                        {isPending || isConfirming ? 'Confirming...' : `Supply ${ethAmount || '0'} ETH`}
                    </button>
                </div>
            </div>
        </div>
    );
}
