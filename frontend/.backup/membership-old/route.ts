import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // 创建 Supabase 客户端
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

    // 获取当前登录用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('[API] Auth error or no user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[API] User ID:', user.id);
    console.log('[API] DIRECTUS_ADMIN_TOKEN exists:', !!process.env.DIRECTUS_ADMIN_TOKEN);
    console.log('[API] DIRECTUS_ADMIN_TOKEN length:', process.env.DIRECTUS_ADMIN_TOKEN?.length);

    // 从 Directus 获取用户的活跃订阅
    const url = `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${user.id}&filter[status][_eq]=active&sort=-start_date&limit=1&fields=*,membership_id.*`;
    console.log('[API] Fetching from Directus:', url);

    // 临时硬编码 token 来测试
    const token = process.env.DIRECTUS_ADMIN_TOKEN || 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';
    const subscriptionResponse = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[API] Directus response status:', subscriptionResponse.status);

    if (!subscriptionResponse.ok) {
      console.error('[API] Failed to fetch subscription from Directus');
      return NextResponse.json(
        { subscription: null },
        { status: 200 }
      );
    }

    const subscriptionData = await subscriptionResponse.json();
    console.log('[API] Directus data count:', subscriptionData.data?.length || 0);

    if (!subscriptionData.data || subscriptionData.data.length === 0) {
      // 没有活跃订阅
      console.log('[API] No active subscription found for user:', user.id);
      return NextResponse.json(
        { subscription: null },
        { status: 200 }
      );
    }

    const rawSubscription = subscriptionData.data[0];

    // 转换为前端需要的格式
    const subscription = {
      id: String(rawSubscription.id),
      membership: {
        id: String(rawSubscription.membership_id.id),
        name: rawSubscription.membership_id.name,
        level: rawSubscription.membership_id.level,
        price_monthly_usd: rawSubscription.membership_id.price_monthly_usd,
        price_yearly_usd: rawSubscription.membership_id.price_yearly_usd,
        features: rawSubscription.membership_id.features || {},
        description: rawSubscription.membership_id.description || '',
      },
      status: rawSubscription.status,
      billing_cycle: rawSubscription.billing_cycle,
      payment_method: rawSubscription.payment_method,
      amount_paid: rawSubscription.billing_cycle === 'monthly'
        ? rawSubscription.membership_id.price_monthly_usd
        : rawSubscription.membership_id.price_yearly_usd,
      start_date: rawSubscription.start_date,
      end_date: rawSubscription.end_date,
      auto_renew: rawSubscription.auto_renew,
      cancelled_at: rawSubscription.cancelled_at,
    };

    return NextResponse.json({ subscription }, { status: 200 });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
