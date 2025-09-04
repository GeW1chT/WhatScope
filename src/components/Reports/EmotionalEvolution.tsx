'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChatAnalysis } from '@/types/chat';
import { SENTIMENT_LABELS_TR } from '@/lib/constants';
import { motion } from 'framer-motion';

interface EmotionalEvolutionProps {
  analysis: ChatAnalysis;
}

// Define the chart data type
interface EvolutionDataItem {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  displayDate: string;
  totalMessages: number;
}

const EmotionalEvolution = ({ analysis }: EmotionalEvolutionProps) => {
  const [timeSpan, setTimeSpan] = useState<'all' | 'year' | 'month'>('all');
  
  if (!analysis.sentimentAnalysis) {
    return (
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Duygusal Evrim Analizi
          </h3>
        </div>
        <p className="text-white/70">
          Duygusal analiz verisi bulunamadı.
        </p>
      </motion.div>
    );
  }
  
  const { sentimentAnalysis } = analysis;
  
  // Prepare evolution data grouped by date
  const sentimentByDate = sentimentAnalysis.sentimentByDate;
  
  // Convert to array and sort by date
  let evolutionData: EvolutionDataItem[] = Object.entries(sentimentByDate).map(([date, data]) => {
    // Count sentiments for this date
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    // Since we have one sentiment per date in sentimentByDate, 
    // we'll distribute the sentiment based on the score
    if (data.sentiment === 'positive') {
      positive = 1;
    } else if (data.sentiment === 'negative') {
      negative = 1;
    } else {
      neutral = 1;
    }
    
    return {
      date,
      positive: data.sentiment === 'positive' ? 1 : 0,
      negative: data.sentiment === 'negative' ? 1 : 0,
      neutral: data.sentiment === 'neutral' ? 1 : 0,
      displayDate: format(new Date(date), 'd MMM', { locale: tr }),
      totalMessages: 1
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group by week or month for better visualization
  const groupedData: Record<string, EvolutionDataItem> = {};
  
  evolutionData.forEach(item => {
    let key: string;
    
    if (timeSpan === 'month') {
      // Group by month
      const date = new Date(item.date);
      key = `${date.getFullYear()}-${date.getMonth()}`;
    } else if (timeSpan === 'year') {
      // Group by year
      const date = new Date(item.date);
      key = `${date.getFullYear()}`;
    } else {
      // Group by week
      const date = new Date(item.date);
      const year = date.getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((date.getDay() + 1 + days) / 7);
      key = `${year}-W${week}`;
    }
    
    if (!groupedData[key]) {
      groupedData[key] = {
        date: item.date,
        positive: 0,
        negative: 0,
        neutral: 0,
        displayDate: timeSpan === 'month' 
          ? format(new Date(item.date), 'MMM yyyy', { locale: tr }) 
          : timeSpan === 'year' 
            ? format(new Date(item.date), 'yyyy', { locale: tr })
            : `W${key.split('-W')[1]} ${format(new Date(item.date), 'yyyy', { locale: tr })}`,
        totalMessages: 0
      };
    }
    
    groupedData[key].positive += item.positive;
    groupedData[key].negative += item.negative;
    groupedData[key].neutral += item.neutral;
    groupedData[key].totalMessages += item.totalMessages;
  });
  
  // Convert grouped data back to array
  evolutionData = Object.values(groupedData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Filter data based on selected time span
  if (timeSpan !== 'all') {
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeSpan === 'month') {
      cutoffDate.setMonth(now.getMonth() - 12); // Last 12 months
    } else if (timeSpan === 'year') {
      cutoffDate.setFullYear(now.getFullYear() - 5); // Last 5 years
    }
    
    evolutionData = evolutionData.filter(item => new Date(item.date) >= cutoffDate);
  }
  
  // Calculate percentages for better visualization
  const percentageData = evolutionData.map(item => ({
    ...item,
    positive: item.totalMessages > 0 ? (item.positive / item.totalMessages) * 100 : 0,
    negative: item.totalMessages > 0 ? (item.negative / item.totalMessages) * 100 : 0,
    neutral: item.totalMessages > 0 ? (item.neutral / item.totalMessages) * 100 : 0
  }));
  
  return (
    <div className="space-y-8">
      {/* Main Header */}
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Duygusal Evrim Analizi
          </h3>
        </div>
        
        {/* Time Span Selector */}
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl font-bold text-white">
            Duygusal Değişim Grafiği
          </h4>
          
          <div className="flex backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-1">
            <motion.button
              onClick={() => setTimeSpan('all')}
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                timeSpan === 'all'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tümü
            </motion.button>
            <motion.button
              onClick={() => setTimeSpan('year')}
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                timeSpan === 'year'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Yıllık
            </motion.button>
            <motion.button
              onClick={() => setTimeSpan('month')}
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                timeSpan === 'month'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Aylık
            </motion.button>
          </div>
        </div>
        
        {/* Chart Container */}
        <motion.div 
          className="h-80 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {percentageData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={percentageData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
                  labelFormatter={(label) => `Tarih: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="positive" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Pozitif"
                />
                <Area 
                  type="monotone" 
                  dataKey="neutral" 
                  stackId="1" 
                  stroke="#9CA3AF" 
                  fill="#9CA3AF" 
                  fillOpacity={0.6}
                  name="Nötr"
                />
                <Area 
                  type="monotone" 
                  dataKey="negative" 
                  stackId="1" 
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.6}
                  name="Negatif"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/70">
                Yeterli veri bulunamadı.
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-2xl p-6"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-green-300 font-medium mb-2">En Pozitif Dönem</p>
            <p className="text-lg font-bold text-white">
              {sentimentAnalysis.happiest.date 
                ? format(new Date(sentimentAnalysis.happiest.date), 'd MMMM yyyy', { locale: tr }) 
                : 'Veri yok'}
            </p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-red-500/10 to-rose-600/10 border border-red-400/20 rounded-2xl p-6"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-red-300 font-medium mb-2">En Negatif Dönem</p>
            <p className="text-lg font-bold text-white">
              {sentimentAnalysis.saddest.date 
                ? format(new Date(sentimentAnalysis.saddest.date), 'd MMMM yyyy', { locale: tr }) 
                : 'Veri yok'}
            </p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-400/20 rounded-2xl p-6"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-blue-300 font-medium mb-2">En Yoğun Dönem</p>
            <p className="text-lg font-bold text-white">
              {analysis.timeStats.mostActiveDate 
                ? format(new Date(analysis.timeStats.mostActiveDate), 'd MMMM yyyy', { locale: tr }) 
                : 'Veri yok'}
            </p>
          </motion.div>
        </div>
        
        {/* Info Box */}
        <motion.div 
          className="mt-8 backdrop-blur-sm bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-400/20 rounded-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h4 className="font-bold text-indigo-300 mb-2">
            Duygusal Yolculuğunuz
          </h4>
          <p className="text-white/80 text-sm">
            Bu grafik, zaman içindeki duygusal değişimlerinizi gösterir. 
            Pozitif duygular yeşil, nötr duygular gri, negatif duygular kırmızı ile gösterilmiştir.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmotionalEvolution;