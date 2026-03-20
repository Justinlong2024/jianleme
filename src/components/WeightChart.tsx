import { useState } from 'react';
import { HealthRecord } from '@/types';
import { TrendingDown, TrendingUp, Scale, Droplet, Heart, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface WeightChartProps {
  data: HealthRecord[];
}

type ChartTab = 'weight' | 'bodyFat' | 'waist' | 'bloodSugar' | 'bloodPressure';

const tabs: { key: ChartTab; label: string; icon: typeof Scale }[] = [
  { key: 'weight', label: '体重', icon: Scale },
  { key: 'bodyFat', label: '体脂', icon: TrendingDown },
  { key: 'waist', label: '腰围', icon: Ruler },
  { key: 'bloodSugar', label: '血糖', icon: Droplet },
  { key: 'bloodPressure', label: '血压', icon: Heart },
];

const WeightChart = ({ data }: WeightChartProps) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('weight');
  const latest = data[data.length - 1];
  const first = data[0];

  const sliced = data.slice(-14);

  const chartData = sliced.map((d) => ({
    date: d.date.slice(5),
    体重: d.weight,
    体脂率: d.bodyFat,
    腰围: d.waistCircumference,
    血糖: d.bloodSugar,
    高压: d.bloodPressureSystolic,
    低压: d.bloodPressureDiastolic,
  }));

  const renderSummary = () => {
    if (activeTab === 'weight') {
      const change = latest?.weight && first?.weight ? (latest.weight - first.weight).toFixed(1) : '0';
      const isDown = parseFloat(change) <= 0;
      return (
        <>
          <div className="flex items-center gap-1 text-sm">
            {isDown ? <TrendingDown size={14} className="text-success" /> : <TrendingUp size={14} className="text-destructive" />}
            <span className={`font-medium ${isDown ? 'text-success' : 'text-destructive'}`}>{change} kg</span>
          </div>
          <div className="flex items-end gap-4 mb-4">
            <div>
              <div className="text-3xl font-bold text-foreground font-serif">{latest?.weight ?? '--'}</div>
              <div className="text-xs text-muted-foreground">kg · 当前</div>
            </div>
            {latest?.bodyFat && (
              <div>
                <div className="text-lg font-semibold text-muted-foreground">{latest.bodyFat}%</div>
                <div className="text-xs text-muted-foreground">体脂率</div>
              </div>
            )}
          </div>
        </>
      );
    }
    if (activeTab === 'bloodSugar') {
      const val = latest?.bloodSugar;
      const isNormal = val ? val <= 6.1 : true;
      return (
        <>
          <div className="flex items-center gap-1 text-sm">
            <span className={`font-medium ${isNormal ? 'text-success' : 'text-destructive'}`}>{isNormal ? '正常' : '偏高'}</span>
          </div>
          <div className="flex items-end gap-4 mb-4">
            <div>
              <div className="text-3xl font-bold text-foreground font-serif">{val ?? '--'}</div>
              <div className="text-xs text-muted-foreground">mmol/L · 当前</div>
            </div>
          </div>
        </>
      );
    }
    // bloodPressure
    const sys = latest?.bloodPressureSystolic;
    const dia = latest?.bloodPressureDiastolic;
    const isNormal = sys ? sys <= 140 : true;
    return (
      <>
        <div className="flex items-center gap-1 text-sm">
          <span className={`font-medium ${isNormal ? 'text-success' : 'text-destructive'}`}>{isNormal ? '正常' : '偏高'}</span>
        </div>
        <div className="flex items-end gap-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-foreground font-serif">{sys && dia ? `${sys}/${dia}` : '--'}</div>
            <div className="text-xs text-muted-foreground">mmHg · 当前</div>
          </div>
        </div>
      </>
    );
  };

  const renderLines = () => {
    if (activeTab === 'weight') {
      return (
        <>
          <Line type="monotone" dataKey="体重" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'hsl(var(--primary))' }} />
          <Line type="monotone" dataKey="体脂率" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
        </>
      );
    }
    if (activeTab === 'bloodSugar') {
      return (
        <Line type="monotone" dataKey="血糖" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'hsl(var(--primary))' }} />
      );
    }
    return (
      <>
        <Line type="monotone" dataKey="收缩压" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'hsl(var(--primary))' }} />
        <Line type="monotone" dataKey="舒张压" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="wabi-card"
    >
      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-4 p-0.5 rounded-lg bg-muted/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 flex-1 justify-center py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-foreground">
          {activeTab === 'weight' ? '体重趋势' : activeTab === 'bloodSugar' ? '血糖趋势' : '血压趋势'}
        </span>
        {renderSummary()}
      </div>

      {/* Chart */}
      <div className="h-48 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            {renderLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default WeightChart;
