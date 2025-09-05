'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChatAnalysis } from '@/types/chat';
import { CHART_COLORS } from '@/lib/constants';
import { motion } from 'framer-motion';
import WordCloudChart from '@/components/Charts/WordCloudChart';
import ActivityHeatmap from '@/components/Charts/ActivityHeatmap';

interface PremiumFeaturesProps {
  analysis: ChatAnalysis;
}

const PremiumFeatures = ({ analysis }: PremiumFeaturesProps) => {
  const [activeTab, setActiveTab] = useState<'wordCloud' | 'activeDays' | 'activityHeatmap' | 'mediaPatterns' | 'topics' | 'customRange'>('wordCloud');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [customAnalysis, setCustomAnalysis] = useState<ChatAnalysis | null>(null);
  const [wordCloudData, setWordCloudData] = useState<Array<{ text: string; value: number }>>([]);
  
  if (!analysis.premiumFeatures) {
    return (
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">💎</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Premium Özellikler
          </h3>
        </div>
        <p className="text-white/70">
          Premium özellikler analizi verisi bulunamadı.
        </p>
      </motion.div>
    );
  }
  
  const { premiumFeatures } = analysis;
  
  // Prepare data for word cloud
  useEffect(() => {
    const words = Object.entries(premiumFeatures.wordFrequency)
      .map(([word, count]) => ({
        text: word,
        value: count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50); // Top 50 words
    
    setWordCloudData(words);
  }, [premiumFeatures.wordFrequency]);
  
  // Prepare data for most active days chart
  const activeDaysData = premiumFeatures.mostActiveDays.map(day => ({
    name: format(new Date(day.date), 'd MMM yyyy', { locale: tr }),
    messageCount: day.messageCount
  }));
  
  // Prepare data for media sharing patterns
  const mediaPatternsData = Object.entries(premiumFeatures.mediaSharingPatterns).map(([user, pattern]) => ({
    name: user,
    dailyAverage: pattern.dailyAverage,
    peakDay: pattern.peakDay,
    peakCount: pattern.peakCount
  }));
  
  // Prepare data for conversation topics
  const topicsData = premiumFeatures.conversationTopics.map(topic => ({
    name: topic.topic,
    frequency: topic.frequency
  }));

  // Prepare data for activity heatmap
  const activityHeatmapData = analysis.messages.map(message => {
    const date = new Date(message.timestamp);
    return {
      date: format(date, 'yyyy-MM-dd'),
      hour: date.getHours(),
      count: 1
    };
  }).reduce((acc, item) => {
    const key = `${item.date}-${item.hour}`;
    if (!acc[key]) {
      acc[key] = { ...item };
    } else {
      acc[key].count += item.count;
    }
    return acc;
  }, {} as Record<string, { date: string; hour: number; count: number }>);

  const heatmapData = Object.values(activityHeatmapData);
  
  // Handle custom date range analysis
  const handleCustomAnalysis = () => {
    if (!customStartDate || !customEndDate) return;
    
    try {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      
      if (startDate > endDate) {
        alert('Başlangıç tarihi bitiş tarihinden sonra olamaz.');
        return;
      }
      
      if (premiumFeatures.customDateRangeAnalysis) {
        const result = premiumFeatures.customDateRangeAnalysis(startDate, endDate);
        setCustomAnalysis(result);
      }
    } catch (error) {
      console.error('Error in custom analysis:', error);
      alert('Geçersiz tarih formatı.');
    }
  };
  
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
            <span className="text-2xl">💎</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Premium Özellikler
          </h3>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/20">
          <button
            onClick={() => setActiveTab('wordCloud')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === 'wordCloud'
                ? 'text-white border-b-2 border-purple-400 bg-purple-500/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Kelime Bulutu
          </button>
          
          <button
            onClick={() => setActiveTab('activeDays')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === 'activeDays'
                ? 'text-white border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            En Aktif Günler
          </button>
          
          <button
            onClick={() => setActiveTab('activityHeatmap')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === 'activityHeatmap'
                ? 'text-white border-b-2 border-cyan-400 bg-cyan-500/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Aktivite Isı Haritası
          </button>
          
          <button
            onClick={() => setActiveTab('mediaPatterns')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === 'mediaPatterns'
                ? 'text-white border-b-2 border-green-400 bg-green-500/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Medya Paylaşım Desenleri
          </button>
          
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === 'topics'
                ? 'text-white border-b-2 border-orange-400 bg-orange-500/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Konuşma Konuları
          </button>
          
          <button
            onClick={() => setActiveTab('customRange')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === 'customRange'
                ? 'text-white border-b-2 border-indigo-400 bg-indigo-500/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Özel Tarih Aralığı
          </button>
        </div>
        
        {/* Word Cloud Tab */}
        {activeTab === 'wordCloud' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-2xl font-bold text-white mb-6">
              En Sık Kullanılan Kelimeler
            </h4>
            
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[600px]">
              {wordCloudData.length > 0 ? (
                <WordCloudChart 
                  data={wordCloudData}
                  width={1000}
                  height={550}
                  backgroundColor="transparent"
                  maxFontSize={80}
                  minFontSize={16}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/70">
                    Kelime verisi bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Most Active Days Tab */}
        {activeTab === 'activeDays' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-2xl font-bold text-white mb-6">
              En Aktif Günler
            </h4>
            
            <div className="h-80 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              {activeDaysData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activeDaysData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip
                      formatter={(value) => [value, 'Mesaj']}
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(12px)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="messageCount" name="Mesaj Sayısı" fill={CHART_COLORS.primary[0]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/70">
                    Aktif gün verisi bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Activity Heatmap Tab */}
        {activeTab === 'activityHeatmap' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-2xl font-bold text-white mb-6">
              Aktivite Isı Haritası
            </h4>
            
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[600px]">
              {heatmapData.length > 0 ? (
                <ActivityHeatmap 
                  data={heatmapData}
                  width={900}
                  height={500}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/70">
                    Aktivite verisi bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Media Patterns Tab */}
        {activeTab === 'mediaPatterns' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-2xl font-bold text-white mb-6">
              Medya Paylaşım Desenleri
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-64 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
                {mediaPatternsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mediaPatternsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        tickFormatter={(value) => value.toFixed(1)}
                      />
                      <Tooltip
                        formatter={(value) => [parseFloat(value.toString()).toFixed(2), 'Ortalama Günlük']}
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          backdropFilter: 'blur(12px)',
                          borderColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'white'
                        }}
                      />
                      <Bar dataKey="dailyAverage" name="Ortalama Günlük" fill={CHART_COLORS.primary[1]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/70">
                      Medya paylaşım deseni verisi bulunamadı.
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h5 className="text-xl font-bold text-white mb-4">
                  En Yoğun Medya Paylaşımı Günleri
                </h5>
                
                <div className="space-y-4">
                  {mediaPatternsData.map((pattern, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-white/90">{pattern.name}</span>
                      <div className="text-right">
                        <span className="font-medium text-white">
                          {pattern.peakCount} medya
                        </span>
                        <span className="text-xs block text-white/60">
                          {pattern.peakDay ? format(new Date(pattern.peakDay), 'd MMM yyyy', { locale: tr }) : 'Veri yok'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Conversation Topics Tab */}
        {activeTab === 'topics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-2xl font-bold text-white mb-6">
              Konuşma Konuları
            </h4>
            
            <div className="h-80 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              {topicsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topicsData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      type="number" 
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                      width={90}
                    />
                    <Tooltip
                      formatter={(value) => [value, 'Kullanım']}
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(12px)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="frequency" name="Kullanım Sayısı" fill={CHART_COLORS.primary[2]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/70">
                    Konuşma konusu verisi bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Custom Date Range Tab */}
        {activeTab === 'customRange' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-2xl font-bold text-white mb-6">
              Özel Tarih Aralığı Analizi
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-end">
                <motion.button
                  onClick={handleCustomAnalysis}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analiz Et
                </motion.button>
              </div>
            </div>
            
            {customAnalysis ? (
              <motion.div 
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h5 className="text-xl font-bold text-white mb-4">
                  {format(customAnalysis.dateRange.start, 'd MMM yyyy', { locale: tr })} - {format(customAnalysis.dateRange.end, 'd MMM yyyy', { locale: tr })} Aralığı Analizi
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <motion.div 
                    className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-400/20 rounded-xl p-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-sm text-blue-300 font-medium">Toplam Mesaj</p>
                    <p className="text-2xl font-bold text-white">{customAnalysis.totalMessages}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-xl p-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-sm text-green-300 font-medium">Katılımcılar</p>
                    <p className="text-2xl font-bold text-white">{customAnalysis.participants.length}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20 rounded-xl p-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-sm text-purple-300 font-medium">En Aktif Gün</p>
                    <p className="text-lg font-bold text-white">
                      {customAnalysis.timeStats.mostActiveDate 
                        ? format(new Date(customAnalysis.timeStats.mostActiveDate), 'd MMM yyyy', { locale: tr })
                        : 'Veri yok'}
                    </p>
                  </motion.div>
                </div>
                
                {customAnalysis.messageStats.length > 0 && (
                  <div>
                    <h6 className="text-lg font-bold text-white mb-4">
                      Katılımcı İstatistikleri
                    </h6>
                    
                    <div className="space-y-3">
                      {customAnalysis.messageStats.map((stat, index) => (
                        <motion.div 
                          key={index} 
                          className="flex justify-between items-center backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-white/90">{stat.sender}</span>
                          <div className="flex items-center">
                            <span className="font-medium text-white mr-3">
                              {stat.count} mesaj
                            </span>
                            <span className="text-sm text-white/60">
                              ({stat.averageLength.toFixed(0)} karakter)
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h5 className="text-2xl font-bold text-white mb-3">
                  Özel Tarih Aralığı Analizi
                </h5>
                <p className="text-white/70 max-w-md mx-auto">
                  Belirli bir tarih aralığı için detaylı analiz yapmak üzere başlangıç ve bitiş tarihlerini seçin.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PremiumFeatures;