'use client';

import { useState, useEffect } from 'react';
import { FileText, Send, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
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

interface SubmitPlaySectionProps {
  userId: string;
}

export default function SubmitPlaySection({ userId }: SubmitPlaySectionProps) {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [allCategories, setAllCategories] = useState<Array<{ name: string; slug: string; icon?: string }>>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    category: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  async function loadData() {
    try {
      // 加载分类
      const groups = await getCategoryGroups();
      setCategoryGroups(groups);

      const cats = groups.flatMap((group: CategoryGroup) =>
        group.children.map((cat) => ({
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
        }))
      );
      setAllCategories(cats);

      if (cats.length > 0) {
        setSubmissionForm((prev) => ({ ...prev, category: cats[0].slug }));
      }

      // 加载用户提交记录
      await loadSubmissions();
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSubmissions() {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error } = await supabase
        .from('user_submitted_plays')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('加载提交记录失败:', error);
        return;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('加载提交记录失败:', error);
    }
  }

  async function handleSubmit() {
    if (!submissionForm.title || !submissionForm.category || !submissionForm.content) {
      toast.error('请填写完整信息');
      return;
    }

    setIsSubmitting(true);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      // 提交到 Supabase
      const { data, error } = await supabase
        .from('user_submitted_plays')
        .insert({
          user_id: userId,
          title: submissionForm.title,
          category: submissionForm.category,
          content: submissionForm.content,
          status: 'pending',
          credits_awarded: 0,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('提交成功！等待审核');
      setSubmissionForm({ title: '', category: allCategories[0]?.slug || '', content: '' });

      // 重新加载提交记录
      await loadSubmissions();
    } catch (error) {
      console.error('提交失败:', error);
      toast.error('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">待审核</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">已通过</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">已拒绝</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 提交表单 */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">提交玩法</h2>
            <p className="text-sm text-gray-500">分享你的独家策略，获得积分奖励</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              玩法标题 *
            </label>
            <input
              type="text"
              value={submissionForm.title}
              onChange={(e) => setSubmissionForm({ ...submissionForm, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="例如: LayerZero 空投完全攻略"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              玩法类别 *
            </label>
            <select
              value={submissionForm.category}
              onChange={(e) => setSubmissionForm({ ...submissionForm, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {allCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              详细内容 *
            </label>
            <textarea
              value={submissionForm.content}
              onChange={(e) => setSubmissionForm({ ...submissionForm, content: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              rows={8}
              placeholder="详细描述你的玩法策略，包括步骤、收益预期、风险提示等..."
            />
          </div>

          {/* 提示信息 */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-700 flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                内容越详细，通过率越高。审核通过后将获得 1-100 积分奖励
              </span>
            </p>
          </div>

          <button
            onClick={handleSubmit}
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
      </div>

      {/* 提交记录 */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-purple-500" />
          我的提交记录
          {submissions.length > 0 && (
            <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
              {submissions.length}
            </span>
          )}
        </h3>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">还没有提交记录</p>
            <p className="text-sm text-gray-400">提交你的第一个玩法，开始赚取积分吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className={`p-5 rounded-xl border-2 transition-all ${
                  submission.status === 'approved'
                    ? 'bg-green-50 border-green-200 hover:border-green-300'
                    : submission.status === 'rejected'
                    ? 'bg-red-50 border-red-200 hover:border-red-300'
                    : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {submission.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs">
                        {submission.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(submission.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusBadge(submission.status)}
                    {submission.status === 'approved' && submission.credits_awarded > 0 && (
                      <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg">
                        +{submission.credits_awarded} 积分
                      </div>
                    )}
                  </div>
                </div>
                {submission.status === 'rejected' && submission.review_notes && (
                  <div className="mt-3 p-3 bg-white border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      <span className="font-medium">拒绝原因：</span>
                      {submission.review_notes}
                    </p>
                  </div>
                )}
                {submission.status === 'approved' && submission.review_notes && (
                  <div className="mt-3 p-3 bg-white border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">审核意见：</span>
                      {submission.review_notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
