import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

const getDbClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  });
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  const client = getDbClient();

  try {
    await client.connect();

    // Get arbitrage type details
    const result = await client.query(
      `SELECT * FROM arbitrage_types WHERE slug = $1 AND status = 'published'`,
      [params.slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Arbitrage type not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await client.query(
      `UPDATE arbitrage_types SET view_count = view_count + 1 WHERE slug = $1`,
      [params.slug]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error fetching arbitrage type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch arbitrage type' },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}