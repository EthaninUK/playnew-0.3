'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User, Mail, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SettingsSectionProps {
  userId: string;
  userEmail: string;
}

export default function SettingsSection({ userId, userEmail }: SettingsSectionProps) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    avatar_url: '',
    twitter_handle: '',
    telegram_handle: '',
    website: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
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
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId, supabase]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('资料已保存');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">设置</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          管理您的账户设置和偏好
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
              value={userEmail}
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
  );
}
