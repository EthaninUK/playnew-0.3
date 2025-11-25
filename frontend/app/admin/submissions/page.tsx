'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

interface Submission {
  id: string;
  user_id: string;
  title: string;
  category: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  credits_awarded: number;
  review_notes: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function SubmissionsAdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [creditsAwarded, setCreditsAwarded] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (adminUser) {
      loadSubmissions();
    }
  }, [adminUser, activeTab]);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login?redirect=/admin/submissions');
      return;
    }

    // TODO: 添加管理员权限检查
    // 暂时允许所有登录用户访问
    setAdminUser(user);
  }

  async function loadSubmissions() {
    try {
      setLoading(true);

      let query = supabase
        .from('user_submitted_plays')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      console.error('加载提交记录失败:', error);
      toast.error('加载失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(submissionId: string, status: 'approved' | 'rejected') {
    if (!adminUser) return;

    setProcessing(true);

    try {
      const updateData: any = {
        status,
        review_notes: reviewNotes,
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
      };

      if (status === 'approved') {
        updateData.credits_awarded = creditsAwarded;
      }

      const { error } = await supabase
        .from('user_submitted_plays')
        .update(updateData)
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(status === 'approved' ? '已通过审核' : '已拒绝');

      // 重置表单
      setSelectedSubmission(null);
      setReviewNotes('');
      setCreditsAwarded(0);

      // 刷新列表
      await loadSubmissions();
    } catch (error) {
      console.error('审核失败:', error);
      toast.error('审核失败');
    } finally {
      setProcessing(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">待审核</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">已通过</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">已拒绝</Badge>;
      default:
        return null;
    }
  };

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    total: submissions.length,
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            玩法提交审核
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            审核用户提交的玩法，并分配积分奖励
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">待审核</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已通过</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已拒绝</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-10 h-10 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总提交</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <Award className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 标签页 */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              待审核 ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="approved">
              已通过 ({stats.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              已拒绝 ({stats.rejected})
            </TabsTrigger>
            <TabsTrigger value="all">
              全部 ({stats.total})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : submissions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">没有提交记录</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 提交列表 */}
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <Card
                      key={submission.id}
                      className={`cursor-pointer transition-all ${
                        selectedSubmission?.id === submission.id
                          ? 'ring-2 ring-blue-500'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setReviewNotes(submission.review_notes || '');
                        setCreditsAwarded(submission.credits_awarded || 50);
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">
                              {submission.title}
                            </CardTitle>
                            <CardDescription>
                              分类: {submission.category}
                            </CardDescription>
                          </div>
                          {getStatusBadge(submission.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center justify-between">
                            <span>提交时间:</span>
                            <span>{new Date(submission.created_at).toLocaleString('zh-CN')}</span>
                          </div>
                          {submission.status === 'approved' && (
                            <div className="flex items-center justify-between text-green-600 font-medium">
                              <span>获得积分:</span>
                              <span>+{submission.credits_awarded}</span>
                            </div>
                          )}
                          {submission.reviewed_at && (
                            <div className="flex items-center justify-between">
                              <span>审核时间:</span>
                              <span>{new Date(submission.reviewed_at).toLocaleString('zh-CN')}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 审核面板 */}
                <div className="lg:sticky lg:top-6 lg:self-start">
                  {selectedSubmission ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          审核详情
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* 内容预览 */}
                        <div>
                          <h4 className="font-semibold mb-2">提交内容:</h4>
                          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-64 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">{selectedSubmission.content}</p>
                          </div>
                        </div>

                        {selectedSubmission.status === 'pending' && (
                          <>
                            {/* 积分设置 */}
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                奖励积分 (1-100)
                              </label>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                value={creditsAwarded}
                                onChange={(e) => setCreditsAwarded(parseInt(e.target.value) || 0)}
                                placeholder="输入积分数量"
                              />
                            </div>

                            {/* 审核意见 */}
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                审核意见
                              </label>
                              <Textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="输入审核意见或拒绝原因..."
                                rows={4}
                              />
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex gap-3">
                              <Button
                                onClick={() => handleReview(selectedSubmission.id, 'approved')}
                                disabled={processing || creditsAwarded < 1 || creditsAwarded > 100}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                {processing ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <ThumbsUp className="w-4 h-4 mr-2" />
                                )}
                                通过
                              </Button>
                              <Button
                                onClick={() => handleReview(selectedSubmission.id, 'rejected')}
                                disabled={processing}
                                variant="destructive"
                                className="flex-1"
                              >
                                {processing ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <ThumbsDown className="w-4 h-4 mr-2" />
                                )}
                                拒绝
                              </Button>
                            </div>
                          </>
                        )}

                        {/* 已审核的记录显示审核信息 */}
                        {selectedSubmission.status !== 'pending' && selectedSubmission.review_notes && (
                          <div className={`p-4 rounded-lg ${
                            selectedSubmission.status === 'approved'
                              ? 'bg-green-50 dark:bg-green-950 border border-green-200'
                              : 'bg-red-50 dark:bg-red-950 border border-red-200'
                          }`}>
                            <p className={`text-sm ${
                              selectedSubmission.status === 'approved'
                                ? 'text-green-700 dark:text-green-300'
                                : 'text-red-700 dark:text-red-300'
                            }`}>
                              <span className="font-medium">
                                {selectedSubmission.status === 'approved' ? '审核意见:' : '拒绝原因:'}
                              </span>
                              <br />
                              {selectedSubmission.review_notes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">选择一个提交记录查看详情</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
