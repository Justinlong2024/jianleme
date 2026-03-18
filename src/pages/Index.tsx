import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabType } from '@/types';
import { generateMockWeightData } from '@/data/mockData';
import BottomNav from '@/components/BottomNav';
import DailySummary from '@/components/DailySummary';
import LifeTree from '@/components/LifeTree';
import { calculateDailyPoints, getLevelInfo } from '@/lib/lifeTreeSystem';
import MealCard from '@/components/MealCard';
import WaterTracker from '@/components/WaterTracker';
import MeditationCard from '@/components/MeditationCard';
import WeightChart from '@/components/WeightChart';
import HealthInputForm from '@/components/HealthInputForm';
import FoodAnalyzer from '@/components/FoodAnalyzer';
import { Activity, TrendingUp, Droplet, Heart } from 'lucide-react';
import CoursePage from '@/pages/CoursePage';
import ProfilePage from '@/pages/ProfilePage';
import MediaPage from '@/pages/MediaPage';
import AuthPage from '@/pages/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useCheckIn } from '@/hooks/useCheckIn';
import { HealthRecord } from '@/types';
import { FoodAnalysisResult } from '@/services/foodAnalysis';
import { toast } from '@/hooks/use-toast';

const initialWeightData = generateMockWeightData();

const Index = () => {
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription(user?.id);
  const {
    checkIn,
    streakDays,
    loading: checkInLoading,
    handleToggleFasting,
    handleAddWater,
    handleAddFoodToMeal,
    handleAddFoodToMealForType,
    handleAddMeditationRecord,
  } = useCheckIn(user?.id);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [weightData, setWeightData] = useState<HealthRecord[]>(initialWeightData);
  const [showFoodAnalyzer, setShowFoodAnalyzer] = useState(false);
  const [analyzerMealType, setAnalyzerMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  const getMealLabel = () => {
    const hour = new Date().getHours();
    if (hour < 10) return '早餐';
    if (hour < 15) return '午餐';
    return '晚餐';
  };

  const handleAnalysisComplete = useCallback((result: FoodAnalysisResult) => {
    handleAddFoodToMeal(result.foods);
    toast({
      title: '已记录到' + getMealLabel() + ' ✨',
      description: `识别了 ${result.foods.length} 种食物，共 ${result.totalCalories} 千卡`,
    });
  }, [handleAddFoodToMeal]);

  const handleAddHealthRecord = useCallback((record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = { ...record, id: `h-${Date.now()}` };
    setWeightData((prev) => {
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

  const meditationMinutes = checkIn.meditationRecords.reduce((s, r) => s + r.duration, 0);

  // Life Tree points calculation
  const dailyPointsData = useMemo(() => calculateDailyPoints(checkIn), [checkIn]);
  const BASE_POINTS = 150;
  const totalPoints = BASE_POINTS + dailyPointsData.total;
  const levelInfo = useMemo(() => getLevelInfo(totalPoints), [totalPoints]);

  const growthHistory = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      const pts = Math.floor(8 + Math.random() * 35);
      days.push({ day: label, points: pts });
    }
    return days;
  }, []);

  if (authLoading || subLoading || checkInLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">加载中...</div>;
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了 🌙';
    if (hour < 12) return '早安 🌅';
    if (hour < 18) return '午安 ☀️';
    return '晚安 🌙';
  };

  const fastingMealCount = [checkIn.meals.breakfast, checkIn.meals.lunch, checkIn.meals.dinner].filter(m => m.isFasting).length;

  const getFastingStatus = () => {
    if (fastingMealCount === 3) {
      return `今天是你辟谷之旅的第 <span class="text-primary font-semibold">${streakDays}</span> 天`;
    } else if (fastingMealCount > 0) {
      return `今天是你轻断食的第 <span class="text-primary font-semibold">${streakDays}</span> 天`;
    }
    return '今天尚未开始断食';
  };

  return (
    <div className="min-h-screen bg-background pb-28 safe-area-top safe-area-bottom">
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
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                  {' '}
                  {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5"
                   dangerouslySetInnerHTML={{ __html: getFastingStatus() }}
                />
              </div>
              <LifeTree
                level={levelInfo.level}
                levelLabel={levelInfo.label}
                points={levelInfo.pointsInLevel}
                nextLevelPoints={levelInfo.pointsNeeded}
                todayPoints={dailyPointsData.total}
                breakdown={dailyPointsData.breakdown}
                isMaxLevel={levelInfo.isMaxLevel}
              />
            </div>

            {/* Daily Summary */}
            <DailySummary
              fastingHours={checkIn.fastingHours}
              totalCalories={checkIn.totalCalories}
              totalWater={checkIn.totalWater}
              meditationMinutes={meditationMinutes}
              streakDays={streakDays}
              fastingMealCount={fastingMealCount}
            />

            {/* Meals Section */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">三餐记录</h2>
              <div className="space-y-2.5">
                <MealCard meal={checkIn.meals.breakfast} onToggleFasting={handleToggleFasting} onOpenAnalyzer={() => setShowFoodAnalyzer(true)} onManualAdd={(food) => handleAddFoodToMealForType('breakfast', food)} />
                <MealCard meal={checkIn.meals.lunch} onToggleFasting={handleToggleFasting} onOpenAnalyzer={() => setShowFoodAnalyzer(true)} onManualAdd={(food) => handleAddFoodToMealForType('lunch', food)} />
                <MealCard meal={checkIn.meals.dinner} onToggleFasting={handleToggleFasting} onOpenAnalyzer={() => setShowFoodAnalyzer(true)} onManualAdd={(food) => handleAddFoodToMealForType('dinner', food)} />
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
              <HealthInputForm onSave={handleAddHealthRecord} isPremium={isPremium} />
              {(() => {
                const latest = weightData[weightData.length - 1];
                const first = weightData[0];
                const weightChange = latest?.weight && first?.weight ? (latest.weight - first.weight).toFixed(1) : null;
                const fatChange = latest?.bodyFat && first?.bodyFat ? (latest.bodyFat - first.bodyFat).toFixed(1) : null;
                const bp = latest?.bloodPressureSystolic && latest?.bloodPressureDiastolic
                  ? `${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}` : '--/--';
                const freeMetrics = [
                  { label: '体重', value: latest?.weight ? `${latest.weight} kg` : '--', icon: Activity, change: weightChange ? `${parseFloat(weightChange) <= 0 ? '' : '+'}${weightChange}kg` : '暂无', positive: weightChange ? parseFloat(weightChange) <= 0 : true },
                  { label: '体脂率', value: latest?.bodyFat ? `${latest.bodyFat}%` : '--', icon: TrendingUp, change: fatChange ? `${parseFloat(fatChange) <= 0 ? '' : '+'}${fatChange}%` : '暂无', positive: fatChange ? parseFloat(fatChange) <= 0 : true },
                ];
                const premiumMetrics = [
                  { label: '空腹血糖', value: latest?.bloodSugar ? `${latest.bloodSugar} mmol/L` : '--', icon: Droplet, change: latest?.bloodSugar ? (latest.bloodSugar <= 6.1 ? '正常' : '偏高') : '暂无', positive: latest?.bloodSugar ? latest.bloodSugar <= 6.1 : true },
                  { label: '血压', value: bp, icon: Heart, change: latest?.bloodPressureSystolic ? (latest.bloodPressureSystolic <= 140 ? '正常' : '偏高') : '暂无', positive: latest?.bloodPressureSystolic ? latest.bloodPressureSystolic <= 140 : true },
                ];
                const metrics = isPremium ? [...freeMetrics, ...premiumMetrics] : freeMetrics;
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

            <div className="mt-4">
              <WeightChart data={weightData} />
            </div>

            {/* Monthly Summary */}
            {isPremium && (() => {
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

        {/* Food Analyzer Modal */}
        <AnimatePresence>
          {showFoodAnalyzer && (
            <FoodAnalyzer
              onAnalysisComplete={handleAnalysisComplete}
              onClose={() => setShowFoodAnalyzer(false)}
            />
          )}
        </AnimatePresence>

        {activeTab === 'course' && (
          <motion.div
            key="course"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CoursePage isPremium={isPremium} />
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
            <ProfilePage
              isPremium={isPremium}
              lifeTree={{
                level: levelInfo.level,
                levelLabel: levelInfo.label,
                totalPoints,
                pointsInLevel: levelInfo.pointsInLevel,
                pointsNeeded: levelInfo.pointsNeeded,
                isMaxLevel: levelInfo.isMaxLevel,
                growthHistory,
              }}
              isAdmin={isAdmin}
              onSignOut={signOut}
              userEmail={user.email}
              displayName={user.user_metadata?.display_name}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
