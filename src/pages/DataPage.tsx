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

  // bp split into separate high/low metrics below

  const waistChange = latest?.waistCircumference && first?.waistCircumference
    ? (latest.waistCircumference - first.waistCircumference).toFixed(1)
    : null;

  // Primary metrics (体重, 体脂, 腰围) — larger cards
  const primaryMetrics = [
    { label: '体重', value: latest?.weight ? `${latest.weight}` : '--', unit: 'kg', icon: Activity, change: weightChange ? `${parseFloat(weightChange) <= 0 ? '' : '+'}${weightChange}kg` : '暂无', positive: weightChange ? parseFloat(weightChange) <= 0 : true },
    { label: '体脂率', value: latest?.bodyFat ? `${latest.bodyFat}` : '--', unit: '%', icon: TrendingUp, change: fatChange ? `${parseFloat(fatChange) <= 0 ? '' : '+'}${fatChange}%` : '暂无', positive: fatChange ? parseFloat(fatChange) <= 0 : true },
    { label: '腰围', value: latest?.waistCircumference ? `${latest.waistCircumference}` : '--', unit: 'cm', icon: Ruler, change: waistChange ? `${parseFloat(waistChange) <= 0 ? '' : '+'}${waistChange}cm` : '暂无', positive: waistChange ? parseFloat(waistChange) <= 0 : true },
  ];

  // Secondary metrics (血糖, 高压, 低压) — compact row
  const secondaryMetrics = [
    { label: '空腹血糖', value: latest?.bloodSugar ? `${latest.bloodSugar}` : '--', unit: 'mmol/L', icon: Droplet, status: latest?.bloodSugar ? (latest.bloodSugar <= 6.1 ? '正常' : '偏高') : '暂无', positive: latest?.bloodSugar ? latest.bloodSugar <= 6.1 : true },
    { label: '高压', value: latest?.bloodPressureSystolic ? `${latest.bloodPressureSystolic}` : '--', unit: 'mmHg', icon: Heart, status: latest?.bloodPressureSystolic ? (latest.bloodPressureSystolic <= 140 ? '正常' : '偏高') : '暂无', positive: latest?.bloodPressureSystolic ? latest.bloodPressureSystolic <= 140 : true },
    { label: '低压', value: latest?.bloodPressureDiastolic ? `${latest.bloodPressureDiastolic}` : '--', unit: 'mmHg', icon: Heart, status: latest?.bloodPressureDiastolic ? (latest.bloodPressureDiastolic <= 90 ? '正常' : '偏高') : '暂无', positive: latest?.bloodPressureDiastolic ? latest.bloodPressureDiastolic <= 90 : true },
  ];

  return (
    <div ref={ref} className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-foreground font-serif mb-1">健康数据</h1>
      <p className="text-sm text-muted-foreground mb-5">数据不说谎，看见你的改变</p>

      {/* Add record button */}
      <div className="mb-5">
        <HealthInputForm onSave={onAddHealthRecord} />
      </div>

      {/* Primary metrics — 3-col grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        {primaryMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="wabi-card !p-3.5 text-center"
            >
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/8 mb-2">
                <Icon size={15} className="text-primary" />
              </div>
              <div className="text-[11px] text-muted-foreground mb-1">{metric.label}</div>
              <div className="text-xl font-bold text-foreground tabular-nums leading-tight">{metric.value}</div>
              <div className="text-[10px] text-muted-foreground/70 mb-1">{metric.unit}</div>
              <div className={`text-[10px] font-medium ${metric.positive ? 'text-success' : 'text-destructive'}`}>
                {metric.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary metrics — horizontal compact strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="wabi-card !p-0 mb-5 overflow-hidden"
      >
        <div className="grid grid-cols-3 divide-x divide-border">
          {secondaryMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="px-3 py-3.5 text-center">
                <div className="flex items-center justify-center gap-1 mb-1.5">
                  <Icon size={12} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{metric.label}</span>
                </div>
                <div className="text-sm font-bold text-foreground tabular-nums">{metric.value}</div>
                <div className="text-[9px] text-muted-foreground/60">{metric.unit}</div>
                <div className={`text-[10px] mt-0.5 font-medium ${metric.positive ? 'text-success' : 'text-destructive'}`}>
                  {metric.status}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

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
