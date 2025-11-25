'use client';

import { useCryptoPrices } from './useCryptoPrices';
import { useEffect, useRef, useState } from 'react';

export default function PriceTicker() {
  const { prices, loading, error } = useCryptoPrices({ refreshInterval: 60000 });
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Double the prices array for seamless infinite scroll
  const displayPrices = [...prices, ...prices];

  if (error) {
    return (
      <div className="bg-gray-900 border-b border-gray-800 py-3 px-4 text-center">
        <span className="text-red-400 text-sm">Failed to load crypto prices</span>
      </div>
    );
  }

  if (loading || prices.length === 0) {
    return (
      <div className="bg-gray-900 border-b border-gray-800 py-3 px-4">
        <div className="flex space-x-8 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-4 w-12 bg-gray-800 rounded"></div>
              <div className="h-4 w-20 bg-gray-800 rounded"></div>
              <div className="h-4 w-16 bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border-b border-gray-800 overflow-hidden">
      <div
        ref={tickerRef}
        className={`flex space-x-8 py-3 px-4 ${!isPaused ? 'animate-scroll' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {displayPrices.map((crypto, index) => (
          <div
            key={`${crypto.id}-${index}`}
            className="flex items-center space-x-2 whitespace-nowrap transition-all duration-300"
          >
            {/* Symbol */}
            <span className="text-gray-400 font-medium text-sm">
              {crypto.symbol}
            </span>

            {/* Price */}
            <span className="text-white font-semibold text-sm">
              ${formatPrice(crypto.price)}
            </span>

            {/* Change */}
            <span
              className={`text-sm font-medium flex items-center ${
                crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {crypto.change24h >= 0 ? '↑' : '↓'} {Math.abs(crypto.change24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to format price based on value
function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 0.01) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  }
}
