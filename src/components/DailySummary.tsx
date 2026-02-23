import { motion } from 'framer-motion';
import { Flame, Droplets, Timer, TreePine } from 'lucide-react';

interface DailySummaryProps {
  fastingHours: number;
  totalCalories: number;
  totalWater: number;
  meditationMinutes: number;
  streakDays: number;
}

const DailySummary = ({
  fastingHours,
  totalCalories,
  totalWater,
  meditationMinutes,
  streakDays,
}: DailySummaryProps) => {
  const stats = [
    { icon: Flame, label: '断食', value: `${fastingHours}h`, color: 'text-warning' },
    { icon: Droplets, label: '饮水', value: `${totalWater}ml`, color: 'text-info' },
    { icon: Timer, label: '冥想', value: `${meditationMinutes}min`, color: 'text-secondary' },
    { icon: TreePine, label: '连续', value: `${streakDays}天`, color: 'text-primary' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-4 gap-2"
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="wabi-card flex flex-col items-center gap-1 !p-3"
          >
            <Icon size={18} className={stat.color} />
            <div className="text-sm font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground">{stat.label}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DailySummary;
