'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ChatAnalysis } from '@/types/chat';
import { CHART_COLORS, SENTIMENT_LABELS_TR } from '@/lib/constants';
import { motion } from 'framer-motion';

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
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">💭</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Duygusal Analiz
          </h3>
        </div>
        <p className="text-white/70">
          Duygusal analiz verisi bulunamadı.
        </p>
      </motion.div>
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
  
  // Prepare chart data with displayDate included
  let chartData: ChartDataItem[] = Object.entries(sentimentAnalysis.sentimentByDate).map(([date, data]) => ({
    date,
    value: data.score,
    sentiment: data.sentiment,
    displayDate: format(new Date(date), 'd MMM', { locale: tr })
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
  
  // Prepare emotional categories data for chart
  const emotionalCategoriesData = Object.entries(sentimentAnalysis.emotionalCategories)
    .map(([category, count]) => ({
      name: category,
      value: count
    }))
    .sort((a, b) => b.value - a.value);
  
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
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">💭</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Duygusal Analiz
          </h3>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-400/20 rounded-2xl p-6"
            whileHover={{ scale: 1.02, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-xl">🎭</span>
                </div>
                <div>
                  <p className="text-blue-300 text-sm font-medium">Genel Duygusal Ton</p>
                  <div className="flex items-center mt-1">
                    <motion.div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: sentimentColor }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                    <p className="text-2xl font-black text-white">
                      {SENTIMENT_LABELS_TR[overallSentiment]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full relative overflow-hidden"
                style={{ width: `${Math.abs(sentimentAnalysis.overallScore) * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.abs(sentimentAnalysis.overallScore) * 100}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-2xl p-6"
            whileHover={{ scale: 1.02, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-xl">😊</span>
              </div>
              <div>
                <p className="text-green-300 text-sm font-medium">En Mutlu Gün</p>
                <p className="text-xl font-bold text-white mt-1">
                  {sentimentAnalysis.happiest.date ? format(new Date(sentimentAnalysis.happiest.date), 'd MMMM yyyy', { locale: tr }) : 'Veri yok'}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-red-500/10 to-rose-600/10 border border-red-400/20 rounded-2xl p-6"
            whileHover={{ scale: 1.02, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-rose-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-xl">😔</span>
              </div>
              <div>
                <p className="text-red-300 text-sm font-medium">En Üzgün Gün</p>
                <p className="text-xl font-bold text-white mt-1">
                  {sentimentAnalysis.saddest.date ? format(new Date(sentimentAnalysis.saddest.date), 'd MMMM yyyy', { locale: tr }) : 'Veri yok'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Sentiment Chart Section */}
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">📈</span>
            </div>
            <h4 className="text-2xl font-bold text-white">
              Duygusal Ton Değişimi
            </h4>
          </div>
          
          <div className="flex backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-1">
            <motion.button
              onClick={() => setTimeSpan('all')}
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                timeSpan === 'all'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tümü
            </motion.button>
            <motion.button
              onClick={() => setTimeSpan('month')}
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                timeSpan === 'month'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Son Ay
            </motion.button>
            <motion.button
              onClick={() => setTimeSpan('week')}
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                timeSpan === 'week'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Son Hafta
            </motion.button>
          </div>
        </div>
        
        <motion.div 
          className="h-80 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  interval={chartData.length > 15 ? Math.floor(chartData.length / 10) : 0}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
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
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="url(#gradient)" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#06b6d4', strokeWidth: 2, stroke: '#ffffff' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/70">
                Seçilen zaman aralığında veri bulunamadı.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Emotional Categories Chart */}
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-3">
            <span className="text-xl">🎨</span>
          </div>
          <h4 className="text-2xl font-bold text-white">
            Duygusal Kategoriler
          </h4>
        </div>
        
        <motion.div 
          className="h-80 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {emotionalCategoriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={emotionalCategoriesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <Tooltip
                  formatter={(value) => [value, 'Mesaj Sayısı']}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
                <Bar dataKey="value" name="Mesaj Sayısı" radius={[4, 4, 0, 0]}>
                  {emotionalCategoriesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#barGradient${index})`}
                    />
                  ))}
                </Bar>
                <defs>
                  {emotionalCategoriesData.map((entry, index) => (
                    <linearGradient key={index} id={`barGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={CHART_COLORS.primary[index % CHART_COLORS.primary.length]} />
                      <stop offset="100%" stopColor={CHART_COLORS.primary[index % CHART_COLORS.primary.length] + '80'} />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/70">
                Duygusal kategori verisi bulunamadı.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">👥</span>
            </div>
            <h4 className="text-2xl font-bold text-white">
              Kişilerin Duygusal Tonu
            </h4>
          </div>
          
          <div className="space-y-4">
            {Object.entries(sentimentAnalysis.sentimentByUser).map(([user, data], index) => {
              const userSentimentColor = CHART_COLORS.sentiment[data.sentiment];
              
              return (
                <motion.div 
                  key={user} 
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-white">{user}</span>
                    <div className="flex items-center">
                      <motion.div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: userSentimentColor }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 * index }}
                      />
                      <span className="text-sm font-medium text-white/90">
                        {SENTIMENT_LABELS_TR[data.sentiment]}
                      </span>
                      {data.dominantEmotion && (
                        <span className="text-xs ml-2 px-2 py-1 bg-white/10 rounded-lg text-white/70">
                          {data.dominantEmotion}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        
        <motion.div 
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">📊</span>
            </div>
            <h4 className="text-2xl font-bold text-white">
              Duygusal Analiz Özeti
            </h4>
          </div>
          
          <div className="space-y-4">
            <motion.p 
              className="text-white/80 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Bu sohbetin genel tonu <span className="font-bold text-white px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">{SENTIMENT_LABELS_TR[overallSentiment]}</span>.
              {overallSentiment === 'positive' && (
                ' Konuşmalarınız genel olarak pozitif ve olumlu bir havaya sahip.'
              )}
              {overallSentiment === 'negative' && (
                ' Konuşmalarınız genel olarak negatif veya eleştirel bir ton taşıyor.'
              )}
              {overallSentiment === 'neutral' && (
                ' Konuşmalarınız genel olarak dengeli ve nötr bir ton taşıyor.'
              )}
            </motion.p>
            
            <motion.p 
              className="text-white/80 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              En mutlu gününüz <span className="font-medium text-green-300">{sentimentAnalysis.happiest.date ? format(new Date(sentimentAnalysis.happiest.date), 'd MMMM yyyy', { locale: tr }) : 'Veri yok'}</span>,
              en üzgün gününüz ise <span className="font-medium text-red-300">{sentimentAnalysis.saddest.date ? format(new Date(sentimentAnalysis.saddest.date), 'd MMMM yyyy', { locale: tr }) : 'Veri yok'}</span>.
            </motion.p>
            
            <motion.p 
              className="text-white/80 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              En baskın duygu ise <span className="font-medium text-purple-300">{sentimentAnalysis.dominantEmotion || 'Veri yok'}</span>.
            </motion.p>
            
            {Object.entries(sentimentAnalysis.sentimentByUser).some(([_, data]) => data.sentiment === 'positive') && (
              <motion.p 
                className="text-white/80 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <span className="font-medium text-yellow-300">
                  {Object.entries(sentimentAnalysis.sentimentByUser)
                    .filter(([_, data]) => data.sentiment === 'positive')
                    .map(([user]) => user)
                    .join(' ve ')}
                </span> genellikle daha pozitif mesajlar gönderiyor.
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Most Intense Messages */}
      {sentimentAnalysis.mostIntenseMessages.length > 0 && (
        <motion.div 
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">🔥</span>
            </div>
            <h4 className="text-2xl font-bold text-white">
              En Yoğun Duygusal Mesajlar
            </h4>
          </div>
          
          <div className="space-y-4">
            {sentimentAnalysis.mostIntenseMessages.map((msg, index) => {
              // Safely access message content with error handling
              const message = analysis.messages[msg.messageId];
              const messageContent = message ? message.content : 'Mesaj bulunamadı';
              const sender = message ? message.sender : 'Bilinmeyen';
              const timestamp = message ? message.timestamp : new Date();
              
              return (
                <motion.div 
                  key={index} 
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-lg font-medium text-white">
                      {sender}
                    </span>
                    <span className="text-sm text-white/60">
                      {format(new Date(timestamp), 'HH:mm', { locale: tr })}
                    </span>
                  </div>
                  <p className="text-white/80 mb-4 leading-relaxed">
                    {messageContent.substring(0, 100)}
                    {messageContent.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex items-center space-x-3">
                    <motion.span 
                      className="text-xs px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 text-orange-200 font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 * index }}
                    >
                      Yoğunluk: {Math.round(msg.intensity * 100)}%
                    </motion.span>
                    {msg.emotionalCategory && (
                      <motion.span 
                        className="text-xs px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 text-purple-200 font-medium"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 * index + 0.1 }}
                      >
                        {msg.emotionalCategory}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SentimentAnalysis;