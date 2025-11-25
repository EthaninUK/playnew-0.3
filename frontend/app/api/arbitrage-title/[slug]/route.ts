import { NextResponse } from 'next/server';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const items = await directus.request(
      readItems('arbitrage_types', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        fields: ['title'],
        limit: 1,
      })
    );

    if (!items || items.length === 0) {
      return NextResponse.json({ title: null }, { status: 404 });
    }

    return NextResponse.json({ title: items[0].title });
  } catch (error) {
    console.error('Error fetching arbitrage title:', error);
    return NextResponse.json({ title: null }, { status: 500 });
  }
}
