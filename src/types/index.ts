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
  bloodSugar?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
}

export interface MediaRecord {
  id: string;
  mediaType: 'photo' | 'video';
  timestamp: string;
  date: string;
  photoType?: 'halfBody' | 'fullBody' | 'meal';
  url: string;
  thumbnailUrl: string;
  duration?: number; // seconds, for video
  tags: string[];
  notes?: string;
  relatedData?: {
    weight?: number;
    dayNumber?: number;
  };
}

export interface VideoEditTask {
  id: string;
  status: 'idle' | 'selecting' | 'processing' | 'completed' | 'failed';
  selectedMediaIds: string[];
  template: 'simple' | 'nature' | 'motivation' | 'wabisabi';
  resultUrl?: string;
  progress: number;
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

export type TabType = 'home' | 'checkin' | 'media' | 'profile';

export const VIDEO_TEMPLATES: Record<string, { label: string; description: string }> = {
  simple: { label: '简约', description: '纯白背景，简洁文字' },
  nature: { label: '自然', description: '自然背景，温暖色调' },
  motivation: { label: '激励', description: '动感转场，励志文字' },
  wabisabi: { label: '侘寂', description: '米白背景，质朴文字' },
};

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
