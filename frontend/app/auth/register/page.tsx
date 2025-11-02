'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // Validate password
    if (password.length < 6) {
      setError('密码至少需要 6 个字符')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
          emailRedirectTo: `${window.location.origin}${redirect}`,
        },
      })

      if (error) throw error

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('该邮箱已被注册，请直接登录')
        return
      }

      setMessage('注册成功！请查收确认邮件。')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(`/auth/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`)
      }, 2000)
    } catch (error: any) {
      setError(error.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-8 border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">创建账号</h1>
            <p className="text-muted-foreground">加入币圈玩法收集录社区</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="username">用户名（可选）</Label>
              <Input
                id="username"
                type="text"
                placeholder="crypto_pro"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password">密码 (至少 6 位)</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-sm p-3 rounded-md">
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">已有账号? </span>
            <Link
              href={`/auth/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
              className="text-primary hover:underline font-medium"
            >
              登录
            </Link>
          </div>

          <div className="mt-6 text-xs text-muted-foreground text-center">
            注册即表示您同意我们的服务条款和隐私政策
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
