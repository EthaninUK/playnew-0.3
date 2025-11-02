'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Save,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    avatar_url: '',
    twitter_handle: '',
    telegram_handle: '',
    website: '',
  });

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          router.push('/auth/login');
          return;
        }

        setUser(currentUser);

        // 获取用户资料
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (profileData) {
          setProfile({
            username: profileData.username || '',
            bio: profileData.bio || '',
            avatar_url: profileData.avatar_url || '',
            twitter_handle: profileData.twitter_handle || '',
            telegram_handle: profileData.telegram_handle || '',
            website: profileData.website || '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('加载用户数据失败');
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router, supabase]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('资料已保存');
      router.push('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              首页
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/profile" className="hover:text-foreground transition-colors">
              个人中心
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">设置</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">个人资料设置</h1>
            <p className="text-muted-foreground mt-2">
              管理你的个人信息和偏好设置
            </p>
          </div>

          {/* 账户信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                账户信息
              </CardTitle>
              <CardDescription>
                这些信息会在你的个人主页上公开显示
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 邮箱（只读） */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  邮箱地址无法修改
                </p>
              </div>

              <Separator />

              {/* 用户名 */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  用户名 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  placeholder="请输入用户名"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  {profile.username.length}/50 字符
                </p>
              </div>

              {/* 个人简介 */}
              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  placeholder="介绍一下你自己..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {profile.bio.length}/200 字符
                </p>
              </div>

              {/* 头像URL */}
              <div className="space-y-2">
                <Label htmlFor="avatar_url">头像 URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={profile.avatar_url}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  输入你的头像图片链接
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 社交链接 */}
          <Card>
            <CardHeader>
              <CardTitle>社交链接</CardTitle>
              <CardDescription>
                添加你的社交媒体账号（可选）
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Twitter */}
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">@</span>
                  <Input
                    id="twitter"
                    placeholder="username"
                    value={profile.twitter_handle}
                    onChange={(e) => setProfile({ ...profile, twitter_handle: e.target.value })}
                  />
                </div>
              </div>

              {/* Telegram */}
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">@</span>
                  <Input
                    id="telegram"
                    placeholder="username"
                    value={profile.telegram_handle}
                    onChange={(e) => setProfile({ ...profile, telegram_handle: e.target.value })}
                  />
                </div>
              </div>

              {/* 个人网站 */}
              <div className="space-y-2">
                <Label htmlFor="website">个人网站</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-website.com"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/profile')}
              disabled={saving}
            >
              取消
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !profile.username}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存设置
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
