import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

interface Membership {
  id: number;
  name: string;
  level: number;
  price_monthly_usd: string;
  price_yearly_usd: string;
  features: Record<string, string>;
  description: string;
}

interface UserSubscription {
  id: number;
  user_id: string;
  membership_id: number;
  status: string;
  billing_cycle: string;
  payment_method: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  cancelled_at: string | null;
  stripe_subscription_id: string | null;
}

interface SubscriptionWithMembership extends UserSubscription {
  membership_id: Membership;
}

export async function GET(request: NextRequest) {
  console.log('\n=== [/api/subscription] Request started ===');

  try {
    // 1. Get Supabase user
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('[Auth] User ID:', user?.id || 'none');
    console.log('[Auth] User Email:', user?.email || 'none');

    if (authError || !user) {
      console.log('[Auth] Error:', authError?.message || 'No user');
      return NextResponse.json(
        { error: 'Unauthorized', subscription: null },
        { status: 401 }
      );
    }

    // 2. Check Directus token
    if (!DIRECTUS_TOKEN) {
      console.error('[Directus] DIRECTUS_ADMIN_TOKEN not set!');
      return NextResponse.json(
        { error: 'Server configuration error', subscription: null },
        { status: 500 }
      );
    }
    console.log('[Directus] Token length:', DIRECTUS_TOKEN.length);

    // 3. Fetch subscription from Directus
    const url = `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${user.id}&filter[status][_eq]=active&sort=-start_date&limit=1&fields=*,membership_id.*`;
    console.log('[Directus] Fetching:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      },
      cache: 'no-store',
    });

    console.log('[Directus] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Directus] Error response:', errorText);

      // Return null subscription instead of error for better UX
      return NextResponse.json(
        { subscription: null },
        { status: 200 }
      );
    }

    const data = await response.json();
    console.log('[Directus] Records found:', data.data?.length || 0);

    if (!data.data || data.data.length === 0) {
      console.log('[Result] No active subscription found');
      return NextResponse.json(
        { subscription: null },
        { status: 200 }
      );
    }

    // 4. Transform data
    const rawSub = data.data[0] as SubscriptionWithMembership;
    console.log('[Data] Raw subscription ID:', rawSub.id);
    console.log('[Data] Membership:', rawSub.membership_id?.name);

    const subscription = {
      id: String(rawSub.id),
      membership: {
        id: String(rawSub.membership_id.id),
        name: rawSub.membership_id.name,
        level: rawSub.membership_id.level,
        price_monthly_usd: parseFloat(rawSub.membership_id.price_monthly_usd),
        price_yearly_usd: parseFloat(rawSub.membership_id.price_yearly_usd),
        features: rawSub.membership_id.features || {},
        description: rawSub.membership_id.description || '',
      },
      status: rawSub.status,
      billing_cycle: rawSub.billing_cycle,
      payment_method: rawSub.payment_method,
      amount_paid: rawSub.billing_cycle === 'monthly'
        ? parseFloat(rawSub.membership_id.price_monthly_usd)
        : parseFloat(rawSub.membership_id.price_yearly_usd),
      start_date: rawSub.start_date,
      end_date: rawSub.end_date,
      auto_renew: rawSub.auto_renew,
      cancelled_at: rawSub.cancelled_at,
    };

    console.log('[Result] Subscription transformed successfully');
    console.log('=== [/api/subscription] Request completed ===\n');

    return NextResponse.json({ subscription }, { status: 200 });

  } catch (error: any) {
    console.error('[Error]', error.message);
    console.error(error.stack);
    console.log('=== [/api/subscription] Request failed ===\n');

    return NextResponse.json(
      { error: 'Internal server error', subscription: null },
      { status: 500 }
    );
  }
}
