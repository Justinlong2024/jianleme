import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, FileText, Mail } from 'lucide-react';

interface HelpFeedbackPageProps {
  onBack: () => void;
}

const HelpFeedbackPage = ({ onBack }: HelpFeedbackPageProps) => {
  const items = [
    { icon: FileText, label: '常见问题', desc: '查看常见问题解答' },
    { icon: MessageCircle, label: '意见反馈', desc: '告诉我们你的想法' },
    { icon: Mail, label: '联系我们', desc: 'support@jianleme.com' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> 返回
      </button>
      <h1 className="text-xl font-bold text-foreground mb-5">帮助与反馈</h1>

      <div className="wabi-card !p-0 overflow-hidden">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 text-left"
            >
              <Icon size={18} className="text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default HelpFeedbackPage;
