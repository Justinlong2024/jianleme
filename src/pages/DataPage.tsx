import { HealthRecord } from '@/types';
import WeightChart from '@/components/WeightChart';
import { motion } from 'framer-motion';
import { Activity, Heart, Droplet, TrendingUp } from 'lucide-react';

interface DataPageProps {
  weightData: HealthRecord[];
}

const DataPage = ({ weightData }: DataPageProps) => {
  const latest = weightData[weightData.length - 1];

  const healthMetrics = [
    { label: '体重', value: `${latest?.weight} kg`, icon: Activity, change: '-2.5kg', positive: true },
    { label: '体脂率', value: `${latest?.bodyFat}%`, icon: TrendingUp, change: '-1.2%', positive: true },
    { label: '空腹血糖', value: '5.2 mmol/L', icon: Droplet, change: '正常', positive: true },
    { label: '血压', value: '120/80', icon: Heart, change: '正常', positive: true },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <h1 className="text-xl font-bold text-foreground font-serif mb-1">健康数据</h1>
      <p className="text-sm text-muted-foreground mb-5">数据不说谎，看见你的改变</p>

      {/* Health metrics grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {healthMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="wabi-card"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <div className="text-lg font-bold text-foreground">{metric.value}</div>
              <div className={`text-xs mt-1 ${metric.positive ? 'text-success' : 'text-destructive'}`}>
                {metric.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weight chart */}
      <WeightChart data={weightData} />

      {/* Monthly summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="wabi-card mt-4"
      >
        <h3 className="font-semibold text-foreground mb-3">本月小结</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✦ 您的体重在过去一个月下降了 <span className="text-primary font-semibold">2.5kg</span>，非常棒！</p>
          <p>✦ 体脂率下降了 1.2%，说明您减掉的主要是脂肪</p>
          <p>✦ 建议继续保持当前的饮食和运动习惯</p>
        </div>
      </motion.div>
    </div>
  );
};

export default DataPage;
