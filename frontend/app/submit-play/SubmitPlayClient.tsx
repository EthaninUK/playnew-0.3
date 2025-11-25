'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Send, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getCategoryGroups, type CategoryGroup } from '@/lib/directus';

interface Submission {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  credits_awarded: number;
  review_notes: string;
  created_at: string;
  reviewed_at: string;
}

export default function SubmitPlayClient() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, supabase } = useAuth();

  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [allCategories, setAllCategories] = useState<Array<{ name: string; slug: string; icon?: string }>>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    category: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // 初始化：加载分类数据
  useEffect(() => {
    loadCategories();
  }, []);

  // 当用户状态变化时，加载用户提交记录
  useEffect(() => {
    async function loadUserData() {
      if (authUser) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await loadSubmissions(session.access_token);
        }
      }
      setPageLoading(false);
    }

    if (!authLoading) {
      loadUserData();
    }
  }, [authUser, authLoading]);

  // 加载分类
  async function loadCategories() {
    try {
      const groups = await getCategoryGroups();
      setCategoryGroups(groups);

      // 提取所有分类
      const cats = groups.flatMap((group: CategoryGroup) =>
        group.children.map((cat) => ({
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
        }))
      );
      setAllCategories(cats);

      // 设置默认分类
      if (cats.length > 0) {
        setSubmissionForm((prev) => ({ ...prev, category: cats[0].slug }));
      }
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  }

  // 加载提交记录
  async function loadSubmissions(token: string) {
    try {
      const response = await fetch('/api/play-exchange/submissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('加载提交记录失败:', error);
    }
  }

  // 提交玩法
  async function handleSubmitPlay() {
    if (!authUser) {
      toast.error('请先登录');
      router.push('/auth/login');
      return;
    }

    if (!submissionForm.title || !submissionForm.category || !submissionForm.content) {
      toast.error('请填写完整信息');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('请先登录');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/play-exchange/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(submissionForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('提交成功！等待审核');
        setSubmissionForm({ title: '', category: allCategories[0]?.slug || '', content: '' });
        await loadSubmissions(session.access_token);
      } else {
        toast.error(data.error || '提交失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      toast.error('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  }

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">待审核</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full">已通过</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded-full">已拒绝</span>;
      default:
        return null;
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            请先登录
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            登录后即可提交玩法并获得积分奖励
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg"
          >
            前往登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10">
        {/* Dynamic grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Rotating lights */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-transparent rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  提交玩法
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                分享你的独家策略，获得积分奖励
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 提交表单 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  玩法标题 *
                </label>
                <input
                  type="text"
                  value={submissionForm.title}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="例如: LayerZero 空投完全攻略"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  玩法类别 *
                </label>
                <select
                  value={submissionForm.category}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  {allCategories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  详细内容 *
                </label>
                <textarea
                  value={submissionForm.content}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, content: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  rows={8}
                  placeholder="详细描述你的玩法策略，包括步骤、收益预期、风险提示等..."
                />
              </div>

              {/* 提示信息 */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-300 dark:border-amber-500/30 rounded-xl">
                <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    内容越详细，通过率越高。审核通过后将获得 1-100 积分奖励
                  </span>
                </p>
              </div>

              <button
                onClick={handleSubmitPlay}
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    立即提交换取积分
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* 我的提交记录 */}
          {submissions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                我的提交记录
              </h3>

              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/50 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {submission.title}
                      </h4>
                      {getStatusBadge(submission.status)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      分类: {submission.category}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      提交时间: {new Date(submission.created_at).toLocaleDateString('zh-CN')}
                    </div>
                    {submission.status === 'approved' && submission.credits_awarded > 0 && (
                      <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                        获得积分: +{submission.credits_awarded}
                      </div>
                    )}
                    {submission.status === 'rejected' && submission.review_notes && (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                        拒绝原因: {submission.review_notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
