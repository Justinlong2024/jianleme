import { useState } from 'react';
import { MealCheckIn, MEAL_LABELS, MEAL_ICONS } from '@/types';
import { Check, Utensils, Camera, PenLine, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MealCardProps {
  meal: MealCheckIn;
  onToggleFasting: (mealType: string) => void;
  onOpenAnalyzer?: () => void;
  onManualAdd?: (food: { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number }) => void;
}

const MealCard = ({ meal, onToggleFasting, onOpenAnalyzer, onManualAdd }: MealCardProps) => {
  const icon = MEAL_ICONS[meal.mealType];
  const label = MEAL_LABELS[meal.mealType];
  const totalCalories = meal.foodItems?.reduce((sum, f) => sum + f.calories, 0) || 0;
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualCalories, setManualCalories] = useState('');

  const handleManualSubmit = () => {
    if (!manualName.trim() || !manualCalories.trim()) return;
    onManualAdd?.({
      name: manualName.trim(),
      portion: '1份',
      calories: parseInt(manualCalories) || 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
    setManualName('');
    setManualCalories('');
    setShowManual(false);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="wabi-card flex items-center gap-4"
      >
        <div className="text-2xl w-10 text-center">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {meal.isFasting ? '已断食 ✓' : `${totalCalories} 千卡`}
          </div>
          {!meal.isFasting && meal.foodItems && meal.foodItems.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {meal.foodItems.map((f) => f.name).join('、')}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Manual input */}
          <button
            onClick={() => setShowManual(!showManual)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-muted/60 text-muted-foreground hover:bg-muted transition-all"
            title="手动输入"
          >
            <PenLine size={15} />
          </button>
          {/* AI photo */}
          <button
            onClick={onOpenAnalyzer}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-all"
            title="AI拍照分析"
          >
            <Camera size={15} />
          </button>
          {/* Fasting toggle */}
          <button
            onClick={() => onToggleFasting(meal.mealType)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              meal.isFasting
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {meal.isFasting ? <Check size={18} /> : <Utensils size={16} />}
          </button>
        </div>
      </motion.div>

      {/* Manual input panel */}
      <AnimatePresence>
        {showManual && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-muted/40 rounded-b-2xl -mt-2 pt-5 flex items-center gap-2">
              <input
                type="text"
                placeholder="食物名称"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="千卡"
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                className="w-20 h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleManualSubmit}
                className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                添加
              </button>
              <button
                onClick={() => setShowManual(false)}
                className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealCard;
