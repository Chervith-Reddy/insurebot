import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { AnalyticsData } from '../types';

interface AnalyticsChartProps {
  data: AnalyticsData;
}

const TYPE_COLORS: Record<string, string> = {
  accident: '#f97316',
  health: '#10b981',
  property: '#8b5cf6',
  vehicle: '#f59e0b',
  unknown: '#6b7280',
};

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  'Under Review': '#3b82f6',
  Approved: '#10b981',
  Rejected: '#ef4444',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '10px 14px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>{label}</p>
        {payload.map((item, index) => (
          <p key={index} style={{ color: item.color, fontSize: 13 }}>
            {item.name}: <strong>{item.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  const claimsByTypeFormatted = data.claimsByType.map((item) => ({
    ...item,
    type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    fill: TYPE_COLORS[item.type] || '#6b7280',
  }));

  const monthlyTrendsFormatted = (data.monthlyTrends || []).map((item) => ({
    ...item,
    label: `${MONTH_NAMES[item.month - 1]} ${item.year}`,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <p className="section-title" style={{ marginBottom: 20 }}>
            📊 Claims by Type
          </p>
          {data.claimsByType.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <p>No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={claimsByTypeFormatted} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Claims" radius={[6, 6, 0, 0]}>
                  {claimsByTypeFormatted.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <p className="section-title" style={{ marginBottom: 20 }}>
            🎯 Claims by Status
          </p>
          {data.claimsByStatus.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <p>No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.claimsByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  nameKey="status"
                  label={({ status, percent }) =>
                    `${status}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {data.claimsByStatus.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={STATUS_COLORS[entry.status] || '#6b7280'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {monthlyTrendsFormatted.length > 0 && (
        <div className="card">
          <p className="section-title" style={{ marginBottom: 20 }}>
            📈 Monthly Claims Trend (Last 6 Months)
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrendsFormatted} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Claims"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 5, fill: '#3b82f6' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
