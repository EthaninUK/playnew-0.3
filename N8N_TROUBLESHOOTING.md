# n8n 常见问题排查指南

## 问题: "The service refused the connection - perhaps it is offline"

### 错误示例
```
Error code: ECONNREFUSED
Full message: connect ECONNREFUSED 127.0.0.1:8055
```

---

## 原因分析

当在 n8n 工作流中使用 HTTP Request 节点调用 Directus 时，**不能使用 `127.0.0.1` 或 `localhost`**。

### 为什么?

- n8n 运行在 Docker 容器内
- Directus 也运行在另一个 Docker 容器内
- 在 n8n 容器内部，`127.0.0.1` 指向的是 **n8n 容器自己**，而不是 Directus 容器
- Docker 容器之间需要使用 **服务名** 或 **容器 IP** 来通信

---

## ✅ 解决方案

### 方案 1: 使用 Docker 服务名 (推荐) ⭐

在 n8n 的 HTTP Request 节点中，将 URL 改为:

```
❌ 错误: http://127.0.0.1:8055/auth/login
❌ 错误: http://localhost:8055/auth/login

✅ 正确: http://directus:8055/auth/login
```

**为什么使用 `directus`?**

在 `docker-compose.yml` 中，Directus 服务的名称是 `directus`:

```yaml
services:
  directus:  # ← 这就是服务名
    image: directus/directus:latest
    ports:
      - 8055:8055
```

Docker Compose 会自动为每个服务创建 DNS 记录，使用服务名就能访问对应的容器。

---

### 方案 2: 使用容器 IP 地址

如果服务名不工作，可以使用容器的实际 IP 地址:

```bash
# 获取 Directus 容器的 IP
docker inspect playnew_03-directus-1 | grep '"IPAddress"' | head -1
```

输出示例:
```
"IPAddress": "172.18.0.3",
```

然后在 n8n 中使用:
```
http://172.18.0.3:8055/auth/login
```

**注意**: 容器重启后 IP 可能会变化，所以推荐使用服务名。

---

### 方案 3: 从 n8n 容器访问宿主机服务

如果您的 Next.js 前端运行在宿主机上（不在 Docker 中），需要使用:

```
❌ 错误: http://localhost:3000
❌ 错误: http://127.0.0.1:3000

✅ 正确: http://host.docker.internal:3000
```

**`host.docker.internal`** 是 Docker 提供的特殊 DNS 名称，指向宿主机。

---

## 📋 正确的 URL 使用规则

| 目标服务 | 从哪里访问 | 应该使用的 URL |
|---------|----------|---------------|
| Directus | n8n 容器内 | `http://directus:8055` |
| Meilisearch | n8n 容器内 | `http://meilisearch:7700` |
| Next.js | n8n 容器内 | `http://host.docker.internal:3000` |
| Directus | 浏览器/宿主机 | `http://localhost:8055` |
| n8n | 浏览器/宿主机 | `http://localhost:5678` |

---

## 🔧 修复 "Login to Directus" 节点

### 步骤 1: 打开节点编辑

在 n8n 中，双击 "Login to Directus" 节点

### 步骤 2: 修改 URL

将 URL 从:
```
http://127.0.0.1:8055/admin
```

改为:
```
http://directus:8055/auth/login
```

### 步骤 3: 检查 Body

确保 Body 参数正确:

**Send Body**: 开启 (ON)
**Body Content Type**: JSON

**Body Parameters (JSON)**:
```json
{
  "email": "the_uk1@outlook.com",
  "password": "Mygcdjmyxzg2026!"
}
```

### 步骤 4: 保存并测试

1. 点击 "Save" 保存节点
2. 点击 "Execute Node" 测试单个节点
3. 应该看到成功响应，包含 `access_token`

---

## 🧪 测试连接

### 测试 1: 在 n8n 容器内测试连接

```bash
# 进入 n8n 容器
docker exec -it playnew_03-n8n-1 sh

# 测试能否访问 Directus (使用服务名)
wget -O- http://directus:8055/server/health

# 测试登录
wget -O- --post-data='{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  --header='Content-Type: application/json' \
  http://directus:8055/auth/login

# 退出容器
exit
```

### 测试 2: 检查 Docker 网络

```bash
# 查看所有容器在同一网络中
docker network inspect playnew_03_default

# 应该看到 n8n 和 directus 都在这个网络中
```

---

## 📝 完整的工作流配置示例

### "Login to Directus" 节点配置

