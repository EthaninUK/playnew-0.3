'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { Heart, FileText, Building2, Newspaper, Loader2, Check } from 'lucide-react'

interface ProfileContentProps {
  user: User
  profile: any
  stats: {
    strategies: number
    providers: number
    news: number
    total: number
  }
}

export function ProfileContent({ user, profile: initialProfile, stats }: ProfileContentProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [username, setUsername] = useState(profile?.username || '')
  const [bio, setBio] = useState(profile?.bio || '')

  const supabase = createClient()

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          username,
          bio,
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      setIsEditing(false)
      setMessage({ type: 'success', text: '保存成功！' })

      // 3 秒后清除消息
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '保存失败' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setUsername(profile?.username || '')
    setBio(profile?.bio || '')
    setIsEditing(false)
    setMessage(null)
  }

  return (
    <div className="space-y-6">
      {/* 用户信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
          <CardDescription>
            管理您的公开信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
              <AvatarFallback className="text-2xl">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">邮箱</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing}
                placeholder="设置您的用户名"
              />
            </div>

            <div>
              <Label htmlFor="bio">个人简介</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
                placeholder="介绍一下您自己..."
                rows={3}
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {message.type === 'success' && <Check className="h-4 w-4" />}
              {message.text}
            </div>
          )}

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    '保存'
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  取消
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                编辑资料
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 收藏统计卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>我的收藏</CardTitle>
          <CardDescription>
            您收藏的内容统计
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">总收藏</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <FileText className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{stats.strategies}</p>
              <p className="text-sm text-muted-foreground">玩法</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Building2 className="h-8 w-8 text-purple-500 mb-2" />
              <p className="text-2xl font-bold">{stats.providers}</p>
              <p className="text-sm text-muted-foreground">服务商</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Newspaper className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold">{stats.news}</p>
              <p className="text-sm text-muted-foreground">资讯</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 账号信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>账号信息</CardTitle>
          <CardDescription>
            您的账号详细信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">用户 ID</span>
            <span className="font-mono text-sm">{user.id.substring(0, 8)}...</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">注册时间</span>
            <span>{new Date(user.created_at).toLocaleDateString('zh-CN')}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">邮箱验证</span>
            <span className={user.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}>
              {user.email_confirmed_at ? '已验证' : '未验证'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
