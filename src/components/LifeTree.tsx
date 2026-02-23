import { motion } from 'framer-motion';
import { TreePine } from 'lucide-react';

interface LifeTreeProps {
  level: number;
  points: number;
  nextLevelPoints: number;
}

const LifeTree = ({ level, points, nextLevelPoints }: LifeTreeProps) => {
  const progress = (points / nextLevelPoints) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-1"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <TreePine size={24} className="text-primary" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {level}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-foreground">生命树 Lv.{level}</div>
        <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">
          {points} / {nextLevelPoints} 积分
        </div>
      </div>
    </motion.div>
  );
};

export default LifeTree;
