import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// 请求超时时间（毫秒）
const REQUEST_TIMEOUT = 3000;

/**
 * 带超时的 fetch 请求
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * GET /api/stats
 * 获取平台统计数据（策略总数、分类总数等）
 * 优化版本：启用缓存、并行请求、超时处理
 */
export async function GET() {
  try {
    const headers = { 'Content-Type': 'application/json' };

    // 并行执行所有查询，启用缓存
    const [strategiesRes, categoriesRes, providersRes, newsRes] = await Promise.all([
      // 1. 查询已发布的策略总数
      fetchWithTimeout(
        `${DIRECTUS_URL}/items/strategies?aggregate[count]=id&filter[status][_eq]=published`,
        {
          headers,
          next: { revalidate: 300 }, // 5分钟缓存
        }
      ),
      // 2. 查询不同分类的策略数量
      fetchWithTimeout(
        `${DIRECTUS_URL}/items/strategies?aggregate[count]=id&groupBy[]=category&filter[status][_eq]=published`,
        {
          headers,
          next: { revalidate: 300 },
        }
      ),
      // 3. 查询服务商总数
      fetchWithTimeout(
        `${DIRECTUS_URL}/items/service_providers?aggregate[count]=id&filter[status][_eq]=published`,
        {
          headers,
          next: { revalidate: 300 },
        }
      ).catch(() => null), // 服务商查询失败不影响整体
      // 4. 查询快讯总数
      fetchWithTimeout(
        `${DIRECTUS_URL}/items/news?aggregate[count]=id&filter[status][_eq]=published`,
        {
          headers,
          next: { revalidate: 300 },
        }
      ),
    ]);

    // 处理响应
    if (!strategiesRes.ok) {
      throw new Error(`Failed to fetch strategies: ${strategiesRes.statusText}`);
    }
    if (!categoriesRes.ok) {
      throw new Error(`Failed to fetch categories: ${categoriesRes.statusText}`);
    }
    if (!newsRes.ok) {
      throw new Error(`Failed to fetch news: ${newsRes.statusText}`);
    }

    // 并行解析 JSON
    const [strategiesData, categoriesData, providersData, newsData] = await Promise.all([
      strategiesRes.json(),
      categoriesRes.json(),
      providersRes?.ok ? providersRes.json() : Promise.resolve({ data: [{ count: { id: 0 } }] }),
      newsRes.json(),
    ]);

    const strategiesCount = strategiesData.data?.[0]?.count?.id || 0;
    const categoriesCount = categoriesData.data?.length || 0;
    const providersCount = providersData.data?.[0]?.count?.id || 0;
    const newsCount = newsData.data?.[0]?.count?.id || 0;

    // 返回统计数据
    return NextResponse.json(
      {
        success: true,
        data: {
          strategies: strategiesCount,
          categories: categoriesCount,
          providers: providersCount,
          news: newsCount,
          updated_at: new Date().toISOString(),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // CDN缓存
        },
      }
    );
  } catch (error) {
    console.error('获取统计数据失败:', error);

    // 返回缓存的估算值作为降级方案
    const fallbackData = {
      strategies: 138,
      categories: 47,
      providers: 0,
      news: 50,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: fallbackData,
        fallback: true,
        message: '使用缓存数据',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  }
}

// 设置路由段配置
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5分钟重新验证
