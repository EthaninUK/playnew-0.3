import { NextResponse } from 'next/server';

const CRYPTO_LIST = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism' },
  { id: 'starknet', symbol: 'STRK', name: 'Starknet' },
];

export async function GET() {
  try {
    const ids = CRYPTO_LIST.map(c => c.id).join(',');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      {
        signal: controller.signal,
        next: { revalidate: 60 }, // Cache for 60 seconds
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PlayNew-Crypto-Tracker/1.0',
        }
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const formattedPrices = CRYPTO_LIST.map(crypto => ({
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      price: data[crypto.id]?.usd || 0,
      change24h: data[crypto.id]?.usd_24h_change || 0,
    }));

    return NextResponse.json(formattedPrices, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);

    // Return mock data on error so the UI doesn't break
    const mockPrices = CRYPTO_LIST.map(crypto => ({
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      price: 0,
      change24h: 0,
    }));

    return NextResponse.json(mockPrices, {
      status: 200, // Return 200 with mock data instead of 500
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5',
        'X-Data-Source': 'fallback',
      },
    });
  }
}
