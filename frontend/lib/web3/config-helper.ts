/**
 * Web3 配置辅助函数
 * 从 Directus 读取 Web3 支付配置
 */

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// 支持的链配置
export interface ChainConfig {
  chain_id: number;
  chain_name: string;
  platform_wallet: string;
  rpc_url: string;
  rpc_provider: string;
  required_confirmations: number;
  is_enabled: boolean;
}

// 代币配置
export interface TokenConfig {
  token_symbol: string;
  token_name: string;
  token_address: string | null;
  decimals: number;
  chain_id: number;
  chain_name: string;
  display_name: string;
  is_active: boolean;
  is_preferred: boolean;
}

// 定价配置
export interface PricingConfig {
  config_key: string;
  config_name: string;
  content_type: string;
  price_usd: number;
  price_pp: number;
  recharge_enabled: boolean;
  recharge_ratio: number;
  recharge_bonus_percent: number;
  membership_discounts: Record<string, number>;
}

/**
 * 获取所有启用的链配置
 */
export async function getEnabledChains(): Promise<ChainConfig[]> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/web3_system_config?filter[chain_enabled][_eq]=true&filter[chain_id][_nnull]=true`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chain configs: ${response.status}`);
    }

    const data = await response.json();

    return data.data.map((config: any) => ({
      chain_id: config.chain_id,
      chain_name: config.chain_name,
      platform_wallet: config.platform_wallet_address,
      rpc_url: config.rpc_url,
      rpc_provider: config.rpc_provider || 'public',
      required_confirmations: config.required_confirmations || 3,
      is_enabled: config.chain_enabled,
    }));
  } catch (error) {
    console.error('Error fetching chain configs:', error);
    return [];
  }
}

/**
 * 获取特定链的配置
 */
export async function getChainConfig(chainId: number): Promise<ChainConfig | null> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/web3_system_config?filter[chain_id][_eq]=${chainId}&limit=1`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chain config: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    const config = data.data[0];

    return {
      chain_id: config.chain_id,
      chain_name: config.chain_name,
      platform_wallet: config.platform_wallet_address,
      rpc_url: config.rpc_url,
      rpc_provider: config.rpc_provider || 'public',
      required_confirmations: config.required_confirmations || 3,
      is_enabled: config.chain_enabled,
    };
  } catch (error) {
    console.error('Error fetching chain config:', error);
    return null;
  }
}

/**
 * 获取链支持的代币
 */
export async function getChainTokens(chainId: number): Promise<TokenConfig[]> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/web3_supported_tokens?filter[chain_id][_eq]=${chainId}&filter[is_active][_eq]=true&sort=sort_order`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.status}`);
    }

    const data = await response.json();

    return data.data.map((token: any) => ({
      token_symbol: token.token_symbol,
      token_name: token.token_name,
      token_address: token.token_address,
      decimals: token.decimals,
      chain_id: token.chain_id,
      chain_name: token.chain_name,
      display_name: token.display_name,
      is_active: token.is_active,
      is_preferred: token.is_preferred,
    }));
  } catch (error) {
    console.error('Error fetching chain tokens:', error);
    return [];
  }
}

/**
 * 获取内容定价配置
 */
export async function getContentPricing(
  contentType: string,
  contentCategory?: string
): Promise<PricingConfig | null> {
  try {
    // 构建过滤条件
    let filter = `filter[content_type][_eq]=${contentType}&filter[is_active][_eq]=true&sort=-priority&limit=1`;

    if (contentCategory) {
      filter += `&filter[content_category][_eq]=${contentCategory}`;
    }

    const response = await fetch(
      `${DIRECTUS_URL}/items/web3_pricing_config?${filter}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch pricing config: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    const config = data.data[0];

    return {
      config_key: config.config_key,
      config_name: config.config_name,
      content_type: config.content_type,
      price_usd: parseFloat(config.price_usd),
      price_pp: config.price_pp,
      recharge_enabled: config.recharge_enabled,
      recharge_ratio: config.recharge_ratio,
      recharge_bonus_percent: config.recharge_bonus_percent,
      membership_discounts: config.membership_discounts || {},
    };
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return null;
  }
}

/**
 * 获取充值配置 (根据充值金额)
 */
