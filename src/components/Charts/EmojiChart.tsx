'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { EmojiStats } from '@/types/chat';
import { CHART_COLORS } from '@/lib/constants';

interface EmojiChartProps {
  emojiStats: EmojiStats;
}

const EmojiChart = ({ emojiStats }: EmojiChartProps) => {
  const [viewMode, setViewMode] = useState<'bar' | 'pie'>('bar');
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  
  // Prepare data for the chart
  const chartData = emojiStats.mostUsedEmojis.slice(0, 10).map((item, index) => ({
    name: item.emoji,
    value: item.count,
    fill: CHART_COLORS.primary[index % CHART_COLORS.primary.length]
  }));
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl mb-1">{payload[0].payload.name}</div>
          <p className="text-indigo-600 dark:text-indigo-400">
            {payload[0].value} kez kullanıldı
          </p>
        </motion.div>
      );
    }
    return null;
  };
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          En Çok Kullanılan Emojiler
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Görünüm:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md">
            <button
              onClick={() => setViewMode('bar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'bar'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setViewMode('pie')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'pie'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Pasta
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'bar' ? (
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fill: '#6b7280' }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#6b7280', fontSize: 18 }} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                name="Kullanım Sayısı"
                onMouseEnter={(data) => setHoveredEmoji(data.name)}
                onMouseLeave={() => setHoveredEmoji(null)}
              >
                {chartData.map((entry, index) => (
                  <motion.rect
                    key={`cell-${index}`}
                    fill={entry.fill}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    style={{
                      transformOrigin: 'left'
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                dataKey="value"
                nameKey="name"
                onMouseEnter={(data) => setHoveredEmoji(data.name)}
                onMouseLeave={() => setHoveredEmoji(null)}
              >
                {chartData.map((entry, index) => (
                  <motion.g key={`cell-${index}`}>
                    <Cell 
                      fill={entry.fill} 
                      stroke={hoveredEmoji === entry.name ? '#fff' : 'none'}
                      strokeWidth={hoveredEmoji === entry.name ? 2 : 0}
                    />
                  </motion.g>
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <motion.div 
        className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {emojiStats.mostUsedEmojis.slice(0, 10).map((item, index) => (
          <motion.div 
            key={index}
            className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md transition-all hover:shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-2xl mb-1">{item.emoji}</span>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {item.count} kez
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default EmojiChart;