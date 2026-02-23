import { useState } from 'react';
import { DailyCheckIn } from '@/types';
import MealCard from '@/components/MealCard';
import WaterTracker from '@/components/WaterTracker';
import MeditationCard from '@/components/MeditationCard';
import FoodAnalyzer from '@/components/FoodAnalyzer';
import { Camera, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodAnalysisResult } from '@/services/foodAnalysis';
import { toast } from '@/hooks/use-toast';

interface CheckInPageProps {
  checkIn: DailyCheckIn;
  onToggleFasting: (mealType: string) => void;
  onAddWater: (amount: number) => void;
  onAddFoodToMeal: (foods: { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number }[]) => void;
}

const getMealLabel = () => {
  const hour = new Date().getHours();
  if (hour < 10) return '早餐';
  if (hour < 15) return '午餐';
  return '晚餐';
};

const CheckInPage = ({ checkIn, onToggleFasting, onAddWater, onAddFoodToMeal }: CheckInPageProps) => {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const meditationMinutes = checkIn.meditationRecords.reduce((s, r) => s + r.duration, 0);

  const handleAnalysisComplete = (result: FoodAnalysisResult) => {
    onAddFoodToMeal(result.foods);
    toast({
      title: '已记录到' + getMealLabel() + ' ✨',
      description: `识别了 ${result.foods.length} 种食物，共 ${result.totalCalories} 千卡`,
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <h1 className="text-xl font-bold text-foreground font-serif mb-1">今日打卡</h1>
      <p className="text-sm text-muted-foreground mb-5">记录你的每一步，见证蜕变</p>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAnalyzer(true)}
          className="wabi-card flex items-center gap-3 !p-4"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Camera size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-foreground">AI拍照分析</div>
            <div className="text-[10px] text-muted-foreground">识别餐食营养</div>
          </div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="wabi-card flex items-center gap-3 !p-4"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Zap size={20} className="text-secondary" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-foreground">快速打卡</div>
            <div className="text-[10px] text-muted-foreground">一键记录断食</div>
          </div>
        </motion.button>
      </div>

      {/* Meals */}
      <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">三餐记录</h2>
      <div className="space-y-2.5 mb-5">
        <MealCard meal={checkIn.meals.breakfast} onToggleFasting={onToggleFasting} />
        <MealCard meal={checkIn.meals.lunch} onToggleFasting={onToggleFasting} />
        <MealCard meal={checkIn.meals.dinner} onToggleFasting={onToggleFasting} />
      </div>

      {/* Water */}
      <WaterTracker
        records={checkIn.waterRecords}
        totalWater={checkIn.totalWater}
        onAddWater={onAddWater}
      />

      {/* Meditation */}
      <div className="mt-4">
        <MeditationCard records={checkIn.meditationRecords} totalMinutes={meditationMinutes} />
      </div>

      {/* Food Analyzer Modal */}
      <AnimatePresence>
        {showAnalyzer && (
          <FoodAnalyzer
            onAnalysisComplete={handleAnalysisComplete}
            onClose={() => setShowAnalyzer(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckInPage;
