import { supabase } from './supabase';

// 获取 access token
async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || '';
}

// API 封装
export const playExchangeAPI = {
  // 获取今日精选
  async getDailyFeatured() {
    const res = await fetch('/api/play-exchange/daily-featured');
    return res.json();
  },

  // 获取用户信息
  async getUserInfo() {
    const token = await getAccessToken();
    if (!token) throw new Error('未登录');

    const res = await fetch('/api/play-exchange/user-info', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // 翻牌
  async draw(cardIndex: number, playId: string) {
    const token = await getAccessToken();
    if (!token) throw new Error('未登录');

    const res = await fetch('/api/play-exchange/draw', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ card_index: cardIndex, play_id: playId })
    });
    return res.json();
  },

  // 提交玩法
  async submitPlay(title: string, category: string, content: string) {
    const token = await getAccessToken();
    if (!token) throw new Error('未登录');

    const res = await fetch('/api/play-exchange/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, category, content })
    });
    return res.json();
  },

  // 获取提交记录
  async getSubmissions() {
    const token = await getAccessToken();
    if (!token) throw new Error('未登录');

    const res = await fetch('/api/play-exchange/submit', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // 获取邀请信息
  async getReferralInfo() {
    const token = await getAccessToken();
    if (!token) throw new Error('未登录');

    const res = await fetch('/api/play-exchange/referral', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }
};

// 类型定义
export interface DailyFeaturedResponse {
  success: boolean;
  data?: {
    date: string;
    theme_label: string;
    plays: Play[];
  };
  error?: string;
}

export interface Play {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  risk_level: number;
  apy_min: number;
  apy_max: number;
  cover_image: string | null;
  card_index: number;
}

export interface UserInfoResponse {
  success: boolean;
  data?: {
    user_id: string;
    email: string;
    credits: number;
    first_draw_used: boolean;
    referral_code: string;
    total_plays: number;
    my_plays: string[];
  };
  error?: string;
}

export interface DrawResponse {
  success: boolean;
  data?: {
    exchange_type: 'first_free' | 'paid_draw';
    credits_spent: number;
    credits_remaining: number;
    play: any;
    message: string;
  };
  error?: string;
}

export interface SubmitResponse {
  success: boolean;
  data?: {
    submission_id: string;
    status: string;
    message: string;
  };
  error?: string;
}

export interface SubmissionsResponse {
  success: boolean;
  data?: {
    submissions: Submission[];
    stats: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      total_credits_earned: number;
    };
  };
  error?: string;
}

export interface Submission {
  id: string;
  title: string;
  category: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  credits_awarded: number;
  review_notes: string;
  created_at: string;
  reviewed_at: string;
}

export interface ReferralInfoResponse {
  success: boolean;
  data?: {
    referral_code: string;
    referral_link: string;
    stats: {
      total_invited: number;
      total_registered: number;
      total_credits_earned: number;
      pending_count: number;
    };
    records: ReferralRecord[];
  };
  error?: string;
}

export interface ReferralRecord {
  id: string;
  referred_id: string;
  referred_username: string;
  referral_code: string;
  credits_awarded: boolean;
  awarded_at: string;
  created_at: string;
  status: 'completed' | 'pending';
}
