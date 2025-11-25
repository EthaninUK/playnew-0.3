const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

const pages = [
  {
    slug: 'guide',
    title: '使用指南',
    description: 'PlayNew.ai 使用指南 - 快速上手Web3玩法探索平台',
    content: '# 使用指南\n\n欢迎使用 PlayNew.ai！\n\n## 快速开始\n\n### 浏览玩法库\n\n访问玩法库页面，使用分类筛选找到感兴趣的策略。\n\n### 追踪快讯\n\n实时掌握币圈最新动态，24/7 更新。\n\n### 八卦热议\n\n了解币圈最新热点话题和社区讨论。\n\n## 联系我们\n\n- Telegram: @playnew\n- Twitter: @playnew_ai\n- Email: support@playnew.ai'
  },
  {
    slug: 'faq',
    title: '常见问题',
    description: 'PlayNew.ai 常见问题解答',
    content: '# 常见问题\n\n## 如何注册账户？\n\n支持邮箱注册、Web3钱包连接等方式。\n\n## 什么是"玩法"？\n\n玩法是指在 Web3 生态中获取收益的策略方法。\n\n## 策略可靠吗？\n\n所有策略仅供学习参考，不构成投资建议。\n\n## 如何联系客服？\n\n- Email: support@playnew.ai\n- Telegram: @playnew'
  },
  {
    slug: 'risk',
    title: '风险提示',
    description: 'PlayNew.ai 投资风险提示',
    content: '# 风险提示\n\n## 重要声明\n\n加密货币投资具有极高风险，可能损失全部本金。\n\n## 核心风险\n\n### 市场风险\n- 价格剧烈波动\n- 流动性不足\n- 可能归零\n\n### 技术风险\n- 智能合约漏洞\n- 黑客攻击\n- 私钥丢失\n\n### 监管风险\n- 政策变化\n- 法律限制\n\n## 安全建议\n\n- 不要投入超过承受能力的资金\n- 使用硬件钱包\n- 多方验证信息\n\n---\n\n投资有风险，入市需谨慎！'
  },
  {
    slug: 'terms',
    title: '服务条款',
    description: 'PlayNew.ai 服务条款',
    content: '# 服务条款\n\n最后更新: 2025年1月\n\n## 1. 条款接受\n\n使用本平台服务即表示您同意本服务条款。\n\n## 2. 服务说明\n\nPlayNew.ai 提供 Web3 策略信息、行业资讯等服务。\n\n## 3. 用户责任\n\n- 提供真实准确的信息\n- 保管好账户安全\n- 遵守平台规则\n\n## 4. 知识产权\n\n平台内容受知识产权保护。\n\n## 5. 免责声明\n\n所有内容不构成投资建议。\n\n## 6. 联系我们\n\nEmail: legal@playnew.ai'
  },
  {
    slug: 'privacy',
    title: '隐私政策',
    description: 'PlayNew.ai 隐私政策',
    content: '# 隐私政策\n\n生效日期: 2025年1月\n\n## 1. 信息收集\n\n我们收集以下信息：\n- 账户信息（邮箱、用户名）\n- 使用信息（浏览记录）\n- 设备信息（IP地址）\n\n## 2. 信息使用\n\n用于提供服务、改善产品、保障安全。\n\n## 3. 信息分享\n\n我们不会出售您的个人信息。\n\n## 4. 数据安全\n\n采用多层安全措施保护数据。\n\n## 5. 您的权利\n\n您有权访问、更正、删除个人数据。\n\n## 6. 联系我们\n\nEmail: privacy@playnew.ai'
  },
  {
    slug: 'disclaimer',
    title: '免责声明',
    description: 'PlayNew.ai 免责声明',
    content: '# 免责声明\n\n## 总体声明\n\nPlayNew.ai 提供的所有内容不构成投资建议。\n\n## 投资风险\n\n- 市场风险极高\n- 可能损失全部本金\n- 无收益保证\n\n## 内容免责\n\n- 不保证信息准确性\n- 不对第三方内容负责\n- 过往表现不代表未来\n\n## 责任限制\n\n不对投资损失承担责任。\n\n## 重要提醒\n\n1. 加密货币投资风险极高\n2. 不要投入无法承受损失的资金\n3. 咨询专业人士后再决定\n\n---\n\n投资有风险，入市需谨慎！\n\n*最后更新: 2025年1月*'
  },
];

async function addStaticPages() {
  try {
    console.log('📝 添加静态页面内容...\n');

    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    for (const page of pages) {
      console.log(`正在创建: ${page.title} (${page.slug})...`);

      try {
        await axios.post(
          `${DIRECTUS_URL}/items/static_pages`,
          {
            ...page,
            status: 'published',
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`✓ ${page.title} 创建成功\n`);
      } catch (error) {
        if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
          console.log(`✓ ${page.title} 已存在，跳过\n`);
        } else {
          console.error(`✗ ${page.title} 创建失败:`, error.response?.data || error.message);
        }
      }
    }

    console.log('═'.repeat(60));
    console.log('✅ 所有静态页面创建完成！\n');
    console.log('📄 已创建的页面:');
    pages.forEach(page => {
      console.log(`   - ${page.title} (/page/${page.slug})`);
    });
    console.log('\n💡 提示：');
    console.log('   1. 访问 Directus 后台编辑详细内容');
    console.log('   2. 使用 Markdown 格式编写');
    console.log('   3. 内容支持实时更新');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

addStaticPages();
