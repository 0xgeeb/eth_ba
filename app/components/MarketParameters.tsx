"use client";

interface MarketParametersProps {
	maxLTV?: number;
	liquidationThreshold?: number;
}

export function MarketParameters({
	maxLTV = 80.5,
	liquidationThreshold = 83
}: MarketParametersProps) {

	const formatNumber = (num: number, decimals: number = 2) => {
		return num.toFixed(decimals);
	};

	return (
		<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-md mb-6">
			<h3 className="text-2xl font-bold text-blue-900 mb-4">ETH Market Parameters</h3>

			<div className="grid grid-cols-2 gap-4">
				<div className="bg-white rounded-lg p-4 border border-blue-100">
					<div className="text-sm text-gray-600 mb-1">Max LTV</div>
					<div className="text-2xl font-bold text-blue-600">
						{formatNumber(maxLTV, 1)}%
					</div>
					<div className="text-xs text-gray-500 mt-1">
						Maximum loan-to-value ratio
					</div>
				</div>

				<div className="bg-white rounded-lg p-4 border border-blue-100">
					<div className="text-sm text-gray-600 mb-1">Liquidation Threshold</div>
					<div className="text-2xl font-bold text-orange-600">
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
