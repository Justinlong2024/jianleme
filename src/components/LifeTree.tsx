import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine } from 'lucide-react';

interface PointBreakdown {
  label: string;
  points: number;
}

interface LifeTreeProps {
  level: number;
  levelLabel: string;
  points: number;
  nextLevelPoints: number;
  todayPoints: number;
  breakdown: PointBreakdown[];
  isMaxLevel?: boolean;
}

const LifeTree = ({ level, levelLabel, points, nextLevelPoints, todayPoints, breakdown, isMaxLevel }: LifeTreeProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const progress = isMaxLevel ? 100 : (points / nextLevelPoints) * 100;
  // But we receive total points & nextLevelPoints, let's compute inline

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-1 cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <TreePine size={24} className="text-primary" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {level}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">{levelLabel} Lv.{level}</div>
          <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          {todayPoints > 0 && (
            <div className="text-[10px] text-primary mt-0.5 font-medium">
              今日 +{todayPoints}
            </div>
          )}
        </div>
      </motion.div>

      {/* Detail Popup */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-5 w-[85%] max-w-sm shadow-xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <TreePine size={28} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{levelLabel}</h3>
                  <p className="text-sm text-muted-foreground">Lv.{level} · {isMaxLevel ? '已满级' : `${points} / ${nextLevelPoints} 积分`}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>

              {/* Today's breakdown */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">今日积分明细</h4>
                {breakdown.length > 0 ? (
                  <div className="space-y-1.5">
                    {breakdown.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.label}</span>
                        <span className="text-primary font-semibold">+{item.points}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-1.5 flex justify-between text-sm font-bold">
                      <span className="text-foreground">合计</span>
                      <span className="text-primary">+{todayPoints}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">暂无积分，开始今日打卡吧！</p>
                )}
              </div>

              {/* Point rules */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">积分规则</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>🌿 辟谷（全天断食）+30分</p>
                  <p>🍃 轻断食（1-2餐）+15分</p>
                  <p>🧘 冥想 +5分/次 +1分/分钟</p>
                  <p>💧 饮水达标（≥2L）+5分</p>
                  <p>📝 记录饮食 +3分</p>
                  <p>📊 记录健康数据 +5分</p>
                </div>
              </div>

              <button
                onClick={() => setShowDetail(false)}
                className="w-full mt-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium"
              >
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LifeTree;
