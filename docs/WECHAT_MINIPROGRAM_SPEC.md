# 简了么 (JianLeMa) — 微信小程序开发者完整文档

> 版本: 2.0.0 | 最后更新: 2026-03-17
> 
> 本文档用于指导微信小程序生成工具，完整复现"简了么"健康管理应用。

---

## 目录

1. [产品概述](#1-产品概述)
2. [应用架构](#2-应用架构)
3. [设计系统](#3-设计系统)
4. [页面结构与导航](#4-页面结构与导航)
5. [首页模块](#5-首页模块)
6. [课堂模块](#6-课堂模块)
7. [影像记录模块](#7-影像记录模块)
8. [个人中心模块](#8-个人中心模块)
9. [登录注册模块](#9-登录注册模块)
10. [数据模型](#10-数据模型)
11. [数据库设计](#11-数据库设计)
12. [AI 功能](#12-ai-功能)
13. [业务逻辑详解](#13-业务逻辑详解)
14. [积分与等级系统](#14-积分与等级系统)
15. [订阅与权限体系](#15-订阅与权限体系)
16. [交互与动画规范](#16-交互与动画规范)
17. [组件清单](#17-组件清单)

---

## 1. 产品概述

### 产品定位

**简了么** 是一款以「侘寂」(Wabi-Sabi) 美学为设计语言的健康管理应用，专注于**辟谷/轻断食、冥想、饮水和体重管理**。

### 核心功能矩阵

| 功能模块 | 描述 | 是否需要登录 | 是否付费 |
|---------|------|:----------:|:------:|
| 🍽️ 三餐打卡 | 记录每餐进食或断食状态，支持手动输入和 AI 识别 | ✅ | 免费 |
| 📸 AI 食物分析 | 拍照自动识别食物并计算营养成分 | ✅ | 免费 |
| 💧 饮水追踪 | 记录每日饮水量，目标 2000ml | ✅ | 免费 |
| 🧘 冥想记录 | 计时器 + 四种冥想类型，自动记录 | ✅ | 免费 |
| 📊 体重/体脂追踪 | 手动输入体重、体脂率并展示趋势图 | ✅ | 免费 |
| 📊 血糖/血压追踪 | 手动输入空腹血糖、血压并展示趋势图 | ✅ | **付费** |
| 📈 本月小结 | AI 根据健康数据生成月度总结 | ✅ | **付费** |
| 🌳 生命树 | 游戏化积分成长系统，10 级进阶 | ✅ | 免费 |
| 🎓 课堂 | 养生课程（视频/音频/文章）学习 | ✅ | 部分付费 |
| 🖼️ 影像记录 | 照片/视频打卡记录身体变化 | ✅ | 免费 |
| 🎬 一键对比视频 | 多张照片自动合成对比视频 | ✅ | 免费 |

### 品牌标识

- **App 名称**: 简了么
- **Slogan**: 简法守护健康
- **Logo 图标**: 🍃 叶子 (Leaf)，苔藓绿色
- **版本号**: v1.0.0

---

## 2. 应用架构

### Web 版技术栈（供参考）

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite |
| UI 组件 | shadcn/ui (Radix) |
| 样式 | Tailwind CSS |
| 动画 | Framer Motion |
| 图表 | Recharts |
| 后端 | Supabase (PostgreSQL + Auth + Edge Functions + Storage) |
| AI | Google Gemini 2.5 Flash (通过 AI Gateway) |

### 微信小程序建议技术栈

| 层级 | 建议方案 |
|------|---------|
| 框架 | 原生微信小程序 / Taro / uni-app |
| UI | Vant Weapp / TDesign 小程序版 |
| 样式 | WXSS / Less，使用 CSS 变量实现主题 |
| 图表 | wx-charts / ECharts 微信小程序版 |
| 后端 | 微信云开发 / 自建后端 |
| AI | 通过云函数调用 Gemini / 通义千问 API |
| 存储 | 云存储 |

### 微信 AppID 信息

```
AppID: wx2e10459c9a6a344a
原始 ID: gh_189168034034
```

---

## 3. 设计系统

### 3.1 设计理念 — 侘寂 (Wabi-Sabi)

设计灵感来源于日本侘寂美学，强调：
- **质朴自然**: 天然材质般的色调，避免过度修饰
- **留白呼吸**: 充足的留白空间，不堆砌元素
- **温暖柔和**: 圆角、柔和阴影、渐进动画
- **简约克制**: 功能清晰，操作直觉

### 3.2 调色板

#### 亮色模式 (Light Mode)

| Token 名称 | HSL 值 | HEX 值 | 用途 |
|-----------|--------|--------|------|
| `background` | `37 33% 94%` | `#F5F1E8` | 页面背景（米白色） |
| `foreground` | `0 0% 18%` | `#2D2D2D` | 主文本色（深灰） |
| `card` | `0 0% 100%` | `#FFFFFF` | 卡片背景 |
| `card-foreground` | `0 0% 18%` | `#2D2D2D` | 卡片文本 |
| `primary` | `107 12% 56%` | `#8B9D83` | 主色调（苔藓绿） |
| `primary-foreground` | `0 0% 100%` | `#FFFFFF` | 主色按钮文字 |
| `secondary` | `15 22% 69%` | `#C4A69D` | 辅助色（陶土红/暖棕） |
| `secondary-foreground` | `0 0% 100%` | `#FFFFFF` | 辅助色按钮文字 |
| `muted` | `37 20% 90%` | — | 浅灰背景（标签、进度条底色） |
| `muted-foreground` | `0 0% 42%` | `#6B6B6B` | 次要文本 |
| `accent` | `15 22% 69%` | 同 secondary | 强调色 |
| `destructive` | `8 55% 59%` | `#D66853` | 负面/错误/删除（红） |
| `success` | `97 30% 55%` | `#7FB069` | 正面指标（绿） |
| `warning` | `36 70% 67%` | `#E8B86D` | 警告（橙） |
| `info` | `213 45% 62%` | `#6B9BD1` | 信息/饮水色（蓝） |
| `border` | `0 0% 88%` | `#E0E0E0` | 分割线 |

#### 暗色模式 (Dark Mode)

| Token 名称 | HSL 值 |
|-----------|--------|
| `background` | `0 0% 10%` |
| `foreground` | `37 33% 94%` |
| `card` | `0 0% 14%` |
| `muted` | `0 0% 20%` |
| `muted-foreground` | `0 0% 70%` |
| `border` | `0 0% 22%` |
| 其余色值保持不变 | — |

### 3.3 字体

```
主字体: 'Noto Serif SC' (思源宋体)
备用: 'PingFang SC', 'Microsoft YaHei', serif

辅助无衬线: 'PingFang SC', 'Microsoft YaHei', sans-serif
```

**使用规则**:
- 标题 (`h1`, `h2`) → 宋体 (serif)
- 正文、按钮 → 继承主字体
- 数字展示（计时器等）→ 等宽字体 (monospace)

### 3.4 卡片样式 (`wabi-card`)

```css
.wabi-card {
  background: var(--card);        /* 白色/暗色卡片背景 */
  border-radius: 16px;            /* rounded-2xl */
  padding: 20px;                  /* p-5 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);     /* 默认 */
  transition: box-shadow 0.3s ease;
}
.wabi-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);     /* 悬停 */
}
```

### 3.5 圆角规范

| 元素 | 圆角 |
|------|------|
| 页面卡片 | 16px (rounded-2xl) |
| 按钮 | 12px (rounded-xl) |
| 底部弹出面板 | 顶部 24px (rounded-t-3xl) |
| 头像/图标容器 | 50% (rounded-full) |
| 进度条 | 9999px (rounded-full) |
| 标签/徽章 | 9999px (rounded-full) |
| 输入框 | 12px (rounded-xl) |

### 3.6 阴影规范

- 卡片默认: `0 2px 12px rgba(0, 0, 0, 0.05)`
- 卡片悬停: `0 4px 20px rgba(0, 0, 0, 0.08)`
- 弹窗: `shadow-xl`

### 3.7 间距规范

- 页面左右内边距: 16px (px-4)
- 卡片间距: 8-12px (space-y-2.5 / mt-4~5)
- 最大内容宽度: 512px (max-w-lg)
- 底部安全区域: env(safe-area-inset-bottom) + 80px (底部导航高度)
- 顶部安全区域: env(safe-area-inset-top)

---

## 4. 页面结构与导航

### 4.1 底部 Tab 导航

固定在底部，4 个 Tab：

| Tab | 图标 | 中文标签 | 对应页面 |
|-----|------|---------|---------|
| `home` | 🏠 Home | 首页 | 主页（每日打卡） |
| `course` | 📖 BookOpen | 课堂 | 课程列表与播放 |
| `media` | 🖼️ ImageIcon | 记录 | 照片/视频记录 |
| `profile` | 👤 User | 我的 | 个人中心 |

**交互规范**:
- 当前选中 Tab：图标和文字为 `primary` 色，顶部有 2px 圆角指示条（带弹簧动画）
- 未选中 Tab：图标和文字为 `muted-foreground` 色
- 导航栏高度: 64px (h-16)
- 背景: `card` 色 + 顶部 1px `border` 分割线
- 需处理底部安全区域 (safe-area-inset-bottom)

### 4.2 页面切换动画

- 使用淡入淡出 (`opacity: 0 → 1`)，`AnimatePresence mode="wait"`
- 切换时当前页先淡出，新页再淡入

---

## 5. 首页模块

### 5.1 页面整体布局

从上到下依次为：

```
┌─────────────────────────────┐
│ 问候语 + 日期时间 + 断食状态  │ ← Header
│                  生命树图标   │
├─────────────────────────────┤
│ [断食] [饮水] [冥想] [连续]  │ ← DailySummary 四宫格
├─────────────────────────────┤
│ 三餐记录                     │
│ ┌ 🌅 早餐 ────── 🖊 📷 ✓ ┐ │
│ ┌ ☀️ 午餐 ────── 🖊 📷 ✓ ┐ │
│ ┌ 🌙 晚餐 ────── 🖊 📷 ✓ ┐ │
├─────────────────────────────┤
│ 💧 饮水追踪                  │
│ 进度条 + 快速添加按钮        │
├─────────────────────────────┤
│ 🧘 冥想 · 打坐              │
│ 计时器 / 记录列表            │
├─────────────────────────────┤
│ + 记录今日健康数据            │ ← HealthInputForm
│ [体重] [体脂率]              │ ← 四宫格指标卡片
│ [空腹血糖] [血压]（付费）     │
├─────────────────────────────┤
│ 体重趋势图表                 │ ← WeightChart
├─────────────────────────────┤
│ 本月小结（付费）             │
└─────────────────────────────┘
```

### 5.2 Header 区域

**左侧**:
- **问候语** (h1, 2xl, bold, serif):
  - 0:00-6:00 → `夜深了 🌙`
  - 6:00-12:00 → `早安 🌅`
  - 12:00-18:00 → `午安 ☀️`
  - 18:00-24:00 → `晚安 🌙`
- **日期时间** (xs, muted-foreground): `2026年3月17日 星期二 14:30`
- **断食状态文案** (sm, muted-foreground):
  - 三餐全断食 → `今天是你辟谷之旅的第 N 天`（N 为绿色 primary 高亮）
  - 部分断食 → `今天是你轻断食的第 N 天`
  - 未断食 → `今天尚未开始断食`

**右侧**:
- **生命树**组件（可点击展开详情弹窗）

### 5.3 DailySummary — 每日概览四宫格

4 列等分网格卡片（grid-cols-4），每个卡片居中显示：

| 指标 | 图标 | 颜色 | 显示值 | 标签 |
|------|------|------|--------|------|
| 断食 | 🔥 Flame | 3餐=`warning`, 1-2餐=`accent-foreground`, 0=`muted-foreground` | 3餐=`24h`, 其他=`N餐` | 辟谷/轻断食/正常饮食 |
| 饮水 | 💧 Droplets | `info` | `NNNml` | 饮水 |
| 冥想 | ⏱ Timer | `secondary` | `Nmin` | 冥想 |
| 连续 | 🌲 TreePine | `primary` | `N天` | 连续 |

### 5.4 MealCard — 三餐卡片

每张卡片结构：

```
┌────────────────────────────────────┐
│ [Emoji] 早餐/午餐/晚餐             │
│         已断食 ✓ / NNN 千卡        │
│         食物1、食物2、食物3...      │
│                    [🖊] [📷] [✓/🍴]│
└────────────────────────────────────┘
```

**元素说明**:
- 左侧：2xl Emoji (`🌅`早餐 / `☀️`午餐 / `🌙`晚餐)
- 中间：餐名（semibold）+ 状态文本（xs, muted-foreground）
  - 断食状态 → "已断食 ✓"
  - 进食状态 → "NNN 千卡" + 食物名列表
- 右侧操作区（3 个按钮）：
  1. **手动输入** 🖊 (PenLine) — 展开底部输入面板
  2. **AI 拍照** 📷 (Camera) — 打开 FoodAnalyzer 弹窗
  3. **断食开关** ✓/🍴 — 切换断食/进食状态
     - 断食中：primary 色实心圆 + Check 图标
     - 进食中：muted 色圆 + Utensils 图标

**手动输入面板**（点击🖊后展开）:
- 从卡片底部滑出，包含：
  - 食物名称输入框 (text)
  - 千卡数输入框 (number)
  - 添加按钮 (primary)
  - 关闭按钮 (X)

### 5.5 WaterTracker — 饮水追踪

```
┌────────────────────────────────────┐
│ 💧 饮水               1350/2000ml │
│ ████████████████░░░░░░░░           │ ← 进度条 (info 色)
│ [+200ml] [+300ml] [+500ml]        │ ← 快速添加按钮
│ 08:00·300ml  10:30·250ml  ...     │ ← 最近记录标签
└────────────────────────────────────┘
```

**交互规范**:
- 进度条：`info` 色填充，`muted` 色背景，高度 2.5px，圆角全圆
- 快速添加按钮：3 列等分，默认 `muted` 背景，hover 变 `primary`
- 最近记录：最多显示最近 4 条，圆角标签样式

### 5.6 MeditationCard — 冥想记录

3 种状态视图：

**1. 初始状态**:
```
┌────────────────────────────────────┐
│ 🧠 冥想 · 打坐          今日 0分钟 │
│ ┌──── + 开始冥想 ─────┐           │ ← 虚线边框按钮
└────────────────────────────────────┘
```

**2. 类型选择**:
```
│ [冥想] [打坐] [动引] [静引]        │ ← 4列按钮
```

**3. 计时中**:
```
│         冥想中                     │
│        05:23                       │ ← 4xl, mono, bold
│     [⏸暂停] [⏹完成]              │ ← 两个圆形按钮
│       已暂停（暂停时显示）          │
```

**冥想类型**:
| Key | 中文 |
|-----|------|
| `meditation` | 冥想 |
| `sitting` | 打坐 |
| `dongyin` | 动引 |
| `jingyin` | 静引 |

**心情选项**: 平静(calm)、焦虑(anxious)、愉悦(happy)、疲惫(tired)

**计时器完成后**：自动记录冥想时长（向上取整到分钟），添加到记录列表。

### 5.7 HealthInputForm — 健康数据输入

点击 "**+ 记录今日健康数据**" 按钮后，弹出底部面板：

| 字段 | 标签 | 单位 | 范围 | 图标 | 权限 |
|------|------|------|------|------|------|
| `weight` | 体重 | kg | 20-300 | Activity | 免费 |
| `bodyFat` | 体脂率 | % | 1-60 | TrendingUp | 免费 |
| `bloodSugar` | 空腹血糖 | mmol/L | 1-30 | Droplet | **付费** |
| `bloodPressureSystolic` | 收缩压 | mmHg | 50-250 | Heart | **付费** |
| `bloodPressureDiastolic` | 舒张压 | mmHg | 30-150 | Heart | **付费** |

**付费字段**在非会员时显示 🔒 锁定状态 + "会员专属" 文字。

### 5.8 健康指标四宫格

2x2 网格（付费用户为 2x2，免费用户为 2x1）:

| 指标 | 图标 | 趋势标注 |
|------|------|---------|
| 体重 | Activity | `±N.Nkg`，下降=绿色，上升=红色 |
| 体脂率 | TrendingUp | `±N.N%`，下降=绿色 |
| 空腹血糖 (付费) | Droplet | `≤6.1正常/偏高` |
| 血压 (付费) | Heart | `≤140正常/偏高` |

### 5.9 WeightChart — 趋势图表

带 3 个 Tab 切换的折线图：

| Tab | 图标 | 数据线 |
|-----|------|--------|
| 体重 | Scale | 体重(实线 primary) + 体脂率(虚线 muted) |
| 血糖 | Droplet | 血糖(实线 primary) |
| 血压 | Heart | 收缩压(实线 primary) + 舒张压(虚线 muted) |

- 显示最近 14 天数据
- X 轴: 日期 (MM/DD)
- Y 轴: 自动范围
- Tooltip 样式: card 色背景 + border 边框 + 8px 圆角

### 5.10 本月小结（付费）

仅付费用户可见，展示：
- 体重变化总结（如 "下降了 N.Nkg，非常棒！"）
- 体脂率变化总结
- 鼓励文案

---

## 6. 课堂模块

### 6.1 课程分类

| 分类 Key | 图标 |
|---------|------|
| 辟谷基础 | 🌿 |
| 轻断食 | 🍃 |
| 静坐冥想 | 🧘 |
| 食疗养生 | 🍵 |
| 辟谷运动 | 🏃 |
| 极简生活 | 🏡 |

### 6.2 页面结构

**默认视图**（未选分类时）:
```
📖 课堂
探索身心合一的智慧

[🔍 搜索课程或讲师...]

┌─────────┐ ┌─────────┐
│ 🌿 辟谷基础│ │ 🍃 轻断食  │  ← 2列网格
│ N 门课程  │ │ N 门课程  │
├─────────┤ ├─────────┤
│ 🧘 静坐冥想│ │ 🍵 食疗养生│
│ N 门课程  │ │ N 门课程  │
├─────────┤ ├─────────┤
│ 🏃 辟谷运动│ │ 🏡 极简生活│
│ N 门课程  │ │ N 门课程  │
└─────────┘ └─────────┘
```

**分类列表视图**:
```
← [返回] 🌿 辟谷基础

[🔍 搜索...]

┌────────────────────────────────────┐
│ [缩略图]  课程标题                  │
│  80x80    讲师名                   │
│           [视频] 15min  👁 1.2k 免费│
└────────────────────────────────────┘
```

**课程详情弹窗**（从底部滑出）:
- 封面图 / 播放器
- 分类标签 + 类型标签
- 标题 (lg, bold)
- 讲师 · 时长
- 详细描述
- 学习次数
- 操作按钮：
  - 免费/付费用户 → "开始学习" (primary)
  - 非付费且非免费课程 → "🔒 开通会员解锁" (secondary)

### 6.3 课程数据字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `title` | text | 标题 |
| `category` | text | 分类 |
| `type` | text | `video` / `audio` / `article` |
| `duration` | text | 时长描述（如 "15分钟"） |
| `instructor` | text | 讲师名 |
| `description` | text | 详细描述 |
| `content_url` | text | 内容文件 URL |
| `thumbnail` | text | 缩略图 URL |
| `is_free` | boolean | 是否免费 |
| `views` | integer | 学习次数 |

### 6.4 搜索功能

支持按**标题**和**讲师名**模糊搜索，搜索时隐藏分类网格，直接显示结果列表。

缓存策略: 5 分钟 staleTime（避免频繁请求）。

---

## 7. 影像记录模块

### 7.1 页面结构

**画廊视图**:
```
照片 · 视频                    [选择]

┌─────────┐ ┌─────────┐
│📷 拍照打卡│ │📹 录制视频│  ← 操作入口
│ 半身/全身 │ │ 30秒以内  │
└─────────┘ └─────────┘

[全部 N] [照片 N] [视频 N]  ← 筛选 Tab

┌───┐ ┌───┐ ┌───┐
│   │ │   │ │   │          ← 3列瀑布流
└───┘ └───┘ └───┘

[一键对比视频]              ← 仅有记录时显示
```

**空状态**（新用户）:
```
🖼️ 
还没有记录
开始你的第一次打卡记录吧
```

### 7.2 发布流程（Composer）

1. 用户点击拍照/录制按钮
2. 系统调用原生文件选择器
3. 选择文件后打开 Composer 弹窗：
   ```
   ┌─────────────────────┐
   │ [预览图/视频]        │  ← 最大高度 24dvh
   │                     │
   │ [文字描述输入框]     │
   │ 📸照片/📹视频 · 日期  │
   │                     │
   │ [取消]    [发布]     │  ← 底部操作栏
   └─────────────────────┘
   ```
4. 发布后添加到本地记录列表

### 7.3 一键对比视频

1. 点击"选择"进入多选模式
2. 选择≥2张照片/视频
3. 选择模板：

| 模板 Key | 名称 | 描述 |
|----------|------|------|
| `simple` | 简约 | 纯白背景，简洁文字 |
| `nature` | 自然 | 自然背景，温暖色调 |
| `motivation` | 激励 | 动感转场，励志文字 |
| `wabisabi` | 侘寂 | 米白背景，质朴文字 |

4. 模拟处理进度条 → 完成

### 7.4 MediaRecord 数据结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一 ID |
| `mediaType` | `photo` / `video` | 类型 |
| `timestamp` | string | 时间戳 |
| `date` | string | 日期 YYYY-MM-DD |
| `url` | string | 文件 URL |
| `thumbnailUrl` | string | 缩略图 URL |
| `tags` | string[] | 标签 |
| `notes` | string? | 文字描述 |
| `relatedData` | object? | `{ weight?, dayNumber? }` |

---

## 8. 个人中心模块

### 8.1 页面结构

```
┌────────────────────────────────────┐
│ [头像]  用户昵称                    │
│         邮箱                       │
│         [免费用户 / 高级会员]       │
├────────────────────────────────────┤
│ 总打卡: 45  │ 连续天数: 7 │ Lv.3  │ ← 统计三宫格
├────────────────────────────────────┤
│ 🌳 生命树详情卡片                  │ ← LifeTreeProfileCard
│ 等级称号 + 进度条 + 14天成长曲线   │
├────────────────────────────────────┤
│ 📚 课程管理 (仅管理员可见)        │
├────────────────────────────────────┤
│ 👑 订阅管理                       │
│ 🔔 提醒设置                       │
│ 🛡️ 隐私设置                       │
│ ❓ 帮助与反馈                      │
│ ⚙️ 应用设置                       │
├────────────────────────────────────┤
│ 🚪 退出登录 (destructive 色)       │
├────────────────────────────────────┤
│ 简了么 v1.0.0 · 简法守护健康       │
└────────────────────────────────────┘
```

### 8.2 子页面

每个菜单项点击后导航到独立子页面：
- **订阅管理** (`SubscriptionPage`)
- **提醒设置** (`NotificationSettingsPage`)
- **隐私设置** (`PrivacySettingsPage`)
- **帮助与反馈** (`HelpFeedbackPage`)
- **应用设置** (`AppSettingsPage`)
- **课程管理** (`AdminCoursePage`) — 仅管理员可见

### 8.3 生命树个人卡片

展示：
- 等级图标 + 称号 (如 "幼苗 Lv.3")
- 总积分
- 当前等级进度条
- 14 天积分柱状图（成长曲线）
- 成长路径：10 级列表，当前等级高亮

---

## 9. 登录注册模块

### 9.1 页面结构

```
        🍃
      简了么
    简法守护健康

┌────────────────────────────────────┐
│  [登录]  [注册]                    │ ← Tab 切换
│                                    │
│  (注册时显示) 昵称输入框           │
│  邮箱输入框                        │
│  密码输入框 (最少6位)              │
│                                    │
│  [登录 / 注册]                     │ ← primary 全宽按钮
└────────────────────────────────────┘
```

### 9.2 认证方式

- **邮箱 + 密码** 注册/登录
- 注册时需输入昵称
- 注册后需邮箱验证（不自动确认）
- Session 持久化到本地存储
- Token 自动刷新

### 9.3 角色体系

| 角色 | 权限 |
|------|------|
| 未登录 | 无法访问应用 |
| `user` | 查看课程、管理个人数据 |
| `moderator` | （保留，暂无特殊权限） |
| `admin` | 管理课程（增删改）、管理订阅 |

角色存储在独立的 `user_roles` 表中（**不**存在 profiles 表），通过 `has_role()` 函数判定。

---

## 10. 数据模型

### 10.1 TypeScript 类型定义

```typescript
// ===== 三餐相关 =====

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface FoodItem {
  name: string;          // 食物名称
  calories: number;      // 卡路里 (kcal)
  protein: number;       // 蛋白质 (g)
  carbs: number;         // 碳水化合物 (g)
  fat: number;           // 脂肪 (g)
  portion: string;       // 份量描述（如 "1碗"）
}

interface MealCheckIn {
  mealType: MealType;    // 餐次
  isFasting: boolean;    // 是否断食
  mealTime?: string;     // 用餐时间
  foodItems?: FoodItem[]; // 食物列表
  photos?: string[];     // 照片 URL
  notes?: string;        // 备注
}

// ===== 饮水 =====

interface WaterRecord {
  id: string;
  timestamp: string;     // HH:mm 格式
  amount: number;        // 毫升
  waterType: 'purified' | 'tea' | 'coffee' | 'other';
}

// ===== 冥想 =====

interface MeditationRecord {
  id: string;
  timestamp: string;     // HH:mm 格式
  duration: number;      // 分钟
  type: 'meditation' | 'sitting' | 'dongyin' | 'jingyin';
  mood?: 'calm' | 'anxious' | 'happy' | 'tired';
  notes?: string;
}

// ===== 健康数据 =====

interface HealthRecord {
  id: string;
  date: string;          // YYYY-MM-DD
  weight?: number;       // kg
  bodyFat?: number;      // %
  bloodSugar?: number;   // mmol/L
  bloodPressureSystolic?: number;   // mmHg
  bloodPressureDiastolic?: number;  // mmHg
}

// ===== 每日打卡汇总 =====

interface DailyCheckIn {
  date: string;          // YYYY-MM-DD
  meals: {
    breakfast: MealCheckIn;
    lunch: MealCheckIn;
    dinner: MealCheckIn;
  };
  waterRecords: WaterRecord[];
  meditationRecords: MeditationRecord[];
  totalWater: number;    // 总饮水量 (ml)
  totalCalories: number; // 总热量 (kcal)
  fastingHours: number;  // 断食小时数
}

// ===== AI 食物分析结果 =====

interface FoodAnalysisResult {
  foods: {
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    confidence: number;  // 识别置信度 0-1
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  healthScore: number;   // 0-100 健康评分
  suggestion: string;    // AI 饮食建议
}

// ===== 影像记录 =====

interface MediaRecord {
  id: string;
  mediaType: 'photo' | 'video';
  timestamp: string;
  date: string;
  url: string;
  thumbnailUrl: string;
  duration?: number;     // 视频秒数
  tags: string[];
  notes?: string;
  relatedData?: {
    weight?: number;
    dayNumber?: number;
  };
}
```

### 10.2 常量映射

```typescript
const MEAL_LABELS = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
};

const MEAL_ICONS = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
};

const MEDITATION_LABELS = {
  meditation: '冥想',
  sitting: '打坐',
  dongyin: '动引',
  jingyin: '静引',
};

const MOOD_LABELS = {
  calm: '平静',
  anxious: '焦虑',
  happy: '愉悦',
  tired: '疲惫',
};
```

---

## 11. 数据库设计

### 11.1 表结构

#### `profiles` — 用户资料

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,  -- 关联 auth.users.id
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: 任何人可查看，仅本人可插入/更新
```

#### `user_roles` — 用户角色（安全关键）

```sql
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,     -- 关联 auth.users.id
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
-- RLS: 仅本人可查看（不可自行修改）
-- 管理员角色需后台手动分配
```

#### `subscriptions` — 订阅信息

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan TEXT DEFAULT 'free',          -- 'free' | 'premium' | 'annual'
  status TEXT DEFAULT 'active',      -- 'active' | 'expired' | 'cancelled'
  price_cents INTEGER DEFAULT 0,
  payment_method TEXT,
  payment_order_id TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: 本人可查看/插入/更新，admin 全权
```

#### `courses` — 课程内容

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,            -- 分类名称
  type TEXT DEFAULT 'video',         -- 'video' | 'audio' | 'article'
  duration TEXT DEFAULT '',
  instructor TEXT DEFAULT '',
  description TEXT DEFAULT '',
  content_url TEXT DEFAULT '',
  thumbnail TEXT DEFAULT '',
  is_free BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: 任何人可查看，仅 admin 可增删改
```

#### `daily_checkins` — 每日打卡记录

```sql
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  meals JSONB DEFAULT '{}',           -- { breakfast: MealCheckIn, lunch: ..., dinner: ... }
  water_records JSONB DEFAULT '[]',   -- WaterRecord[]
  meditation_records JSONB DEFAULT '[]', -- MeditationRecord[]
  total_water INTEGER DEFAULT 0,
  total_calories INTEGER DEFAULT 0,
  fasting_hours INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, date)
);
-- RLS: 仅本人可查看/插入/更新
```

### 11.2 安全函数

```sql
-- 判断用户角色（SECURITY DEFINER，避免 RLS 递归）
CREATE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### 11.3 数据库触发器

```sql
-- 新用户注册时自动创建 profile
CREATE FUNCTION handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;
-- 触发器绑定到 auth.users 的 INSERT 事件
```

---

## 12. AI 功能

### 12.1 食物分析

**调用流程**:

```
用户拍照 → 前端转 Base64 → 调用后端 API
→ 后端发送到 AI 模型 (Gemini 2.5 Flash)
→ AI 返回结构化 JSON → 前端展示结果并记录到餐食
```

**API 接口**:
- **路径**: `POST /api/analyze-food`
- **请求体**: `{ imageBase64: string }`
- **响应体**: `{ data: FoodAnalysisResult }` 或 `{ error: string }`

**AI Prompt**:
```
你是一个专业的营养分析师。用户会发送餐食照片，你需要：
1. 识别图片中的所有食物
2. 估算每种食物的份量和营养成分（卡路里、蛋白质、碳水化合物、脂肪）
3. 给出总热量和健康评分（0-100）
4. 提供简短的饮食建议

份量用中文描述（如"1碗"、"1份"），食物名称用中文。
```

**返回格式** (Tool Calling / Function Calling):
```json
{
  "foods": [
    {
      "name": "糙米饭",
      "portion": "1碗",
      "calories": 180,
      "protein": 4,
      "carbs": 38,
      "fat": 1.5,
      "confidence": 0.95
    }
  ],
  "totalCalories": 380,
  "totalProtein": 31,
  "totalCarbs": 43,
  "totalFat": 9.5,
  "healthScore": 85,
  "suggestion": "这顿饭营养搭配合理，建议适当增加蔬菜摄入。"
}
```

**错误处理**:
| 状态码 | 含义 | 用户提示 |
|--------|------|---------|
| 400 | 缺少图片数据 | "缺少图片数据" |
| 402 | AI 额度用完 | "AI 额度已用完，请充值" |
| 429 | 请求频率限制 | "请求过于频繁，请稍后再试" |
| 500 | 服务端错误 | "AI 分析失败" |

### 12.2 FoodAnalyzer 组件 UI

```
┌────────────────────────────────────┐
│ ✨ AI 餐食分析                  [X]│
├────────────────────────────────────┤
│                                    │
│     ┌──────────────────┐          │
│     │  拍照或选择照片    │          │ ← 虚线边框区域
│     │  AI自动识别食物    │          │
│     └──────────────────┘          │
│                                    │
│ ── 分析后显示 ──                  │
│  [85分]  380千卡  31g蛋白          │ ← 健康评分 + 营养总览
│         43g碳水   9.5g脂肪         │
│                                    │
│ ✨ AI 建议文字...                  │ ← 淡绿底色框
│                                    │
│ 食物详情（3项）  [展开/收起]       │
│                                    │
│ [重新拍照]        [确认保存]       │
└────────────────────────────────────┘
```

---

## 13. 业务逻辑详解

### 13.1 断食状态判定

根据每日三餐打卡情况**动态**定义：

| 条件 | 状态 | 标签 |
|------|------|------|
| 3 餐全部 `isFasting: true` | 辟谷 | `辟谷` |
| 1-2 餐 `isFasting: true` | 轻断食 | `轻断食` |
| 0 餐断食 | 正常饮食 | `正常饮食` |

### 13.2 自动餐次分配

系统根据当前时间自动判定当前餐次：

| 时间段 | 餐次 |
|--------|------|
| 00:00 - 10:00 | 早餐 (breakfast) |
| 10:00 - 15:00 | 午餐 (lunch) |
| 15:00 - 24:00 | 晚餐 (dinner) |

当用户通过 AI 拍照或手动输入食物时，自动添加到当前时段对应的餐次。

### 13.3 断食连续天数计算

```
从今天往前回溯历史打卡记录：
1. 如果今天有断食（任意一餐 isFasting），当天算第 1 天
2. 检查昨天是否有打卡且有断食 → 是则 +1
3. 继续往前检查，直到某天无打卡记录或无断食 → 停止
4. 新用户无历史记录：当天有断食则为第 1 天
```

### 13.4 饮水达标判定

目标: **2000ml/天**
- 达标 → 显示进度条填满 + 积分 +5
- 未达标 → 进度条显示当前比例

### 13.5 数据持久化

每日打卡数据（三餐、饮水、冥想）自动保存到 `daily_checkins` 表：
- **防抖保存**: 用户操作后 1 秒内无新操作才保存
- **Upsert 策略**: 按 `(user_id, date)` 唯一约束，更新当天记录
- **加载策略**: 进入首页时加载当天记录 + 最近 60 天记录（用于计算连续天数）

---

## 14. 积分与等级系统

### 14.1 积分规则

| 行为 | 积分 | 条件 |
|------|------|------|
| 辟谷（全天三餐断食） | +30 | 一天只算一次 |
| 轻断食（1-2餐断食） | +15 | 一天只算一次 |
| 每次冥想 | +5 基础分 + 每分钟 +1 | 可叠加多次 |
| 冥想超 30 分钟 | 额外 +10 | 单次冥想 ≥30min |
| 饮水达标 | +5 | 总量 ≥ 2000ml |
| 记录健康数据 | +5 | 一天一次 |
| 记录饮食 | +3 | 有食物记录即可 |

### 14.2 等级体系

| 等级 | 名称 | 所需总积分 | 图标 |
|------|------|-----------|------|
| Lv.1 | 种子 | 0 | 🌱 |
| Lv.2 | 萌芽 | 100 | 🌿 |
| Lv.3 | 幼苗 | 300 | 🌱 |
| Lv.4 | 小树 | 600 | 🌲 |
| Lv.5 | 壮树 | 1,000 | 🌳 |
| Lv.6 | 大树 | 1,500 | 🌳 |
| Lv.7 | 古木 | 2,200 | 🏛️ |
| Lv.8 | 神木 | 3,000 | ✨ |
| Lv.9 | 世界树 | 4,000 | 🌍 |
| Lv.10 | 永恒之树 | 5,500 | ♾️ |

### 14.3 等级计算逻辑

```
输入: totalPoints (总积分)
从最高等级向下遍历：
  找到第一个 required ≤ totalPoints 的等级
  当前等级 = 该等级
  下一等级 = 该等级 + 1（如已满级则不变）
  等级内积分 = totalPoints - 当前等级.required
  升级所需 = 下一等级.required - 当前等级.required
```

### 14.4 生命树 UI

**首页显示** (点击可展开详情):
```
[🌲 12x12 圆形] Lv.3 幼苗
 等级徽章     ████████░░░ 进度条
              今日 +23
```

**详情弹窗**:
```
┌────────────────────────────────────┐
│ 🌲 幼苗                           │
│ Lv.3 · 150 / 300 积分             │
│ ████████████████░░░░░░             │
│                                    │
│ 今日积分明细                       │
│ 轻断食（1餐）         +15          │
│ 冥想 22分钟           +27          │
│ ─────────────────────              │
│ 合计                  +42          │
│                                    │
│ 积分规则                           │
│ 🌿 辟谷（全天断食）+30分           │
│ 🍃 轻断食（1-2餐）+15分           │
│ 🧘 冥想 +5分/次 +1分/分钟         │
│ 💧 饮水达标（≥2L）+5分            │
│ 📝 记录饮食 +3分                   │
│ 📊 记录健康数据 +5分               │
│                                    │
│ [关闭]                             │
└────────────────────────────────────┘
```

---

## 15. 订阅与权限体系

### 15.1 Premium 判定

```
查询 subscriptions 表:
WHERE user_id = 当前用户
  AND status = 'active'
  AND plan != 'free'
  AND (expires_at IS NULL OR expires_at > NOW())
→ 有结果则为 Premium
```

### 15.2 功能权限矩阵

| 功能 | 免费用户 | Premium 用户 |
|------|:-------:|:-----------:|
| 三餐打卡 | ✅ | ✅ |
| AI 食物分析 | ✅ | ✅ |
| 饮水追踪 | ✅ | ✅ |
| 冥想记录 | ✅ | ✅ |
| 体重/体脂记录 | ✅ | ✅ |
| 生命树 | ✅ | ✅ |
| 照片记录 | ✅ | ✅ |
| **血糖记录** | 🔒 | ✅ |
| **血压记录** | 🔒 | ✅ |
| **本月小结** | 🔒 | ✅ |
| **付费课程** | 🔒 | ✅ |

---

## 16. 交互与动画规范

### 16.1 通用动画

| 场景 | 动画 | 参数 |
|------|------|------|
| 卡片入场 | 淡入+上移 | `opacity: 0→1, y: 10→0` |
| 页面切换 | 淡入淡出 | `opacity: 0→1→0` |
| 弹窗出现 | 底部滑入 | `y: 100%→0, spring damping:25` |
| 弹窗背景 | 淡入 | `opacity: 0→1` + 模糊 `backdrop-blur-sm` |
| 按钮点击 | 缩放 | `scale: 0.97` (whileTap) |
| 进度条 | 宽度动画 | `width: 0→N%, duration: 0.8s` |
| Tab 指示条 | 弹簧位移 | `layoutId + spring stiffness:400` |
| 列表项交错 | 延迟入场 | 每项延迟 `i * 0.03~0.05s` |

### 16.2 手势交互

- 长按图片 → 禁止系统回调 (`-webkit-touch-callout: none`)
- 禁用页面过度滚动弹跳 (`overscroll-behavior: none`)
- 禁用点击高亮 (`-webkit-tap-highlight-color: transparent`)
- 禁用文本大小调整 (`-webkit-text-size-adjust: 100%`)

### 16.3 Toast 通知

使用 Toast 组件显示操作反馈：
- 成功: 默认样式，如 "已记录到午餐 ✨"
- 错误: `variant: 'destructive'`，如 "分析失败"

---

## 17. 组件清单

| 组件名 | 文件 | 功能 | 复用度 |
|--------|------|------|--------|
| `BottomNav` | BottomNav.tsx | 底部 4-Tab 导航 | 全局 |
| `DailySummary` | DailySummary.tsx | 每日概览四宫格 | 首页 |
| `MealCard` | MealCard.tsx | 三餐卡片（断食/进食/AI/手动） | 首页×3 |
| `FoodAnalyzer` | FoodAnalyzer.tsx | AI 食物分析弹窗 | 首页 |
| `WaterTracker` | WaterTracker.tsx | 饮水追踪卡片 | 首页 |
| `MeditationCard` | MeditationCard.tsx | 冥想计时器卡片 | 首页 |
| `HealthInputForm` | HealthInputForm.tsx | 健康数据输入弹窗 | 首页 |
| `WeightChart` | WeightChart.tsx | 趋势图表（体重/血糖/血压） | 首页 |
| `LifeTree` | LifeTree.tsx | 生命树组件+详情弹窗 | 首页 |
| `LifeTreeProfileCard` | profile/LifeTreeProfileCard.tsx | 个人中心生命树卡片 | 个人中心 |
| `AuthPage` | AuthPage.tsx | 登录/注册页 | 入口 |
| `CoursePage` | CoursePage.tsx | 课堂页面 | Tab |
| `MediaPage` | MediaPage.tsx | 影像记录页面 | Tab |
| `ProfilePage` | ProfilePage.tsx | 个人中心页面 | Tab |
| `AdminCoursePage` | AdminCoursePage.tsx | 管理员课程管理 | 个人中心 |
| `SubscriptionPage` | profile/SubscriptionPage.tsx | 订阅管理子页 | 个人中心 |
| `NotificationSettingsPage` | profile/NotificationSettingsPage.tsx | 提醒设置子页 | 个人中心 |
| `PrivacySettingsPage` | profile/PrivacySettingsPage.tsx | 隐私设置子页 | 个人中心 |
| `HelpFeedbackPage` | profile/HelpFeedbackPage.tsx | 帮助反馈子页 | 个人中心 |
| `AppSettingsPage` | profile/AppSettingsPage.tsx | 应用设置子页 | 个人中心 |

---

## 附录

### A. 课程分类完整列表

```typescript
const COURSE_CATEGORIES = [
  { key: '辟谷基础', icon: '🌿' },
  { key: '轻断食',   icon: '🍃' },
  { key: '静坐冥想', icon: '🧘' },
  { key: '食疗养生', icon: '🍵' },
  { key: '辟谷运动', icon: '🏃' },
  { key: '极简生活', icon: '🏡' },
];
```

### B. 视频模板列表

```typescript
const VIDEO_TEMPLATES = {
  simple:     { label: '简约', description: '纯白背景，简洁文字' },
  nature:     { label: '自然', description: '自然背景，温暖色调' },
  motivation: { label: '激励', description: '动感转场，励志文字' },
  wabisabi:   { label: '侘寂', description: '米白背景，质朴文字' },
};
```

### C. 缩略图映射

每个课程分类有对应的默认缩略图：
- 辟谷基础 → `course-bigu.jpg`
- 轻断食 → `course-fasting.jpg`
- 静坐冥想 → `course-meditation.jpg`
- 食疗养生 → `course-food.jpg`
- 辟谷运动 → `course-movement.jpg`
- 极简生活 → `course-minimalism.jpg`

### D. 存储 Bucket

| Bucket 名称 | 用途 | 公开 |
|-------------|------|:----:|
| `course-media` | 课程媒体文件（视频/音频/文档） | ✅ |

---

> 本文档完整覆盖了「简了么」应用的所有功能、设计、数据结构和业务逻辑。
> 可直接用于微信小程序生成工具的输入参考。
