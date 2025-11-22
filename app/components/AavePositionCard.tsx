interface Asset {
  symbol: string;
  name: string;
  address: string;
  balance: number;
  balanceUSD: number;
  price: number;
  decimals: number;
  imgUrl?: string;
}

interface ProtocolPosition {
  type: string;
  assets: Asset[];
  balanceUSD: number;
}

interface AavePositionCardProps {
  position: ProtocolPosition;
}

export function AavePositionCard({ position }: AavePositionCardProps) {
  const isSupply = position.type === 'supplied';
  const title = isSupply ? 'Supplied' : 'Borrowed';
  const bgColor = isSupply ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSupply ? 'border-green-200' : 'border-red-200';
  const textColor = isSupply ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-6 shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-bold ${textColor}`}>{title}</h3>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Value</div>
          <div className="text-2xl font-bold">${position.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="space-y-3">
        {position.assets.map((asset, index) => (
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
                  {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 6 })} {asset.symbol}
                </div>
                <div className="text-sm text-gray-600">
                  ${asset.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500">
                  @ ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
