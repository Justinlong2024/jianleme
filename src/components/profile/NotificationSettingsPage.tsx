import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface NotificationSettingsPageProps {
  onBack: () => void;
}

const NotificationSettingsPage = ({ onBack }: NotificationSettingsPageProps) => {
  const [settings, setSettings] = useState({
    mealReminder: true,
    waterReminder: true,
    meditationReminder: false,
    weeklyReport: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const items = [
    { key: 'mealReminder' as const, label: '三餐打卡提醒', desc: '每日三餐时间提醒打卡' },
    { key: 'waterReminder' as const, label: '饮水提醒', desc: '每2小时提醒喝水' },
    { key: 'meditationReminder' as const, label: '冥想提醒', desc: '每日固定时间提醒冥想' },
    { key: 'weeklyReport' as const, label: '周报推送', desc: '每周一发送上周健康小结' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> 返回
      </button>
      <h1 className="text-xl font-bold text-foreground mb-5">提醒设置</h1>

      <div className="wabi-card !p-0 overflow-hidden">
        {items.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0"
          >
            <div>
              <div className="text-sm font-medium text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
            </div>
            <Switch checked={settings[item.key]} onCheckedChange={() => toggle(item.key)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
