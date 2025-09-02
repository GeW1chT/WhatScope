'use client';

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Zaman İçinde Aktivite
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
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
          Zaman İçinde Aktivite
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Zaman Birimi:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md">
            <button
              onClick={() => setTimeUnit('hour')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeUnit === 'hour'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Saat
            </button>
            <button
              onClick={() => setTimeUnit('day')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeUnit === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Gün
            </button>
            <button
              onClick={() => setTimeUnit('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeUnit === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Ay
            </button>
            <button
              onClick={() => setTimeUnit('date')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeUnit === 'date'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Tarih
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {timeUnit === 'date' && chartData.length > 0 ? (
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280' }}
                interval={timeUnit === 'date' && chartData.length > 15 ? Math.floor(chartData.length / 10) : 0}
              />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="Mesaj" 
                stroke="#4f46e5" 
                fill="#818cf8" 
                fillOpacity={0.3}
                animationDuration={300}
              />
            </AreaChart>
          ) : chartData.length > 0 ? (
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="Mesaj" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2, fill: '#fff' }}
                animationDuration={300}
              />
            </LineChart>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                Seçilen zaman birimi için veri bulunamadı.
              </p>
            </div>
          )}
        </ResponsiveContainer>
      </div>
      
      <motion.div 
        className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-all hover:shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Aktif Saat</p>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {analysis.timeStats.mostActiveHour !== undefined ? `${analysis.timeStats.mostActiveHour}:00` : 'Veri yok'}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-all hover:shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Aktif Gün</p>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {analysis.timeStats.mostActiveDay !== undefined ? DAYS_TR[analysis.timeStats.mostActiveDay] || `Gün ${analysis.timeStats.mostActiveDay}` : 'Veri yok'}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-all hover:shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Aktif Tarih</p>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {analysis.timeStats.mostActiveDate ? format(new Date(analysis.timeStats.mostActiveDate), 'd MMMM yyyy', { locale: tr }) : 'Veri yok'}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-all hover:shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Konuşma Süresi</p>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {analysis.dateRange ? Math.round((analysis.dateRange.end.getTime() - analysis.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) : 0} gün
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TimelineChart;