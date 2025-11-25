'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Gift, Loader2, CalendarCheck, Send, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string;
  reward_pp: number;
  task_type: 'daily';
  action_required: string;
  completed: boolean;
  icon: React.ReactNode;
}

interface TaskCenterProps {
  userId: string;
  compact?: boolean;
}

export default function TaskCenter({ userId, compact = false }: TaskCenterProps) {
  const { supabase } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // 定义三个每日任务
  const getDefaultTasks = (): Task[] => [
    {
      id: 'daily_signin',
      title: '每日签到',
      description: '完成今日签到，获取积分奖励',
      reward_pp: 10,
      task_type: 'daily',
      action_required: 'signin',
      completed: false,
      icon: <CalendarCheck className="w-5 h-5 text-white" />,
    },
    {
      id: 'submit_play',
      title: '提交玩法',
      description: '提交一个新的玩法策略',
      reward_pp: 50,
      task_type: 'daily',
      action_required: 'submit_play',
      completed: false,
      icon: <Send className="w-5 h-5 text-white" />,
    },
    {
      id: 'invite_friend',
      title: '邀请好友',
      description: '成功邀请一位好友注册',
      reward_pp: 100,
      task_type: 'daily',
      action_required: 'invite_friend',
      completed: false,
      icon: <Users className="w-5 h-5 text-white" />,
    },
  ];

  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId]);

  async function loadTasks() {
    try {
      setLoading(true);

      // 获取当前session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        // 未登录时显示默认任务
        setTasks(getDefaultTasks());
        return;
      }

      // 从 API 获取任务完成状态
      const response = await fetch('/api/playpass/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('加载任务失败');
      }

      const result = await response.json();

      if (result.success && result.data) {
        // 合并API返回的任务状态
        const defaultTasks = getDefaultTasks();
        const updatedTasks = defaultTasks.map(task => {
          const apiTask = result.data.find((t: any) => t.action_required === task.action_required);
          if (apiTask) {
            return { ...task, completed: apiTask.completed };
          }
          return task;
        });
        setTasks(updatedTasks);
      } else {
        setTasks(getDefaultTasks());
      }
    } catch (error) {
      console.error('加载任务失败:', error);
      setTasks(getDefaultTasks());
    } finally {
      setLoading(false);
    }
  }

  async function handleTaskAction(task: Task) {
    if (task.completed) return;

    switch (task.action_required) {
      case 'signin':
        await handleSignIn(task.id);
        break;
      case 'submit_play':
        router.push('/member-center?tab=submit');
        break;
      case 'invite_friend':
        router.push('/member-center?tab=invite');
        break;
      default:
        break;
    }
  }

  async function handleSignIn(taskId: string) {
    try {
      setClaimingId(taskId);

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error('请先登录');
        return;
      }

      // 调用签到 API
      const response = await fetch('/api/playpass/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`签到成功！获得 ${result.reward || 10} PP`);

        // 更新任务状态
        setTasks(tasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        ));
      } else {
        if (result.error === 'already_signed_in') {
          toast.info('今日已签到');
          setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
          ));
        } else {
          toast.error(result.error || '签到失败');
        }
      }
    } catch (error) {
      console.error('签到失败:', error);
      toast.error('签到失败，请稍后重试');
    } finally {
      setClaimingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (compact) {
    // 紧凑模式：显示所有任务的简化版本
    return (
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-lg border transition-colors cursor-pointer ${
              task.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleTaskAction(task)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  task.completed ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    task.icon
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-orange-600">+{task.reward_pp} PP</div>
                {task.completed && (
                  <span className="text-xs text-green-600">已完成</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 完整模式
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* 每日任务标题 */}
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">每日任务</h3>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
          {completedCount}/{tasks.length}
        </span>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-5 rounded-xl border-2 transition-all ${
              task.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  task.completed
                    ? 'bg-green-500'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    task.icon
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-0.5">{task.description}</p>
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                <div className="text-lg font-bold text-orange-600">+{task.reward_pp} PP</div>
                {task.completed ? (
                  <div className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                    已完成
                  </div>
                ) : (
                  <button
                    onClick={() => handleTaskAction(task)}
                    disabled={claimingId === task.id}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {claimingId === task.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        处理中
                      </>
                    ) : (
                      '去完成'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 全部完成提示 */}
      {completedCount === tasks.length && (
        <div className="text-center py-6 bg-green-50 rounded-xl border border-green-200">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <p className="text-lg font-semibold text-green-700">太棒了！</p>
          <p className="text-sm text-green-600 mt-1">今日任务已全部完成</p>
        </div>
      )}
    </div>
  );
}
