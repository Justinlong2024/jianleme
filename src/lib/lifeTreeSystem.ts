import { DailyCheckIn } from '@/types';

// === 积分来源规则 ===
export const POINT_RULES = {
  // 断食相关
  BIGU_FULL_DAY: 30,      // 辟谷（三餐全断）
  LIGHT_FASTING: 15,       // 轻断食（断1-2餐）
  
  // 冥想相关
  MEDITATION_SESSION: 5,   // 每次冥想基础分
  MEDITATION_PER_MIN: 1,   // 每分钟额外积分
  MEDITATION_LONG_BONUS: 10, // 超过30分钟额外奖励
  
  // 饮水相关
  WATER_GOAL_REACHED: 5,   // 饮水达标 (≥2000ml)
  
  // 记录相关
  HEALTH_RECORDED: 5,      // 记录体重/体脂等健康数据
  FOOD_LOGGED: 3,          // 记录饮食
} as const;

// === 等级阈值 ===
export const LEVEL_THRESHOLDS = [
  { level: 1, required: 0,    label: '种子' },
  { level: 2, required: 100,  label: '萌芽' },
  { level: 3, required: 300,  label: '幼苗' },
  { level: 4, required: 600,  label: '小树' },
  { level: 5, required: 1000, label: '壮树' },
  { level: 6, required: 1500, label: '大树' },
  { level: 7, required: 2200, label: '古木' },
  { level: 8, required: 3000, label: '神木' },
  { level: 9, required: 4000, label: '世界树' },
  { level: 10, required: 5500, label: '永恒之树' },
] as const;

// === 根据积分计算等级 ===
export function getLevelInfo(totalPoints: number) {
  let currentLevel = LEVEL_THRESHOLDS[0] as (typeof LEVEL_THRESHOLDS)[number];
  let nextLevel = LEVEL_THRESHOLDS[1] as (typeof LEVEL_THRESHOLDS)[number];

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVEL_THRESHOLDS[i].required) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i]; // max level
      break;
    }
  }

  const isMaxLevel = currentLevel.level === LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].level;
  const pointsInLevel = totalPoints - currentLevel.required;
  const pointsNeeded = isMaxLevel ? 1 : nextLevel.required - currentLevel.required;

  return {
    level: currentLevel.level,
    label: currentLevel.label,
    totalPoints,
    pointsInLevel,
    pointsNeeded,
    nextLevelRequired: isMaxLevel ? currentLevel.required : nextLevel.required,
    isMaxLevel,
  };
}

// === 根据当天 checkIn 数据计算今日获得的积分 ===
export function calculateDailyPoints(checkIn: DailyCheckIn): { total: number; breakdown: { label: string; points: number }[] } {
  const breakdown: { label: string; points: number }[] = [];

  // 断食积分
  const { breakfast, lunch, dinner } = checkIn.meals;
  const fastingCount = [breakfast, lunch, dinner].filter(m => m.isFasting).length;
  if (fastingCount === 3) {
    breakdown.push({ label: '辟谷（全天）', points: POINT_RULES.BIGU_FULL_DAY });
  } else if (fastingCount > 0) {
    breakdown.push({ label: `轻断食（${fastingCount}餐）`, points: POINT_RULES.LIGHT_FASTING });
  }

  // 饮食记录积分
  const hasFood = [breakfast, lunch, dinner].some(m => m.foodItems && m.foodItems.length > 0);
  if (hasFood) {
    breakdown.push({ label: '记录饮食', points: POINT_RULES.FOOD_LOGGED });
  }

  // 冥想积分
  checkIn.meditationRecords.forEach((record) => {
    let pts = POINT_RULES.MEDITATION_SESSION + record.duration * POINT_RULES.MEDITATION_PER_MIN;
    if (record.duration >= 30) {
      pts += POINT_RULES.MEDITATION_LONG_BONUS;
    }
    breakdown.push({ label: `冥想 ${record.duration}分钟`, points: pts });
  });

  // 饮水积分
  if (checkIn.totalWater >= 2000) {
    breakdown.push({ label: '饮水达标', points: POINT_RULES.WATER_GOAL_REACHED });
  }

  const total = breakdown.reduce((sum, item) => sum + item.points, 0);
  return { total, breakdown };
}
