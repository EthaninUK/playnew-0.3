'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatsChartProps {
  data: Array<{
    month: string;
    users: number;
    strategies: number;
    revenue: number;
  }>;
}

export function StatsChart({ data }: StatsChartProps) {
  return (
    <div className="space-y-8">
      {/* 用户和策略增长曲线 */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              yAxisId="left"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: '用户数', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: '策略数', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="users"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={3}
              name="用户数"
              dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="strategies"
              stroke="hsl(271, 91%, 65%)"
              strokeWidth={3}
              name="策略数"
              dot={{ fill: 'hsl(271, 91%, 65%)', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 收益柱状图 */}
      <div className="h-[250px] border-t pt-6">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground">月度收益趋势 (¥)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number) => [`¥${value.toLocaleString()}`, '收益']}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(142, 76%, 36%)"
              radius={[8, 8, 0, 0]}
              name="收益"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
