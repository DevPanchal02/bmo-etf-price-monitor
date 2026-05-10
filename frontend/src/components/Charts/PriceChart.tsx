import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush
} from 'recharts';
import type { TimeSeriesDataPoint } from '../../types';
import styles from './Charts.module.css';

interface ReconstructedPriceChartProps {
  data: TimeSeriesDataPoint[];
}

export function ReconstructedPriceChart({ data }: ReconstructedPriceChartProps) {
  // truncate decimals for the Y-Axis labels to keep the right rail clean
  const formatYAxis = (value: number) => value.toFixed(0);

  // strip the year for the main X-Axis to prevent overlapping labels
  const formatXAxis = (dateString: string) => {
    const parts = dateString.split('-');
    return parts.length === 3 ? `${parts[1]}-${parts[2]}` : dateString;
  };

  // calculate the starting window for the zoomer
  // defaulting to the last 30 data points provides a readable 1month view
  const defaultStartIndex = useMemo(() => {
    return Math.max(0, data.length - 30);
  }, [data.length]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipDate}>{payload[0].payload.date}</p>
          <div className={styles.tooltipValue}>
            <span className={styles.label}>VAL:</span>
            <span className={styles.val}>
              {Number(payload[0].value).toFixed(4)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        
        <h3 className={styles.title}>PRICE HISTORY</h3>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            // balanced margins to prevent the left-edge flush and right-edge dead zone
            margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="1 4" 
              stroke="var(--border-color)" 
              vertical={true} 
              horizontal={true}
            />
            <XAxis
              dataKey="date"
              stroke="var(--text-muted)"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-color)' }}
              dy={10}
              minTickGap={40}
              tickFormatter={formatXAxis}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              domain={['auto', 'auto']}
              orientation="right"
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'var(--border-active)', strokeWidth: 1 }} 
            />
            <Line
              type="linear"
              dataKey="reconstructedPrice"
              stroke="var(--bmo-blue)"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: "var(--bmo-blue)", stroke: 'var(--bg-app)', strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Brush
              dataKey="date"
              height={25}
              stroke="var(--border-active)"
              fill="var(--bg-panel)"
              travellerWidth={12}
              startIndex={defaultStartIndex}
              // display full YYYY-MM-DD on the brush bounds so users know their exact selection
              tickFormatter={(val) => val} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}