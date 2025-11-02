import { MeiliSearch } from 'meilisearch';

// 客户端实例（用于浏览器端）
export function getMeiliClient() {
  const apiKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || process.env.MEILISEARCH_MASTER_KEY;

  return new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700',
    ...(apiKey && { apiKey }),
  });
}

// 服务端实例（用于 API routes，有写权限）
export function getMeiliAdminClient() {
  const apiKey = process.env.MEILISEARCH_MASTER_KEY;

  return new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700',
    ...(apiKey && { apiKey }),
  });
}

export const STRATEGIES_INDEX = 'strategies';
export const NEWS_INDEX = 'news';
export const PROVIDERS_INDEX = 'providers';
