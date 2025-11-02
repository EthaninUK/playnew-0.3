import { NextRequest, NextResponse } from 'next/server';
import { MeiliSearch } from 'meilisearch';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const MEILISEARCH_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_KEY = process.env.MEILISEARCH_MASTER_KEY;

const client = new MeiliSearch({
  host: MEILISEARCH_HOST,
  ...(MEILISEARCH_KEY && { apiKey: MEILISEARCH_KEY }),
});

/**
 * API endpoint to sync Directus data to MeiliSearch
 * Can be called manually or via webhook
 */
export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();
    const syncType = type || 'all'; // 'strategies', 'providers', 'news', or 'all'

    const results: any = {
      success: true,
      synced: {},
    };

    // Sync strategies
    if (syncType === 'all' || syncType === 'strategies') {
      const strategiesResult = await syncStrategies();
      results.synced.strategies = strategiesResult;
    }

    // Sync providers
    if (syncType === 'all' || syncType === 'providers') {
      const providersResult = await syncProviders();
      results.synced.providers = providersResult;
    }

    // Sync news
    if (syncType === 'all' || syncType === 'news') {
      const newsResult = await syncNews();
      results.synced.news = newsResult;
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function syncStrategies() {
  try {
    const params = new URLSearchParams({
      'filter[status][_eq]': 'published',
      'limit': '-1',
      'fields': 'id,title,slug,summary,content,category,risk_level,view_count,bookmark_count,created_at,updated_at,status,tags,chains,protocols',
    });

    const response = await fetch(`${DIRECTUS_URL}/items/strategies?${params}`);
    const data = await response.json();
    const strategies = data.data || [];

    if (strategies.length === 0) {
      return { count: 0, message: 'No strategies to sync' };
    }

    const index = client.index('strategies');
    await index.addDocuments(strategies, { primaryKey: 'id' });

    return { count: strategies.length, message: `Synced ${strategies.length} strategies` };
  } catch (error: any) {
    return { count: 0, error: error.message };
  }
}

async function syncProviders() {
  try {
    const params = new URLSearchParams({
      'filter[status][_eq]': 'published',
      'limit': '-1',
      'fields': 'id,name,slug,description,logo_url,type,category,rating,verified,view_count,review_count,website_url,status',
    });

    const response = await fetch(`${DIRECTUS_URL}/items/service_providers?${params}`);
    const data = await response.json();
    const providers = data.data || [];

    if (providers.length === 0) {
      return { count: 0, message: 'No providers to sync' };
    }

    const index = client.index('providers');
    await index.addDocuments(providers, { primaryKey: 'id' });

    return { count: providers.length, message: `Synced ${providers.length} providers` };
  } catch (error: any) {
    return { count: 0, error: error.message };
  }
}

async function syncNews() {
  try {
    const params = new URLSearchParams({
      'filter[status][_eq]': 'published',
      'limit': '-1',
      'fields': 'id,title,ai_summary,content,category,source,published_at,created_at,status,news_type',
    });

    const response = await fetch(`${DIRECTUS_URL}/items/news?${params}`);
    const data = await response.json();
    const news = data.data || [];

    if (news.length === 0) {
      return { count: 0, message: 'No news to sync' };
    }

    const index = client.index('news');
    await index.addDocuments(news, { primaryKey: 'id' });

    return { count: news.length, message: `Synced ${news.length} news items` };
  } catch (error: any) {
    return { count: 0, error: error.message };
  }
}

// GET endpoint to manually trigger sync (for convenience)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'all';

  try {
    const results: any = {
      success: true,
      synced: {},
    };

    if (type === 'all' || type === 'strategies') {
      results.synced.strategies = await syncStrategies();
    }

    if (type === 'all' || type === 'providers') {
      results.synced.providers = await syncProviders();
    }

    if (type === 'all' || type === 'news') {
      results.synced.news = await syncNews();
    }

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
