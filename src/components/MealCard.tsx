import { MealCheckIn, MEAL_LABELS, MEAL_ICONS } from '@/types';
import { Check, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

interface MealCardProps {
  meal: MealCheckIn;
  onToggleFasting: (mealType: string) => void;
}

const MealCard = ({ meal, onToggleFasting }: MealCardProps) => {
  const icon = MEAL_ICONS[meal.mealType];
  const label = MEAL_LABELS[meal.mealType];
  const totalCalories = meal.foodItems?.reduce((sum, f) => sum + f.calories, 0) || 0;

  return (
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
        {!meal.isFasting && meal.foodItems && (
          <div className="text-xs text-muted-foreground mt-1 truncate">
            {meal.foodItems.map((f) => f.name).join('、')}
          </div>
        )}
      </div>
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
    </motion.div>
  );
};

export default MealCard;
