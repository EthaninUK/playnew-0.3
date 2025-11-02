import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // 验证 webhook 签名
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // 处理不同的事件类型
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// 处理支付成功 - 创建订阅记录
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);

  const userId = session.metadata?.userId;
  const membershipId = session.metadata?.membershipId;
  const billingCycle = session.metadata?.billingCycle;

  if (!userId || !membershipId) {
    console.error('Missing required metadata:', { userId, membershipId });
    return;
  }

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  // 获取订阅详情
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // 计算订阅期限
  const startDate = new Date(subscription.current_period_start * 1000);
  const endDate = new Date(subscription.current_period_end * 1000);

  // 创建 user_subscriptions 记录
  try {
    const subscriptionResponse = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          user_id: userId,
          membership_id: membershipId,
          status: 'active',
          billing_cycle: billingCycle,
          payment_method: 'stripe',
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: customerId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          auto_renew: true,
        }),
      }
    );

    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.json();
      console.error('Failed to create subscription record:', error);
      return;
    }

    const subscriptionData = await subscriptionResponse.json();
    console.log('Created subscription record:', subscriptionData.data.id);

    // 创建 payments 记录
    const amount = session.amount_total ? session.amount_total / 100 : 0;

    await fetch(`${DIRECTUS_URL}/items/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        user_id: userId,
        subscription_id: subscriptionData.data.id,
        amount: amount,
        payment_method: 'stripe',
        stripe_payment_id: session.payment_intent,
        status: 'completed',
        payment_date: new Date().toISOString(),
      }),
    });

    console.log('Created payment record');
  } catch (error) {
    console.error('Error creating records:', error);
  }
}

// 处理订阅更新
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription.updated:', subscription.id);

  try {
    // 查找对应的订阅记录
    const response = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?filter[stripe_subscription_id][_eq]=${subscription.id}`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const subscriptionRecord = data.data[0];

      // 更新订阅状态和日期
      await fetch(
        `${DIRECTUS_URL}/items/user_subscriptions/${subscriptionRecord.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
          },
          body: JSON.stringify({
            status: subscription.status === 'active' ? 'active' : 'cancelled',
            end_date: new Date(subscription.current_period_end * 1000).toISOString(),
            auto_renew: !subscription.cancel_at_period_end,
          }),
        }
      );

      console.log('Updated subscription record:', subscriptionRecord.id);
    }
  } catch (error) {
    console.error('Error updating subscription:', error);
  }
}

// 处理订阅取消
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription.deleted:', subscription.id);

  try {
    // 查找对应的订阅记录
    const response = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?filter[stripe_subscription_id][_eq]=${subscription.id}`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const subscriptionRecord = data.data[0];

      // 更新订阅状态为已取消
      await fetch(
        `${DIRECTUS_URL}/items/user_subscriptions/${subscriptionRecord.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
          },
          body: JSON.stringify({
            status: 'cancelled',
            auto_renew: false,
          }),
        }
      );

      console.log('Cancelled subscription record:', subscriptionRecord.id);
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
  }
}

// 处理发票支付成功 (续费)
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_succeeded:', invoice.id);

  if (!invoice.subscription) return;

  const subscriptionId = invoice.subscription as string;
  const amount = invoice.amount_paid / 100;

  try {
    // 查找对应的订阅记录
    const response = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?filter[stripe_subscription_id][_eq]=${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const subscriptionRecord = data.data[0];

      // 创建新的支付记录
      await fetch(`${DIRECTUS_URL}/items/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          user_id: subscriptionRecord.user_id,
          subscription_id: subscriptionRecord.id,
          amount: amount,
          payment_method: 'stripe',
          stripe_payment_id: invoice.payment_intent,
          status: 'completed',
          payment_date: new Date().toISOString(),
        }),
      });

      console.log('Created renewal payment record');
    }
  } catch (error) {
    console.error('Error processing invoice payment:', error);
  }
}

// 处理发票支付失败
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_failed:', invoice.id);

  if (!invoice.subscription) return;

  const subscriptionId = invoice.subscription as string;

  try {
    // 查找对应的订阅记录
    const response = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?filter[stripe_subscription_id][_eq]=${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const subscriptionRecord = data.data[0];

      // 更新订阅状态为支付失败
      await fetch(
        `${DIRECTUS_URL}/items/user_subscriptions/${subscriptionRecord.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
          },
          body: JSON.stringify({
            status: 'payment_failed',
          }),
        }
      );

      console.log('Updated subscription status to payment_failed');

      // TODO: 发送邮件通知用户支付失败
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
