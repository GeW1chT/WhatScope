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
          className="backdrop-blur-md bg-black/80 p-4 rounded-xl shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-3xl mb-2 text-center">{payload[0].payload.name}</div>
          <p className="text-blue-300 font-medium text-center">
            {payload[0].value} kez kullanıldı
          </p>
        </motion.div>
      );
    }
    return null;
  };
  
  return (
    <motion.div 
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">😊</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">
              En Çok Kullanılan Emojiler
            </h3>
            <p className="text-white/70 mt-1">
              Toplam {emojiStats.totalEmojis} emoji kullanıldı
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-white/70">Görünüm:</span>
          <div className="flex backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-1">
            <button
              onClick={() => setViewMode('bar')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                viewMode === 'bar'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Bar Grafik
            </button>
            <button
              onClick={() => setViewMode('pie')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                viewMode === 'pie'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Pasta Grafik
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-96 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'bar' ? (
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 24 }} 
                width={60} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                name="Kullanım Sayısı"
                onMouseEnter={(data) => setHoveredEmoji(data.name)}
                onMouseLeave={() => setHoveredEmoji(null)}
                radius={[0, 8, 8, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index})`}
                  />
                ))}
              </Bar>
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor={entry.fill} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={entry.fill} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                innerRadius={40}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                dataKey="value"
                nameKey="name"
                onMouseEnter={(data) => setHoveredEmoji(data.name)}
                onMouseLeave={() => setHoveredEmoji(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.fill} 
                    stroke={hoveredEmoji === entry.name ? '#ffffff' : 'transparent'}
                    strokeWidth={hoveredEmoji === entry.name ? 3 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {emojiStats.mostUsedEmojis.slice(0, 10).map((item, index) => (
          <motion.div 
            key={index}
            className="flex flex-col items-center justify-center p-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl transition-all duration-300 hover:scale-110 hover:bg-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <span className="text-3xl mb-2">{item.emoji}</span>
            <span className="text-sm font-medium text-white/90 text-center">
              {item.count} kez
            </span>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
              <motion.div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / emojiStats.mostUsedEmojis[0].count) * 100}%` }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* İstatistik Özeti */}
      <motion.div 
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border border-yellow-400/20 rounded-2xl p-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-lg">📊</span>
            </div>
            <p className="text-sm text-yellow-300 font-medium">Toplam Emoji</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {emojiStats.totalEmojis}
          </p>
        </motion.div>

        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-400/20 rounded-2xl p-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-lg">🏆</span>
            </div>
            <p className="text-sm text-orange-300 font-medium">En Popüler</p>
          </div>
          <div className="flex items-center">
            <span className="text-3xl mr-2">{emojiStats.mostUsedEmojis[0]?.emoji}</span>
            <p className="text-xl font-bold text-white">
              {emojiStats.mostUsedEmojis[0]?.count} kez
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20 rounded-2xl p-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-lg">🎯</span>
            </div>
            <p className="text-sm text-purple-300 font-medium">Çeşitlilik</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {emojiStats.mostUsedEmojis.length}
          </p>
          <p className="text-sm text-white/60 mt-1">Farklı emoji türü</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default EmojiChart;