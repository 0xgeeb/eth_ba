"use client";

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { parseEther } from 'viem';

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

export function TopUpButton() {
	const [amount, setAmount] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { address } = useAccount()

	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const handleTopUp = async () => {
		if (!amount || parseFloat(amount) <= 0) {
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
                value: parseEther(amount),
                account: address,
                chain: mainnet
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
					className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors"
				>
					Top Up ETH Supply
				</button>
			) : (
				<div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-6 shadow-md">
					<h3 className="text-xl font-bold text-red-900 mb-4">Supply ETH to Aave</h3>

					<div className="mb-4">
						<label className="block text-sm font-semibold text-red-900 mb-2">
							Amount (ETH)
						</label>
						<input
							type="number"
							step="0.001"
							min="0"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0.0"
							className="w-full px-4 py-2 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
						/>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm font-medium">
							Error: {error.message}
						</div>
					)}

					{isSuccess && (
						<div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm font-medium">
							Success! Transaction confirmed.
						</div>
					)}

					<div className="flex gap-3">
						<button
							onClick={handleTopUp}
							disabled={isPending || isConfirming}
							className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
						>
							{isPending || isConfirming ? 'Confirming...' : 'Supply'}
						</button>
						<button
							onClick={() => {
								setIsOpen(false);
								setAmount('');
							}}
							disabled={isPending || isConfirming}
							className="flex-1 bg-white hover:bg-red-50 disabled:bg-gray-200 text-red-900 border-2 border-red-300 font-bold py-3 px-6 rounded-lg transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
