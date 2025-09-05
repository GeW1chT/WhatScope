'use client';

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ChatAnalysis } from '@/types/chat';
import { DAYS_TR, MONTHS_TR } from '@/lib/constants';

interface TimelineChartProps {
  analysis: ChatAnalysis;
}

const TimelineChart = ({ analysis }: TimelineChartProps) => {
  const [timeUnit, setTimeUnit] = useState<'hour' | 'day' | 'month' | 'date'>('date');
  const [hoveredData, setHoveredData] = useState<any>(null);
  const [brushStartIndex, setBrushStartIndex] = useState<number | undefined>(undefined);
  const [brushEndIndex, setBrushEndIndex] = useState<number | undefined>(undefined);
  const [zoomDomain, setZoomDomain] = useState<[number, number] | undefined>(undefined);
  
  // Define the chart data type
  interface ChartDataItem {
    name: string;
    Mesaj: number;
    fullDate?: string;
  }
  
  // Safety check for analysis data
  if (!analysis || !analysis.timeStats) {
    return (
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Zaman İçinde Aktivite
          </h3>
        </div>
        <p className="text-white/70">
          Zaman istatistikleri verisi bulunamadı.
        </p>
      </motion.div>
    );
  }
  
  // Prepare data based on selected time unit
  let chartData: ChartDataItem[] = [];
  
  if (timeUnit === 'hour') {
    chartData = Object.entries(analysis.timeStats.byHour || {}).map(([hour, count]) => ({
      name: `${hour}:00`,
      Mesaj: count
    })).sort((a, b) => parseInt(a.name) - parseInt(b.name));
  } else if (timeUnit === 'day') {
    chartData = Object.entries(analysis.timeStats.byDay || {}).map(([day, count]) => ({
      name: DAYS_TR[parseInt(day)] || `Gün ${day}`,
      Mesaj: count
    }));
    // Reorder to start with Monday (1 = Monday in Date.getDay())
    if (chartData.length >= 7) {
      // Move Sunday (0) to the end if it exists
      const sundayIndex = chartData.findIndex(item => item.name === DAYS_TR[0]);
      if (sundayIndex !== -1) {
        const sunday = chartData.splice(sundayIndex, 1)[0];
        chartData.push(sunday);
      }
    }
  } else if (timeUnit === 'month') {
    chartData = Object.entries(analysis.timeStats.byMonth || {}).map(([month, count]) => ({
      name: MONTHS_TR[parseInt(month)] || `Ay ${month}`,
      Mesaj: count
    }));
  } else if (timeUnit === 'date') {
    // Group dates by week or month if there are too many
    const dateEntries = Object.entries(analysis.timeStats.byDate || {});
    
    if (dateEntries.length > 30) {
      // If too many dates, group by month
      const byMonth: Record<string, number> = {};
      
      dateEntries.forEach(([dateStr, count]) => {
        try {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            const monthKey = format(date, 'MMM yyyy', { locale: tr });
            byMonth[monthKey] = (byMonth[monthKey] || 0) + count;
          }
        } catch (e) {
          console.warn('Invalid date string:', dateStr);
        }
      });
      
      chartData = Object.entries(byMonth).map(([month, count]) => ({
        name: month,
        Mesaj: count
      }));
    } else {
      // Use dates directly
      chartData = dateEntries.map(([dateStr, count]) => {
        try {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            return {
              name: format(date, 'd MMM', { locale: tr }),
              fullDate: dateStr,
              Mesaj: count
            };
          }
        } catch (e) {
          console.warn('Invalid date string:', dateStr);
        }
        return {
          name: dateStr,
          fullDate: dateStr,
          Mesaj: count
        };
      }).sort((a, b) => {
        // Safely sort by date
        const dateA = new Date(a.fullDate);
        const dateB = new Date(b.fullDate);
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return 0;
        }
        return dateA.getTime() - dateB.getTime();
      });
    }
  }
  
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
          className="backdrop-blur-md bg-black/80 p-4 rounded-xl shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-medium text-white">{label}</p>
          <p className="text-blue-300">
            {payload[0].value} mesaj
          </p>
          {payload[0].payload.fullDate && (
            <p className="text-sm text-white/60">
              {payload[0].payload.fullDate}
            </p>
          )}
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
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Zaman İçinde Aktivite
          </h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-white/70">Zaman Birimi:</span>
          <div className="flex backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-1">
            <button
              onClick={() => setTimeUnit('hour')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                timeUnit === 'hour'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Saat
            </button>
            <button
              onClick={() => setTimeUnit('day')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                timeUnit === 'day'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Gün
            </button>
            <button
              onClick={() => setTimeUnit('month')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                timeUnit === 'month'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Ay
            </button>
            <button
              onClick={() => setTimeUnit('date')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                timeUnit === 'date'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Tarih
            </button>
          </div>
        </div>
        
        {/* Zoom Controls */}
        {zoomDomain && (
          <motion.div 
            className="flex items-center justify-between gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-white/70">
              Yakınlaştırılmış görünüm: {brushStartIndex !== undefined && brushEndIndex !== undefined 
                ? `${brushStartIndex + 1}-${brushEndIndex + 1} / ${chartData.length}` 
                : ''}
            </div>
            <button
              onClick={resetZoom}
              className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all duration-300"
            >
              Yakınlaştırmayı Sıfırla
            </button>
          </motion.div>
        )}
      </div>
      
      <div className="h-96 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          {timeUnit === 'date' && chartData.length > 0 ? (
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                interval={timeUnit === 'date' && chartData.length > 15 ? Math.floor(chartData.length / 10) : 0}
              />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="Mesaj" 
                stroke="#60a5fa" 
                fill="url(#colorGradient)" 
                fillOpacity={0.6}
                animationDuration={800}
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              {chartData.length > 10 && (
                <Brush 
                  dataKey="name"
                  height={30}
                  stroke="#60a5fa"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  onChange={handleBrushChange}
                  startIndex={brushStartIndex}
                  endIndex={brushEndIndex}
                />
              )}
            </AreaChart>
          ) : chartData.length > 0 ? (
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="Mesaj" 
                stroke="#60a5fa" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#60a5fa', strokeWidth: 2, stroke: '#ffffff' }} 
                activeDot={{ r: 8, stroke: '#60a5fa', strokeWidth: 3, fill: '#ffffff' }}
                animationDuration={800}
              />
              {chartData.length > 10 && (
                <Brush 
                  dataKey="name"
                  height={30}
                  stroke="#60a5fa"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  onChange={handleBrushChange}
                  startIndex={brushStartIndex}
                  endIndex={brushEndIndex}
                />
              )}
            </LineChart>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/70 text-lg">
                Seçilen zaman birimi için veri bulunamadı.
              </p>
            </div>
          )}
        </ResponsiveContainer>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-400/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-blue-300 font-medium">En Aktif Saat</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {analysis.timeStats.mostActiveHour !== undefined ? `${analysis.timeStats.mostActiveHour}:00` : 'Veri yok'}
          </p>
        </motion.div>

        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-green-300 font-medium">En Aktif Gün</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {analysis.timeStats.mostActiveDay !== undefined ? DAYS_TR[analysis.timeStats.mostActiveDay] || `Gün ${analysis.timeStats.mostActiveDay}` : 'Veri yok'}
          </p>
        </motion.div>

        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-purple-300 font-medium">En Aktif Tarih</p>
          </div>
          <p className="text-xl font-bold text-white">
            {analysis.timeStats.mostActiveDate ? format(new Date(analysis.timeStats.mostActiveDate), 'd MMM yyyy', { locale: tr }) : 'Veri yok'}
          </p>
        </motion.div>

        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-400/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-sm text-orange-300 font-medium">Konuşma Süresi</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {analysis.dateRange ? Math.round((analysis.dateRange.end.getTime() - analysis.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) : 0} gün
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TimelineChart;