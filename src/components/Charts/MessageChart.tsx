'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { MessageStats } from '@/types/chat';
import { CHART_COLORS } from '@/lib/constants';

interface MessageChartProps {
  messageStats: MessageStats[];
}

const MessageChart = ({ messageStats }: MessageChartProps) => {
  const [sortBy, setSortBy] = useState<'name' | 'count'>('count');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  
  // Sort message stats based on selected sort option
  const sortedStats = [...messageStats].sort((a, b) => {
    if (sortBy === 'name') {
      return a.sender.localeCompare(b.sender);
    } else {
      return b.count - a.count;
    }
  });
  
  // Format data for the chart
  const chartData = sortedStats.map((stat, index) => ({
    name: stat.sender,
    Mesaj: stat.count,
    fill: CHART_COLORS.primary[index % CHART_COLORS.primary.length],
    averageLength: stat.averageLength
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
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-indigo-600 dark:text-indigo-400">
            {payload[0].value} mesaj
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ortalama {payload[0].payload.averageLength.toFixed(1)} karakter
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
          Kişi Bazında Mesaj Sayıları
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Sırala:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md">
            <button
              onClick={() => setSortBy('count')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortBy === 'count'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Mesaj Sayısı
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortBy === 'name'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              İsim
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="Mesaj" 
              name="Mesaj Sayısı"
              onMouseEnter={(data) => setHoveredBar(data.name)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {chartData.map((entry, index) => (
                <motion.rect
                  key={`rect-${index}`}
                  fill={entry.fill}
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    transformOrigin: 'bottom'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <motion.div 
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {sortedStats.map((stat, index) => (
          <motion.div 
            key={stat.sender}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-all hover:shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: CHART_COLORS.primary[index % CHART_COLORS.primary.length] }}
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{stat.sender}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {stat.count} mesaj
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                (Ort. {stat.averageLength.toFixed(1)} karakter)
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MessageChart;