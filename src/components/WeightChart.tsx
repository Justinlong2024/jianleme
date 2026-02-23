import { HealthRecord } from '@/types';
import { TrendingDown, Scale } from 'lucide-react';
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

const WeightChart = ({ data }: WeightChartProps) => {
  const latest = data[data.length - 1];
  const first = data[0];
  const change = latest && first ? (latest.weight! - first.weight!).toFixed(1) : '0';

  const chartData = data.slice(-14).map((d) => ({
    date: d.date.slice(5), // MM-DD
    体重: d.weight,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="wabi-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-primary" />
          <span className="font-semibold text-foreground">体重趋势</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <TrendingDown size={14} className="text-success" />
          <span className="text-success font-medium">{change} kg</span>
        </div>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div>
          <div className="text-3xl font-bold text-foreground font-serif">
            {latest?.weight}
          </div>
          <div className="text-xs text-muted-foreground">kg · 当前</div>
        </div>
        {latest?.bodyFat && (
          <div>
            <div className="text-lg font-semibold text-muted-foreground">
              {latest.bodyFat}%
            </div>
            <div className="text-xs text-muted-foreground">体脂率</div>
          </div>
        )}
      </div>

      <div className="h-36 -mx-2">
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
            <Line
              type="monotone"
              dataKey="体重"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default WeightChart;
