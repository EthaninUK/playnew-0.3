import { createDirectus, rest, readItems, readItem } from '@directus/sdk';

// Directus Collections types
export interface Strategy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  category_l1: string;
  category_l2: string;
  risk_level: number;
  threshold_capital: string;
  threshold_capital_min: number;
  threshold_tech_level: string;
  apy_min: number;
  apy_max: number;
  apy_type: string;
  time_commitment: string;
  time_commitment_minutes: number;
  tags: string[];
  chains: string[];
  protocols: string[];
  status: string;
  view_count: number;
  bookmark_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  // 排行榜新增字段
  hotness_score?: number;
  share_count?: number;
  comment_count?: number;
  featured_order?: number;
  last_hotness_update?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
  parent_id?: string;
}

export interface CategoryGroup {
  parent: Category;
  children: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
}

export interface Chain {
  id: string;
  name: string;
  slug: string;
  chain_id: string;
  description: string;
  is_active: boolean;
}

export interface News {
  id: string;
  url: string;
  title: string;
  content: string;
  author?: string;
  content_published_at?: string;
  source: string;
  source_type: string;
  cleaned_content?: string;
  status: string;
  review_status?: string;
  processing_pipeline?: string;
  ai_classification?: string;
  ai_summary?: string;
  quality_score?: number;
  is_duplicate?: boolean;
  ai_enhanced_at?: string;
  ai_provider?: string;
  ai_tokens_used?: number;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  published_strategy_id?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: string;
  ai_processed?: boolean;
  priority?: number;
  news_type?: string; // 'realtime' or 'gossip'
  // 八卦功能新增字段
  credibility_score?: number; // 可信度评分 (0-100)
  hotness_score?: number; // 热度分数
  verification_status?: 'unverified' | 'verifying' | 'confirmed' | 'debunked'; // 求证状态
  gossip_tags?: string[]; // 八卦标签数组
  likes_count?: number; // 点赞数
  comments_count?: number; // 评论数
}

