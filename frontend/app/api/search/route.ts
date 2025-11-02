import { NextRequest, NextResponse } from 'next/server';
import { searchStrategies, searchProviders, searchNews, searchAll } from '@/lib/meilisearch/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const type = searchParams.get('type'); // 'all', 'strategy', 'provider', 'news'
  const category = searchParams.get('category');
  const riskLevel = searchParams.get('risk');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], totalHits: 0, query: '' });
  }

  try {
    // 全局搜索
    if (!type || type === 'all') {
      const results = await searchAll(query, 10);
      return NextResponse.json({
        strategies: results.strategies,
        providers: results.providers,
        news: results.news,
        totalHits: results.totalHits,
        query,
      });
    }

    // 构建过滤器
    let filter: string | undefined;
    const filters: string[] = [];

    if (category) {
      filters.push(`category = "${category}"`);
    }

    if (riskLevel) {
      if (riskLevel.includes('-')) {
        const [min, max] = riskLevel.split('-').map(Number);
        filters.push(`risk_level >= ${min} AND risk_level <= ${max}`);
      } else {
        filters.push(`risk_level = ${riskLevel}`);
      }
    }

    if (filters.length > 0) {
      filter = filters.join(' AND ');
    }

    // 根据类型搜索
    let results;
    if (type === 'strategy') {
      results = await searchStrategies({
        query,
        limit: 20,
        filter,
        sort: ['view_count:desc', 'created_at:desc'],
      });
    } else if (type === 'provider') {
      results = await searchProviders({
        query,
        limit: 20,
        filter,
        sort: ['rating:desc'],
      });
    } else if (type === 'news') {
      results = await searchNews({
        query,
        limit: 20,
        filter,
        sort: ['published_at:desc'],
      });
    }

    return NextResponse.json({
      results: results?.hits || [],
      totalHits: results?.totalHits || 0,
      query,
      processingTimeMs: results?.processingTimeMs || 0,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', results: [], totalHits: 0 },
      { status: 500 }
    );
  }
}
