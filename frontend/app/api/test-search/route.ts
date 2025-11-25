import { NextRequest, NextResponse } from 'next/server';
import { MeiliSearch } from 'meilisearch';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || 'Uniswap';

    // 直接使用 Meilisearch 客户端
    const client = new MeiliSearch({
      host: 'http://localhost:7700',
      apiKey: process.env.MEILISEARCH_API_KEY || process.env.MEILISEARCH_MASTER_KEY || '3JxRTswA7fhGinzFd9BL5DBXdUhOktwPqzapMDL5GDc=',
    });

    const index = client.index('strategies');
    const results = await index.search(query, { limit: 5 });

    return NextResponse.json({
      success: true,
      query,
      totalHits: results.estimatedTotalHits,
      hits: results.hits.map((hit: any) => ({
        id: hit.id,
        title: hit.title,
        slug: hit.slug,
      })),
      apiKey: process.env.MEILISEARCH_API_KEY?.substring(0, 10) || 'NOT_SET',
      masterKey: process.env.MEILISEARCH_MASTER_KEY?.substring(0, 10) || 'NOT_SET',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      apiKey: process.env.MEILISEARCH_API_KEY?.substring(0, 10) || 'NOT_SET',
      masterKey: process.env.MEILISEARCH_MASTER_KEY?.substring(0, 10) || 'NOT_SET',
    }, { status: 500 });
  }
}
