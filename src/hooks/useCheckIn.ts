import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DailyCheckIn, MeditationRecord } from '@/types';
import { calculateFastingStreak } from '@/lib/streakCalculator';

/** Get local date as YYYY-MM-DD without UTC shift */
const getLocalDateStr = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getEmptyCheckIn = (): DailyCheckIn => ({
  date: getLocalDateStr(),
  meals: {
    breakfast: { mealType: 'breakfast', isFasting: false },
    lunch: { mealType: 'lunch', isFasting: false },
    dinner: { mealType: 'dinner', isFasting: false },
  },
  waterRecords: [],
  meditationRecords: [],
  totalWater: 0,
  totalCalories: 0,
  fastingHours: 0,
});

export const useCheckIn = (userId: string | undefined) => {
  const [checkIn, setCheckIn] = useState<DailyCheckIn>(getEmptyCheckIn());
  const [streakDays, setStreakDays] = useState(0);
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);
  const latestCheckInRef = useRef(checkIn);

  // Keep ref in sync
  useEffect(() => { latestCheckInRef.current = checkIn; }, [checkIn]);
  const today = getLocalDateStr();

  // Load today's check-in and history for streak
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Load today's check-in
        const { data: todayData } = await supabase
          .from('daily_checkins')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today)
          .maybeSingle();

        if (todayData) {
          const meals = todayData.meals as any;
          const waterRecords = (todayData.water_records as any[]) || [];
          const meditationRecords = (todayData.meditation_records as any[]) || [];
          setCheckIn({
            date: todayData.date,
            meals: {
              breakfast: meals?.breakfast || { mealType: 'breakfast', isFasting: false },
              lunch: meals?.lunch || { mealType: 'lunch', isFasting: false },
              dinner: meals?.dinner || { mealType: 'dinner', isFasting: false },
            },
            waterRecords,
            meditationRecords,
            totalWater: todayData.total_water || 0,
            totalCalories: todayData.total_calories || 0,
            fastingHours: todayData.fasting_hours || 0,
          });
        }

        // Load recent history for streak calculation (last 60 days)
        const { data: history } = await supabase
          .from('daily_checkins')
          .select('date, meals')
          .eq('user_id', userId)
          .gte('date', getLocalDateStr(new Date(Date.now() - 60 * 86400000)))
          .order('date', { ascending: false });

        if (history && history.length > 0) {
          setTotalCheckIns(history.length);
          const historyRecords = history.map(h => ({
            date: h.date,
            meals: h.meals as any || {},
          }));

          const todayMeals = todayData?.meals as any;
          const todayHasFasting = todayMeals
            ? [todayMeals.breakfast?.isFasting, todayMeals.lunch?.isFasting, todayMeals.dinner?.isFasting].some(Boolean)
            : false;

          setStreakDays(calculateFastingStreak(historyRecords, todayHasFasting));
        }
      } catch (err) {
        console.error('Failed to load check-in data:', err);
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadData();
  }, [userId, today]);

  // Auto-save to DB when checkIn changes (debounced)
  useEffect(() => {
    if (!userId || isInitialLoad.current || loading) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('daily_checkins')
          .upsert({
            user_id: userId,
            date: today,
            meals: checkIn.meals as any,
            water_records: checkIn.waterRecords as any,
            meditation_records: checkIn.meditationRecords as any,
            total_water: checkIn.totalWater,
            total_calories: checkIn.totalCalories,
            fasting_hours: checkIn.fastingHours,
          }, { onConflict: 'user_id,date' });

        if (error) console.error('Failed to save check-in:', error);

        // Recalculate streak
        const fastingCount = [
          checkIn.meals.breakfast.isFasting,
          checkIn.meals.lunch.isFasting,
          checkIn.meals.dinner.isFasting,
        ].filter(Boolean).length;

        if (fastingCount > 0) {
          const { data: history } = await supabase
            .from('daily_checkins')
            .select('date, meals')
            .eq('user_id', userId)
            .gte('date', getLocalDateStr(new Date(Date.now() - 60 * 86400000)))
            .order('date', { ascending: false });

          if (history) {
            const records = history.map(h => ({ date: h.date, meals: h.meals as any || {} }));
            setStreakDays(calculateFastingStreak(records, true));
          }
        } else {
          setStreakDays(0);
        }
      } catch (err) {
        console.error('Save check-in error:', err);
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [checkIn, userId, today, loading]);

  // Flush pending save on page unload
  useEffect(() => {
    if (!userId) return;
    const handleBeforeUnload = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        const data = latestCheckInRef.current;
        const body = JSON.stringify({
          user_id: userId,
          date: today,
          meals: data.meals,
          water_records: data.waterRecords,
          meditation_records: data.meditationRecords,
          total_water: data.totalWater,
          total_calories: data.totalCalories,
          fasting_hours: data.fastingHours,
        });
        // Use sendBeacon for reliable delivery on page close
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/daily_checkins?on_conflict=user_id,date`;
        navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [userId, today]);

  // === Action handlers ===

  const handleToggleFasting = useCallback((mealType: string) => {
    setCheckIn((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: {
          ...prev.meals[mealType as keyof typeof prev.meals],
          isFasting: !prev.meals[mealType as keyof typeof prev.meals].isFasting,
        },
      },
    }));
  }, []);

  const handleAddWater = useCallback((amount: number) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setCheckIn((prev) => ({
      ...prev,
      waterRecords: [
        ...prev.waterRecords,
        { id: `w-${Date.now()}`, timestamp: timeStr, amount, waterType: 'purified' as const },
      ],
      totalWater: prev.totalWater + amount,
    }));
  }, []);

  const getMealTypeByTime = (): 'breakfast' | 'lunch' | 'dinner' => {
    const hour = new Date().getHours();
    if (hour < 10) return 'breakfast';
    if (hour < 15) return 'lunch';
    return 'dinner';
  };

  const handleAddFoodToMeal = useCallback((foods: { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number }[]) => {
    const mealType = getMealTypeByTime();
    const foodItems = foods.map(f => ({
      name: f.name, calories: f.calories, protein: f.protein,
      carbs: f.carbs, fat: f.fat, portion: f.portion,
    }));
    const addedCalories = foodItems.reduce((s, f) => s + f.calories, 0);
    setCheckIn((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: {
          ...prev.meals[mealType],
          isFasting: false,
          foodItems: [...(prev.meals[mealType].foodItems || []), ...foodItems],
        },
      },
      totalCalories: prev.totalCalories + addedCalories,
    }));
  }, []);

  const handleAddFoodToMealForType = useCallback((mealType: 'breakfast' | 'lunch' | 'dinner', food: { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number }) => {
    setCheckIn((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: {
          ...prev.meals[mealType],
          isFasting: false,
          foodItems: [...(prev.meals[mealType].foodItems || []), food],
        },
      },
      totalCalories: prev.totalCalories + food.calories,
    }));
  }, []);

  const handleAddMeditationRecord = useCallback((record: Omit<MeditationRecord, 'id'>) => {
    setCheckIn((prev) => ({
      ...prev,
      meditationRecords: [
        ...prev.meditationRecords,
        { ...record, id: `m-${Date.now()}` },
      ],
    }));
  }, []);

  return {
    checkIn,
    setCheckIn,
    streakDays,
    totalCheckIns,
    loading,
    handleToggleFasting,
    handleAddWater,
    handleAddFoodToMeal,
    handleAddFoodToMealForType,
    handleAddMeditationRecord,
  };
};
