# 新手推荐使用现成网页版
https://vps.appwrite.network/

# 中手可以使用 AppWrite Site 部署
Vercel/Netlify/Cloudflare 也可以。

## 注册 AppWrite 账号
https://cloud.appwrite.io/

## 创建数据库和字段
- Database id: vps-dashboard
- Collection id(现在叫 Table id): servers

参考下方创建所需的字段

## 打包上传到 AppWrite Site

npm run build

tar -czvf release.tar.gz -C dist/public assets index.html

会生成一个文件到项目根目录, 通过 AppWrite Site 部署即可.


# 本地使用

npm install
npm run build
npx vite preview

# VPS Dashboard

一个现代化的 VPS 服务器管理仪表盘，帮助用户集中管理和追踪多个 VPS 服务器及其部署的服务。

## 🌟 特性

- **服务器管理**: 添加、编辑、删除 VPS 服务器信息
- **服务追踪**: 管理每个服务器上运行的服务和端口信息
- **智能搜索**: 支持按服务器名称、IP、提供商、服务名称搜索
- **筛选排序**: 按提供商筛选，按添加时间或服务数量排序
- **用户认证**: 完整的注册/登录系统，数据隔离
- **响应式设计**: 支持桌面端和移动端
- **深色模式**: 内置深色/浅色主题切换
- **现代 UI**: 基于 shadcn/ui 的精美界面

## 🛠 技术栈

### 前端

- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** - 高质量 React 组件库
- **TanStack Query** - 数据获取和状态管理
- **React Hook Form** + **Zod** - 表单处理和验证
- **Wouter** - 轻量级路由库

### 后端服务

- **AppWrite** - 后端即服务 (BaaS)
  - 用户认证和会话管理
  - NoSQL 文档数据库
  - 实时数据同步

### 开发工具

- **Node.js** + **Express** - 开发服务器
- **ESLint** + **TypeScript** - 代码质量检查

## 📋 前置要求

- Node.js 18+
- npm 或 yarn
- AppWrite 云账户

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd vps-dashboard
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量模板文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 AppWrite 配置：

```env
# AppWrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_SERVERS_COLLECTION_ID=servers
```

### 4. 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:5000` 运行。

## ⚙️ AppWrite 配置详解

### 创建 AppWrite 项目

1. 访问 [AppWrite Console](https://cloud.appwrite.io/)
2. 创建新项目
3. 记录项目 ID

### 配置认证

1. 进入 **Auth** 设置
2. 启用 **Email/Password** 认证方式
3. 在 **Settings** > **Domains** 中添加你的域名：
   - 开发环境：`http://localhost:5000`
   - 生产环境：你的实际域名

### 创建数据库

1. 进入 **Databases** 部分
2. 创建新数据库，记录数据库 ID
3. 创建 `servers` 集合，设置以下属性：

#### servers 集合字段配置

| 字段名      | 类型     | 大小 | 必填 | 数组 | 默认值 | 描述                  |
| ----------- | -------- | ---- | ---- | ---- | ------ | --------------------- |
| `name`      | String   | 255  | ✅   | ❌   | -      | 服务器名称            |
| `ip`        | String   | 45   | ❌   | ❌   | -      | IP 地址               |
| `os`        | String   | 100  | ❌   | ❌   | -      | 操作系统              |
| `provider`  | String   | 100  | ❌   | ❌   | -      | 服务提供商            |
| `location`  | String   | 100  | ❌   | ❌   | -      | 服务器位置            |
| `notes`     | String   | 1000 | ❌   | ❌   | -      | 备注信息              |
| `services`  | String   | 5000 | ❌   | ❌   | `[]`   | 服务列表(JSON 字符串) |
| `userId`    | String   | 36   | ✅   | ❌   | -      | 用户 ID               |
| `createdAt` | Datetime |
| `updatedAt` | Datetime |

#### 设置权限

在 `servers` 集合的 **Settings** > **Permissions** 中配置：

**Document Security**: 启用

**Permissions**:

- **Create**: `users` (任何已认证用户可创建)
- **Read**: `user:$userId` (仅文档所有者可读取)
- **Update**: `user:$userId` (仅文档所有者可更新)
- **Delete**: `user:$userId` (仅文档所有者可删除)

### 创建索引

为了优化查询性能，建议创建以下索引：

1. **userId 索引**
   - Key: `userId`
   - Type: `ASC`
   - 用于用户数据隔离查询

## 🌐 部署指南

### Replit 部署

项目已配置为在 Replit 上运行：

1. 导入项目到 Replit
2. 设置环境变量 (在 Secrets 中)
3. 运行 `npm run dev`
4. 使用 Replit 提供的公网地址

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 构建命令: `npm run build`
4. 输出目录: `client/dist`

### Netlify 部署

1. 连接仓库到 Netlify
2. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `client/dist`
3. 设置环境变量

### 自托管部署

#### 构建生产版本

```bash
npm run build
```

#### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status
```

#### 使用 Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

## 📁 项目结构

```
vps-dashboard/
├── client/                 # 前端代码
│   ├── src/
│   │   ├── components/     # React 组件
│   │   │   ├── ui/        # shadcn/ui 组件
│   │   │   ├── add-edit-server-modal.tsx
│   │   │   ├── delete-server-modal.tsx
│   │   │   └── server-card.tsx
│   │   ├── contexts/       # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── lib/            # 工具函数和配置
│   │   │   ├── appwrite.ts
│   │   │   ├── appwriteService.ts
│   │   │   └── utils.ts
│   │   ├── pages/          # 页面组件
│   │   │   ├── dashboard.tsx
│   │   │   ├── auth.tsx
│   │   │   └── not-found.tsx
│   │   ├── App.tsx         # 主应用组件
│   │   └── main.tsx        # 应用入口
│   ├── index.html
│   └── dist/               # 构建输出
├── server/                 # 服务器代码
├── shared/                 # 共享类型和模式
│   └── schema.ts
├── .env.example            # 环境变量模板
├── package.json
├── tailwind.config.ts      # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目文档
```

## 🔧 开发指南

### 添加新功能

1. 在 `shared/schema.ts` 中定义数据模型
2. 更新 AppWrite 集合结构
3. 在 `appwriteService.ts` 中添加 API 方法
4. 创建相应的 React 组件
5. 更新路由和导航

### 代码风格

项目使用 TypeScript 和 ESLint 进行代码质量控制：

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 主题定制

主题色彩在 `client/src/index.css` 中定义，使用 CSS 变量系统：

```css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222 84% 5%);
  --primary: hsl(217 91% 60%);
  /* ... 其他颜色变量 */
}

.dark {
  --background: hsl(222 84% 5%);
  --foreground: hsl(210 40% 98%);
  /* ... 深色模式变量 */
}
```

## 🐛 故障排除

### 常见问题

**1. AppWrite 连接失败**

- 检查环境变量是否正确配置
- 确认项目 ID 和端点 URL 准确
- 检查网络连接

**2. 认证问题**

- 确认 AppWrite 项目中启用了 Email/Password 认证
- 检查域名配置是否包含当前访问地址

**3. 数据库权限错误**

- 确认 `servers` 集合的权限设置正确
- 检查用户是否已登录

**4. 构建失败**

- 清理依赖：`rm -rf node_modules package-lock.json && npm install`
- 检查 Node.js 版本是否 >= 18

### 获取帮助

如遇到问题，可以：

1. 查看浏览器控制台错误信息
2. 检查 AppWrite Console 中的日志
3. 确认环境变量配置
4. 参考 [AppWrite 文档](https://appwrite.io/docs)

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**享受使用 VPS Dashboard 管理你的服务器！** 🚀
