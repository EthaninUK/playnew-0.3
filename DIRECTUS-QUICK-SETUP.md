# Directus 排行榜 - 快速配置指南

## 🎯 5分钟快速配置

只需要在 Directus 管理界面进行简单设置,即可完全启用排行榜功能!

---

## 📝 Step 1: 设置精选策略 (3分钟)

### 1.1 登录 Directus
- URL: http://localhost:8055
- 邮箱: the_uk1@outlook.com
- 密码: Mygcdjmyxzg2026!

### 1.2 进入策略管理
1. 点击左侧菜单 **Content** → **strategies**
2. 你会看到所有策略列表

### 1.3 设置精选策略

选择你想要在"编辑精选榜"展示的策略:

**方法1: 单个设置**
1. 点击一个策略进入编辑页面
2. 找到 `is_featured` 字段,勾选 ✅
3. 找到 `featured_order` 字段,输入数字 (如 1, 2, 3...)
4. 点击右上角 **保存** ✓

**方法2: 批量设置** (推荐)
1. 在列表中勾选多个策略
2. 点击顶部 **Batch Edit** (批量编辑)
3. 设置 `is_featured: true`
4. 保存
5. 然后逐个编辑设置 `featured_order`

### 1.4 推荐的精选策略

建议选择以下类型的策略设为精选:
- 稳定币理财类 (新手友好)
- 高APY收益策略 (吸引用户)
- 低风险套利策略 (稳健)
- 热门空投任务 (流量高)
- 详细教程类策略 (有价值)

**精选顺序建议**:
```
featured_order = 1:  最推荐的核心策略
featured_order = 2-5: 优质补充策略
featured_order = 6-10: 多样化选择
```

---

## 📊 Step 2: 优化列表显示 (2分钟)

### 2.1 自定义显示列

1. 在 strategies 列表页面
2. 点击右上角 **布局图标** (Layout icon)
3. 选择 **Customize Columns**
4. 添加以下列:

```
✅ title (标题)
✅ category (分类)
✅ hotness_score (热度分) ⭐
✅ view_count (浏览量)
✅ bookmark_count (收藏数)
✅ is_featured (精选)
✅ featured_order (精选顺序)
✅ status (状态)
```

### 2.2 设置默认排序

1. 点击列表上方的 **Sort** (排序)
2. 选择排序字段: `hotness_score`
3. 选择排序方向: **降序** (Descending)
4. 保存

这样你就能一眼看到热度最高的策略!

---

## 🔍 Step 3: 创建快速筛选 (可选)

### 3.1 筛选精选策略

1. 点击 **Filter** (筛选器)
2. 添加规则:
   - `is_featured` = `true`
   - `status` = `published`
3. 点击 **Save as Bookmark** (保存为书签)
4. 命名: "精选策略"

### 3.2 筛选高热度策略

1. 点击 **Filter**
2. 添加规则:
   - `hotness_score` >= `100`
   - `status` = `published`
3. 保存为书签: "高热度策略"

---

## ✅ 验证配置

### 测试精选榜
1. 打开浏览器: http://localhost:3000/leaderboard
2. 切换到 **精选榜** Tab
3. 检查是否显示你设置的精选策略
4. 检查顺序是否正确 (按 `featured_order` 排序)

### 测试其他榜单
- **热度榜**: 应该按 `hotness_score` 降序排列
- **收益榜**: 应该按 `apy_max` 降序排列
- **新人友好榜**: 应该显示低风险、低门槛的策略
- **快速上手榜**: 应该显示时间投入少的策略
- **社区推荐榜**: 应该按 `bookmark_count` 降序排列

---

## 🎯 推荐设置示例

### 精选榜推荐配置 (10个精选策略)

基于现有数据,建议设置以下策略为精选:

```
featured_order = 1:  稳定币理财完全指南 (热度: 300)
featured_order = 2:  Uniswap V3 流动性挖矿策略 (热度: 246.9)
featured_order = 3:  Curve 3pool 稳定币策略 (热度: 216.9)
featured_order = 4:  Aave 借贷套利策略 (热度: 160.8)
featured_order = 5:  LayerZero 跨链交互空投 (热度: 15)
featured_order = 6:  其他高质量策略...
```

#### 如何查找和设置

1. 在 Directus 中按 `hotness_score` 降序排列
2. 选择 Top 10 的策略
3. 批量设置 `is_featured = true`
4. 逐个编辑设置 `featured_order = 1, 2, 3...`

---

## 🔄 维护和更新

### 定期更新精选榜 (建议每月1次)

1. 查看热度榜 Top 20
2. 评估策略质量和时效性
3. 调整精选策略列表
4. 更新 `featured_order` 顺序

### 如何取消精选

1. 打开策略编辑页面
2. 取消勾选 `is_featured`
3. 清空 `featured_order` (留空)
4. 保存

---

## 💡 常见问题

### Q: 热度分是如何计算的?
**A**: 公式: `view_count × 0.3 + bookmark_count × 2 + comment_count × 1.5 + share_count × 3`

当前热度分是基于已有的浏览量和收藏数初始化的。

### Q: 可以手动修改热度分吗?
**A**: 可以,但不推荐。热度分应该由系统自动计算。如果需要临时提升某个策略,建议增加其收藏数或浏览量。

### Q: 精选榜为什么是空的?
**A**: 需要手动设置策略的 `is_featured = true` 和 `featured_order`。按照 Step 1 的步骤设置即可。

### Q: 如何让某个策略排在最前面?
**A**:
- 精选榜: 设置 `featured_order = 1`
- 热度榜: 增加其热度分 (增加浏览量、收藏数)
- 其他榜单: 提升对应的排序字段值

---

## 📊 字段说明

| 字段 | 说明 | 是否可编辑 |
|------|------|-----------|
| `hotness_score` | 热度分 | 可以,但建议让系统自动计算 |
| `share_count` | 分享次数 | 可以手动修改 |
| `comment_count` | 评论数 | 可以手动修改 |
| `featured_order` | 精选排序 | **需要手动设置** ⭐ |
| `last_hotness_update` | 最后更新时间 | 只读(系统自动) |
| `view_count` | 浏览量 | 可以手动修改 |
| `bookmark_count` | 收藏数 | 可以手动修改 |
| `is_featured` | 是否精选 | **需要手动设置** ⭐ |

---

## 🎉 完成!

配置完成后:
1. ✅ 排行榜的6个榜单都能正常工作
2. ✅ 精选榜显示你设置的精选策略
3. ✅ 热度榜自动按热度排序
4. ✅ 其他榜单按各自规则排序

访问 http://localhost:3000/leaderboard 查看效果!

---

## 📞 需要帮助?

如果遇到问题,请查看:
- [DIRECTUS-LEADERBOARD-SETUP.md](DIRECTUS-LEADERBOARD-SETUP.md) - 详细配置指南
- [LEADERBOARD-COMPLETED.md](LEADERBOARD-COMPLETED.md) - 完整功能说明

**祝您使用愉快!** 🚀
