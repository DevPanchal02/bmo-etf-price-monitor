import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { TopHoldingData } from '../../types';
import styles from './Charts.module.css';

interface TopHoldingsChartProps {
  data: TopHoldingData[];
}

export function TopHoldingsChart({ data }: TopHoldingsChartProps) {
  // format as USD to match the rest of the application
  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    });
  },[]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipDate}>Asset: {payload[0].payload.name}</p>
          <p className={styles.tooltipValue}>
            <span className={styles.label}>Value Size: </span>
            <span className={styles.val}>{currencyFormatter.format(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Top 5 Largest Holdings</h3>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 15, right: 30, left: 10, bottom: 15 }}
          >
            <CartesianGrid 
              strokeDasharray="1 4" 
              stroke="var(--border-color)" 
              horizontal={false} 
            />
            <XAxis
              type="number"
              stroke="var(--text-muted)"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-color)' }}
              tickFormatter={(val) => currencyFormatter.format(val)}
              dy={10}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="var(--text-secondary)"
              fontSize={11}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} 
            />
            <Bar
              dataKey="holdingSize"
              radius={[0, 4, 4, 0]}
              maxBarSize={32}
              isAnimationActive={false}
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--bar-fill)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}