/**
 * GET /api/web3/payment-info
 * 获取支付信息 (价格、钱包地址、支持的代币等)
 *
 * 用途:
 * 1. 购买内容: 返回内容价格和支付方式
 * 2. 充值积分: 返回充值比例和赠送信息
 * 3. 购买会员: 返回会员价格和支付方式
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getEnabledChains,
  getChainTokens,
  getContentPricing,
  getRechargeConfig,
  calculateTokenAmount,
  calculateRechargePP,
} from '@/lib/web3/config-helper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 支付用途: 'content', 'recharge', 或 'membership'
    const purpose = searchParams.get('purpose') || 'content';

    // 内容购买参数
    const contentId = searchParams.get('content_id');
    const contentType = searchParams.get('content_type');

    // 充值参数
    const rechargeAmount = searchParams.get('amount'); // USD

    // 会员购买参数
    const membershipId = searchParams.get('membership_id');

    // ============================================
    // 验证参数
    // ============================================
    if (purpose === 'content' && (!contentId || !contentType)) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要参数: content_id, content_type',
        },
        { status: 400 }
      );
    }

    if (purpose === 'recharge' && !rechargeAmount) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要参数: amount (充值金额 USD)',
        },
        { status: 400 }
      );
    }

    if (purpose === 'membership' && (!membershipId || !rechargeAmount)) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要参数: membership_id, amount',
        },
        { status: 400 }
      );
    }

    // ============================================
    // 获取链和代币配置
    // ============================================
    const chains = await getEnabledChains();

    if (chains.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '暂无可用的支付链',
        },
        { status: 500 }
      );
    }

    // ============================================
    // 根据用途返回不同的响应
    // ============================================

    if (purpose === 'content') {
      // ============================================
      // 内容购买
      // ============================================

      // 获取定价配置
      const pricing = await getContentPricing(contentType!);

      if (!pricing) {
        return NextResponse.json(
          {
            success: false,
            error: `未找到内容类型 ${contentType} 的定价配置`,
          },
          { status: 404 }
        );
      }

      // 如果价格为 0,表示免费内容
      if (pricing.price_usd === 0) {
        return NextResponse.json({
          success: true,
          data: {
            purpose: 'content',
            content_id: contentId,
            content_type: contentType,
            is_free: true,
            price_usd: 0,
            price_pp: 0,
            message: '此内容免费访问',
          },
        });
      }

      // 构建支付信息
      const supportedChains = await Promise.all(
        chains.map(async (chain) => {
          const tokens = await getChainTokens(chain.chain_id);

          // 计算每个代币的支付金额
          const tokensWithPrice = await Promise.all(
            tokens.map(async (token) => {
              try {
                const { amount_decimal, amount_wei, token_price_usd } =
                  await calculateTokenAmount(
                    pricing.price_usd,
                    token.token_symbol,
                    token.decimals
                  );

                return {
                  symbol: token.token_symbol,
                  name: token.token_name,
                  address: token.token_address,
                  decimals: token.decimals,
                  display_name: token.display_name,
                  is_preferred: token.is_preferred,
                  price: amount_decimal,
                  price_wei: amount_wei,
                  token_price_usd,
                };
              } catch (error) {
                console.error(`Error calculating price for ${token.token_symbol}:`, error);
                return null;
              }
            })
          );

          return {
            chain_id: chain.chain_id,
            chain_name: chain.chain_name,
            platform_wallet: chain.platform_wallet,
            required_confirmations: chain.required_confirmations,
            supported_tokens: tokensWithPrice.filter((t) => t !== null),
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: {
          purpose: 'content',
          content_id: contentId,
          content_type: contentType,
          is_free: false,
          pricing: {
            price_usd: pricing.price_usd,
            price_pp: pricing.price_pp,
            config_name: pricing.config_name,
          },
          supported_chains: supportedChains,
          payment_methods: ['web3', 'playpass'], // 支持 Web3 和 PlayPass 两种方式
        },
      });
    } else if (purpose === 'recharge') {
      // ============================================
      // 积分充值
      // ============================================

      const amountUsd = parseFloat(rechargeAmount!);

      if (isNaN(amountUsd) || amountUsd <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: '无效的充值金额',
          },
          { status: 400 }
        );
      }

      // 获取充值配置
      const rechargeConfig = await getRechargeConfig(amountUsd);

      if (!rechargeConfig) {
        return NextResponse.json(
          {
            success: false,
            error: '未找到充值配置',
          },
          { status: 500 }
        );
      }

      // 计算可获得的 PP
      const ppResult = calculateRechargePP(
        amountUsd,
        rechargeConfig.recharge_ratio,
        rechargeConfig.recharge_bonus_percent
      );

      // 构建支付信息
      const supportedChains = await Promise.all(
        chains.map(async (chain) => {
          const tokens = await getChainTokens(chain.chain_id);

          const tokensWithPrice = await Promise.all(
            tokens.map(async (token) => {
              try {
                const { amount_decimal, amount_wei, token_price_usd } =
                  await calculateTokenAmount(amountUsd, token.token_symbol, token.decimals);

                return {
                  symbol: token.token_symbol,
                  name: token.token_name,
                  address: token.token_address,
                  decimals: token.decimals,
                  display_name: token.display_name,
                  is_preferred: token.is_preferred,
                  price: amount_decimal,
                  price_wei: amount_wei,
                  token_price_usd,
                };
              } catch (error) {
                console.error(`Error calculating price for ${token.token_symbol}:`, error);
                return null;
              }
            })
          );

          return {
            chain_id: chain.chain_id,
            chain_name: chain.chain_name,
            platform_wallet: chain.platform_wallet,
            required_confirmations: chain.required_confirmations,
            supported_tokens: tokensWithPrice.filter((t) => t !== null),
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: {
          purpose: 'recharge',
          amount_usd: amountUsd,
          recharge_info: {
            ratio: rechargeConfig.recharge_ratio, // 1 USD = N PP
            bonus_percent: rechargeConfig.recharge_bonus_percent,
            base_pp: ppResult.base_pp,
            bonus_pp: ppResult.bonus_pp,
            total_pp: ppResult.total_pp,
            config_name: rechargeConfig.config_name,
          },
          supported_chains: supportedChains,
        },
      });
    } else if (purpose === 'membership') {
      // ============================================
      // 会员购买
      // ============================================

      const amountUsd = parseFloat(rechargeAmount!);

      if (isNaN(amountUsd) || amountUsd <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: '无效的会员价格',
          },
          { status: 400 }
        );
      }

      // 会员方案定义
      const membershipPlans: Record<string, { name: string; price: number; level: number }> = {
        'pro': { name: 'Pro', price: 699, level: 1 },
        'max': { name: 'Max', price: 1299, level: 2 },
      };

      const membership = membershipPlans[membershipId!];
      if (!membership) {
        return NextResponse.json(
          {
            success: false,
            error: `无效的会员方案: ${membershipId}`,
          },
          { status: 400 }
        );
      }

      // 验证价格匹配
      if (Math.abs(amountUsd - membership.price) > 0.01) {
        return NextResponse.json(
          {
            success: false,
            error: `价格不匹配: 期望 ${membership.price} USD, 收到 ${amountUsd} USD`,
          },
          { status: 400 }
        );
      }

      // 构建支付信息
      const supportedChains = await Promise.all(
        chains.map(async (chain) => {
          const tokens = await getChainTokens(chain.chain_id);

          const tokensWithPrice = await Promise.all(
            tokens.map(async (token) => {
              try {
                const { amount_decimal, amount_wei, token_price_usd } =
                  await calculateTokenAmount(amountUsd, token.token_symbol, token.decimals);

                return {
                  symbol: token.token_symbol,
                  name: token.token_name,
                  address: token.token_address,
                  decimals: token.decimals,
                  display_name: token.display_name,
                  is_preferred: token.is_preferred,
                  price_decimal: amount_decimal,
                  price_wei: amount_wei,
                  token_price_usd,
                };
              } catch (error) {
                console.error(`Error calculating price for ${token.token_symbol}:`, error);
                return null;
              }
            })
          );

          return {
            chain_id: chain.chain_id,
            chain_name: chain.chain_name,
            platform_wallet: chain.platform_wallet,
            required_confirmations: chain.required_confirmations,
            supported_tokens: tokensWithPrice.filter((t) => t !== null),
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: {
          purpose: 'membership',
          membership_id: membershipId,
          membership_info: {
            name: membership.name,
            level: membership.level,
            price_usd: membership.price,
            validity_days: 365,
          },
          amount_usd: amountUsd,
          supported_chains: supportedChains,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: '无效的支付用途,必须是 content, recharge 或 membership',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error in /api/web3/payment-info:', error);
    return NextResponse.json(
      {
        success: false,
        error: '服务器错误',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// 支持 OPTIONS 请求 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
