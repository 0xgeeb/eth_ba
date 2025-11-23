"use client";

import { formatEther } from "viem"

interface Asset {
  symbol: string;
  name: string;
  address: string;
  value: number;
  price: number;
  decimals?: number;
  imgUrl?: string;
}

interface AavePositionCardProps {
  assets: Asset[];
  type: 'supply' | 'borrow';
}

export function AavePositionCard({ assets, type }: AavePositionCardProps) {
  const isSupply = type === 'supply';
  const title = isSupply ? 'Supplied' : 'Borrowed';
  const bgColor = isSupply ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSupply ? 'border-green-200' : 'border-red-200';
  const textColor = isSupply ? 'text-green-700' : 'text-red-700';

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const formatNum = (stringedNum: string) => {
    return parseFloat(formatEther(stringedNum as unknown as bigint)).toFixed(2)
  }

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-6 shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-bold ${textColor}`}>{title}</h3>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Value</div>
          <div className="text-2xl font-bold">${formatNum(totalValue.toString())}</div>
        </div>
      </div>

      <div className="space-y-3">
        {assets.map((asset, index) => {
          const amount = asset.price > 0 ? asset.value / asset.price : 0;

          return (
            <div key={index} className="bg-white rounded-md p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {asset.imgUrl && (
                    <img
                      src={asset.imgUrl}
                      alt={asset.symbol}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <div className="font-bold text-lg">{asset.symbol}</div>
                    <div className="text-sm text-gray-600">{asset.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {amount.toLocaleString('en-US', { maximumFractionDigits: 6 })} {asset.symbol}
                  </div>
                  <div className="text-sm text-gray-600">
                    ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500">
                    @ ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
