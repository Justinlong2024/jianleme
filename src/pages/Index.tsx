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
import CheckInPage from '@/pages/CheckInPage';
import DataPage from '@/pages/DataPage';
import ProfilePage from '@/pages/ProfilePage';

const weightData = generateMockWeightData();

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [checkIn, setCheckIn] = useState(getTodayCheckIn());

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

  const meditationMinutes = checkIn.meditationRecords.reduce((s, r) => s + r.duration, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了 🌙';
    if (hour < 12) return '早安 🌅';
    if (hour < 18) return '午安 ☀️';
    return '晚安 🌙';
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
                <p className="text-sm text-muted-foreground mt-0.5">
                  今天是你辟谷之旅的第 <span className="text-primary font-semibold">7</span> 天
                </p>
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
              />
            </div>

            {/* Weight Chart */}
            <div className="mt-4 mb-6">
              <WeightChart data={weightData} />
            </div>
          </motion.div>
        )}

        {activeTab === 'checkin' && (
          <motion.div
            key="checkin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CheckInPage checkIn={checkIn} onToggleFasting={handleToggleFasting} onAddWater={handleAddWater} />
          </motion.div>
        )}

        {activeTab === 'data' && (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DataPage weightData={weightData} />
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