export async function getRechargeConfig(amountUsd: number): Promise<PricingConfig | null> {
  try {
    // 获取所有充值档位配置
    const response = await fetch(
      `${DIRECTUS_URL}/items/web3_pricing_config?filter[content_type][_eq]=global&filter[recharge_enabled][_eq]=true&filter[is_active][_eq]=true&sort=-priority`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recharge configs: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    // 根据充值金额匹配档位
    // priority 越高越优先 (40=超大额, 30=大额, 20=中额, 10=小额)
    for (const config of data.data) {
      const description = config.description || '';

      // 解析档位范围 (如 "充值 $100+", "充值 $50-$99")
      if (description.includes('$100+') && amountUsd >= 100) {
        return transformPricingConfig(config);
      } else if (description.includes('$50-$99') && amountUsd >= 50 && amountUsd < 100) {
        return transformPricingConfig(config);
      } else if (description.includes('$10-$49') && amountUsd >= 10 && amountUsd < 50) {
        return transformPricingConfig(config);
      } else if (description.includes('$1-$9') && amountUsd >= 1 && amountUsd < 10) {
        return transformPricingConfig(config);
      }
    }

    // 默认返回优先级最低的配置
    return transformPricingConfig(data.data[data.data.length - 1]);
  } catch (error) {
    console.error('Error fetching recharge config:', error);
    return null;
  }
}

/**
 * 转换定价配置格式
 */
function transformPricingConfig(config: any): PricingConfig {
  return {
    config_key: config.config_key,
    config_name: config.config_name,
    content_type: config.content_type,
    price_usd: parseFloat(config.price_usd),
    price_pp: config.price_pp,
    recharge_enabled: config.recharge_enabled,
    recharge_ratio: config.recharge_ratio,
    recharge_bonus_percent: config.recharge_bonus_percent,
    membership_discounts: config.membership_discounts || {},
  };
}

/**
 * 计算充值可获得的 PP
 */
export function calculateRechargePP(
  amountUsd: number,
  ratio: number,
  bonusPercent: number
): { base_pp: number; bonus_pp: number; total_pp: number } {
  const basePP = Math.floor(amountUsd * ratio);
  const bonusPP = Math.floor(basePP * (bonusPercent / 100));
  const totalPP = basePP + bonusPP;

  return {
    base_pp: basePP,
    bonus_pp: bonusPP,
    total_pp: totalPP,
  };
}

/**
 * 格式化代币金额 (从最小单位转为可读格式)
 */
export function formatTokenAmount(amount: string | bigint, decimals: number): string {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** decimals);
  const integerPart = amountBigInt / divisor;
  const fractionalPart = amountBigInt % divisor;

  // 保留最多 6 位小数
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0').slice(0, 6);

  return `${integerPart}.${fractionalStr}`;
}

/**
 * 解析代币金额 (从可读格式转为最小单位)
 */
export function parseTokenAmount(amount: string | number, decimals: number): string {
  const amountStr = typeof amount === 'number' ? amount.toFixed(decimals) : amount;
  const [integerPart, fractionalPart = ''] = amountStr.split('.');

  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
  const combined = integerPart + paddedFractional;

  return BigInt(combined).toString();
}

/**
 * 获取代币价格 (USD)
 * 简化版本: 返回固定价格或从 CoinGecko 获取
 */
export async function getTokenPriceUSD(tokenSymbol: string): Promise<number> {
  // 稳定币固定价格
  if (tokenSymbol === 'USDC' || tokenSymbol === 'USDT') {
    return 1.0;
  }

  // TODO: 集成 CoinGecko API
  // 临时返回固定价格
  const prices: Record<string, number> = {
    ETH: 3000,
    MATIC: 0.5,
    BTC: 60000,
  };

  return prices[tokenSymbol] || 0;
}

/**
 * 计算需要支付的代币数量
 */
export async function calculateTokenAmount(
  priceUsd: number,
  tokenSymbol: string,
  decimals: number
): Promise<{ amount_decimal: string; amount_wei: string; token_price_usd: number }> {
  const tokenPriceUSD = await getTokenPriceUSD(tokenSymbol);

  if (tokenPriceUSD === 0) {
    throw new Error(`Cannot get price for token: ${tokenSymbol}`);
  }

  const amountDecimal = (priceUsd / tokenPriceUSD).toFixed(decimals);
  const amountWei = parseTokenAmount(amountDecimal, decimals);

  return {
    amount_decimal: amountDecimal,
    amount_wei: amountWei,
    token_price_usd: tokenPriceUSD,
  };
}
