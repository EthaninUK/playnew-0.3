'use client';

import { useState } from 'react';
import {
  PPBalance,
  ContentUnlock,
  DailySignin,
  PPTransactions,
  MembershipBadge,
} from '@/components/playpass';

/**
 * PlayPass 组件集成示例页面
 * 用于测试和演示所有 PlayPass 组件
 */
export default function PlayPassDemoPage() {
  // 测试用户 ID (实际使用时从 auth 获取)
  const [userId] = useState('demo-user-123');
  const [membershipLevel] = useState(1); // Pro 会员

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎟️ PlayPass 组件演示
          </h1>
          <p className="text-gray-600">
            测试和演示所有 PlayPass 相关组件
          </p>
        </div>

        {/* 布局网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧列 */}
          <div className="space-y-6">
            {/* 1. 余额显示组件 (完整模式) */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. PPBalance - 余额显示组件
              </h2>
              <PPBalance userId={userId} showDetails />
            </section>

            {/* 2. 会员徽章组件 (详细模式) */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. MembershipBadge - 会员徽章组件
              </h2>
              <MembershipBadge
                level={membershipLevel}
                showDetails
              />
            </section>

            {/* 3. 每日签到组件 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. DailySignin - 每日签到组件
              </h2>
              <DailySignin
                userId={userId}
                membershipLevel={membershipLevel}
                onSigninSuccess={(pp) => {
                  alert(`签到成功！获得 ${pp} PP`);
                }}
              />
            </section>
          </div>

          {/* 右侧列 */}
          <div className="space-y-6">
            {/* 4. 内容解锁组件 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. ContentUnlock - 内容解锁组件
              </h2>
              <ContentUnlock
                userId={userId}
                contentId="demo-strategy-123"
                contentType="strategy"
                contentTitle="Uniswap V3 集中流动性策略"
                membershipLevel={membershipLevel}
                onUnlock={() => {
                  alert('解锁成功！');
                }}
                onError={(error) => {
                  alert(`解锁失败: ${error}`);
                }}
              />
            </section>

            {/* 5. 交易记录组件 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                5. PPTransactions - 交易记录组件
              </h2>
              <PPTransactions
                userId={userId}
                limit={10}
                showFilters
              />
            </section>
          </div>
        </div>

        {/* 紧凑模式示例 */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            6. 紧凑模式组件 (适合 Header)
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">PlayNew.ai</span>
                <span className="text-gray-300">|</span>

                {/* 紧凑模式余额 */}
                <PPBalance userId={userId} compact />

                <span className="text-gray-300">|</span>

                {/* 小尺寸会员徽章 */}
                <MembershipBadge level={membershipLevel} size="sm" />
              </div>

              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                个人中心
              </button>
            </div>
          </div>
        </section>

        {/* 测试说明 */}
        <section className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📝 测试说明
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• 测试用户 ID: <code className="bg-blue-100 px-2 py-1 rounded">{userId}</code></li>
            <li>• 会员等级: Pro (Level 1)</li>
            <li>• 所有组件都使用真实 API 端点</li>
            <li>• 数据会实时更新到 Supabase 数据库</li>
            <li>• 可以尝试签到、解锁内容等操作</li>
          </ul>
        </section>

        {/* API 端点列表 */}
        <section className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🔌 使用的 API 端点
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-green-600">GET</span> /api/playpass/balance
            </div>
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-blue-600">POST</span> /api/playpass/earn
            </div>
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-blue-600">POST</span> /api/playpass/spend
            </div>
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-blue-600">POST</span> /api/playpass/get-price
            </div>
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-blue-600">POST</span> /api/playpass/get-reward
            </div>
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-blue-600">POST</span> /api/playpass/daily-signin
            </div>
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-blue-600">POST</span> /api/playpass/check-access
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
