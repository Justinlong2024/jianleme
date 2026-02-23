import { motion } from 'framer-motion';
import { TreePine, TrendingUp, Sparkles, Target } from 'lucide-react';
import { LEVEL_THRESHOLDS } from '@/lib/lifeTreeSystem';

interface LifeTreeProfileCardProps {
  level: number;
  levelLabel: string;
  totalPoints: number;
  pointsInLevel: number;
  pointsNeeded: number;
  isMaxLevel: boolean;
  // Simulated historical growth data (days ago → points)
  growthHistory: { day: string; points: number }[];
}

const LifeTreeProfileCard = ({
  level,
  levelLabel,
  totalPoints,
  pointsInLevel,
  pointsNeeded,
  isMaxLevel,
  growthHistory,
}: LifeTreeProfileCardProps) => {
  const progress = isMaxLevel ? 100 : (pointsInLevel / pointsNeeded) * 100;
  const nextLevel = LEVEL_THRESHOLDS.find(l => l.level === level + 1);
  const maxPoints = Math.max(...growthHistory.map(g => g.points), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="wabi-card mb-5"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <TreePine size={32} className="text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
            {level}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">{levelLabel}</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              Lv.{level}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isMaxLevel ? '已达最高等级 ✨' : `距下一级还需 ${pointsNeeded - pointsInLevel} 积分`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Lv.{level} {levelLabel}</span>
          <span>{isMaxLevel ? '满级' : `Lv.${level + 1} ${nextLevel?.label || ''}`}</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
          />
        </div>
        <div className="text-[11px] text-muted-foreground mt-1 text-right">
          {pointsInLevel} / {pointsNeeded}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center bg-muted/40 rounded-xl py-2.5">
          <Sparkles size={16} className="text-primary mx-auto mb-1" />
          <div className="text-base font-bold text-foreground">{totalPoints}</div>
          <div className="text-[10px] text-muted-foreground">累计积分</div>
        </div>
        <div className="text-center bg-muted/40 rounded-xl py-2.5">
          <Target size={16} className="text-primary mx-auto mb-1" />
          <div className="text-base font-bold text-foreground">Lv.{level}</div>
          <div className="text-[10px] text-muted-foreground">当前等级</div>
        </div>
        <div className="text-center bg-muted/40 rounded-xl py-2.5">
          <TrendingUp size={16} className="text-primary mx-auto mb-1" />
          <div className="text-base font-bold text-foreground">{growthHistory.length}</div>
          <div className="text-[10px] text-muted-foreground">活跃天数</div>
        </div>
      </div>

      {/* Growth curve */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <TrendingUp size={12} />
          成长曲线
        </h4>
        <div className="h-24 flex items-end gap-[3px]">
          {growthHistory.map((item, i) => {
            const height = (item.points / maxPoints) * 100;
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 4)}%` }}
                transition={{ duration: 0.6, delay: i * 0.03 }}
                className="flex-1 rounded-t-sm bg-primary/60 hover:bg-primary transition-colors relative group"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-1.5 py-0.5 text-[9px] text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
                  {item.day}: +{item.points}
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
          <span>{growthHistory[0]?.day}</span>
          <span>{growthHistory[growthHistory.length - 1]?.day}</span>
        </div>
      </div>

      {/* Level roadmap */}
      <div className="mt-4 pt-3 border-t border-border">
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">等级之路</h4>
        <div className="flex gap-1 items-center">
          {LEVEL_THRESHOLDS.map((t) => (
            <div
              key={t.level}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                t.level <= level ? 'bg-primary' : 'bg-muted'
              }`}
              title={`Lv.${t.level} ${t.label} (${t.required}分)`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
          <span>Lv.1 种子</span>
          <span>Lv.10 永恒之树</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LifeTreeProfileCard;
