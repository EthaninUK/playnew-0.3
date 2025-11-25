/**
 * Web3 交易验证辅助函数
 * 使用 viem 验证链上交易
 */

import { createPublicClient, http, formatUnits, Address } from 'viem';
import { mainnet, polygon, base } from 'viem/chains';
import { getChainConfig } from './config-helper';

// ERC-20 Transfer Event ABI
const ERC20_TRANSFER_ABI = [
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { type: 'address', name: 'from', indexed: true },
      { type: 'address', name: 'to', indexed: true },
      { type: 'uint256', name: 'value', indexed: false },
    ],
  },
] as const;

// 链配置映射
const CHAIN_MAP: Record<number, any> = {
  1: mainnet,
  137: polygon,
  8453: base,
};

/**
 * 交易验证结果
 */
export interface TransactionVerificationResult {
  success: boolean;
  error?: string;

  // 交易信息
  chain_id?: number;
  tx_hash?: string;
  from_address?: string;
  to_address?: string;
  block_number?: number;
  timestamp?: string;

  // 代币信息
  token_symbol?: string;
  token_address?: string | null;
  amount_token?: string;
  amount_usd?: number;
}

/**
 * 验证交易参数
 */
export interface VerifyTransactionParams {
  txHash: string;
  chainId: number;
  expectedAmountUsd: number;
  tolerancePercent?: number; // 允许的误差百分比,默认 5%
}

/**
 * 获取代币价格 (USD)
 * TODO: 集成 CoinGecko API
 */
async function getTokenPriceUSD(tokenSymbol: string): Promise<number> {
  // 稳定币固定价格
  if (tokenSymbol === 'USDC' || tokenSymbol === 'USDT' || tokenSymbol === 'DAI') {
    return 1.0;
  }

  // 临时固定价格 (实际应该从 API 获取)
  const prices: Record<string, number> = {
    ETH: 3000,
    MATIC: 0.5,
    BTC: 60000,
  };

  return prices[tokenSymbol] || 0;
}

/**
 * 主验证函数: 验证链上交易
 */
