'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, Filter, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: 'earn' | 'spend';
  amount: number;
  balance_before: number;
  balance_after: number;
  source_type: string;
  source_id?: string;
  source_metadata?: any;
  description: string;
  display_title: string;
  status: string;
  created_at: string;
}

interface PPTransactionsProps {
  userId: string;
  limit?: number;
  showFilters?: boolean;
}

export default function PPTransactions({
  userId,
  limit = 20,
  showFilters = true,
}: PPTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'spend'>('all');

  // 获取交易记录
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      let query = supabase
        .from('playpass_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filterType !== 'all') {
        query = query.eq('transaction_type', filterType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setTransactions(data || []);
      setError(null);
    } catch (err) {
      setError('获取交易记录失败');
      console.error('获取交易记录失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId, filterType, limit]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 7) return `${diffDays} 天前`;

    return date.toLocaleDateString('zh-CN');
  };

  // 获取交易类型图标和颜色
  const getTransactionStyle = (type: string) => {
    if (type === 'earn') {
      return {
        icon: TrendingUp,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        sign: '+',
      };
    }
    return {
      icon: TrendingDown,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      sign: '-',
    };
  };

  // 获取来源类型显示文本
  const getSourceTypeText = (sourceType: string) => {
    const types: Record<string, string> = {
      daily_signin: '每日签到',
      read_strategy: '阅读策略',
      read_arbitrage: '阅读套利',
      share_content: '分享内容',
      comment: '评论',
      publish_strategy: '发布策略',
      unlock_content: '解锁内容',
      strategy: '策略解锁',
      arbitrage: '套利解锁',
      news: '新闻解锁',
      gossip: '八卦解锁',
      unknown: '其他',
    };
    return types[sourceType] || sourceType;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 头部 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">交易记录</h3>
          </div>

          <button
            onClick={fetchTransactions}
            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="刷新"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* 筛选器 */}
        {showFilters && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType('earn')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'earn'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              收入
            </button>
            <button
              onClick={() => setFilterType('spend')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'spend'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              支出
            </button>
          </div>
        )}
      </div>

      {/* 交易列表 */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">暂无交易记录</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const style = getTransactionStyle(tx.transaction_type);
            const Icon = style.icon;

            return (
              <div
                key={tx.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* 图标 */}
                  <div className={`${style.bg} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${style.color}`} />
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800 truncate">
                        {tx.display_title || tx.description}
                      </p>
                      <p className={`font-bold ${style.color} ml-4 whitespace-nowrap`}>
                        {style.sign}
                        {Math.abs(tx.amount)} PP
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {getSourceTypeText(tx.source_type)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(tx.created_at)}
                      </span>
                    </div>

                    {/* 余额变化 */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{tx.balance_before} PP</span>
                      <span>→</span>
                      <span className="font-medium">{tx.balance_after} PP</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 底部 */}
      {transactions.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            显示最近 {transactions.length} 条记录
          </p>
        </div>
      )}
    </div>
  );
}
