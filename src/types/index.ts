// Types for the 辟了么 app

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealCheckIn {
  mealType: MealType;
  isFasting: boolean;
  mealTime?: string;
  foodItems?: FoodItem[];
  photos?: string[];
  notes?: string;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
}

export interface WaterRecord {
  id: string;
  timestamp: string;
  amount: number;
  waterType: 'purified' | 'tea' | 'coffee' | 'other';
}

export interface MeditationRecord {
  id: string;
  timestamp: string;
  duration: number;
  type: 'meditation' | 'sitting' | 'dongyin' | 'jingyin';
  mood?: 'calm' | 'anxious' | 'happy' | 'tired';
  notes?: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
}

export interface DailyCheckIn {
  date: string;
  meals: {
    breakfast: MealCheckIn;
    lunch: MealCheckIn;
    dinner: MealCheckIn;
  };
  waterRecords: WaterRecord[];
  meditationRecords: MeditationRecord[];
  totalWater: number;
  totalCalories: number;
  fastingHours: number;
}

export type TabType = 'home' | 'checkin' | 'data' | 'profile';

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
};

export const MEAL_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
};

export const MEDITATION_LABELS: Record<string, string> = {
  meditation: '冥想',
  sitting: '打坐',
  dongyin: '动引',
  jingyin: '静引',
};

export const MOOD_LABELS: Record<string, string> = {
  calm: '平静',
  anxious: '焦虑',
  happy: '愉悦',
  tired: '疲惫',
};
