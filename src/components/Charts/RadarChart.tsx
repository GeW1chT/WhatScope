'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  width?: number;
  height?: number;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  title?: string;
  description?: string;
}

const RadarChart = ({ 
  data, 
  width = 400, 
  height = 400, 
  colors = ['#3B82F6', '#8B5CF6', '#06B6D4'],
  showLegend = true,
  showTooltip = true,
  title,
  description
}: RadarChartProps) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Group data by subject and create radar chart format
    const subjects = [...new Set(data.map(d => d.subject))];
    
    return subjects.map(subject => {
      const item = data.find(d => d.subject === subject);
      return {
        subject: subject,
        value: item?.value || 0,
        fullMark: item?.fullMark || 100
      };
    });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <motion.div 
        className="flex items-center justify-center h-full backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-white/70 font-medium">Radar grafik verisi bulunamadı</p>
        </div>
      </motion.div>
    );
  }

  // Enhanced custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const maxValue = Math.max(...payload.map((p: any) => p.value));
      const avgValue = payload.reduce((sum: number, p: any) => sum + p.value, 0) / payload.length;
      
      return (
        <motion.div 
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 min-w-[200px]"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-2" />
            <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          </div>
          
          <div className="space-y-2 mb-3">
            {payload.map((entry: any, index: number) => {
              const percentage = maxValue > 0 ? (entry.value / maxValue) * 100 : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 shadow-sm" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {entry.dataKey}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {entry.value}
                    </span>
                    <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: entry.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Ortalama: {avgValue.toFixed(1)}</span>
              <span>En yüksek: {maxValue}</span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomPolarAngleAxis = ({ payload, x, y, cx, cy, ...props }: any) => {
    return (
      <text 
        {...props} 
        x={x} 
        y={y} 
        className="fill-white/80 text-sm font-medium"
        textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
        dominantBaseline={y > cy ? 'start' : y < cy ? 'end' : 'middle'}
      >
        {payload.value}
      </text>
    );
  };

  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {(title || description) && (
        <div className="mb-4 text-center">
          {title && (
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-white/70">{description}</p>
          )}
        </div>
      )}
      
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsRadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid 
              stroke="rgba(255,255,255,0.2)" 
              strokeDasharray="2 2"
            />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={CustomPolarAngleAxis}
              className="text-white/80"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 'dataMax']} 
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              tickCount={5}
            />
            
            <Radar
              name="Değer"
              dataKey="value"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
            />
            
            {showTooltip && (
              <Tooltip content={<CustomTooltip />} />
            )}
            
            {showLegend && (
              <Legend 
                wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
                iconType="circle"
              />
            )}
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="text-white/50">Ortalama</div>
          <div className="text-white font-semibold">
            {chartData.length > 0 
              ? (chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length).toFixed(1)
              : '0'
            }
          </div>
        </div>
        <div className="text-center">
          <div className="text-white/50">En Yüksek</div>
          <div className="text-white font-semibold">
            {chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : '0'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-white/50">En Düşük</div>
          <div className="text-white font-semibold">
            {chartData.length > 0 ? Math.min(...chartData.map(d => d.value)) : '0'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-white/50">Kategori</div>
          <div className="text-white font-semibold">
            {chartData.length}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RadarChart;