"use client";

interface HealthFactorBarProps {
	healthFactor: number;
}

export function HealthFactorBar({ healthFactor }: HealthFactorBarProps) {
	const getHealthStatus = () => {
		if (healthFactor >= 2) return 'Safe';
		if (healthFactor >= 1.5) return 'Moderate';
		if (healthFactor >= 1.0) return 'Risky';
		return 'Liquidation Risk';
	};

	const getHealthTextColor = () => {
		if (healthFactor >= 2) return 'text-green-700';
		if (healthFactor >= 1.5) return 'text-yellow-700';
		if (healthFactor >= 1.0) return 'text-orange-700';
		return 'text-red-700';
	};

	// Calculate position on the bar (0-100%)
	// Map health factor to position: 0.5 -> 0%, 1.0 -> 25%, 2.0 -> 75%, 3.0+ -> 100%
	const getBarPosition = () => {
		if (healthFactor <= 0.5) return 0;
		if (healthFactor >= 3) return 100;

		// Linear interpolation between key points
		if (healthFactor < 1.0) {
			// 0.5 to 1.0 maps to 0% to 25%
			return ((healthFactor - 0.5) / 0.5) * 25;
		} else if (healthFactor < 2.0) {
			// 1.0 to 2.0 maps to 25% to 75%
			return 25 + ((healthFactor - 1.0) / 1.0) * 50;
		} else {
			// 2.0 to 3.0 maps to 75% to 100%
			return 75 + ((healthFactor - 2.0) / 1.0) * 25;
		}
	};

	const position = getBarPosition();

	return (
		<div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-6 shadow-md mb-6">
			<div className="flex justify-between items-center mb-3">
				<h3 className="text-xl font-bold text-red-900">Loan Health</h3>
				<div className="text-right">
					<div className={`text-2xl font-bold ${getHealthTextColor()}`}>
						{healthFactor.toFixed(2)}
					</div>
					<div className={`text-sm font-semibold ${getHealthTextColor()}`}>
						{getHealthStatus()}
					</div>
				</div>
			</div>

			<div className="relative w-full h-6 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 shadow-inner">
				{/* Sliding indicator */}
				<div
					className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-500"
					style={{ left: `${position}%` }}
				>
					<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-bold">
						{healthFactor.toFixed(2)}
					</div>
				</div>
			</div>

			<div className="mt-3 flex justify-between text-xs text-red-900 font-semibold">
				<span>Liquidation (&lt;1.0)</span>
				<span>Safe (&gt;2.0)</span>
			</div>

			<div className="mt-3 text-sm text-red-800 font-medium">
				<p>Health factor below 1.0 may result in liquidation</p>
			</div>
		</div>
	);
}
