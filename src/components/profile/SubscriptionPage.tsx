import { motion } from 'framer-motion';
import { Crown, Check, ArrowLeft, Lock } from 'lucide-react';

interface SubscriptionPageProps {
  onBack: () => void;
  isPremium?: boolean;
}

const SubscriptionPage = ({ onBack, isPremium }: SubscriptionPageProps) => {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> 返回
      </button>
      <h1 className="text-xl font-bold text-foreground mb-5">订阅管理</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="wabi-card mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Crown size={20} className={isPremium ? 'text-primary' : 'text-muted-foreground'} />
          <span className="font-semibold text-foreground">
            当前方案：{isPremium ? '高级会员' : '免费用户'}
          </span>
        </div>
        {isPremium ? (
          <p className="text-sm text-muted-foreground">感谢您的支持！享受全部功能</p>
        ) : (
          <p className="text-sm text-muted-foreground">升级会员享受完整功能</p>
        )}
      </motion.div>

      {/* Pricing card */}
      {!isPremium && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="wabi-card mb-4 border-2 border-primary/20">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-primary">¥6.9</div>
            <div className="text-sm text-muted-foreground">/月</div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
            onClick={() => {
              // TODO: 接入微信/支付宝支付
              alert('支付功能即将上线，敬请期待！');
            }}
          >
            立即开通
          </motion.button>
          <p className="text-[10px] text-muted-foreground text-center mt-2">支持微信支付 / 支付宝</p>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="wabi-card">
        <h3 className="font-semibold text-foreground mb-3">会员权益</h3>
        <div className="space-y-2">
          {[
            { text: '断食 / 饮水 / 冥想记录', free: true },
            { text: '体重 / 体脂记录', free: true },
            { text: '血糖 / 血压记录', free: false },
            { text: '全部课程解锁', free: false },
            { text: 'AI食物识别', free: false },
            { text: '高级数据报告', free: false },
            { text: '云端数据同步', free: false },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm">
              {item.free ? (
                <Check size={14} className="text-primary" />
              ) : isPremium ? (
                <Check size={14} className="text-primary" />
              ) : (
                <Lock size={14} className="text-muted-foreground" />
              )}
              <span className={item.free || isPremium ? 'text-foreground' : 'text-muted-foreground'}>
                {item.text}
              </span>
              {item.free && <span className="text-[10px] text-muted-foreground ml-auto">免费</span>}
              {!item.free && !isPremium && <span className="text-[10px] text-primary ml-auto">会员</span>}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionPage;