```
节点名称: Login to Directus
节点类型: HTTP Request

参数配置:
├─ Method: POST
├─ URL: http://directus:8055/auth/login
├─ Authentication: None
├─ Send Query Parameters: OFF
├─ Send Headers: OFF (或自定义 Content-Type: application/json)
├─ Send Body: ON
│  ├─ Body Content Type: JSON
│  └─ Body Parameters:
│     {
│       "email": "the_uk1@outlook.com",
│       "password": "Mygcdjmyxzg2026!"
│     }
└─ Options: (可选 timeout: 10000)
```

### "Save to Directus" 节点配置

```
节点名称: Save to Directus
节点类型: HTTP Request

参数配置:
├─ Method: POST
├─ URL: http://directus:8055/items/news
├─ Send Headers: ON
│  └─ Headers:
│     ├─ Authorization: Bearer {{ $node["Login to Directus"].json["data"]["access_token"] }}
│     └─ Content-Type: application/json
├─ Send Body: ON
│  ├─ Body Content Type: JSON
│  └─ Body Parameters: { ... your data ... }
└─ Options: (可选)
```

---

## 🐛 其他常见错误

### 错误 1: "Cannot read property 'access_token' of undefined"

**原因**: Login 节点执行失败或返回格式不对

**解决**:
1. 检查 Login 节点是否成功执行
2. 查看 Login 节点的输出，确认有 `data.access_token`
3. 使用正确的表达式: `{{ $node["Login to Directus"].json["data"]["access_token"] }}`

### 错误 2: "Workflow execution timed out"

**原因**: HTTP Request 超时

**解决**:
在 HTTP Request 节点的 Options 中添加:
```
Timeout: 30000 (30秒)
```

### 错误 3: "Invalid credentials"

**原因**: 邮箱或密码错误

**解决**:
1. 确认 Directus 登录信息:
   - Email: `the_uk1@outlook.com`
   - Password: `Mygcdjmyxzg2026!`
2. 在浏览器中测试登录: http://localhost:8055

### 错误 4: "Could not resolve host: directus"

**原因**: n8n 和 Directus 不在同一个 Docker 网络中

**解决**:
```bash
# 检查网络
docker network inspect playnew_03_default

# 如果 n8n 不在网络中，重启服务
docker-compose restart n8n
```

---

## ✅ 正确的工作流测试步骤

### 1. 测试 Login 节点单独执行

1. 在 n8n 中打开工作流
2. 双击 "Login to Directus" 节点
3. 点击 "Execute Node"
4. 检查输出，应该看到:
   ```json
   {
     "data": {
       "access_token": "eyJhbGci...",
       "expires": 900000,
       "refresh_token": "..."
     }
   }
   ```

### 2. 测试后续节点

只有在 Login 节点成功后，才能测试其他需要 token 的节点。

### 3. 测试完整工作流

1. 点击工作流左上角的 "Execute Workflow"
2. 查看执行历史
3. 检查每个节点的输出

---

## 📚 快速参考

### Docker 容器内访问其他服务

| 访问目标 | URL 格式 |
|---------|---------|
| 同一 docker-compose 中的服务 | `http://服务名:端口` |
| 宿主机上的服务 | `http://host.docker.internal:端口` |
| 外部 API | `https://api.example.com` |

### 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs n8n --tail=50 -f
docker-compose logs directus --tail=50 -f

# 重启服务
docker-compose restart n8n

# 进入容器调试
docker exec -it playnew_03-n8n-1 sh

# 测试容器内网络
docker exec playnew_03-n8n-1 wget -O- http://directus:8055/server/health
```

---

## 💡 最佳实践

1. **始终使用服务名**而不是 IP 地址
2. **从容器内访问容器**使用服务名
3. **从容器内访问宿主机**使用 `host.docker.internal`
4. **从浏览器访问**使用 `localhost`
5. **添加适当的 timeout**防止工作流卡住
6. **先测试单个节点**再执行完整工作流

---

## 🎯 快速修复清单

- [ ] URL 使用 `http://directus:8055` 而不是 `127.0.0.1`
- [ ] Method 设置为 `POST`
- [ ] Body 参数格式正确 (JSON)
- [ ] Email 和 Password 正确
- [ ] 节点成功执行并返回 `access_token`
- [ ] 后续节点正确引用 token: `{{ $node["Login to Directus"].json["data"]["access_token"] }}`

---

需要更多帮助？运行以下命令进行诊断:

```bash
# 完整诊断
docker-compose ps
docker network inspect playnew_03_default
docker exec playnew_03-n8n-1 wget -O- http://directus:8055/server/health
```
