import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

const getDbClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const limit = searchParams.get('limit') || '20';

  const client = getDbClient();

  try {
    await client.connect();

    let query = `
      SELECT *
      FROM live_opportunities
      WHERE status = 'active'
      AND (expires_at IS NULL OR expires_at > NOW())
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    query += ` ORDER BY profit_percent DESC, detected_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit));

    const result = await client.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      updated_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching live opportunities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live opportunities' },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}