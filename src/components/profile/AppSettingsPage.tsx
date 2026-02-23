import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AppSettingsPageProps {
  onBack: () => void;
}

const AppSettingsPage = ({ onBack }: AppSettingsPageProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> 返回
      </button>
      <h1 className="text-xl font-bold text-foreground mb-5">应用设置</h1>

      <div className="wabi-card !p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="text-sm font-medium text-foreground">深色模式</div>
            <div className="text-xs text-muted-foreground mt-0.5">切换应用主题</div>
          </div>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
        <div className="px-5 py-4 border-b border-border">
          <div className="text-sm font-medium text-foreground">语言</div>
          <div className="text-xs text-muted-foreground mt-0.5">简体中文</div>
        </div>
        <div className="px-5 py-4">
          <div className="text-sm font-medium text-foreground">版本</div>
          <div className="text-xs text-muted-foreground mt-0.5">v1.0.0</div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full mt-5 wabi-card text-center text-sm text-destructive hover:bg-destructive/5 transition-colors"
      >
        清除缓存
      </motion.button>
    </div>
  );
};

export default AppSettingsPage;
