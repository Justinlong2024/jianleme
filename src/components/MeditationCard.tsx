import { MeditationRecord, MEDITATION_LABELS } from '@/types';
import { Brain, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

interface MeditationCardProps {
  records: MeditationRecord[];
  totalMinutes: number;
}

const MeditationCard = ({ records, totalMinutes }: MeditationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="wabi-card"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-secondary" />
          <span className="font-semibold text-foreground">冥想 · 打坐</span>
        </div>
        <span className="text-sm text-muted-foreground">
          今日 {totalMinutes} 分钟
        </span>
      </div>

      {records.length > 0 ? (
        <div className="space-y-2">
          {records.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 bg-muted rounded-xl px-3 py-2"
            >
              <Timer size={14} className="text-muted-foreground" />
              <div className="flex-1">
                <span className="text-sm text-foreground">
                  {MEDITATION_LABELS[r.type]}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {r.duration}分钟
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{r.timestamp}</span>
            </div>
          ))}
        </div>
      ) : (
        <button className="w-full h-12 rounded-xl border-2 border-dashed border-border text-muted-foreground text-sm hover:border-primary hover:text-primary transition-all">
          + 开始冥想
        </button>
      )}
    </motion.div>
  );
};

export default MeditationCard;
