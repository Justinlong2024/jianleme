import { forwardRef } from 'react';
import { HealthRecord } from '@/types';
import WeightChart from '@/components/WeightChart';
import HealthInputForm from '@/components/HealthInputForm';
import { motion } from 'framer-motion';
import { Activity, Heart, Droplet, TrendingUp, Ruler } from 'lucide-react';

interface DataPageProps {
  weightData: HealthRecord[];
  onAddHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
}

const DataPage = forwardRef<HTMLDivElement, DataPageProps>(({ weightData, onAddHealthRecord }, ref) => {
  const latest = weightData[weightData.length - 1];
  const first = weightData[0];

  const weightChange = latest?.weight && first?.weight
    ? (latest.weight - first.weight).toFixed(1)
    : null;
  const fatChange = latest?.bodyFat && first?.bodyFat
    ? (latest.bodyFat - first.bodyFat).toFixed(1)
    : null;

  const bp = latest?.bloodPressureSystolic && latest?.bloodPressureDiastolic
    ? `${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}`
    : '--/--';

  const waistChange = latest?.waistCircumference && first?.waistCircumference
    ? (latest.waistCircumference - first.waistCircumference).toFixed(1)
    : null;

  const healthMetrics = [
    { label: '体重', value: latest?.weight ? `${latest.weight} kg` : '--', icon: Activity, change: weightChange ? `${parseFloat(weightChange) <= 0 ? '' : '+'}${weightChange}kg` : '暂无', positive: weightChange ? parseFloat(weightChange) <= 0 : true },
    { label: '体脂率', value: latest?.bodyFat ? `${latest.bodyFat}%` : '--', icon: TrendingUp, change: fatChange ? `${parseFloat(fatChange) <= 0 ? '' : '+'}${fatChange}%` : '暂无', positive: fatChange ? parseFloat(fatChange) <= 0 : true },
    { label: '腰围', value: latest?.waistCircumference ? `${latest.waistCircumference} cm` : '--', icon: Ruler, change: waistChange ? `${parseFloat(waistChange) <= 0 ? '' : '+'}${waistChange}cm` : '暂无', positive: waistChange ? parseFloat(waistChange) <= 0 : true },
    { label: '空腹血糖', value: latest?.bloodSugar ? `${latest.bloodSugar} mmol/L` : '--', icon: Droplet, change: latest?.bloodSugar ? (latest.bloodSugar <= 6.1 ? '正常' : '偏高') : '暂无', positive: latest?.bloodSugar ? latest.bloodSugar <= 6.1 : true },
    { label: '高压', value: latest?.bloodPressureSystolic ? `${latest.bloodPressureSystolic} mmHg` : '--', icon: Heart, change: latest?.bloodPressureSystolic ? (latest.bloodPressureSystolic <= 140 ? '正常' : '偏高') : '暂无', positive: latest?.bloodPressureSystolic ? latest.bloodPressureSystolic <= 140 : true },
    { label: '低压', value: latest?.bloodPressureDiastolic ? `${latest.bloodPressureDiastolic} mmHg` : '--', icon: Heart, change: latest?.bloodPressureDiastolic ? (latest.bloodPressureDiastolic <= 90 ? '正常' : '偏高') : '暂无', positive: latest?.bloodPressureDiastolic ? latest.bloodPressureDiastolic <= 90 : true },
  ];

  return (
    <div ref={ref} className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <h1 className="text-xl font-bold text-foreground font-serif mb-1">健康数据</h1>
      <p className="text-sm text-muted-foreground mb-5">数据不说谎，看见你的改变</p>

      {/* Add record button */}
      <div className="mb-5">
        <HealthInputForm onSave={onAddHealthRecord} />
      </div>

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
          {weightChange && parseFloat(weightChange) < 0 ? (
            <p>✦ 您的体重在记录期间下降了 <span className="text-primary font-semibold">{Math.abs(parseFloat(weightChange))}kg</span>，非常棒！</p>
          ) : (
            <p>✦ 坚持记录，看见自己的改变</p>
          )}
          {fatChange && parseFloat(fatChange) < 0 && (
            <p>✦ 体脂率下降了 {Math.abs(parseFloat(fatChange))}%，说明减掉的主要是脂肪</p>
          )}
          <p>✦ 建议继续保持记录习惯，数据会帮你做更好的决策</p>
        </div>
      </motion.div>
    </div>
  );
});

DataPage.displayName = 'DataPage';

export default DataPage;
