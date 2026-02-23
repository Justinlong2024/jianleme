import { DailyCheckIn } from '@/types';
import MealCard from '@/components/MealCard';
import WaterTracker from '@/components/WaterTracker';
import MeditationCard from '@/components/MeditationCard';
import { Camera, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface CheckInPageProps {
  checkIn: DailyCheckIn;
  onToggleFasting: (mealType: string) => void;
  onAddWater: (amount: number) => void;
}

const CheckInPage = ({ checkIn, onToggleFasting, onAddWater }: CheckInPageProps) => {
  const meditationMinutes = checkIn.meditationRecords.reduce((s, r) => s + r.duration, 0);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <h1 className="text-xl font-bold text-foreground font-serif mb-1">今日打卡</h1>
      <p className="text-sm text-muted-foreground mb-5">记录你的每一步，见证蜕变</p>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
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
    </div>
  );
};

export default CheckInPage;
