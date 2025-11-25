#!/bin/bash

# 设置 Directus 提交审核功能
# 这个脚本会在 Directus 中创建 user_submitted_plays 集合和字段

DIRECTUS_URL="http://localhost:8055"
DIRECTUS_EMAIL="the_uk1@outlook.com"
DIRECTUS_PASSWORD="Mygcdjmyxzg2026!"

echo "🔐 登录 Directus..."
TOKEN=$(curl -s "$DIRECTUS_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$DIRECTUS_EMAIL\",\"password\":\"$DIRECTUS_PASSWORD\"}" \
  | node -p "JSON.parse(require('fs').readFileSync(0)).data.access_token")

if [ -z "$TOKEN" ]; then
  echo "❌ 登录失败"
  exit 1
fi

echo "✅ 登录成功"
echo ""

# 1. 创建 user_submitted_plays 集合
echo "📦 创建 user_submitted_plays 集合..."
curl -s "$DIRECTUS_URL/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "user_submitted_plays",
    "meta": {
      "collection": "user_submitted_plays",
      "icon": "rate_review",
      "note": "用户提交的玩法 - 待审核",
      "display_template": "{{title}}",
      "hidden": false,
      "singleton": false,
      "translations": [
        {
          "language": "zh-CN",
          "translation": "提交玩法审核"
        }
      ],
      "archive_field": null,
      "archive_value": null,
      "unarchive_value": null,
      "sort_field": "created_at"
    },
    "schema": {
      "name": "user_submitted_plays"
    },
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "schema": {
          "is_primary_key": true,
          "has_auto_increment": false
        },
        "meta": {
          "hidden": true,
          "readonly": true
        }
      }
    ]
  }' > /dev/null

echo "✅ 集合创建完成"
echo ""

# 2. 创建字段
echo "📝 创建字段..."

# user_id 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "user_id",
    "type": "uuid",
    "meta": {
      "interface": "input",
      "display": "raw",
      "readonly": true,
      "hidden": false,
      "width": "half",
      "translations": [{"language": "zh-CN", "translation": "提交用户"}]
    }
  }' > /dev/null

# title 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "title",
    "type": "string",
    "meta": {
      "interface": "input",
      "display": "formatted-value",
      "required": true,
      "width": "full",
      "translations": [{"language": "zh-CN", "translation": "玩法标题"}]
    },
    "schema": {
      "max_length": 255
    }
  }' > /dev/null

# category 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "category",
    "type": "string",
    "meta": {
      "interface": "input",
      "display": "raw",
      "width": "half",
      "translations": [{"language": "zh-CN", "translation": "分类"}]
    }
  }' > /dev/null

# content 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "content",
    "type": "text",
    "meta": {
      "interface": "input-rich-text-md",
      "display": "formatted-value",
      "required": true,
      "width": "full",
      "translations": [{"language": "zh-CN", "translation": "玩法内容"}]
    }
  }' > /dev/null

# status 字段 (下拉选择)
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "status",
    "type": "string",
    "meta": {
      "interface": "select-dropdown",
      "display": "labels",
      "display_options": {
        "choices": [
          {"text": "待审核", "value": "pending", "color": "#FFC107"},
          {"text": "已通过", "value": "approved", "color": "#4CAF50"},
          {"text": "已拒绝", "value": "rejected", "color": "#F44336"}
        ]
      },
      "options": {
        "choices": [
          {"text": "待审核", "value": "pending"},
          {"text": "已通过", "value": "approved"},
          {"text": "已拒绝", "value": "rejected"}
        ]
      },
      "width": "half",
      "translations": [{"language": "zh-CN", "translation": "审核状态"}]
    },
    "schema": {
      "default_value": "pending"
    }
  }' > /dev/null

# credits_awarded 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "credits_awarded",
    "type": "integer",
    "meta": {
      "interface": "input",
      "display": "formatted-value",
      "width": "half",
      "note": "通过审核后奖励的积分 (1-100)",
      "translations": [{"language": "zh-CN", "translation": "奖励积分"}]
    },
    "schema": {
      "default_value": 0
    }
  }' > /dev/null

# review_notes 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "review_notes",
    "type": "text",
    "meta": {
      "interface": "input-rich-text-md",
      "display": "formatted-value",
      "width": "full",
      "note": "审核意见或拒绝原因",
      "translations": [{"language": "zh-CN", "translation": "审核意见"}]
    }
  }' > /dev/null

# reviewed_by 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "reviewed_by",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "display": "related-values",
      "display_options": {
        "template": "{{email}}"
      },
      "width": "half",
      "readonly": false,
      "translations": [{"language": "zh-CN", "translation": "审核人"}]
    }
  }' > /dev/null

# reviewed_at 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "reviewed_at",
    "type": "timestamp",
    "meta": {
      "interface": "datetime",
      "display": "datetime",
      "display_options": {
        "relative": true
      },
      "width": "half",
      "readonly": true,
      "translations": [{"language": "zh-CN", "translation": "审核时间"}]
    }
  }' > /dev/null

# created_at 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "created_at",
    "type": "timestamp",
    "meta": {
      "interface": "datetime",
      "display": "datetime",
      "display_options": {
        "relative": true
      },
      "width": "half",
      "readonly": true,
      "special": ["date-created"],
      "translations": [{"language": "zh-CN", "translation": "提交时间"}]
    },
    "schema": {
      "default_value": "now()"
    }
  }' > /dev/null

# updated_at 字段
curl -s "$DIRECTUS_URL/fields/user_submitted_plays" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "updated_at",
    "type": "timestamp",
    "meta": {
      "interface": "datetime",
      "display": "datetime",
      "display_options": {
        "relative": true
      },
      "width": "half",
      "readonly": true,
      "special": ["date-updated"],
      "translations": [{"language": "zh-CN", "translation": "更新时间"}]
    },
    "schema": {
      "default_value": "now()"
    }
  }' > /dev/null

echo "✅ 所有字段创建完成"
echo ""

# 3. 设置公共角色权限（只读）
echo "🔒 配置权限..."
curl -s "$DIRECTUS_URL/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "user_submitted_plays",
    "action": "read",
    "permissions": {},
    "fields": ["*"]
  }' > /dev/null

echo "✅ 权限配置完成"
echo ""

echo "🎉 Directus 提交审核功能设置完成！"
echo ""
echo "📍 访问地址："
echo "   http://localhost:8055/admin/content/user_submitted_plays"
echo ""
echo "💡 使用说明："
echo "   1. 在 Directus 管理后台打开 '提交玩法审核' 集合"
echo "   2. 查看待审核的提交（status = pending）"
echo "   3. 编辑记录："
echo "      - 修改 status 为 'approved' (通过) 或 'rejected' (拒绝)"
echo "      - 设置 credits_awarded (1-100 积分)"
echo "      - 填写 review_notes (审核意见)"
echo "   4. 保存后，用户端会实时看到审核结果"
