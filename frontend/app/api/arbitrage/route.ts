import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

const getDbClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const limit = searchParams.get('limit') || '50';

  const client = getDbClient();

  try {
    await client.connect();

    let query = `
      SELECT
        id, slug, title, title_en, category, summary,
        difficulty_level, risk_level, capital_requirement,
        profit_potential, execution_speed, featured,
        has_realtime_data, tags, view_count, sort
      FROM arbitrage_types
      WHERE status = 'published'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (featured === 'true') {
      query += ` AND featured = true`;
    }

    query += ` ORDER BY sort ASC, created_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit));

    const result = await client.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });

  } catch (error) {
    console.error('Error fetching arbitrage types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch arbitrage types' },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}