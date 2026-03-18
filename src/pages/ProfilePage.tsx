import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Crown, GraduationCap } from 'lucide-react';
import SubscriptionPage from '@/components/profile/SubscriptionPage';
import NotificationSettingsPage from '@/components/profile/NotificationSettingsPage';
import PrivacySettingsPage from '@/components/profile/PrivacySettingsPage';
import HelpFeedbackPage from '@/components/profile/HelpFeedbackPage';
import AppSettingsPage from '@/components/profile/AppSettingsPage';
import LifeTreeProfileCard from '@/components/profile/LifeTreeProfileCard';
import AdminCoursePage from '@/pages/AdminCoursePage';

interface LifeTreeData {
  level: number;
  levelLabel: string;
  totalPoints: number;
  pointsInLevel: number;
  pointsNeeded: number;
  isMaxLevel: boolean;
  growthHistory: { day: string; points: number }[];
}

interface ProfilePageProps {
  lifeTree?: LifeTreeData;
  isAdmin?: boolean;
  isPremium?: boolean;
  onSignOut?: () => void;
  userEmail?: string;
  displayName?: string;
  totalCheckIns?: number;
  streakDays?: number;
}

type SubPage = 'main' | 'subscription' | 'notifications' | 'privacy' | 'help' | 'settings' | 'admin-courses';

const menuItems: { icon: typeof Crown; label: string; subtitle: string; page: SubPage }[] = [
  { icon: Crown, label: '订阅管理', subtitle: '高级会员', page: 'subscription' },
  { icon: Bell, label: '提醒设置', subtitle: '已开启', page: 'notifications' },
  { icon: Shield, label: '隐私设置', subtitle: '', page: 'privacy' },
  { icon: HelpCircle, label: '帮助与反馈', subtitle: '', page: 'help' },
  { icon: Settings, label: '应用设置', subtitle: '', page: 'settings' },
];

const ProfilePage = ({ lifeTree, isAdmin, isPremium, onSignOut, userEmail, displayName }: ProfilePageProps) => {
  const [subPage, setSubPage] = useState<SubPage>('main');

  if (subPage === 'subscription') return <SubscriptionPage onBack={() => setSubPage('main')} isPremium={isPremium} />;
  if (subPage === 'notifications') return <NotificationSettingsPage onBack={() => setSubPage('main')} />;
  if (subPage === 'privacy') return <PrivacySettingsPage onBack={() => setSubPage('main')} />;
  if (subPage === 'help') return <HelpFeedbackPage onBack={() => setSubPage('main')} />;
  if (subPage === 'settings') return <AppSettingsPage onBack={() => setSubPage('main')} />;
  if (subPage === 'admin-courses') return <AdminCoursePage onBack={() => setSubPage('main')} />;

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
          <h2 className="text-lg font-bold text-foreground">{displayName || '用户'}</h2>
          <p className="text-xs text-muted-foreground">{userEmail || '辟谷第 7 天 · 连续打卡 7 天'}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isPremium ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {isPremium ? '高级会员' : '免费用户'}
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
          <div className="text-xl font-bold text-primary">Lv.{lifeTree?.level ?? 1}</div>
          <div className="text-[10px] text-muted-foreground">生命树</div>
        </div>
      </motion.div>

      {/* Life Tree Detail Card */}
      {lifeTree && (
        <LifeTreeProfileCard
          level={lifeTree.level}
          levelLabel={lifeTree.levelLabel}
          totalPoints={lifeTree.totalPoints}
          pointsInLevel={lifeTree.pointsInLevel}
          pointsNeeded={lifeTree.pointsNeeded}
          isMaxLevel={lifeTree.isMaxLevel}
          growthHistory={lifeTree.growthHistory}
        />
      )}

      {/* Admin menu */}
      {isAdmin && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="wabi-card !p-0 overflow-hidden mb-3">
          <button
            onClick={() => setSubPage('admin-courses')}
            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors"
          >
            <GraduationCap size={18} className="text-primary" />
            <span className="flex-1 text-sm text-foreground text-left font-medium">课程管理</span>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">管理员</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </motion.div>
      )}

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
              onClick={() => setSubPage(item.page)}
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
        onClick={onSignOut}
        className="w-full mt-5 wabi-card flex items-center justify-center gap-2 text-destructive hover:bg-destructive/5 transition-colors"
      >
        <LogOut size={16} />
        <span className="text-sm font-medium">退出登录</span>
      </motion.button>

      <p className="text-center text-[10px] text-muted-foreground mt-6">
        简了么 v1.0.0 · 简法守护健康
      </p>
    </div>
  );
};

export default ProfilePage;
