/**
 * Supabase 服务端工具函数
 * 用于 API routes 中创建带用户认证的 Supabase 客户端
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 创建带用户 token 的 Supabase 客户端
 * @param userToken - 用户的访问令牌
 */
export async function createClient(userToken: string) {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  });
}

/**
 * 创建服务端 Supabase 客户端（使用 service role key）
 * 用于需要绕过 RLS 的操作
 */
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
