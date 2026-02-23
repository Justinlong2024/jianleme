import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabType } from '@/types';
import { getTodayCheckIn, generateMockWeightData } from '@/data/mockData';
import BottomNav from '@/components/BottomNav';
import DailySummary from '@/components/DailySummary';
import LifeTree from '@/components/LifeTree';
import MealCard from '@/components/MealCard';
import WaterTracker from '@/components/WaterTracker';
import MeditationCard from '@/components/MeditationCard';
import WeightChart from '@/components/WeightChart';
import HealthInputForm from '@/components/HealthInputForm';
import { Activity, TrendingUp, Droplet, Heart } from 'lucide-react';
import CheckInPage from '@/pages/CheckInPage';

import ProfilePage from '@/pages/ProfilePage';
import MediaPage from '@/pages/MediaPage';

import { HealthRecord } from '@/types';

const initialWeightData = generateMockWeightData();

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [checkIn, setCheckIn] = useState(getTodayCheckIn());
  const [weightData, setWeightData] = useState<HealthRecord[]>(initialWeightData);

  const handleAddHealthRecord = useCallback((record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = { ...record, id: `h-${Date.now()}` };
    setWeightData((prev) => {
      // Replace today's record if exists, otherwise append
      const todayDate = new Date().toISOString().split('T')[0];
      const existing = prev.findIndex((r) => r.date === todayDate);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...newRecord };
        return updated;
      }
      return [...prev, newRecord];
    });
  }, []);

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
      name: f.name,
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      portion: f.portion,
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

  const handleAddMeditationRecord = useCallback((record: Omit<import('@/types').MeditationRecord, 'id'>) => {
    setCheckIn((prev) => ({
      ...prev,
      meditationRecords: [
        ...prev.meditationRecords,
        { ...record, id: `m-${Date.now()}` },
      ],
    }));
  }, []);

  const meditationMinutes = checkIn.meditationRecords.reduce((s, r) => s + r.duration, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了 🌙';
    if (hour < 12) return '早安 🌅';
    if (hour < 18) return '午安 ☀️';
    return '晚安 🌙';
  };

  // Calculate fasting status based on meals
  const getFastingStatus = () => {
    const { breakfast, lunch, dinner } = checkIn.meals;
    const fastingCount = [breakfast, lunch, dinner].filter(m => m.isFasting).length;
    const dayNumber = 7; // TODO: replace with real streak from DB
    if (fastingCount === 3) {
      return `今天是你辟谷之旅的第 <span class="text-primary font-semibold">${dayNumber}</span> 天`;
    } else if (fastingCount > 0) {
      return `今天是你轻断食的第 <span class="text-primary font-semibold">${dayNumber}</span> 天`;
    }
    return '今天尚未开始断食';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-lg mx-auto px-4 pt-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-serif">
                  {getGreeting()}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5"
                   dangerouslySetInnerHTML={{ __html: getFastingStatus() }}
                />
              </div>
              <LifeTree level={3} points={1250} nextLevelPoints={2000} />
            </div>

            {/* Daily Summary */}
            <DailySummary
              fastingHours={checkIn.fastingHours}
              totalCalories={checkIn.totalCalories}
              totalWater={checkIn.totalWater}
              meditationMinutes={meditationMinutes}
              streakDays={7}
              fastingMealCount={[checkIn.meals.breakfast, checkIn.meals.lunch, checkIn.meals.dinner].filter(m => m.isFasting).length}
            />

            {/* Meals Section */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                三餐记录
              </h2>
              <div className="space-y-2.5">
                <MealCard meal={checkIn.meals.breakfast} onToggleFasting={handleToggleFasting} />
                <MealCard meal={checkIn.meals.lunch} onToggleFasting={handleToggleFasting} />
                <MealCard meal={checkIn.meals.dinner} onToggleFasting={handleToggleFasting} />
              </div>
            </div>

            {/* Water */}
            <div className="mt-5">
              <WaterTracker
                records={checkIn.waterRecords}
                totalWater={checkIn.totalWater}
                onAddWater={handleAddWater}
              />
            </div>

            {/* Meditation */}
            <div className="mt-4">
              <MeditationCard
                records={checkIn.meditationRecords}
                totalMinutes={meditationMinutes}
                onAddRecord={handleAddMeditationRecord}
              />
            </div>

            {/* Health Data Section */}
            <div className="mt-5">
              <HealthInputForm onSave={handleAddHealthRecord} />
              {(() => {
                const latest = weightData[weightData.length - 1];
                const first = weightData[0];
                const weightChange = latest?.weight && first?.weight ? (latest.weight - first.weight).toFixed(1) : null;
                const fatChange = latest?.bodyFat && first?.bodyFat ? (latest.bodyFat - first.bodyFat).toFixed(1) : null;
                const bp = latest?.bloodPressureSystolic && latest?.bloodPressureDiastolic
                  ? `${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}` : '--/--';
                const metrics = [
                  { label: '体重', value: latest?.weight ? `${latest.weight} kg` : '--', icon: Activity, change: weightChange ? `${parseFloat(weightChange) <= 0 ? '' : '+'}${weightChange}kg` : '暂无', positive: weightChange ? parseFloat(weightChange) <= 0 : true },
                  { label: '体脂率', value: latest?.bodyFat ? `${latest.bodyFat}%` : '--', icon: TrendingUp, change: fatChange ? `${parseFloat(fatChange) <= 0 ? '' : '+'}${fatChange}%` : '暂无', positive: fatChange ? parseFloat(fatChange) <= 0 : true },
                  { label: '空腹血糖', value: latest?.bloodSugar ? `${latest.bloodSugar} mmol/L` : '--', icon: Droplet, change: latest?.bloodSugar ? (latest.bloodSugar <= 6.1 ? '正常' : '偏高') : '暂无', positive: latest?.bloodSugar ? latest.bloodSugar <= 6.1 : true },
                  { label: '血压', value: bp, icon: Heart, change: latest?.bloodPressureSystolic ? (latest.bloodPressureSystolic <= 140 ? '正常' : '偏高') : '暂无', positive: latest?.bloodPressureSystolic ? latest.bloodPressureSystolic <= 140 : true },
                ];
                return (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {metrics.map((m) => {
                      const Icon = m.icon;
                      return (
                        <div key={m.label} className="wabi-card">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={16} className="text-primary" />
                            <span className="text-xs text-muted-foreground">{m.label}</span>
                          </div>
                          <div className="text-lg font-bold text-foreground">{m.value}</div>
                          <div className={`text-xs mt-1 ${m.positive ? 'text-success' : 'text-destructive'}`}>{m.change}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Weight Chart */}
            <div className="mt-4">
              <WeightChart data={weightData} />
            </div>

            {/* Monthly Summary */}
            {(() => {
              const latest = weightData[weightData.length - 1];
              const first = weightData[0];
              const weightChange = latest?.weight && first?.weight ? (latest.weight - first.weight).toFixed(1) : null;
              const fatChange = latest?.bodyFat && first?.bodyFat ? (latest.bodyFat - first.bodyFat).toFixed(1) : null;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="wabi-card mt-4 mb-6"
                >
                  <h3 className="font-semibold text-foreground mb-3">本月小结</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {weightChange && parseFloat(weightChange) < 0 ? (
                      <p>✦ 您的体重在记录期间下降了 <span className="text-primary font-semibold">{Math.abs(parseFloat(weightChange))}kg</span>，非常棒！</p>
                    ) : (
                      <p>✦ 坚持记录，看见自己的改变</p>
                    )}
                    {fatChange && parseFloat(fatChange) < 0 && (
                      <p>✦ 体脂率下降了 {Math.abs(parseFloat(fatChange))}%，说明减掉的主要是脂肪</p>
                    )}
                    <p>✦ 建议继续保持记录习惯，数据会帮你做更好的决策</p>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}

        {activeTab === 'checkin' && (
          <motion.div
            key="checkin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CheckInPage checkIn={checkIn} onToggleFasting={handleToggleFasting} onAddWater={handleAddWater} onAddFoodToMeal={handleAddFoodToMeal} />
          </motion.div>
        )}

        {activeTab === 'media' && (
          <motion.div
            key="media"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MediaPage />
          </motion.div>
        )}


        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProfilePage />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
