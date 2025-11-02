'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, CheckCircle, XCircle, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function SyncAdminPage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<any>(null);

  const handleSync = async (type: 'all' | 'strategies' | 'providers' | 'news') => {
    setSyncing(true);
    toast.info(`开始同步 ${type === 'all' ? '所有数据' : type}...`);

    try {
      const response = await fetch(`/api/sync-search?type=${type}`);
      const data = await response.json();

      if (data.success) {
        setLastSync(data);
        toast.success('同步成功！');
      } else {
        toast.error(`同步失败: ${data.error}`);
      }
    } catch (error: any) {
      toast.error(`同步错误: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">搜索索引同步管理</h1>
          <p className="text-muted-foreground">
            手动触发 MeiliSearch 搜索索引同步。添加新内容后需要运行同步才能被搜索到。
          </p>
        </div>

        {/* 同步按钮 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              快速同步
            </CardTitle>
            <CardDescription>
              选择要同步的内容类型。"全部同步" 会同步所有已发布的玩法、服务商和资讯。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleSync('all')}
                disabled={syncing}
                size="lg"
                className="h-20"
              >
                {syncing ? (
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Database className="h-5 w-5 mr-2" />
                )}
                全部同步
              </Button>

              <Button
                onClick={() => handleSync('strategies')}
                disabled={syncing}
                variant="outline"
                size="lg"
                className="h-20"
              >
                {syncing ? (
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Database className="h-5 w-5 mr-2" />
                )}
                仅同步玩法
              </Button>

              <Button
                onClick={() => handleSync('providers')}
                disabled={syncing}
                variant="outline"
                size="lg"
                className="h-20"
              >
                {syncing ? (
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Database className="h-5 w-5 mr-2" />
                )}
                仅同步服务商
              </Button>

              <Button
                onClick={() => handleSync('news')}
                disabled={syncing}
                variant="outline"
                size="lg"
                className="h-20"
              >
                {syncing ? (
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Database className="h-5 w-5 mr-2" />
                )}
                仅同步资讯
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 上次同步结果 */}
        {lastSync && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {lastSync.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                上次同步结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lastSync.synced.strategies && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">玩法策略</span>
                    <span className="text-sm text-muted-foreground">
                      {lastSync.synced.strategies.count || 0} 条
                    </span>
                  </div>
                )}

                {lastSync.synced.providers && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">服务商</span>
                    <span className="text-sm text-muted-foreground">
                      {lastSync.synced.providers.count || 0} 条
                    </span>
                  </div>
                )}

                {lastSync.synced.news && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">资讯</span>
                    <span className="text-sm text-muted-foreground">
                      {lastSync.synced.news.count || 0} 条
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. <strong>添加新内容后</strong>：在 Directus 中添加或编辑内容后，需要运行同步才能在搜索中找到。</p>
            <p>2. <strong>选择同步类型</strong>：如果只修改了玩法，可以只同步玩法以节省时间。</p>
            <p>3. <strong>全部同步</strong>：如果不确定修改了什么，建议使用"全部同步"。</p>
            <p>4. <strong>同步频率</strong>：建议每次发布新内容后都运行一次同步。</p>
          </CardContent>
        </Card>

        {/* 快捷访问 */}
        <Card>
          <CardHeader>
            <CardTitle>快捷访问</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="http://localhost:8055/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              📝 打开 Directus 管理后台
            </a>
            <a
              href="http://localhost:7700"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              🔍 打开 MeiliSearch 仪表板
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
