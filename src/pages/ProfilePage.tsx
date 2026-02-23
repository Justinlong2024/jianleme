import { motion } from 'framer-motion';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Crown } from 'lucide-react';

const menuItems = [
  { icon: Crown, label: '订阅管理', subtitle: '高级会员' },
  { icon: Bell, label: '提醒设置', subtitle: '已开启' },
  { icon: Shield, label: '隐私设置', subtitle: '' },
  { icon: HelpCircle, label: '帮助与反馈', subtitle: '' },
  { icon: Settings, label: '应用设置', subtitle: '' },
];

const ProfilePage = () => {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      {/* Avatar & Info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="wabi-card flex items-center gap-4 mb-5"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={28} className="text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-foreground">用户</h2>
          <p className="text-xs text-muted-foreground">辟谷第 7 天 · 连续打卡 7 天</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              高级会员
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="wabi-card grid grid-cols-3 gap-4 text-center mb-5"
      >
        <div>
          <div className="text-xl font-bold text-foreground">45</div>
          <div className="text-[10px] text-muted-foreground">总打卡</div>
        </div>
        <div>
          <div className="text-xl font-bold text-foreground">7</div>
          <div className="text-[10px] text-muted-foreground">连续天数</div>
        </div>
        <div>
          <div className="text-xl font-bold text-primary">Lv.3</div>
          <div className="text-[10px] text-muted-foreground">生命树</div>
        </div>
      </motion.div>

      {/* Menu */}
      <div className="wabi-card !p-0 overflow-hidden">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
            >
              <Icon size={18} className="text-muted-foreground" />
              <span className="flex-1 text-sm text-foreground text-left">{item.label}</span>
              {item.subtitle && (
                <span className="text-xs text-muted-foreground">{item.subtitle}</span>
              )}
              <ChevronRight size={16} className="text-muted-foreground" />
            </motion.button>
          );
        })}
      </div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full mt-5 wabi-card flex items-center justify-center gap-2 text-destructive hover:bg-destructive/5 transition-colors"
      >
        <LogOut size={16} />
        <span className="text-sm font-medium">退出登录</span>
      </motion.button>

      <p className="text-center text-[10px] text-muted-foreground mt-6">
        辟了么 v1.0.0 · 用简约守护健康
      </p>
    </div>
  );
};

export default ProfilePage;
