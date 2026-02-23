import { motion } from 'framer-motion';
import { Crown, Check, ArrowLeft } from 'lucide-react';

interface SubscriptionPageProps {
  onBack: () => void;
}

const SubscriptionPage = ({ onBack }: SubscriptionPageProps) => {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> 返回
      </button>
      <h1 className="text-xl font-bold text-foreground mb-5">订阅管理</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="wabi-card mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Crown size={20} className="text-primary" />
          <span className="font-semibold text-foreground">当前方案：高级会员</span>
        </div>
        <p className="text-sm text-muted-foreground">有效期至 2026-12-31</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="wabi-card">
        <h3 className="font-semibold text-foreground mb-3">会员权益</h3>
        <div className="space-y-2">
          {['无限食物AI识别', '高级数据报告', '视频一键编辑', '云端数据同步'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check size={14} className="text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionPage;
