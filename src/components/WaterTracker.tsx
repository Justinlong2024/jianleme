import { WaterRecord } from '@/types';
import { Droplets, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface WaterTrackerProps {
  records: WaterRecord[];
  totalWater: number;
  targetWater?: number;
  onAddWater: (amount: number) => void;
}

const quickAmounts = [200, 300, 500];

const WaterTracker = ({ records, totalWater, targetWater = 2000, onAddWater }: WaterTrackerProps) => {
  const percentage = Math.min(100, (totalWater / targetWater) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="wabi-card"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-info" />
          <span className="font-semibold text-foreground">饮水</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {totalWater} / {targetWater} ml
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: 'hsl(var(--info))' }}
        />
      </div>

      {/* Quick add buttons */}
      <div className="flex gap-2">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onAddWater(amount)}
            className="flex-1 h-9 rounded-xl bg-muted text-muted-foreground text-sm font-medium 
                       hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1"
          >
            <Plus size={14} />
            {amount}ml
          </button>
        ))}
      </div>

      {/* Recent records */}
      {records.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {records.slice(-4).map((r) => (
            <span key={r.id} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {r.timestamp} · {r.amount}ml
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WaterTracker;