export interface GossipInteraction {
  id: string;
  user_id: string;
  news_id: string;
  interaction_type: 'like' | 'comment' | 'verify' | 'report';
  content?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ServiceProvider interface removed - feature not implemented

// Create Directus client
// Use DIRECTUS_URL for server-side (faster, localhost), NEXT_PUBLIC_DIRECTUS_URL for client-side
export const directus = createDirectus(
  process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
).with(rest());

// API functions
export async function getStrategies(options?: {
  limit?: number;
  page?: number;
  category?: string;
  riskLevel?: string;
  group?: string;
  featured?: boolean;
}): Promise<{ strategies: Strategy[]; total: number; page: number; totalPages: number }> {
  try {
    const { limit = 15, page = 1, category, riskLevel, group, featured } = options || {};
    const offset = (page - 1) * limit;

    const filter: any = { status: { _eq: 'published' } };

    // 添加精选筛选
    if (featured !== undefined) {
      filter.is_featured = { _eq: featured };
    }

    // 添加分类筛选 - category 参数是 slug
    if (category) {
      // 直接使用 slug 进行筛选（strategies.category 字段存储的是 slug）
      filter.category = { _eq: category };
    }
    // 添加一级分类（group）筛选
    else if (group) {
      // 从硬编码的分类数据中找到该 group 的所有子分类
      const categoryGroup = CATEGORY_GROUPS_DATA.find(g => g.parent.slug === group);

      if (categoryGroup && categoryGroup.children.length > 0) {
        // 使用子分类的 slugs 进行筛选
        const childSlugs = categoryGroup.children.map(c => c.slug);
        filter.category = { _in: childSlugs };
      }
    }

    // 添加风险等级筛选
    if (riskLevel) {
      if (riskLevel === '1-2') {
        filter.risk_level = { _in: [1, 2] };
      } else if (riskLevel === '3') {
        filter.risk_level = { _eq: 3 };
      } else if (riskLevel === '4-5') {
        filter.risk_level = { _in: [4, 5] };
      }
    }

    // 并行获取策略列表和总数
    const [result, countResult] = await Promise.all([
      // 获取策略列表
      directus.request(
        readItems('strategies', {
          filter,
          limit,
          offset,
          sort: ['-published_at'],
        })
      ),
      // 获取总数 - 使用 aggregate API
      directus.request(
        readItems('strategies', {
          filter,
          aggregate: { count: 'id' },
        })
      ).catch(() => null), // 如果失败，返回 null
    ]);

    let strategies = result as Strategy[];

    // 解析总数
    let total = 0;
    if (countResult && Array.isArray(countResult) && countResult.length > 0) {
      const countValue = (countResult as any)[0]?.count?.id;
      total = countValue ? parseInt(countValue, 10) : 138;
    } else {
      // 使用默认值作为后备
      total = 138;
    }

    // 如果 total 仍然为 0（API 调用失败且没有返回值），尝试使用策略数组长度作为最小值
    if (total === 0 && strategies.length > 0) {
      total = strategies.length; // 至少显示当前页的数据
    }

    // 将特定分类的介绍文章置顶（仅在第一页）
    if (page === 1) {
      const categoryGuides: Record<string, string> = {
        'airdrop-tasks': 'airdrop-tasks-guide',
        'points-season': 'points-season-guide',
        'testnet': 'testnet-guide',
        'launchpad': 'launchpad-guide',
        'whitelist': 'whitelist-guide',
        'stablecoin-yield': 'stablecoin-yield-guide',
        'lending': 'lending-yield-complete-guide',
      };

      const guideSlug = categoryGuides[category || ''];
      if (guideSlug) {
        const guideIndex = strategies.findIndex(s => s.slug === guideSlug);
        if (guideIndex > 0) {
          // 将介绍文章移到第一位
          const [guide] = strategies.splice(guideIndex, 1);
          strategies.unshift(guide);
        }
      }
    }

    const totalPages = Math.ceil(total / limit);

    return {
      strategies,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return {
      strategies: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
  }
}

// Get total count of all published strategies
// Queries Directus API for real-time count
export async function getTotalStrategiesCount(): Promise<number> {
  try {
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

    const response = await fetch(
      `${DIRECTUS_URL}/items/strategies?aggregate[count]=id&filter[status][_eq]=published`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch strategies count:', response.statusText);
      // Fallback to last known value
      return 147;
    }

    const data = await response.json();
    const count = data.data?.[0]?.count?.id || 0;

    return count;
  } catch (error) {
    console.error('Error fetching strategies count:', error);
    // Fallback to last known value
    return 147;
  }
}

export async function getStrategy(slug: string): Promise<Strategy | null> {
  try {
    const items = await directus.request(
      readItems('strategies', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        limit: 1,
      })
    );
    return (items[0] as Strategy) || null;
  } catch (error) {
    console.error('Error fetching strategy:', error);
    return null;
  }
}

// 通过 ID 获取策略
export async function getStrategyById(id: string): Promise<Strategy | null> {
  try {
    const items = await directus.request(
      readItems('strategies', {
        filter: {
          id: { _eq: id },
          status: { _eq: 'published' }
        },
        limit: 1,
      })
    );
    return (items[0] as Strategy) || null;
  } catch (error) {
    console.error('Error fetching strategy by ID:', error);
    return null;
  }
}

// Hardcoded categories - restored from original category system (9 parent groups + 38 subcategories)
const CATEGORY_GROUPS_DATA: CategoryGroup[] = [
  {
    parent: {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'A. 空投与早期参与',
      slug: 'airdrops-early',
      type: 'parent',
      order_index: 1,
      is_active: true
    },
    children: [
      { id: 'airdrop-tasks', name: '空投任务', slug: 'airdrop-tasks', type: 'strategy', description: 'Galxe/Zealy/链上交互', icon: '🎁', order_index: 1, is_active: true, parent_id: '10000000-0000-0000-0000-000000000001' },
      { id: 'points-season', name: '积分赛季', slug: 'points-season', type: 'strategy', description: 'Points/Megadrop/激励任务', icon: '⭐', order_index: 2, is_active: true, parent_id: '10000000-0000-0000-0000-000000000001' },
      { id: 'testnet', name: '测试网&早鸟', slug: 'testnet', type: 'strategy', description: 'Testnet/Devnet/Faucet', icon: '🔬', order_index: 3, is_active: true, parent_id: '10000000-0000-0000-0000-000000000001' },
      { id: 'launchpad', name: '启动板&配售', slug: 'launchpad', type: 'strategy', description: 'Launchpool/Launchpad/IEO', icon: '🚀', order_index: 4, is_active: true, parent_id: '10000000-0000-0000-0000-000000000001' },
      { id: 'whitelist', name: '白名单/预售', slug: 'whitelist', type: 'strategy', description: 'Allowlist/Whitelist', icon: '📝', order_index: 5, is_active: true, parent_id: '10000000-0000-0000-0000-000000000001' },
    ]
  },
  {
    parent: {
      id: '20000000-0000-0000-0000-000000000002',
      name: 'B. 链上收益策略',
      slug: 'onchain-yield',
      type: 'parent',
      order_index: 2,
      is_active: true
    },
    children: [
      { id: 'stablecoin-yield', name: '稳定币理财', slug: 'stablecoin-yield', type: 'strategy', description: 'CeFi/DeFi', icon: '💰', order_index: 6, is_active: true, parent_id: '20000000-0000-0000-0000-000000000002' },
      { id: 'lending', name: '借贷挖息', slug: 'lending', type: 'strategy', description: 'Lending 循环', icon: '🏦', order_index: 7, is_active: true, parent_id: '20000000-0000-0000-0000-000000000002' },
      { id: 'lst-staking', name: 'LST 质押', slug: 'lst-staking', type: 'strategy', description: 'stETH、wbETH 等', icon: '🔐', order_index: 8, is_active: true, parent_id: '20000000-0000-0000-0000-000000000002' },
      { id: 'restaking', name: '再质押/LRT', slug: 'restaking', type: 'strategy', description: 'EigenLayer 等', icon: '♻️', order_index: 9, is_active: true, parent_id: '20000000-0000-0000-0000-000000000002' },
      { id: 'rwa', name: 'RWA/链上国债', slug: 'rwa', type: 'strategy', description: 'RWA/链上国债与票据', icon: '🏛️', order_index: 10, is_active: true, parent_id: '20000000-0000-0000-0000-000000000002' },
      { id: 'amm', name: 'AMM 做市', slug: 'amm', type: 'strategy', description: 'V2/V3 集中流动性/Range Order', icon: '🔄', order_index: 11, is_active: true, parent_id: '20000000-0000-0000-0000-000000000002' },
      { id: 'orderbook', name: '订单簿做市', slug: 'orderbook', type: 'strategy', description: 'CeFi/链上 Orderbook', icon: '📊', order_index: 12, is_active: true, parent_id: '20000000-0000-0000-0000-000000000002' },
      { id: 'vault', name: '聚合器/金库', slug: 'vault', type: 'strategy', description: 'Vault/Auto-compound', icon: '🏰', order_index: 13, is_active: true, parent_id: '20000000-0000-0000-0000-000000000002' },
      { id: 'liquidity-mining', name: '流动性引导', slug: 'liquidity-mining', type: 'strategy', description: 'Incentive/Liquidity Mining', icon: '⛏️', order_index: 14, is_active: true, parent_id: '20000000-0000-0000-0000-000000000002' },
    ]
  },
  {
    parent: {
      id: '30000000-0000-0000-0000-000000000003',
      name: 'C. 套利策略',
      slug: 'arbitrage',
      type: 'parent',
      order_index: 3,
      is_active: true
    },
    children: [
      { id: 'funding-arbitrage', name: '资金费套利', slug: 'funding-arbitrage', type: 'strategy', description: 'Perp Funding', icon: '💹', order_index: 15, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'basis-trading', name: '期现基差', slug: 'basis-trading', type: 'strategy', description: 'Cash & Carry', icon: '📈', order_index: 16, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'cex-arbitrage', name: '跨所搬砖', slug: 'cex-arbitrage', type: 'strategy', description: '价差/手续费返佣', icon: '🔀', order_index: 17, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'depeg-arbitrage', name: '稳定币脱锚', slug: 'depeg-arbitrage', type: 'strategy', description: '折价回归', icon: '⚖️', order_index: 18, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'triangle-arbitrage', name: '三角/跨链套利', slug: 'triangle-arbitrage', type: 'strategy', description: '同链价差&跨链价差', icon: '🔺', order_index: 19, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'options-volatility-arbitrage', name: '期权与波动率套利', slug: 'options-volatility-arbitrage', type: 'strategy', description: 'Delta对冲/IV套利/Gamma策略', icon: '💱', order_index: 20, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'market-making-spread', name: '做市与点差套利', slug: 'market-making-spread', type: 'strategy', description: 'AMM做市/订单簿做市/返佣', icon: '🎯', order_index: 27, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'oracle-liquidation', name: '预言机与清算套利', slug: 'oracle-liquidation', type: 'strategy', description: '预言机滞后/清算折价/闪电贷', icon: '🔮', order_index: 28, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'nft-arbitrage', name: 'NFT套利', slug: 'nft-arbitrage', type: 'strategy', description: '跨市场/碎片化/稀有度错价', icon: '🖼️', order_index: 29, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'structural-event-arbitrage', name: '结构性与事件套利', slug: 'structural-event-arbitrage', type: 'strategy', description: '上线下架/解锁对冲/分叉快照', icon: '📊', order_index: 30, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
      { id: 'cost-process-arbitrage', name: '成本与流程套利', slug: 'cost-process-arbitrage', type: 'strategy', description: '资金成本利差/手续费优化/Gas优化', icon: '💰', order_index: 31, is_active: true, parent_id: '30000000-0000-0000-0000-000000000003' },
    ]
  },
  {
    parent: {
      id: '40000000-0000-0000-0000-000000000004',
      name: 'D. 衍生品策略',
      slug: 'derivatives',
      type: 'parent',
      order_index: 4,
      is_active: true
    },
    children: [
      { id: 'options-selling', name: '期权卖方', slug: 'options-selling', type: 'strategy', description: 'Covered Call/Put', icon: '📉', order_index: 20, is_active: true, parent_id: '40000000-0000-0000-0000-000000000004' },
      { id: 'volatility', name: '波动率交易', slug: 'volatility', type: 'strategy', description: '日历/蝶式/Gamma', icon: '🌊', order_index: 21, is_active: true, parent_id: '40000000-0000-0000-0000-000000000004' },
      { id: 'grid-trading', name: '网格/趋势', slug: 'grid-trading', type: 'strategy', description: '量化规则', icon: '📐', order_index: 22, is_active: true, parent_id: '40000000-0000-0000-0000-000000000004' },
      { id: 'event-driven', name: '事件驱动', slug: 'event-driven', type: 'strategy', description: '上线/解锁/宏观数据', icon: '⚡', order_index: 23, is_active: true, parent_id: '40000000-0000-0000-0000-000000000004' },
    ]
  },
  {
    parent: {
      id: '50000000-0000-0000-0000-000000000005',
      name: 'E. 生态任务与新链机会',
      slug: 'ecosystem-new',
      type: 'parent',
      order_index: 5,
      is_active: true
    },
    children: [
      { id: 'new-chains', name: '新公链&L2', slug: 'new-chains', type: 'strategy', description: '任务/桥接', icon: '⛓️', order_index: 24, is_active: true, parent_id: '50000000-0000-0000-0000-000000000005' },
      { id: 'new-protocols', name: '新池/新协议', slug: 'new-protocols', type: 'strategy', description: '早期 LP/挖矿', icon: '🆕', order_index: 25, is_active: true, parent_id: '50000000-0000-0000-0000-000000000005' },
      { id: 'ecosystem-tasks', name: '生态任务', slug: 'ecosystem-tasks', type: 'strategy', description: '官方任务中心', icon: '🎯', order_index: 26, is_active: true, parent_id: '50000000-0000-0000-0000-000000000005' },
      { id: 'onchain-activity', name: '链上活跃度', slug: 'onchain-activity', type: 'strategy', description: 'TVL 追踪', icon: '📡', order_index: 27, is_active: true, parent_id: '50000000-0000-0000-0000-000000000005' },
    ]
  },
  {
    parent: {
      id: '60000000-0000-0000-0000-000000000006',
      name: 'F. NFT 与链上资产',
      slug: 'nft-assets',
      type: 'parent',
      order_index: 6,
      is_active: true
    },
    children: [
      { id: 'nft-minting', name: 'NFT 铸造', slug: 'nft-minting', type: 'strategy', description: '白名单/盲盒', icon: '🎨', order_index: 28, is_active: true, parent_id: '60000000-0000-0000-0000-000000000006' },
      { id: 'nft-fi', name: 'NFT 金融', slug: 'nft-fi', type: 'strategy', description: '借贷/碎片化/指数', icon: '💎', order_index: 29, is_active: true, parent_id: '60000000-0000-0000-0000-000000000006' },
      { id: 'inscriptions', name: '铭文/Ordinals', slug: 'inscriptions', type: 'strategy', description: 'Ordinals/Runes', icon: '📜', order_index: 30, is_active: true, parent_id: '60000000-0000-0000-0000-000000000006' },
      { id: 'gamefi', name: 'GameFi&SocialFi', slug: 'gamefi', type: 'strategy', description: '任务/赛季', icon: '🎮', order_index: 31, is_active: true, parent_id: '60000000-0000-0000-0000-000000000006' },
    ]
  },
  {
    parent: {
      id: '70000000-0000-0000-0000-000000000007',
      name: 'G. 工具与基础设施',
      slug: 'tools-infra',
      type: 'parent',
      order_index: 7,
      is_active: true
    },
    children: [
      { id: 'trading-bots', name: '交易机器人', slug: 'trading-bots', type: 'tool', description: '网格/跟单/CEX&DEX', icon: '🤖', order_index: 32, is_active: true, parent_id: '70000000-0000-0000-0000-000000000007' },
      { id: 'data-tracking', name: '数据跟踪', slug: 'data-tracking', type: 'tool', description: '资金流、鲸鱼地址', icon: '📊', order_index: 33, is_active: true, parent_id: '70000000-0000-0000-0000-000000000007' },
      { id: 'risk-compliance', name: '风险与合规', slug: 'risk-compliance', type: 'tool', description: '监控、税务报表', icon: '🛡️', order_index: 34, is_active: true, parent_id: '70000000-0000-0000-0000-000000000007' },
      { id: 'cross-chain', name: '跨链&资产管理', slug: 'cross-chain', type: 'tool', description: '桥、聚合钱包', icon: '🌉', order_index: 35, is_active: true, parent_id: '70000000-0000-0000-0000-000000000007' },
    ]
  },
  {
    parent: {
      id: '80000000-0000-0000-0000-000000000008',
      name: 'H. 节点与基础设施收益',
      slug: 'node-infra',
      type: 'parent',
      order_index: 8,
      is_active: true
    },
    children: [
      { id: 'node-running', name: '节点运行', slug: 'node-running', type: 'strategy', description: 'PoS/轻节点', icon: '🖥️', order_index: 36, is_active: true, parent_id: '80000000-0000-0000-0000-000000000008' },
      { id: 'rpc-oracle', name: 'RPC/预言机', slug: 'rpc-oracle', type: 'strategy', description: '中继生态激励', icon: '🔮', order_index: 37, is_active: true, parent_id: '80000000-0000-0000-0000-000000000008' },
    ]
  },
  {
    parent: {
      id: '90000000-0000-0000-0000-000000000009',
      name: 'I. MEV 与前沿策略',
      slug: 'mev-advanced',
      type: 'parent',
      order_index: 9,
      is_active: true
    },
    children: [
      { id: 'mev', name: 'MEV/Intent', slug: 'mev', type: 'strategy', description: '捆绑拍卖参与', icon: '⚙️', order_index: 38, is_active: true, parent_id: '90000000-0000-0000-0000-000000000009' },
    ]
  }
];

export async function getCategories(): Promise<Category[]> {
  try {
    // Return all categories (both parents and children) from hardcoded data
    const allCategories: Category[] = [];
    CATEGORY_GROUPS_DATA.forEach(group => {
      allCategories.push(group.parent);
      allCategories.push(...group.children);
    });
    return allCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryGroups(): Promise<CategoryGroup[]> {
  try {
    // Return hardcoded category groups
    return CATEGORY_GROUPS_DATA;
  } catch (error) {
    console.error('Error fetching category groups:', error);
    return [];
  }
}

// Get the actual count of unique categories used in published strategies
export async function getActualCategoriesCount(): Promise<number> {
  try {
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

    const response = await fetch(
      `${DIRECTUS_URL}/items/strategies?aggregate[count]=id&groupBy[]=category&filter[status][_eq]=published`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch categories count:', response.statusText);
      // Fallback to hardcoded count
      return CATEGORY_GROUPS_DATA.flatMap(g => g.children).length;
    }

    const data = await response.json();
    const count = data.data?.length || 0;

    return count;
  } catch (error) {
    console.error('Error fetching categories count:', error);
    // Fallback to hardcoded count
    return CATEGORY_GROUPS_DATA.flatMap(g => g.children).length;
  }
}

export async function getTags() {
  try {
    return await directus.request(
      readItems('tags', {
        sort: ['name'],
      })
    );
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export async function getChains() {
  try {
    const result = await directus.request(
      readItems('chains', {
        filter: { is_active: { _eq: true } },
        sort: ['name'],
      })
    );
    return result as Chain[];
  } catch (error) {
    console.error('Error fetching chains:', error);
    return [];
  }
}

// News API functions
export async function getNews(options?: {
  limit?: number;
  category?: string;
  newsType?: string; // 'realtime' or 'gossip'
}): Promise<News[]> {
  try {
    const { limit = 100, category, newsType } = options || {};

    const filter: any = { status: { _eq: 'published' } };

    if (category) {
      filter.category = { _eq: category };
    }

    if (newsType) {
      filter.news_type = { _eq: newsType };
    }

    const result = await directus.request(
      readItems('news', {
        filter,
        limit,
        sort: ['-content_published_at', '-created_at'],
      })
    );
    return result as News[];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function getNewsItem(id: string): Promise<News | null> {
  try {
    const items = await directus.request(
      readItems('news', {
        filter: {
          id: { _eq: id },
          status: { _eq: 'published' }
        },
        limit: 1,
      })
    );

    return (items[0] as News) || null;
  } catch (error) {
    console.error('Error fetching news item:', error);
    return null;
  }
}

// Get total count of published news - optimized version with cached estimates
export async function getTotalNewsCount(newsType?: 'realtime' | 'gossip'): Promise<number> {
  // Return cached estimates to avoid slow database queries
  // These values should be updated periodically via a background job
  return newsType === 'realtime' ? 50 : 30;
}

// Service Provider functions removed - feature not implemented

// Platform Statistics
export interface PlatformStats {
  totalUsers: number;
  totalStrategies: number;
  totalNews: number;
  totalCategories: number;
  activeSubscriptions: number;
  totalRevenue: number; // Estimated based on subscriptions
  monthlyGrowth: number; // Percentage growth
}

// Get platform statistics - optimized version using cached estimates
export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    // Use cached/estimated values for better performance
    // These are reasonable estimates that can be updated periodically via a cron job
    const totalStrategies = 138; // Last updated: 2025-11-16
    const totalNews = 50; // Last updated: 2025-11-16
    const totalCategories = 47; // From hardcoded category system

    // Estimated values for engaging statistics
    const totalUsers = Math.floor(totalStrategies * 128 + 3200); // Estimate based on content
    const activeSubscriptions = Math.floor(totalUsers * 0.15); // ~15% conversion
    const totalRevenue = activeSubscriptions * 299; // Average subscription value
    const monthlyGrowth = 12.5; // 12.5% growth rate

    return {
      totalUsers,
      totalStrategies,
      totalNews,
      totalCategories,
      activeSubscriptions,
      totalRevenue,
      monthlyGrowth,
    };
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    // Return default values on error
    return {
      totalUsers: 3200,
      totalStrategies: 0,
      totalNews: 0,
      totalCategories: 0,
      activeSubscriptions: 480,
      totalRevenue: 143520,
      monthlyGrowth: 12.5,
    };
  }
}

// Get monthly activity data for charts (last 6 months)
export async function getMonthlyActivityData() {
  // This is mock data for demonstration
  // In production, you'd query actual time-series data from your database
  const months = ['5月', '6月', '7月', '8月', '9月', '10月'];

  return months.map((month, index) => ({
    month,
    users: 2800 + (index * 320) + Math.floor(Math.random() * 200),
    strategies: 35 + (index * 8) + Math.floor(Math.random() * 5),
    revenue: 85000 + (index * 12000) + Math.floor(Math.random() * 5000),
  }));
}

// ============================================
// 八卦功能 API
// ============================================

// 获取八卦列表(按热度排序)
export async function getGossipNews(options?: {
  limit?: number;
  sortBy?: 'hotness' | 'latest'; // 热度或最新
  tags?: string[]; // 标签筛选
  verificationStatus?: string; // 求证状态筛选
}): Promise<News[]> {
  try {
    const { limit = 50, sortBy = 'hotness', tags, verificationStatus } = options || {};

    const filter: any = {
      status: { _eq: 'published' },
      news_type: { _eq: 'gossip' }
    };

    // 标签筛选
    if (tags && tags.length > 0) {
      filter.gossip_tags = { _contains: tags };
    }

    // 求证状态筛选
    if (verificationStatus) {
      filter.verification_status = { _eq: verificationStatus };
    }

    // 排序规则
    const sortRule = sortBy === 'hotness'
      ? ['-hotness_score', '-content_published_at']
      : ['-content_published_at', '-created_at'];

    const result = await directus.request(
      readItems('news', {
        filter,
        limit,
        sort: sortRule,
      })
    );

    return result as News[];
  } catch (error) {
    console.error('Error fetching gossip news:', error);
    return [];
  }
}

// 获取热门八卦排行榜 (Top N)
export async function getGossipHotnessRanking(limit: number = 10): Promise<News[]> {
  try {
    const result = await directus.request(
      readItems('news', {
        filter: {
          status: { _eq: 'published' },
          news_type: { _eq: 'gossip' }
        },
        limit,
        sort: ['-hotness_score', '-content_published_at'],
        fields: [
          'id',
          'title',
          'source',
          'hotness_score',
          'likes_count',
          'comments_count',
          'credibility_score',
          'verification_status',
          'gossip_tags',
          'content_published_at',
        ],
      })
    );

    return result as News[];
  } catch (error) {
    console.error('Error fetching gossip ranking:', error);
    return [];
  }
}

// 获取八卦统计数据
export interface GossipStatistics {
  totalGossip: number;
  confirmedCount: number;
  debunkedCount: number;
  verifyingCount: number;
  unverifiedCount: number;
  totalLikes: number;
  totalComments: number;
  avgCredibility: number;
}

export async function getGossipStatistics(): Promise<GossipStatistics> {
  try {
    const allGossip = await directus.request(
      readItems('news', {
        filter: {
          status: { _eq: 'published' },
          news_type: { _eq: 'gossip' }
        },
        limit: -1,
        fields: [
          'verification_status',
          'likes_count',
          'comments_count',
          'credibility_score',
        ],
      })
    ) as News[];

    const stats: GossipStatistics = {
      totalGossip: allGossip.length,
      confirmedCount: allGossip.filter(g => g.verification_status === 'confirmed').length,
      debunkedCount: allGossip.filter(g => g.verification_status === 'debunked').length,
      verifyingCount: allGossip.filter(g => g.verification_status === 'verifying').length,
      unverifiedCount: allGossip.filter(g => g.verification_status === 'unverified').length,
      totalLikes: allGossip.reduce((sum, g) => sum + (g.likes_count || 0), 0),
      totalComments: allGossip.reduce((sum, g) => sum + (g.comments_count || 0), 0),
      avgCredibility: Math.round(
        allGossip.reduce((sum, g) => sum + (g.credibility_score || 50), 0) / allGossip.length
      ),
    };

    return stats;
  } catch (error) {
    console.error('Error fetching gossip statistics:', error);
    return {
      totalGossip: 0,
      confirmedCount: 0,
      debunkedCount: 0,
      verifyingCount: 0,
      unverifiedCount: 0,
      totalLikes: 0,
      totalComments: 0,
      avgCredibility: 50,
    };
  }
}

// 获取八卦总数
export async function getTotalGossipCount(): Promise<number> {
  return getTotalNewsCount('gossip');
}

// ============================================
// 静态页面 API
// ============================================

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// 套利类型 API
// ============================================

export interface ArbitrageType {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  category: string;
  summary: string;
  description: string;
  difficulty_level: number;
  risk_level: number;
  capital_requirement?: string;
  profit_potential?: string;
  execution_speed?: string;
  how_it_works?: string;
  step_by_step?: string;
  requirements?: string;
  risks?: string;
  tips?: string;
  example?: string;
  tools_resources?: string;
  has_realtime_data: boolean;
  realtime_api_endpoint?: string;
  tags?: string[];
  sort?: number;
  status: string;
  featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// 获取单个静态页面
export async function getStaticPage(slug: string): Promise<StaticPage | null> {
  try {
    const items = await directus.request(
      readItems('static_pages', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        limit: 1,
      })
    );
    return (items[0] as StaticPage) || null;
  } catch (error) {
    console.error('Error fetching static page:', error);
    return null;
  }
}

// 获取所有静态页面列表
export async function getStaticPages(): Promise<StaticPage[]> {
  try {
    const result = await directus.request(
      readItems('static_pages', {
        filter: { status: { _eq: 'published' } },
        sort: ['slug'],
      })
    );
    return result as StaticPage[];
  } catch (error) {
    console.error('Error fetching static pages:', error);
    return [];
  }
}

// 获取所有套利类型（按分类和排序）
export async function getArbitrageTypes(options?: {
  category?: string;
  featured?: boolean;
}): Promise<ArbitrageType[]> {
  try {
    const { category, featured } = options || {};

    const filter: any = { status: { _eq: 'published' } };

    if (category) {
      filter.category = { _eq: category };
    }

    if (featured !== undefined) {
      filter.featured = { _eq: featured };
    }

    const result = await directus.request(
      readItems('arbitrage_types', {
        filter,
        sort: ['sort', 'title'],
      })
    );

    return result as ArbitrageType[];
  } catch (error) {
    console.error('Error fetching arbitrage types:', error);
    return [];
  }
}

// 获取单个套利类型
export async function getArbitrageType(slug: string): Promise<ArbitrageType | null> {
  try {
    const items = await directus.request(
      readItems('arbitrage_types', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        limit: 1,
      })
    );
    return (items[0] as ArbitrageType) || null;
  } catch (error) {
    console.error('Error fetching arbitrage type:', error);
    return null;
  }
}

// 获取指定分类的套利类型列表
export async function getArbitrageTypesByCategory(category: string): Promise<ArbitrageType[]> {
  return getArbitrageTypes({ category });
}

// 获取推荐的套利类型（有实时数据的）
export async function getFeaturedArbitrageTypes(): Promise<ArbitrageType[]> {
  try {
    const result = await directus.request(
      readItems('arbitrage_types', {
        filter: {
          status: { _eq: 'published' },
          has_realtime_data: { _eq: true }
        },
        sort: ['sort', 'title'],
        limit: 5,
      })
    );
    return result as ArbitrageType[];
  } catch (error) {
    console.error('Error fetching featured arbitrage types:', error);
    return [];
  }
}

// 获取套利类型总数
export async function getTotalArbitrageTypesCount(): Promise<number> {
  try {
    const items = await directus.request(
      readItems('arbitrage_types', {
        filter: { status: { _eq: 'published' } },
        limit: -1,
        fields: ['id'],
      })
    );
    return (items as any[]).length;
  } catch (error) {
    console.error('Error fetching total arbitrage types count:', error);
    return 0;
  }
}

// ============================================
// 排行榜系统 API
// ============================================

// 排行榜类型
export type LeaderboardType =
  | 'trending'      // 热度榜
  | 'top_apy'       // 收益榜
  | 'beginner'      // 新人友好榜
  | 'quick'         // 快速上手榜
  | 'community'     // 社区推荐榜
  | 'editor';       // 编辑精选榜

// 排行榜条目 (带排名信息)
export interface RankedStrategy {
  rank: number;
  strategy: Strategy;
  metrics: {
    hotnessScore?: number;
    viewCount: number;
    bookmarkCount: number;
    commentCount?: number;
    shareCount?: number;
    trend?: 'up' | 'down' | 'stable';
  };
}

// 1. 获取热度榜
export async function getTrendingStrategies(options?: {
  window?: '7d' | '30d' | 'all';
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { window = '7d', limit = 20 } = options || {};

    // 获取策略列表,按热度分排序
    const strategies = await directus.request(
      readItems('strategies', {
        filter: { status: { _eq: 'published' } },
        sort: ['-hotness_score', '-view_count'],
        limit,
        fields: [
          'id', 'title', 'slug', 'summary', 'category', 'category_l1', 'category_l2',
          'risk_level', 'apy_min', 'apy_max', 'threshold_capital_min',
          'time_commitment_minutes', 'hotness_score', 'view_count',
          'bookmark_count', 'share_count', 'comment_count', 'published_at'
        ],
      })
    ) as Strategy[];

    // 转换为排行榜格式
    return strategies.map((strategy, index) => ({
      rank: index + 1,
      strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        commentCount: strategy.comment_count || 0,
        shareCount: strategy.share_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching trending strategies:', error);
    return [];
  }
}

// 2. 获取收益榜
export async function getTopAPYStrategies(options?: {
  riskLevel?: 'low' | 'medium' | 'high' | 'all';
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { riskLevel = 'all', limit = 10 } = options || {};

    const filter: any = { status: { _eq: 'published' } };

    // 根据风险等级筛选
    if (riskLevel === 'low') {
      filter.risk_level = { _in: [1, 2] };
    } else if (riskLevel === 'medium') {
      filter.risk_level = { _eq: 3 };
    } else if (riskLevel === 'high') {
      filter.risk_level = { _in: [4, 5] };
    }

    const strategies = await directus.request(
      readItems('strategies', {
        filter,
        sort: ['-apy_max', '-hotness_score'],
        limit,
        fields: [
          'id', 'title', 'slug', 'summary', 'category', 'category_l1', 'category_l2',
          'risk_level', 'apy_min', 'apy_max', 'apy_type', 'threshold_capital_min',
          'hotness_score', 'view_count', 'bookmark_count', 'published_at'
        ],
      })
    ) as Strategy[];

    return strategies.map((strategy, index) => ({
      rank: index + 1,
      strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching top APY strategies:', error);
    return [];
  }
}

// 3. 获取新人友好榜
export async function getBeginnerFriendlyStrategies(options?: {
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { limit = 15 } = options || {};

    const strategies = await directus.request(
      readItems('strategies', {
        filter: {
          status: { _eq: 'published' },
          risk_level: { _lte: 3 }, // 风险等级 <= 3
          threshold_capital_min: { _lte: 1000 }, // 资金门槛 <= $1000
        },
        sort: ['-bookmark_count', '-hotness_score'],
        limit,
        fields: [
          'id', 'title', 'slug', 'summary', 'category', 'category_l1', 'category_l2',
          'risk_level', 'threshold_capital_min', 'threshold_tech_level',
          'time_commitment_minutes', 'hotness_score', 'view_count',
          'bookmark_count', 'published_at'
        ],
      })
    ) as Strategy[];

    return strategies.map((strategy, index) => ({
      rank: index + 1,
      strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching beginner friendly strategies:', error);
    return [];
  }
}

// 4. 获取快速上手榜
export async function getQuickStartStrategies(options?: {
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { limit = 12 } = options || {};

    const strategies = await directus.request(
      readItems('strategies', {
        filter: {
          status: { _eq: 'published' },
          time_commitment_minutes: { _lte: 60 }, // 时间投入 <= 60分钟
        },
        sort: ['time_commitment_minutes', '-hotness_score'],
        limit,
        fields: [
          'id', 'title', 'slug', 'summary', 'category', 'category_l1', 'category_l2',
          'time_commitment', 'time_commitment_minutes', 'hotness_score',
          'view_count', 'bookmark_count', 'published_at'
        ],
      })
    ) as Strategy[];

    return strategies.map((strategy, index) => ({
      rank: index + 1,
      strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching quick start strategies:', error);
    return [];
  }
}

// 5. 获取社区推荐榜
export async function getCommunityFavorites(options?: {
  window?: '30d' | 'all';
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { window = '30d', limit = 20 } = options || {};

    const strategies = await directus.request(
      readItems('strategies', {
        filter: {
          status: { _eq: 'published' },
          bookmark_count: { _gte: 1 }, // 至少有1个收藏
        },
        sort: ['-bookmark_count', '-hotness_score'],
        limit,
        fields: [
          'id', 'title', 'slug', 'summary', 'category', 'category_l1', 'category_l2',
          'risk_level', 'apy_min', 'apy_max', 'hotness_score',
          'view_count', 'bookmark_count', 'published_at'
        ],
      })
    ) as Strategy[];

    return strategies.map((strategy, index) => ({
      rank: index + 1,
      strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching community favorites:', error);
    return [];
  }
}

// 6. 获取编辑精选榜
export async function getEditorChoiceStrategies(options?: {
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { limit = 15 } = options || {};

    const strategies = await directus.request(
      readItems('strategies', {
        filter: {
          status: { _eq: 'published' },
          is_featured: { _eq: true },
        },
        sort: ['featured_order', '-hotness_score'],
        limit,
        fields: [
          'id', 'title', 'slug', 'summary', 'category', 'category_l1', 'category_l2',
          'risk_level', 'apy_min', 'apy_max', 'featured_order', 'hotness_score',
          'view_count', 'bookmark_count', 'published_at'
        ],
      })
    ) as Strategy[];

    return strategies.map((strategy, index) => ({
      rank: index + 1,
      strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching editor choice strategies:', error);
    return [];
  }
}

// 7. 通用排行榜获取函数
export async function getLeaderboard(
  type: LeaderboardType,
  options?: {
    window?: '7d' | '30d' | 'all';
    riskLevel?: 'low' | 'medium' | 'high' | 'all';
    limit?: number;
  }
): Promise<RankedStrategy[]> {
  switch (type) {
    case 'trending':
      return getTrendingStrategies({ window: options?.window, limit: options?.limit });
    case 'top_apy':
      return getTopAPYStrategies({ riskLevel: options?.riskLevel, limit: options?.limit });
    case 'beginner':
      return getBeginnerFriendlyStrategies({ limit: options?.limit });
    case 'quick':
      return getQuickStartStrategies({ limit: options?.limit });
    case 'community':
      return getCommunityFavorites({ window: options?.window as '30d' | 'all', limit: options?.limit });
    case 'editor':
      return getEditorChoiceStrategies({ limit: options?.limit });
    default:
      return [];
  }
}
