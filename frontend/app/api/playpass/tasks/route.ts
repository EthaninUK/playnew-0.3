/**
 * PlayPass 任务中心 API
 *
 * 功能:
 * - GET: 获取用户的任务列表
 * - POST: 更新任务进度
 */

import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// 任务类型定义
interface Task {
  id: string;
  title: string;
  description: string;
  reward_pp: number;
  task_type: 'daily' | 'weekly' | 'achievement';
  action_required: string;
  completed: boolean;
  progress?: {
    current: number;
    target: number;
  };
}

/**
 * GET /api/playpass/tasks
 * 获取用户的任务列表
 */
export async function GET(request: NextRequest) {
  try {
    // 从请求头获取授权token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = await createClient(token);

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未登录' },
        { status: 401 }
      );
    }

    // 临时: 返回演示数据
    // TODO: 从数据库获取真实任务数据
    const demoTasks: Task[] = [
      {
        id: '1',
        title: '每日签到',
        description: '完成今日签到',
        reward_pp: 10,
        task_type: 'daily',
        action_required: 'signin',
        completed: false,
      },
      {
        id: '2',
        title: '浏览策略',
        description: '浏览5个策略详情页',
        reward_pp: 5,
        task_type: 'daily',
        action_required: 'view_strategies',
        completed: false,
        progress: {
          current: 2,
          target: 5,
        },
      },
      {
        id: '3',
        title: '阅读资讯',
        description: '阅读3篇资讯',
        reward_pp: 5,
        task_type: 'daily',
        action_required: 'view_news',
        completed: false,
        progress: {
          current: 0,
          target: 3,
        },
      },
      {
        id: '4',
        title: '使用搜索',
        description: '使用搜索功能1次',
        reward_pp: 3,
        task_type: 'daily',
        action_required: 'search',
        completed: false,
        progress: {
          current: 0,
          target: 1,
        },
      },
      {
        id: '5',
        title: '提交玩法',
        description: '提交1个玩法策略',
        reward_pp: 50,
        task_type: 'weekly',
        action_required: 'submit_play',
        completed: false,
      },
      {
        id: '6',
        title: '邀请好友',
        description: '成功邀请1位好友注册',
        reward_pp: 100,
        task_type: 'weekly',
        action_required: 'invite_friend',
        completed: false,
      },
      {
        id: '7',
        title: '了解服务商',
        description: '查看5个服务商详情',
        reward_pp: 20,
        task_type: 'weekly',
        action_required: 'view_providers',
        completed: false,
        progress: {
          current: 0,
          target: 5,
        },
      },
    ];

    return NextResponse.json({
      success: true,
      data: demoTasks,
    });

    /*
    // 真实实现代码（需要数据库表）:

    // 1. 初始化用户任务（如果不存在）
    await initializeUserTasks(supabase, user.id);

    // 2. 获取用户的所有活跃任务
    const { data: userTasks, error: tasksError } = await supabase
      .from('playpass_user_tasks')
      .select(`
        id,
        current_count,
        target_count,
        status,
        task_template:playpass_task_templates (
          id,
          title,
          description,
          task_type,
          action_required,
          reward_pp
        )
      `)
      .eq('user_id', user.id)
      .gte('period_end', new Date().toISOString())
      .order('task_template.display_order');

    if (tasksError) {
      throw tasksError;
    }

    // 3. 格式化任务数据
    const tasks = userTasks.map(ut => ({
      id: ut.id,
      title: ut.task_template.title,
      description: ut.task_template.description,
      reward_pp: ut.task_template.reward_pp,
      task_type: ut.task_template.task_type,
      action_required: ut.task_template.action_required,
      completed: ut.status === 'completed' || ut.status === 'claimed',
      progress: ut.target_count > 1 ? {
        current: ut.current_count,
        target: ut.target_count,
      } : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: tasks,
    });
    */

  } catch (error: any) {
    console.error('获取任务列表失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '获取任务列表失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/playpass/tasks/[taskId]/claim
 * 领取任务奖励
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = await createClient(token);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { taskId, action } = body;

    // 临时: 返回成功
    // TODO: 实现真实的任务奖励领取逻辑
    return NextResponse.json({
      success: true,
      data: {
        taskId,
        reward_pp: 10,
        message: '任务奖励领取成功',
      },
    });

    /*
    // 真实实现代码:

    if (action === 'claim') {
      // 领取任务奖励
      const { data: userTask, error: taskError } = await supabase
        .from('playpass_user_tasks')
        .select('*, task_template:playpass_task_templates(*)')
        .eq('id', taskId)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .single();

      if (taskError || !userTask) {
        return NextResponse.json(
          { success: false, error: '任务不存在或未完成' },
          { status: 400 }
        );
      }

      // 更新任务状态为已领取
      await supabase
        .from('playpass_user_tasks')
        .update({
          status: 'claimed',
          claimed_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      // 给用户增加 PP
      await supabase.rpc('add_playpass_balance', {
        p_user_id: user.id,
        p_amount: userTask.task_template.reward_pp,
        p_transaction_type: 'task_reward',
        p_description: `完成任务: ${userTask.task_template.title}`,
      });

      // 记录任务完成
      await supabase
        .from('playpass_task_completions')
        .insert({
          user_id: user.id,
          task_template_id: userTask.task_template.id,
          user_task_id: taskId,
          reward_pp: userTask.task_template.reward_pp,
          period_type: userTask.period_type,
          completed_period: new Date().toISOString().split('T')[0],
        });

      return NextResponse.json({
        success: true,
        data: {
          taskId,
          reward_pp: userTask.task_template.reward_pp,
          message: '任务奖励领取成功',
        },
      });
    }
    */

  } catch (error: any) {
    console.error('领取任务奖励失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '领取任务奖励失败' },
      { status: 500 }
    );
  }
}

/**
 * 辅助函数: 初始化用户任务
 */
async function initializeUserTasks(supabase: any, userId: string) {
  // TODO: 调用数据库函数初始化用户任务
  // await supabase.rpc('initialize_user_tasks', {
  //   p_user_id: userId,
  //   p_period_type: 'daily',
  // });
}
