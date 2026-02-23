import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface PrivacySettingsPageProps {
  onBack: () => void;
}

const PrivacySettingsPage = ({ onBack }: PrivacySettingsPageProps) => {
  const [settings, setSettings] = useState({
    shareProgress: false,
    showProfile: true,
    dataCollection: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const items = [
    { key: 'shareProgress' as const, label: '分享进度', desc: '允许好友查看你的辟谷进度' },
    { key: 'showProfile' as const, label: '公开个人资料', desc: '在社区中展示头像和昵称' },
    { key: 'dataCollection' as const, label: '数据收集', desc: '帮助改善产品体验' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> 返回
      </button>
      <h1 className="text-xl font-bold text-foreground mb-5">隐私设置</h1>

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

export default PrivacySettingsPage;
