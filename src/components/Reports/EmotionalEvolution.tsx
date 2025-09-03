'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChatAnalysis } from '@/types/chat';
import { SENTIMENT_LABELS_TR } from '@/lib/constants';

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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Duygusal Evrim Analizi
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Duygusal analiz verisi bulunamadı.
        </p>
      </div>
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Duygusal Evrim Analizi
      </h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            Duygusal Değişim Grafiği
          </h4>
          
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md">
            <button
              onClick={() => setTimeSpan('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeSpan === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setTimeSpan('year')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeSpan === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Yıllık
            </button>
            <button
              onClick={() => setTimeSpan('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeSpan === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Aylık
            </button>
          </div>
        </div>
        
        <div className="h-80">
          {percentageData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={percentageData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
                  labelFormatter={(label) => `Tarih: ${label}`}
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
              <p className="text-gray-500 dark:text-gray-400">
                Yeterli veri bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Pozitif Dönem</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300 mt-1">
            {sentimentAnalysis.happiest.date 
              ? format(new Date(sentimentAnalysis.happiest.date), 'd MMMM yyyy', { locale: tr }) 
              : 'Veri yok'}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Negatif Dönem</p>
          <p className="text-lg font-bold text-red-700 dark:text-red-300 mt-1">
            {sentimentAnalysis.saddest.date 
              ? format(new Date(sentimentAnalysis.saddest.date), 'd MMMM yyyy', { locale: tr }) 
              : 'Veri yok'}
          </p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Yoğun Dönem</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-1">
            {analysis.timeStats.mostActiveDate 
              ? format(new Date(analysis.timeStats.mostActiveDate), 'd MMMM yyyy', { locale: tr }) 
              : 'Veri yok'}
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">
          Duygusal Yolculuğunuz
        </h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Bu grafik, zaman içindeki duygusal değişimlerinizi gösterir. 
          Pozitif duygular yeşil, nötr duygular gri, negatif duygular kırmızı ile gösterilmiştir.
        </p>
      </div>
    </div>
  );
};

export default EmotionalEvolution;