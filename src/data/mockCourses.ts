export type CourseCategory =
  | '轻断食'
  | '辟谷'
  | '静引'
  | '动引'
  | '复食'
  | '药食同源'
  | '食愈师'
  | '断舍离';

export type CourseType = 'video' | 'audio' | 'article';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  type: CourseType;
  duration: string; // e.g. "12:30" or "5 min read"
  thumbnail: string;
  instructor: string;
  description: string;
  isFree: boolean;
  views: number;
}

export const COURSE_CATEGORIES: { key: CourseCategory; icon: string }[] = [
  { key: '轻断食', icon: '🍃' },
  { key: '辟谷', icon: '🧘' },
  { key: '静引', icon: '🪷' },
  { key: '动引', icon: '🌊' },
  { key: '复食', icon: '🍵' },
  { key: '药食同源', icon: '🌿' },
  { key: '食愈师', icon: '✨' },
  { key: '断舍离', icon: '🎋' },
];

export const MOCK_COURSES: Course[] = [
  // 轻断食
  {
    id: 'c1',
    title: '16:8 轻断食入门指南',
    category: '轻断食',
    type: 'video',
    duration: '18:45',
    thumbnail: '',
    instructor: '李明远',
    description: '从零开始了解16:8间歇性断食法，掌握科学的断食节奏与注意事项。',
    isFree: true,
    views: 12800,
  },
  {
    id: 'c2',
    title: '轻断食期间如何保持精力充沛',
    category: '轻断食',
    type: 'audio',
    duration: '24:10',
    thumbnail: '',
    instructor: '张瑜',
    description: '断食不等于没精神，学会科学调配让你断食期间依然活力满满。',
    isFree: false,
    views: 8420,
  },
  {
    id: 'c3',
    title: '轻断食常见误区与真相',
    category: '轻断食',
    type: 'article',
    duration: '6 分钟',
    thumbnail: '',
    instructor: '王健',
    description: '解答关于轻断食的10个常见疑问，破除断食迷思。',
    isFree: true,
    views: 15200,
  },

  // 辟谷
  {
    id: 'c4',
    title: '七日辟谷全流程详解',
    category: '辟谷',
    type: 'video',
    duration: '35:20',
    thumbnail: '',
    instructor: '陈道长',
    description: '完整的七日辟谷指导，从准备期到辟谷期再到复食期的全流程讲解。',
    isFree: false,
    views: 22400,
  },
  {
    id: 'c5',
    title: '辟谷的身心变化与应对',
    category: '辟谷',
    type: 'audio',
    duration: '28:55',
    thumbnail: '',
    instructor: '林静怡',
    description: '详解辟谷过程中可能出现的身体反应及心理变化，教你从容应对。',
    isFree: true,
    views: 9870,
  },

  // 静引
  {
    id: 'c6',
    title: '静引冥想·晨间呼吸法',
    category: '静引',
    type: 'video',
    duration: '15:00',
    thumbnail: '',
    instructor: '慧心老师',
    description: '每日晨起15分钟静引呼吸练习，唤醒身体的自然能量。',
    isFree: true,
    views: 18600,
  },
  {
    id: 'c7',
    title: '深度放松·身体扫描冥想',
    category: '静引',
    type: 'audio',
    duration: '22:30',
    thumbnail: '',
    instructor: '慧心老师',
    description: '引导式身体扫描冥想，帮助你释放深层紧张，进入深度放松状态。',
    isFree: false,
    views: 14300,
  },

  // 动引
  {
    id: 'c8',
    title: '辟谷动引·八段锦教学',
    category: '动引',
    type: 'video',
    duration: '25:40',
    thumbnail: '',
    instructor: '武道明',
    description: '配合辟谷的八段锦完整教学，温和激活经络，促进气血循环。',
    isFree: true,
    views: 31200,
  },
  {
    id: 'c9',
    title: '晨间动引·五禽戏简化版',
    category: '动引',
    type: 'video',
    duration: '20:15',
    thumbnail: '',
    instructor: '武道明',
    description: '五禽戏简化版动引教学，适合辟谷期间每日练习。',
    isFree: false,
    views: 11500,
  },

  // 复食
  {
    id: 'c10',
    title: '科学复食三阶段',
    category: '复食',
    type: 'video',
    duration: '22:10',
    thumbnail: '',
    instructor: '营养师小周',
    description: '辟谷结束后如何科学复食？掌握三个阶段的饮食原则，避免反弹。',
    isFree: true,
    views: 19800,
  },
  {
    id: 'c11',
    title: '复食期食谱推荐',
    category: '复食',
    type: 'article',
    duration: '8 分钟',
    thumbnail: '',
    instructor: '营养师小周',
    description: '精选复食期适合的食谱，清淡美味又营养均衡。',
    isFree: true,
    views: 25600,
  },

  // 药食同源
  {
    id: 'c12',
    title: '四季养生茶饮配方',
    category: '药食同源',
    type: 'video',
    duration: '16:30',
    thumbnail: '',
    instructor: '中医师刘芳',
    description: '根据四季变化调配养生茶饮，药食同源的日常养生智慧。',
    isFree: true,
    views: 20100,
  },
  {
    id: 'c13',
    title: '常见食材的药用价值',
    category: '药食同源',
    type: 'article',
    duration: '10 分钟',
    thumbnail: '',
    instructor: '中医师刘芳',
    description: '日常食材隐藏的药用功效，学会用厨房里的"药材"调养身体。',
    isFree: false,
    views: 16700,
  },

  // 食愈师
  {
    id: 'c14',
    title: '食愈师认证课程·概论',
    category: '食愈师',
    type: 'video',
    duration: '42:00',
    thumbnail: '',
    instructor: '张大师',
    description: '食愈师认证体系介绍，了解食愈的理论基础与实践路径。',
    isFree: false,
    views: 7800,
  },
  {
    id: 'c15',
    title: '如何成为一名食愈师',
    category: '食愈师',
    type: 'article',
    duration: '12 分钟',
    thumbnail: '',
    instructor: '张大师',
    description: '食愈师成长路径全解析，从入门到专业的学习指南。',
    isFree: true,
    views: 13400,
  },

  // 断舍离
  {
    id: 'c16',
    title: '断舍离·从物品到心灵',
    category: '断舍离',
    type: 'video',
    duration: '28:00',
    thumbnail: '',
    instructor: '心灵导师叶子',
    description: '断舍离不仅是整理物品，更是一场心灵的清洁与觉醒之旅。',
    isFree: true,
    views: 28900,
  },
  {
    id: 'c17',
    title: '极简生活21天挑战',
    category: '断舍离',
    type: 'audio',
    duration: '19:45',
    thumbnail: '',
    instructor: '心灵导师叶子',
    description: '21天极简生活实践指南，每天一个小行动，逐步拥抱简约生活。',
    isFree: false,
    views: 10200,
  },
];
