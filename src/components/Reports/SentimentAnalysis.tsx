'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ChatAnalysis } from '@/types/chat';
import { CHART_COLORS, SENTIMENT_LABELS_TR } from '@/lib/constants';

interface SentimentAnalysisProps {
  analysis: ChatAnalysis;
}

// Define the chart data type
interface ChartDataItem {
  date: string;
  value: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  displayDate: string;
}

const SentimentAnalysis = ({ analysis }: SentimentAnalysisProps) => {
  const [timeSpan, setTimeSpan] = useState<'all' | 'month' | 'week'>('all');
  
  if (!analysis.sentimentAnalysis) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Duygusal Analiz
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Duygusal analiz verisi bulunamadı.
        </p>
      </div>
    );
  }
  
  const { sentimentAnalysis } = analysis;
  
  // Determine sentiment category
  let overallSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (sentimentAnalysis.overallScore > 0.2) {
    overallSentiment = 'positive';
  } else if (sentimentAnalysis.overallScore < -0.2) {
    overallSentiment = 'negative';
  }
  
  // Get sentiment color
  const sentimentColor = CHART_COLORS.sentiment[overallSentiment];
  
  // Prepare chart data
  let chartData: ChartDataItem[] = Object.entries(sentimentAnalysis.sentimentByDate).map(([date, data]) => ({
    date,
    value: data.score,
    sentiment: data.sentiment
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Filter data based on selected time span
  if (timeSpan !== 'all') {
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeSpan === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeSpan === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    }
    
    chartData = chartData.filter(item => new Date(item.date) >= cutoffDate);
  }
  
  // Format dates for display
  chartData = chartData.map(item => ({
    ...item,
    displayDate: format(new Date(item.date), 'd MMM', { locale: tr })
  }));
  
  // Prepare emotional categories data for chart
  const emotionalCategoriesData = Object.entries(sentimentAnalysis.emotionalCategories)
    .map(([category, count]) => ({
      name: category,
      value: count
    }))
    .sort((a, b) => b.value - a.value);
  
  // Prepare most intense messages data
  const intenseMessagesData = sentimentAnalysis.mostIntenseMessages
    .map((msg, index) => {
      // Safely access message content with error handling
      const message = analysis.messages[msg.messageId];
      const content = message ? message.content : 'Mesaj bulunamadı';
      const sender = message ? message.sender : 'Bilinmeyen';
      const timestamp = message ? message.timestamp : new Date();
      
      return {
        id: index, // Add unique id for React keys
        content: msg.emotionalCategory ? `${msg.emotionalCategory}: ${content.substring(0, 50)}...` : content.substring(0, 50) + '...',
        intensity: msg.intensity * Math.abs(msg.score),
        sentiment: msg.sentiment,
        sender,
        timestamp
      };
    })
    .sort((a, b) => b.intensity - a.intensity);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Duygusal Analiz
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Genel Duygusal Ton</p>
          <div className="flex items-center mt-1">
            <div 
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: sentimentColor }}
            ></div>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {SENTIMENT_LABELS_TR[overallSentiment]}
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Mutlu Gün</p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {sentimentAnalysis.happiest.date ? format(new Date(sentimentAnalysis.happiest.date), 'd MMMM yyyy', { locale: tr }) : 'Veri yok'}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Üzgün Gün</p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {sentimentAnalysis.saddest.date ? format(new Date(sentimentAnalysis.saddest.date), 'd MMMM yyyy', { locale: tr }) : 'Veri yok'}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            Duygusal Ton Değişimi
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
              onClick={() => setTimeSpan('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeSpan === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Son Ay
            </button>
            <button
              onClick={() => setTimeSpan('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeSpan === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Son Hafta
            </button>
          </div>
        </div>
        
        <div className="h-60">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fill: '#6b7280' }}
                  interval={chartData.length > 15 ? Math.floor(chartData.length / 10) : 0}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  domain={[-1, 1]}
                  ticks={[-1, -0.5, 0, 0.5, 1]}
                  tickFormatter={(value) => {
                    if (value === -1) return 'Çok Negatif';
                    if (value === -0.5) return 'Negatif';
                    if (value === 0) return 'Nötr';
                    if (value === 0.5) return 'Pozitif';
                    if (value === 1) return 'Çok Pozitif';
                    return '';
                  }}
                />
                <Tooltip
                  formatter={(value: number) => {
                    let sentiment = 'Nötr';
                    if (value > 0.5) sentiment = 'Çok Pozitif';
                    else if (value > 0.2) sentiment = 'Pozitif';
                    else if (value < -0.5) sentiment = 'Çok Negatif';
                    else if (value < -0.2) sentiment = 'Negatif';
                    return [sentiment, 'Duygusal Ton'];
                  }}
                  labelFormatter={(label) => {
                    const item = chartData.find(d => d.displayDate === label);
                    if (item) {
                      return format(new Date(item.date), 'd MMMM yyyy', { locale: tr });
                    }
                    return label;
                  }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ 
                    r: 4,
                    fill: (entry) => {
                      const sentiment = entry.sentiment;
                      return CHART_COLORS.sentiment[sentiment];
                    }
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                Seçilen zaman aralığında veri bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Emotional Categories Chart */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
          Duygusal Kategoriler
        </h4>
        
        <div className="h-60">
          {emotionalCategoriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={emotionalCategoriesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  formatter={(value) => [value, 'Mesaj Sayısı']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Bar dataKey="value" name="Mesaj Sayısı">
                  {emotionalCategoriesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                Duygusal kategori verisi bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
            Kişilerin Duygusal Tonu
          </h4>
          
          <div className="space-y-3">
            {Object.entries(sentimentAnalysis.sentimentByUser).map(([user, data]) => {
              const userSentimentColor = CHART_COLORS.sentiment[data.sentiment];
              
              return (
                <div key={user} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{user}</span>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: userSentimentColor }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {SENTIMENT_LABELS_TR[data.sentiment]}
                    </span>
                    {data.dominantEmotion && (
                      <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                        ({data.dominantEmotion})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
            Duygusal Analiz Özeti
          </h4>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Bu sohbetin genel tonu <span className="font-medium">{SENTIMENT_LABELS_TR[overallSentiment]}</span>.
            {overallSentiment === 'positive' && (
              ' Konuşmalarınız genel olarak pozitif ve olumlu bir havaya sahip.'
            )}
            {overallSentiment === 'negative' && (
              ' Konuşmalarınız genel olarak negatif veya eleştirel bir ton taşıyor.'
            )}
            {overallSentiment === 'neutral' && (
              ' Konuşmalarınız genel olarak dengeli ve nötr bir ton taşıyor.'
            )}
          </p>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            En mutlu gününüz <span className="font-medium">{sentimentAnalysis.happiest.date ? format(new Date(sentimentAnalysis.happiest.date), 'd MMMM yyyy', { locale: tr }) : 'Veri yok'}</span>,
            en üzgün gününüz ise <span className="font-medium">{sentimentAnalysis.saddest.date ? format(new Date(sentimentAnalysis.saddest.date), 'd MMMM yyyy', { locale: tr }) : 'Veri yok'}</span>.
          </p>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            En baskın duygu ise <span className="font-medium">{sentimentAnalysis.dominantEmotion || 'Veri yok'}</span>.
          </p>
          
          {Object.entries(sentimentAnalysis.sentimentByUser).some(([_, data]) => data.sentiment === 'positive') && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              {Object.entries(sentimentAnalysis.sentimentByUser)
                .filter(([_, data]) => data.sentiment === 'positive')
                .map(([user]) => user)
                .join(' ve ')} genellikle daha pozitif mesajlar gönderiyor.
            </p>
          )}
        </div>
      </div>
      
      {/* Most Intense Messages */}
      {sentimentAnalysis.mostIntenseMessages.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
            En Yoğun Duygusal Mesajlar
          </h4>
          
          <div className="space-y-2">
            {sentimentAnalysis.mostIntenseMessages.map((msg, index) => {
              // Safely access message content with error handling
              const message = analysis.messages[msg.messageId];
              const messageContent = message ? message.content : 'Mesaj bulunamadı';
              const sender = message ? message.sender : 'Bilinmeyen';
              const timestamp = message ? message.timestamp : new Date();
              
              return (
                <div key={index} className="border-b border-gray-200 dark:border-gray-600 pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {sender}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(timestamp), 'HH:mm', { locale: tr })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {messageContent.substring(0, 100)}
                    {messageContent.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      Yoğunluk: {Math.round(msg.intensity * 100)}%
                    </span>
                    {msg.emotionalCategory && (
                      <span className="text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ml-2">
                        {msg.emotionalCategory}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;