"use client";

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// Aave V3 Pool contract on Ethereum mainnet
const AAVE_POOL_ADDRESS = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2';

const POOL_ABI = [
	{
		inputs: [
			{ name: 'asset', type: 'address' },
			{ name: 'amount', type: 'uint256' },
			{ name: 'onBehalfOf', type: 'address' },
			{ name: 'referralCode', type: 'uint16' }
		],
		name: 'supply',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
] as const;

// WETH address on Ethereum mainnet
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

export function TopUpButton() {
	const [amount, setAmount] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const { data: hash, writeContract, isPending, error } = useWriteContract();

	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const handleTopUp = async () => {
		if (!amount || parseFloat(amount) <= 0) {
			alert('Please enter a valid amount');
			return;
		}

		try {
			writeContract({
				address: AAVE_POOL_ADDRESS,
				abi: POOL_ABI,
				functionName: 'supply',
				args: [
					WETH_ADDRESS,
					parseEther(amount),
					'0x0000000000000000000000000000000000000000', // Will be replaced by connected address
					0
				],
				value: parseEther(amount), // Send ETH
			});
		} catch (err) {
			console.error('Error topping up:', err);
		}
	};

	return (
		<div className="mb-6">
			{!isOpen ? (
				<button
					onClick={() => setIsOpen(true)}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors"
				>
					Top Up ETH Supply
				</button>
			) : (
				<div className="bg-white border border-blue-200 rounded-lg p-6 shadow-md">
					<h3 className="text-xl font-bold text-gray-800 mb-4">Supply ETH to Aave</h3>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Amount (ETH)
						</label>
						<input
							type="number"
							step="0.001"
							min="0"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0.0"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
							Error: {error.message}
						</div>
					)}

					{isSuccess && (
						<div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
							Success! Transaction confirmed.
						</div>
					)}

					<div className="flex gap-3">
						<button
							onClick={handleTopUp}
							disabled={isPending || isConfirming}
							className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
						>
							{isPending || isConfirming ? 'Confirming...' : 'Supply'}
						</button>
						<button
							onClick={() => {
								setIsOpen(false);
								setAmount('');
							}}
							disabled={isPending || isConfirming}
							className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
