import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function GET() {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/memberships?sort=level&filter[is_active][_eq]=true`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch memberships');
    }

    const data = await response.json();

    return NextResponse.json({
      memberships: data.data || [],
    });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memberships' },
      { status: 500 }
    );
  }
}