export async function verifyTransaction(
  params: VerifyTransactionParams
): Promise<TransactionVerificationResult> {
  const { txHash, chainId, expectedAmountUsd, tolerancePercent = 5 } = params;

  try {
    // 1. 获取链配置
    const chainConfig = await getChainConfig(chainId);

    if (!chainConfig) {
      return {
        success: false,
        error: `不支持的链 ID: ${chainId}`,
      };
    }

    if (!chainConfig.is_enabled) {
      return {
        success: false,
        error: `链 ${chainConfig.chain_name} 当前已禁用`,
      };
    }

    // 2. 创建 viem 客户端
    const chain = CHAIN_MAP[chainId];
    if (!chain) {
      return {
        success: false,
        error: `未找到链配置: ${chainId}`,
      };
    }

    const client = createPublicClient({
      chain,
      transport: http(chainConfig.rpc_url),
    });

    // 3. 获取交易收据
    console.log(`[Verify] 获取交易: ${txHash}`);
    const receipt = await client.getTransactionReceipt({
      hash: txHash as Address,
    });

    if (!receipt) {
      return {
        success: false,
        error: '交易未找到或未确认',
      };
    }

    // 4. 检查交易状态
    if (receipt.status !== 'success') {
      return {
        success: false,
        error: '交易执行失败 (状态: reverted)',
      };
    }

    // 5. 检查确认数
    const currentBlock = await client.getBlockNumber();
    const confirmations = Number(currentBlock - receipt.blockNumber);

    if (confirmations < chainConfig.required_confirmations) {
      return {
        success: false,
        error: `确认数不足 (当前: ${confirmations}, 需要: ${chainConfig.required_confirmations})`,
      };
    }

    // 6. 获取交易详情
    const transaction = await client.getTransaction({
      hash: txHash as Address,
    });

    // 7. 验证收款地址
    if (transaction.to?.toLowerCase() !== chainConfig.platform_wallet.toLowerCase()) {
      // 可能是 ERC-20 代币转账,检查 logs
      const isERC20Transfer = receipt.logs.some(
        (log) => log.address.toLowerCase() !== chainConfig.platform_wallet.toLowerCase()
      );

      if (!isERC20Transfer) {
        return {
          success: false,
          error: `收款地址不匹配 (预期: ${chainConfig.platform_wallet}, 实际: ${transaction.to})`,
        };
      }
    }

    // 8. 解析转账金额和代币
    let tokenSymbol: string;
    let tokenAddress: string | null = null;
    let amountToken: string;
    let amountUsd: number;

    // 检查是否为原生代币转账 (ETH, MATIC 等)
    if (
      transaction.to?.toLowerCase() === chainConfig.platform_wallet.toLowerCase() &&
      transaction.value > 0n
    ) {
      // 原生代币转账
      const nativeTokenSymbol = chain.nativeCurrency.symbol;
      tokenSymbol = nativeTokenSymbol;
      amountToken = formatUnits(transaction.value, chain.nativeCurrency.decimals);

      // 获取代币价格
      const tokenPrice = await getTokenPriceUSD(nativeTokenSymbol);
      amountUsd = parseFloat(amountToken) * tokenPrice;

      console.log(
        `[Verify] 原生代币转账: ${amountToken} ${tokenSymbol} (~$${amountUsd.toFixed(2)})`
      );
    } else {
      // ERC-20 代币转账,解析 logs
      const transferLog = receipt.logs.find((log) => {
        // Transfer event topic
        return (
          log.topics[0] ===
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' &&
          log.topics[2]?.toLowerCase().includes(chainConfig.platform_wallet.toLowerCase().slice(2))
        );
      });

      if (!transferLog) {
        return {
          success: false,
          error: '未找到有效的代币转账事件',
        };
      }

      // 解析 Transfer 事件
      tokenAddress = transferLog.address;
      const amountHex = transferLog.data;
      const amountBigInt = BigInt(amountHex);

      // TODO: 从 Directus 获取代币配置
      // 临时假设为 USDC (6 decimals)
      const decimals = 6;
      tokenSymbol = 'USDC';
      amountToken = formatUnits(amountBigInt, decimals);

      const tokenPrice = await getTokenPriceUSD(tokenSymbol);
      amountUsd = parseFloat(amountToken) * tokenPrice;

      console.log(
        `[Verify] ERC-20 转账: ${amountToken} ${tokenSymbol} (~$${amountUsd.toFixed(2)})`
      );
    }

    // 9. 验证金额是否符合预期
    const tolerance = expectedAmountUsd * (tolerancePercent / 100);
    const minAmount = expectedAmountUsd - tolerance;
    const maxAmount = expectedAmountUsd + tolerance;

    if (amountUsd < minAmount || amountUsd > maxAmount) {
      return {
        success: false,
        error: `金额不匹配 (预期: $${expectedAmountUsd}, 实际: $${amountUsd.toFixed(2)}, 允许误差: ±${tolerancePercent}%)`,
      };
    }

    // 10. 获取区块时间戳
    const block = await client.getBlock({
      blockNumber: receipt.blockNumber,
    });

    const timestamp = new Date(Number(block.timestamp) * 1000).toISOString();

    // 11. 返回验证结果
    return {
      success: true,
      chain_id: chainId,
      tx_hash: txHash,
      from_address: transaction.from,
      to_address: chainConfig.platform_wallet,
      block_number: Number(receipt.blockNumber),
      timestamp,
      token_symbol: tokenSymbol,
      token_address: tokenAddress,
      amount_token: amountToken,
      amount_usd: amountUsd,
    };
  } catch (error: any) {
    console.error('[Verify] 交易验证失败:', error);

    // 处理常见错误
    if (error.message?.includes('transaction not found')) {
      return {
        success: false,
        error: '交易不存在或尚未上链',
      };
    }

    if (error.message?.includes('could not fetch')) {
      return {
        success: false,
        error: 'RPC 节点连接失败,请稍后重试',
      };
    }

    return {
      success: false,
      error: `交易验证失败: ${error.message}`,
    };
  }
}

/**
 * 验证交易是否已确认 (简化版,只检查确认数)
 */
export async function checkTransactionConfirmations(
  txHash: string,
  chainId: number
): Promise<{ confirmed: boolean; confirmations: number; required: number }> {
  try {
    const chainConfig = await getChainConfig(chainId);
    if (!chainConfig) {
      throw new Error(`不支持的链 ID: ${chainId}`);
    }

    const chain = CHAIN_MAP[chainId];
    const client = createPublicClient({
      chain,
      transport: http(chainConfig.rpc_url),
    });

    const receipt = await client.getTransactionReceipt({
      hash: txHash as Address,
    });

    if (!receipt) {
      return {
        confirmed: false,
        confirmations: 0,
        required: chainConfig.required_confirmations,
      };
    }

    const currentBlock = await client.getBlockNumber();
    const confirmations = Number(currentBlock - receipt.blockNumber);

    return {
      confirmed: confirmations >= chainConfig.required_confirmations,
      confirmations,
      required: chainConfig.required_confirmations,
    };
  } catch (error) {
    console.error('[Verify] 检查确认数失败:', error);
    throw error;
  }
}

/**
 * 批量验证多个交易 (用于后台任务)
 */
export async function batchVerifyTransactions(
  transactions: Array<{ txHash: string; chainId: number; expectedAmountUsd: number }>
): Promise<TransactionVerificationResult[]> {
  const results = await Promise.all(
    transactions.map((tx) =>
      verifyTransaction({
        txHash: tx.txHash,
        chainId: tx.chainId,
        expectedAmountUsd: tx.expectedAmountUsd,
      })
    )
  );

  return results;
}
