import { useState, useEffect, useRef, useCallback } from 'react';
import { MeditationRecord, MEDITATION_LABELS } from '@/types';
import { Brain, Timer, Play, Square, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MeditationCardProps {
  records: MeditationRecord[];
  totalMinutes: number;
  onAddRecord?: (record: Omit<MeditationRecord, 'id'>) => void;
}

type MeditationType = 'meditation' | 'sitting' | 'dongyin' | 'jingyin';

const MeditationCard = ({ records, totalMinutes, onAddRecord }: MeditationCardProps) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [selectedType, setSelectedType] = useState<MeditationType>('meditation');
  const [showTypeSelect, setShowTypeSelect] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isTimerActive && !isPaused) {
      intervalRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isTimerActive, isPaused]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setShowTypeSelect(true);
  };

  const handleConfirmStart = (type: MeditationType) => {
    setSelectedType(type);
    setShowTypeSelect(false);
    setElapsed(0);
    setIsTimerActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => setIsPaused(p => !p);

  const handleStop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const duration = Math.max(1, Math.round(elapsed / 60));
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    onAddRecord?.({
      timestamp,
      duration,
      type: selectedType,
      mood: 'calm',
    });
    setIsTimerActive(false);
    setIsPaused(false);
    setElapsed(0);
  }, [elapsed, selectedType, onAddRecord]);

  const types: { key: MeditationType; label: string }[] = [
    { key: 'meditation', label: '冥想' },
    { key: 'sitting', label: '打坐' },
    { key: 'dongyin', label: '动引' },
    { key: 'jingyin', label: '静引' },
  ];

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

      {/* Timer UI */}
      <AnimatePresence mode="wait">
        {isTimerActive && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center py-6 mb-3"
          >
            <div className="text-xs text-muted-foreground mb-2">
              {MEDITATION_LABELS[selectedType]}中
            </div>
            <div className="text-4xl font-mono font-bold text-foreground tracking-wider">
              {formatTime(elapsed)}
            </div>
            <div className="flex gap-4 mt-5">
              <button
                onClick={handlePauseResume}
                className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-accent transition-colors"
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>
              <button
                onClick={handleStop}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Square size={18} />
              </button>
            </div>
            {isPaused && (
              <div className="text-xs text-muted-foreground mt-2">已暂停</div>
            )}
          </motion.div>
        )}

        {showTypeSelect && !isTimerActive && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="grid grid-cols-4 gap-2 mb-3"
          >
            {types.map(t => (
              <button
                key={t.key}
                onClick={() => handleConfirmStart(t.key)}
                className="py-2.5 rounded-xl bg-muted text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Records */}
      {records.length > 0 && (
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
      )}

      {/* Start button when no timer active and not selecting */}
      {!isTimerActive && !showTypeSelect && (
        <button
          onClick={handleStart}
          className="w-full h-12 rounded-xl border-2 border-dashed border-border text-muted-foreground text-sm hover:border-primary hover:text-primary transition-all"
        >
          + 开始冥想
        </button>
      )}
    </motion.div>
  );
};

export default MeditationCard;
