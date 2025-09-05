'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { motion } from 'framer-motion';
import { MessageStats } from '@/types/chat';
import { CHART_COLORS } from '@/lib/constants';

interface MessageChartProps {
  messageStats: MessageStats[];
}

const MessageChart = ({ messageStats }: MessageChartProps) => {
  const [sortBy, setSortBy] = useState<'name' | 'count'>('count');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [brushStartIndex, setBrushStartIndex] = useState<number | undefined>(undefined);
  const [brushEndIndex, setBrushEndIndex] = useState<number | undefined>(undefined);
  const [zoomDomain, setZoomDomain] = useState<[number, number] | undefined>(undefined);
  
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
  
  // Handle brush change for zoom functionality
  const handleBrushChange = (brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      setBrushStartIndex(brushData.startIndex);
      setBrushEndIndex(brushData.endIndex);
      setZoomDomain([brushData.startIndex, brushData.endIndex]);
    }
  };

  // Reset zoom function
  const resetZoom = () => {
    setBrushStartIndex(undefined);
    setBrushEndIndex(undefined);
    setZoomDomain(undefined);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 border border-white/30 p-4 rounded-2xl shadow-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-bold text-white text-lg">{label}</p>
          <p className="text-cyan-300 font-semibold">
            {payload[0].value.toLocaleString('tr-TR')} mesaj
          </p>
          <p className="text-sm text-white/80">
            Ortalama {payload[0].payload.averageLength.toFixed(1)} karakter
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
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Kişi Bazında Mesaj Sayıları
          </h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-white/70 font-medium">Sırala:</span>
          <div className="flex backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-1">
            <button
              onClick={() => setSortBy('count')}
              className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 font-medium ${
                sortBy === 'count'
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Mesaj Sayısı
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 font-medium ${
                sortBy === 'name'
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              İsim
            </button>
          </div>
        </div>
        
        {/* Zoom Controls */}
        {zoomDomain && (
          <div className="flex items-center justify-between mt-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-sm text-white/80 font-medium">
              Yakınlaştırılmış görünüm: {brushStartIndex !== undefined && brushEndIndex !== undefined 
                ? `${brushStartIndex + 1}-${brushEndIndex + 1} / ${chartData.length}` 
                : ''}
            </div>
            <button
              onClick={resetZoom}
              className="px-3 py-1 text-xs bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
            >
              Yakınlaştırmayı Sıfırla
            </button>
          </div>
        )}
      </div>
      
      <div className="h-96 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" tick={{ fill: '#ffffff', fontSize: 12 }} />
            <YAxis tick={{ fill: '#ffffff', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#ffffff' }} />
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
            {chartData.length > 5 && (
              <Brush 
                dataKey="name"
                height={30}
                stroke="#4f46e5"
                fill="#818cf8"
                fillOpacity={0.1}
                onChange={handleBrushChange}
                startIndex={brushStartIndex}
                endIndex={brushEndIndex}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <motion.div 
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {sortedStats.map((stat, index) => (
          <motion.div 
            key={stat.sender}
            className="group flex items-center justify-between p-4 backdrop-blur-sm bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3 shadow-lg"
                style={{ backgroundColor: CHART_COLORS.primary[index % CHART_COLORS.primary.length] }}
              ></div>
              <span className="text-sm font-semibold text-white">{stat.sender}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">
                {stat.count.toLocaleString('tr-TR')} mesaj
              </div>
              <div className="text-xs text-white/70">
                Ort. {stat.averageLength.toFixed(1)} karakter
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MessageChart;