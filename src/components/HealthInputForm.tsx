import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Activity, TrendingUp, Droplet, Heart, Lock, CalendarDays } from 'lucide-react';
import { HealthRecord } from '@/types';
import { toast } from '@/hooks/use-toast';

interface HealthInputFormProps {
  onSave: (record: Omit<HealthRecord, 'id'>) => void;
  isPremium?: boolean;
}

const getLocalDateStr = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const fields = [
  { key: 'weight', label: '体重', unit: 'kg', icon: Activity, placeholder: '如 72.5', min: 20, max: 300, step: 0.1 },
  { key: 'bodyFat', label: '体脂率', unit: '%', icon: TrendingUp, placeholder: '如 18.5', min: 1, max: 60, step: 0.1 },
  { key: 'waistCircumference', label: '腰围', unit: 'cm', icon: Activity, placeholder: '如 80.0', min: 30, max: 200, step: 0.1 },
  { key: 'bloodSugar', label: '空腹血糖', unit: 'mmol/L', icon: Droplet, placeholder: '如 5.2', min: 1, max: 30, step: 0.1 },
  { key: 'bloodPressureSystolic', label: '高压', unit: 'mmHg', icon: Heart, placeholder: '如 120', min: 50, max: 250, step: 1 },
  { key: 'bloodPressureDiastolic', label: '低压', unit: 'mmHg', icon: Heart, placeholder: '如 80', min: 30, max: 150, step: 1 },
] as const;

const HealthInputForm = ({ onSave, isPremium = false }: HealthInputFormProps) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState(getLocalDateStr());

  const handleChange = (key: string, val: string) => {
    if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = () => {
    const hasValue = Object.values(values).some((v) => v.trim() !== '');
    if (!hasValue) {
      toast({ title: '请至少填写一项数据', variant: 'destructive' });
      return;
    }

    for (const field of fields) {
      const raw = values[field.key]?.trim();
      if (raw) {
        const num = parseFloat(raw);
        if (isNaN(num) || num < field.min || num > field.max) {
          toast({
            title: `${field.label}数值异常`,
            description: `请输入 ${field.min}–${field.max} ${field.unit} 之间的值`,
            variant: 'destructive',
          });
          return;
        }
      }
    }

    const record: Omit<HealthRecord, 'id'> = {
      date: selectedDate,
      ...(values.weight ? { weight: parseFloat(values.weight) } : {}),
      ...(values.bodyFat ? { bodyFat: parseFloat(values.bodyFat) } : {}),
      ...(values.bloodSugar ? { bloodSugar: parseFloat(values.bloodSugar) } : {}),
      ...(values.bloodPressureSystolic ? { bloodPressureSystolic: parseFloat(values.bloodPressureSystolic) } : {}),
      ...(values.bloodPressureDiastolic ? { bloodPressureDiastolic: parseFloat(values.bloodPressureDiastolic) } : {}),
    };

    onSave(record);
    setValues({});
    setSelectedDate(getLocalDateStr());
    setOpen(false);

    const isToday = selectedDate === getLocalDateStr();
    toast({
      title: '数据已记录 ✨',
      description: isToday ? '健康数据已保存到今日记录' : `已保存 ${selectedDate} 的健康数据`,
    });
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="w-full wabi-card flex items-center justify-center gap-2 text-primary font-medium text-sm"
      >
        <Plus size={18} />
        记录健康数据
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl mb-[calc(env(safe-area-inset-bottom,0px)+5rem)] sm:mb-0 max-h-[calc(100dvh-6rem-env(safe-area-inset-bottom,0px))] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-bold text-foreground">记录健康数据</h2>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {/* Date picker */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarDays size={16} className="text-primary" />
                  </div>
                  <label className="text-sm text-foreground w-16 shrink-0">日期</label>
                  <input
                    type="date"
                    value={selectedDate}
                    max={getLocalDateStr()}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1 h-10 rounded-xl bg-muted px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                {fields.map((field) => {
                  const Icon = field.icon;
                  const isLocked = !isPremium && (field.key === 'bloodSugar' || field.key === 'bloodPressureSystolic' || field.key === 'bloodPressureDiastolic');
                  return (
                    <div key={field.key} className={`flex items-center gap-3 ${isLocked ? 'opacity-50' : ''}`}>
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        {isLocked ? <Lock size={16} className="text-muted-foreground" /> : <Icon size={16} className="text-primary" />}
                      </div>
                      <label className="text-sm text-foreground w-16 shrink-0">{field.label}</label>
                      <div className="flex-1 relative">
                        {isLocked ? (
                          <div className="w-full h-10 rounded-xl bg-muted px-3 text-sm text-muted-foreground/50 flex items-center">
                            会员专属
                          </div>
                        ) : (
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder={field.placeholder}
                            value={values[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            maxLength={10}
                            className="w-full h-10 rounded-xl bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                          />
                        )}
                        {!isLocked && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            {field.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                <p className="text-[10px] text-muted-foreground px-1">
                  血压请分别填写收缩压（高压）和舒张压（低压）
                </p>
              </div>

              <div className="sticky bottom-0 bg-card p-5 pt-3 border-t border-border flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                >
                  保存记录
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthInputForm;
