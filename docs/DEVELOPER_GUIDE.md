# 食愈 (ShiYu) — 开发者文档

> 版本: 1.0.0 | 最后更新: 2026-02-23

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [项目结构](#3-项目结构)
4. [设计系统](#4-设计系统)
5. [核心功能模块](#5-核心功能模块)
6. [数据模型](#6-数据模型)
7. [后端服务](#7-后端服务)
8. [认证与权限](#8-认证与权限)
9. [AI 功能](#9-ai-功能)
10. [移动端打包](#10-移动端打包)
11. [本地开发](#11-本地开发)
12. [App Store 上架流程](#12-app-store-上架流程)

---

## 1. 项目概述

**食愈** 是一款以「侘寂」美学为设计语言的健康管理 App，专注于辟谷/轻断食、冥想、饮水和体重管理。

### 核心价值

| 功能 | 描述 |
|------|------|
| 🍽️ 三餐打卡 | 记录每餐进食或断食状态 |
| 📸 AI 食物分析 | 拍照自动识别食物并计算营养成分 |
| 💧 饮水追踪 | 记录每日饮水量 |
| 🧘 冥想记录 | 支持冥想、打坐、动引、静引四种类型 |
| 📊 健康数据 | 体重、体脂、血糖、血压趋势图表 |
| 🌳 生命树 | 积分成长体系，10 级进阶 |
| 🎓 课堂 | 养生课程内容（视频/音频/文章） |
| 🖼️ 影像记录 | 照片/视频记录与自动剪辑 |

---

## 2. 技术架构

```
┌─────────────────────────────────────────┐
│              客户端 (Frontend)            │
│  React 18 + TypeScript + Vite           │
│  Tailwind CSS + Framer Motion           │
│  Recharts (数据可视化)                    │
│  Capacitor (原生打包 iOS/Android)        │
├─────────────────────────────────────────┤
│              后端 (Lovable Cloud)         │
│  PostgreSQL 数据库                       │
│  Row Level Security (RLS)               │
│  Edge Functions (Deno)                   │
│  Storage (文件存储)                       │
├─────────────────────────────────────────┤
│              AI 服务                     │
│  Lovable AI Gateway                     │
│  google/gemini-2.5-flash (食物识别)      │
└─────────────────────────────────────────┘
```

### 主要依赖

| 包名 | 用途 |
|------|------|
| `react` / `react-dom` | UI 框架 |
| `react-router-dom` | 路由管理 |
| `@tanstack/react-query` | 服务端状态管理与缓存 |
| `framer-motion` | 动画 |
| `recharts` | 图表 |
| `@supabase/supabase-js` | 后端 SDK |
| `@capacitor/core` | 原生移动端桥接 |
| `shadcn/ui` + `radix-ui` | UI 组件库 |
| `lucide-react` | 图标 |
| `zod` + `react-hook-form` | 表单验证 |

---

## 3. 项目结构

```
src/
├── assets/              # 静态资源（课程缩略图等）
├── components/
│   ├── ui/              # shadcn/ui 基础组件
│   ├── profile/         # 个人中心子页面
│   ├── BottomNav.tsx    # 底部导航栏
│   ├── DailySummary.tsx # 每日概览卡片
│   ├── FoodAnalyzer.tsx # AI 食物分析组件
│   ├── HealthInputForm.tsx # 健康数据输入
│   ├── LifeTree.tsx     # 生命树组件
│   ├── MealCard.tsx     # 三餐卡片
│   ├── MeditationCard.tsx # 冥想记录卡片
│   ├── WaterTracker.tsx # 饮水追踪
│   └── WeightChart.tsx  # 体重趋势图
├── data/
│   ├── mockData.ts      # Mock 数据（开发用）
│   ├── mockCourses.ts   # 课程 Mock 数据
│   └── mockMedia.ts     # 影像 Mock 数据
├── hooks/
│   ├── useAuth.ts       # 认证状态管理
│   ├── useSubscription.ts # 订阅状态管理
│   ├── useCourses.ts    # 课程数据获取 (react-query)
│   └── use-mobile.tsx   # 移动端检测
├── integrations/
│   └── supabase/
│       ├── client.ts    # Supabase 客户端（自动生成，勿改）
│       └── types.ts     # 数据库类型（自动生成，勿改）
├── lib/
│   ├── lifeTreeSystem.ts # 生命树积分与等级系统
│   ├── courseThumbnails.ts # 课程缩略图映射
│   └── utils.ts         # 通用工具函数
├── pages/
│   ├── Index.tsx        # 主页面（Tab 路由容器）
│   ├── AuthPage.tsx     # 登录/注册页
│   ├── CheckInPage.tsx  # 打卡页
│   ├── CoursePage.tsx   # 课堂页
│   ├── DataPage.tsx     # 数据页
│   ├── MediaPage.tsx    # 影像页
│   ├── ProfilePage.tsx  # 个人中心
│   └── AdminCoursePage.tsx # 管理员课程管理
├── services/
│   └── foodAnalysis.ts  # AI 食物分析 API 封装
├── types/
│   └── index.ts         # 全局类型定义
└── App.tsx              # 应用入口

supabase/
└── functions/
    └── analyze-food/    # 食物分析 Edge Function
        └── index.ts
```

---

## 4. 设计系统

### 侘寂 (Wabi-Sabi) 调色板

| Token | HSL 值 | 颜色 | 用途 |
|-------|--------|------|------|
| `--background` | `37 33% 94%` | 米白 `#F5F1E8` | 页面背景 |
| `--foreground` | `0 0% 18%` | 深灰 `#2D2D2D` | 主文本 |
| `--primary` | `107 12% 56%` | 苔藓绿 `#8B9D83` | 主色调 |
| `--secondary` | `15 22% 69%` | 陶土红 `#C4A69D` | 辅助色 |
| `--muted-foreground` | `0 0% 42%` | 灰 `#6B6B6B` | 次要文本 |
| `--success` | `97 30% 55%` | 绿 | 正面指标 |
| `--destructive` | `8 55% 59%` | 红 | 负面指标 |
| `--warning` | `36 70% 67%` | 橙 | 警告 |

### 字体

```css
font-family: 'Noto Serif SC', 'PingFang SC', 'Microsoft YaHei', serif;
```

### 卡片样式

使用 `.wabi-card` 类：圆角 `rounded-2xl`，柔和阴影，hover 时阴影加深。

### 设计规范

- **始终使用语义化 Token**，禁止在组件中写死颜色值（如 `text-white`、`bg-black`）
- 所有颜色必须使用 HSL 格式
- 支持 Light / Dark 两套主题

---

## 5. 核心功能模块

### 5.1 三餐打卡

| 组件 | 功能 |
|------|------|
| `MealCard` | 展示单餐状态，支持切换断食/进食 |
| `FoodAnalyzer` | AI 拍照分析食物，自动填入营养数据 |

**餐型映射**：
- `breakfast` → 早餐 🌅
- `lunch` → 午餐 ☀️
- `dinner` → 晚餐 🌙

### 5.2 生命树系统

积分规则定义在 `src/lib/lifeTreeSystem.ts`：

| 行为 | 积分 |
|------|------|
| 辟谷全天（三餐断食） | +30 |
| 轻断食（1-2餐） | +15 |
| 每次冥想 | +5 基础 + 每分钟 +1 |
| 冥想超 30 分钟 | 额外 +10 |
| 饮水达标 (≥2000ml) | +5 |
| 记录健康数据 | +5 |
| 记录饮食 | +3 |

**等级体系**（10 级）：

| 等级 | 名称 | 所需总积分 |
|------|------|-----------|
| 1 | 种子 | 0 |
| 2 | 萌芽 | 100 |
| 3 | 幼苗 | 300 |
| 4 | 小树 | 600 |
| 5 | 壮树 | 1,000 |
| 6 | 大树 | 1,500 |
| 7 | 古木 | 2,200 |
| 8 | 神木 | 3,000 |
| 9 | 世界树 | 4,000 |
| 10 | 永恒之树 | 5,500 |

### 5.3 饮水追踪

`WaterTracker` 组件，支持快速添加饮水量，水类型包括：纯水、茶、咖啡、其他。

### 5.4 冥想记录

`MeditationCard` 组件，支持四种冥想类型：
- 冥想、打坐、动引、静引

心情状态：平静、焦虑、愉悦、疲惫

### 5.5 健康数据

`HealthInputForm` + `WeightChart` 组件：
- **免费功能**：体重、体脂率
- **高级功能**（需订阅）：空腹血糖、血压

### 5.6 课堂

`CoursePage` + `useCourses` hook：
- 课程分类：辟谷基础、轻断食、静坐冥想、食疗养生、辟谷运动、极简生活
- 支持搜索（标题 + 讲师）
- 数据来源：Lovable Cloud 数据库
- 缓存策略：`staleTime: 5min`

### 5.7 影像记录

`MediaPage` 组件：照片/视频记录，支持标签管理和自动视频剪辑模板。

---

## 6. 数据模型

### 前端类型 (`src/types/index.ts`)

```typescript
MealCheckIn     // 单餐打卡记录
FoodItem        // 食物项（名称、热量、蛋白质、碳水、脂肪）
WaterRecord     // 饮水记录
MeditationRecord // 冥想记录
HealthRecord    // 健康数据（体重、体脂、血糖、血压）
MediaRecord     // 影像记录
VideoEditTask   // 视频剪辑任务
DailyCheckIn    // 每日汇总
```

### 数据库表

| 表名 | 用途 | RLS |
|------|------|-----|
| `courses` | 课程内容 | 任何人可查看，仅 admin 可增删改 |
| `profiles` | 用户资料 | 任何人可查看，仅本人可编辑 |
| `subscriptions` | 订阅信息 | 仅本人可查看/编辑，admin 全权 |
| `user_roles` | 用户角色 | 仅本人可查看 |

### 数据库枚举

```sql
app_role: 'admin' | 'moderator' | 'user'
```

---

## 7. 后端服务

### Edge Functions

#### `analyze-food`

- **路径**: `POST /functions/v1/analyze-food`
- **输入**: `{ imageBase64: string }`
- **输出**: `{ data: FoodAnalysisResult }` 或 `{ error: string }`
- **AI 模型**: `google/gemini-2.5-flash`（通过 Lovable AI Gateway）
- **错误码**:
  - `400` — 缺少图片数据
  - `402` — AI 额度用完
  - `429` — 请求频率限制
  - `500` — 服务端错误

### 数据库函数

```sql
has_role(_user_id UUID, _role app_role) → BOOLEAN
```
用于 RLS 策略中判断用户角色。

---

## 8. 认证与权限

### 认证流程

使用 Lovable Cloud 内置认证系统，通过 `useAuth` hook 管理：

```typescript
const { user, loading, isAdmin, signOut } = useAuth();
```

- 邮箱注册/登录
- 自动 session 持久化
- admin 角色通过 `user_roles` 表判定

### 权限层级

| 角色 | 权限 |
|------|------|
| 匿名 | 不可访问应用 |
| `user` | 查看课程、管理个人数据 |
| `admin` | 管理课程（增删改）、管理订阅 |

### 订阅体系

通过 `useSubscription` hook 判定 Premium 状态：

```typescript
const { isPremium, subscription, loading } = useSubscription(userId);
```

Premium 用户额外功能：血糖/血压追踪、本月小结。

---

## 9. AI 功能

### 食物识别

**调用链路**：

```
用户拍照 → FoodAnalyzer 组件
  → fileToBase64() 转换
  → analyzeFood() 调用 Edge Function
  → Edge Function 调用 Lovable AI Gateway (Gemini 2.5 Flash)
  → 返回结构化营养数据
  → 自动填入当餐记录
```

**AI 模型选型**：使用 `google/gemini-2.5-flash`，平衡速度和多模态识别精度。

---

## 10. 移动端打包

### Capacitor 配置

```typescript
// capacitor.config.ts
{
  appId: 'app.lovable.bef47a049f004d2aa221aa22cb851b72',
  appName: '食愈',
  webDir: 'dist',
  server: {
    // 开发模式：指向预览 URL（热更新）
    url: 'https://bef47a04-9f00-4d2a-a221-aa22cb851b72.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  }
}
```

> ⚠️ **发布前**：必须移除 `server` 配置项，使 App 使用本地 `dist/` 打包文件。

### 依赖

```
@capacitor/core, @capacitor/cli, @capacitor/ios, @capacitor/android
```

---

## 11. 本地开发

### 环境准备

```bash
# 1. 克隆项目
git clone <repo-url>
cd shiyu

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 环境变量（自动配置，勿手动修改）

```
VITE_SUPABASE_URL          # 后端 API 地址
VITE_SUPABASE_PUBLISHABLE_KEY  # 后端公钥
VITE_SUPABASE_PROJECT_ID   # 项目 ID
```

### iOS 真机调试

```bash
npm run build
npx cap sync ios
npx cap run ios    # 需要 Mac + Xcode
```

### Android 调试

```bash
npm run build
npx cap sync android
npx cap run android  # 需要 Android Studio
```

---

## 12. App Store 上架流程

### 前置条件

- [ ] Apple Developer Program 账号（¥688/年）
- [ ] Mac + Xcode（最新版）
- [ ] 应用图标 1024×1024
- [ ] 隐私政策页面 URL
- [ ] 应用截图（iPhone 6.7"、6.5"、5.5"）

### 打包发布步骤

1. **移除开发配置**：删除 `capacitor.config.ts` 中的 `server` 字段
2. **构建**：`npm run build && npx cap sync ios`
3. **Xcode 配置**：
   - 设置 Bundle Identifier
   - 配置 Signing & Capabilities
   - 添加 App Icons（Assets.xcassets）
4. **Archive**：Xcode → Product → Archive
5. **上传**：通过 Xcode Organizer 上传到 App Store Connect
6. **填写元数据**：
   - 应用名称：食愈
   - 副标题：辟谷轻断食健康管理
   - 分类：健康健美
   - 年龄分级：4+
   - 隐私政策 URL
7. **提交审核**

### 审核注意事项

- 确保应用功能完整，无崩溃和空白页面
- 所有 API 调用需 HTTPS
- 隐私政策必须涵盖用户数据收集说明
- 如有账号登录功能，需提供测试账号给审核人员
- 健康类 App 需声明：「本应用不提供医疗建议」

---

## 附录

### 常用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npx cap sync` | 同步到原生平台 |
| `npx cap run ios` | 运行 iOS 模拟器/真机 |
| `npx cap run android` | 运行 Android 模拟器/真机 |

### 相关资源

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
