"use client";

import { formatEther } from "viem";

interface Asset {
	symbol: string;
	name: string;
	value: number;
	price: number;
	imgUrl?: string;
}

interface MarketParametersProps {
	maxLTV?: number;
	liquidationThreshold?: number;
	supplyAssets?: Asset[];
	borrowAssets?: Asset[];
    txDone: boolean;
}

export function MarketParameters({
	maxLTV = 80.5,
	liquidationThreshold = 83,
	supplyAssets = [],
	borrowAssets = [],
    txDone
}: MarketParametersProps) {

    const formatEthNum = (num: number) => {
        return parseFloat(formatEther(num as unknown as bigint))
    }

	const formatNumber = (num: number, decimals: number = 2) => {
		return num.toFixed(decimals);
	};

	const formatAmount = (num: number, decimals: number) => {
		if (num > 1e15) {
			return (num / 1e18).toFixed(decimals);
		}
		return num.toFixed(decimals);
	};

    const assetMap = {
        usdc: 'USDC',
        weth: 'ETH'
    }

	const totalSupplied = supplyAssets.reduce((sum, asset) => sum + asset.value, 0);
	const totalBorrowed = borrowAssets.reduce((sum, asset) => sum + asset.value, 0);

	return (
		<div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-6 shadow-md mb-6">
			<h3 className="text-2xl font-bold text-red-900 mb-4">Your Position & Market Parameters</h3>

			{/* Supply and Borrow - Main Data */}
			<div className="grid md:grid-cols-2 gap-4 mb-6">
				{/* Supplied */}
				<div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
					<div className="text-sm text-gray-600 mb-1">Total Supplied</div>
					<div className="text-2xl font-bold text-green-600 mb-2">
						${txDone ? formatNumber(totalSupplied) : formatEthNum(totalSupplied)}
					</div>
					<div className="space-y-1">
						{supplyAssets.length > 0 ? (
							supplyAssets.map((asset, index) => (
								<div key={index} className="text-base font-semibold text-green-700">
									{asset.value / asset.price} {assetMap[asset.symbol]}
								</div>
							))
						) : (
							<div className="text-sm text-gray-500">No assets supplied</div>
						)}
					</div>
				</div>

				{/* Borrowed */}
				<div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
					<div className="text-sm text-gray-600 mb-1">Total Borrowed</div>
					<div className="text-2xl font-bold text-red-600 mb-2">
						${formatEthNum(totalBorrowed)}
					</div>
					<div className="space-y-1">
						{borrowAssets.length > 0 ? (
							borrowAssets.map((asset, index) => (
								<div key={index} className="text-base font-semibold text-red-700">
									{asset.value / asset.price} {assetMap[asset.symbol]}
								</div>
							))
						) : (
							<div className="text-sm text-gray-500">No borrows</div>
						)}
					</div>
				</div>
			</div>

			{/* Market Parameters */}
			<div className="grid grid-cols-2 gap-4">
				<div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
					<div className="text-sm text-gray-600 mb-1">Max LTV</div>
					<div className="text-2xl font-bold text-red-600">
						{formatNumber(maxLTV, 1)}%
					</div>
					<div className="text-xs text-gray-500 mt-1">
						Maximum loan-to-value ratio
					</div>
				</div>

				<div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
					<div className="text-sm text-gray-600 mb-1">Liquidation Threshold</div>
					<div className="text-2xl font-bold text-red-600">
						{formatNumber(liquidationThreshold, 0)}%
					</div>
					<div className="text-xs text-gray-500 mt-1">
						Liquidation occurs above this
					</div>
				</div>
			</div>
		</div>
	);
}
