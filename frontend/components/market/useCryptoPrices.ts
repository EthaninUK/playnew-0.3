'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

interface UseCryptoPricesOptions {
  refreshInterval?: number;
  autoStart?: boolean;
}

export function useCryptoPrices(options: UseCryptoPricesOptions = {}) {
  const { refreshInterval = 60000, autoStart = true } = options;

  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch('/api/market/prices');

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      setPrices(data);
      setLastUpdate(new Date());
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch crypto prices:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoStart) return;

    // Initial fetch
    fetchPrices();

    // Set up interval for periodic updates
    const interval = setInterval(fetchPrices, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchPrices, refreshInterval, autoStart]);

  return {
    prices,
    loading,
    error,
    lastUpdate,
    refetch: fetchPrices
  };
}
