"use client";

import { useState } from 'react';

interface WhatIfSimulatorProps {
    currentCollateralValue: number;
    currentDebtValue: number;
    currentHealthFactor: number;
    liquidationThreshold: number;
}

export function WhatIfSimulator({
    currentCollateralValue,
    currentDebtValue,
    currentHealthFactor,
    liquidationThreshold
}: WhatIfSimulatorProps) {
    const [borrowMore, setBorrowMore] = useState(0);
    const [repayAmount, setRepayAmount] = useState(0);
    const [addCollateral, setAddCollateral] = useState(0);
    const [priceChange, setPriceChange] = useState(0);

    // Calculate simulated health factor
    const simulatedCollateral = currentCollateralValue * (1 + priceChange / 100) + addCollateral;
    const simulatedDebt = currentDebtValue + borrowMore - repayAmount;
    const simulatedHealthFactor = simulatedDebt > 0
        ? (simulatedCollateral * (liquidationThreshold / 100)) / simulatedDebt
        : 0;


    const getHealthColor = (hf: number) => {
        if (hf < 1.0) return 'text-red-600';
        if (hf >= 2) return 'text-green-600';
        if (hf >= 1.5) return 'text-yellow-600';
        if (hf >= 1.0) return 'text-orange-600';
        return 'text-red-600';
    };

    const getBgColor = (hf: number) => {
        if (hf < 1.0) return 'bg-red-100 border-red-400';
        if (hf >= 2) return 'bg-green-50 border-green-200';
        if (hf >= 1.5) return 'bg-yellow-50 border-yellow-200';
        if (hf >= 1.0) return 'bg-orange-50 border-orange-200';
        return 'bg-red-50 border-red-200';
    };

    const getHealthStatus = (hf: number) => {
        if (hf < 1.0) return '🚨 LIQUIDATED';
        if (hf >= 2) return '✅ Safe';
        if (hf >= 1.5) return '⚠️ Moderate Risk';
        if (hf >= 1.0) return '⚠️ High Risk';
        return '🚨 Critical';
    };

    const resetSimulator = () => {
        setBorrowMore(0);
        setRepayAmount(0);
        setAddCollateral(0);
        setPriceChange(0);
    };

    const healthFactorChange = simulatedHealthFactor - currentHealthFactor;
    const isImproving = healthFactorChange > 0;

    return (
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-6 shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-red-900">🎛️ What-If Simulator</h3>
                <button
                    onClick={resetSimulator}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    Reset
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left side - Sliders */}
                <div className="space-y-4">
                    {/* Borrow More */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-semibold text-red-900">🔧 Borrow More</label>
                            <span className="text-sm font-bold text-red-600">${borrowMore.toFixed(0)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={currentCollateralValue * 0.5}
                            step="100"
                            value={borrowMore}
                            onChange={(e) => setBorrowMore(Number(e.target.value))}
                            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                        />
                    </div>

                    {/* Repay */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-semibold text-red-900">💸 Repay Debt</label>
                            <span className="text-sm font-bold text-red-600">${repayAmount.toFixed(0)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={currentDebtValue}
                            step="100"
                            value={repayAmount}
                            onChange={(e) => setRepayAmount(Number(e.target.value))}
                            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                        />
                    </div>

                    {/* Add Collateral */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-semibold text-red-900">🧱 Add Collateral</label>
                            <span className="text-sm font-bold text-red-600">${addCollateral.toFixed(0)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={currentCollateralValue}
                            step="100"
                            value={addCollateral}
                            onChange={(e) => setAddCollateral(Number(e.target.value))}
                            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                        />
                    </div>

                    {/* Price Change */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-semibold text-red-900">📊 ETH Price Change</label>
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
                </div>

                {/* Right side - Results */}
                <div className="space-y-4">
                    {/* Current Health Factor */}
                    <div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
                        <div className="text-sm text-red-900 font-semibold mb-1">Current Health Factor</div>
                        <div className={`text-3xl font-bold ${getHealthColor(currentHealthFactor)}`}>
                            {currentHealthFactor.toFixed(2)}
                        </div>
                    </div>

                    {/* Simulated Health Factor */}
                    <div className={`rounded-lg p-4 border-2 ${getBgColor(simulatedHealthFactor)}`}>
                        <div className="text-sm font-semibold text-gray-700 mb-1">Simulated Health Factor</div>
                        <div className={`text-4xl font-bold ${getHealthColor(simulatedHealthFactor)}`}>
                            {simulatedHealthFactor.toFixed(2)}
                        </div>
                        <div className="text-sm font-bold mt-1">
                            {getHealthStatus(simulatedHealthFactor)}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
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

                    {/* Summary */}
                    <div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
                        <div className="text-xs font-semibold text-red-900 mb-2">Scenario Summary</div>
                        <div className="space-y-1 text-xs text-gray-700">
                            <div className="flex justify-between">
                                <span>Collateral:</span>
                                <span className="font-bold text-red-700">${simulatedCollateral.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Debt:</span>
                                <span className="font-bold text-red-700">${simulatedDebt.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-red-200 pt-1 mt-1">
                                <span>LTV Ratio:</span>
                                <span className="font-bold text-red-700">
                                    {simulatedCollateral > 0 ? ((simulatedDebt / simulatedCollateral) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Liquidation Warning */}
                    {simulatedHealthFactor < 1.0 && simulatedHealthFactor > 0 && (
                        <div className="bg-red-600 text-white border-2 border-red-800 rounded-lg p-4 animate-pulse">
                            <div className="text-base font-bold">🚨 LIQUIDATION!</div>
                            <div className="text-sm mt-1 font-semibold">
                                Health Factor below 1.0 - Your position will be liquidated!
                            </div>
                        </div>
                    )}

                    {/* High Risk Warning */}
                    {simulatedHealthFactor >= 1.0 && simulatedHealthFactor < 1.2 && (
                        <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
                            <div className="text-sm font-bold text-orange-800">⚠️ High Risk</div>
                            <div className="text-xs text-orange-700 mt-1">
                                You're close to liquidation! Health factor must stay above 1.0.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
