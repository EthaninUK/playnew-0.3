'use client';

import { useAccount, useSignMessage } from 'wagmi';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const authenticateWithWallet = async () => {
    if (!address || !isConnected) {
      toast.error('请先连接钱包');
      return;
    }

    setIsAuthenticating(true);

    try {
      // 1. 生成随机 nonce
      const nonce = Math.random().toString(36).substring(7);
      const message = `登录 PlayNew.ai\n\n地址: ${address}\nNonce: ${nonce}\n时间: ${new Date().toISOString()}`;

      // 2. 请求用户签名
      const signature = await signMessageAsync({ message });

      // 3. 验证签名并登录 Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${address.toLowerCase()}@wallet.playnew.ai`,
        password: signature,
      });

      if (error) {
        // 如果用户不存在，自动注册
        if (error.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: `${address.toLowerCase()}@wallet.playnew.ai`,
            password: signature,
            options: {
              data: {
                wallet_address: address,
                login_method: 'wallet',
              },
            },
          });

          if (signUpError) throw signUpError;

          // 注册后再次登录
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: `${address.toLowerCase()}@wallet.playnew.ai`,
            password: signature,
          });

          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }

      toast.success('钱包登录成功！');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error('Wallet auth error:', error);
      if (error.message?.includes('User rejected')) {
        toast.error('您取消了签名');
      } else {
        toast.error('钱包登录失败: ' + (error.message || '未知错误'));
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    address,
    isConnected,
    isAuthenticating,
    authenticateWithWallet,
  };
}
