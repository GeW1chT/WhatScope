'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChatAnalysis } from '@/types/chat';
import { CHART_COLORS } from '@/lib/constants';

interface PremiumFeaturesProps {
  analysis: ChatAnalysis;
}

const PremiumFeatures = ({ analysis }: PremiumFeaturesProps) => {
  const [activeTab, setActiveTab] = useState<'wordCloud' | 'activeDays' | 'mediaPatterns' | 'topics' | 'customRange'>('wordCloud');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [customAnalysis, setCustomAnalysis] = useState<ChatAnalysis | null>(null);
  const [wordCloudData, setWordCloudData] = useState<Array<{ text: string; value: number }>>([]);
  
  if (!analysis.premiumFeatures) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Premium Özellikler
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Premium özellikler analizi verisi bulunamadı.
        </p>
      </div>
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Premium Özellikler
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('wordCloud')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'wordCloud'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Kelime Bulutu
        </button>
        
        <button
          onClick={() => setActiveTab('activeDays')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'activeDays'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          En Aktif Günler
        </button>
        
        <button
          onClick={() => setActiveTab('mediaPatterns')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'mediaPatterns'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Medya Paylaşım Desenleri
        </button>
        
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'topics'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Konuşma Konuları
        </button>
        
        <button
          onClick={() => setActiveTab('customRange')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'customRange'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Özel Tarih Aralığı
        </button>
      </div>
      
      {/* Word Cloud Tab */}
      {activeTab === 'wordCloud' && (
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
            En Sık Kullanılan Kelimeler
          </h4>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[400px] flex flex-wrap items-center justify-center gap-2">
            {wordCloudData.length > 0 ? (
              wordCloudData.map((word, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 rounded-full"
                  style={{
                    fontSize: `${Math.max(12, Math.min(32, word.value * 2))}px`,
                    backgroundColor: CHART_COLORS.primary[index % CHART_COLORS.primary.length] + '20',
                    color: CHART_COLORS.primary[index % CHART_COLORS.primary.length],
                    fontWeight: word.value > 10 ? 'bold' : 'normal'
                  }}
                >
                  {word.text} ({word.value})
                </span>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Kelime verisi bulunamadı.
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Most Active Days Tab */}
      {activeTab === 'activeDays' && (
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
            En Aktif Günler
          </h4>
          
          <div className="h-80">
            {activeDaysData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeDaysData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip
                    formatter={(value) => [value, 'Mesaj']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar dataKey="messageCount" name="Mesaj Sayısı" fill={CHART_COLORS.primary[0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  Aktif gün verisi bulunamadı.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Media Patterns Tab */}
      {activeTab === 'mediaPatterns' && (
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
            Medya Paylaşım Desenleri
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              {mediaPatternsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mediaPatternsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <Tooltip
                      formatter={(value) => [parseFloat(value.toString()).toFixed(2), 'Ortalama Günlük']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Bar dataKey="dailyAverage" name="Ortalama Günlük" fill={CHART_COLORS.primary[1]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    Medya paylaşım deseni verisi bulunamadı.
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                En Yoğun Medya Paylaşımı Günleri
              </h5>
              
              <div className="space-y-3">
                {mediaPatternsData.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{pattern.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {pattern.peakCount} medya
                      </span>
                      <span className="text-xs block text-gray-500 dark:text-gray-400">
                        {pattern.peakDay ? format(new Date(pattern.peakDay), 'd MMM yyyy', { locale: tr }) : 'Veri yok'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Conversation Topics Tab */}
      {activeTab === 'topics' && (
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
            Konuşma Konuları
          </h4>
          
          <div className="h-80">
            {topicsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: '#6b7280' }}
                    width={90}
                  />
                  <Tooltip
                    formatter={(value) => [value, 'Kullanım']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar dataKey="frequency" name="Kullanım Sayısı" fill={CHART_COLORS.primary[2]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  Konuşma konusu verisi bulunamadı.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Custom Date Range Tab */}
      {activeTab === 'customRange' && (
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
            Özel Tarih Aralığı Analizi
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleCustomAnalysis}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Analiz Et
              </button>
            </div>
          </div>
          
          {customAnalysis ? (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-md font-medium text-gray-800 dark:text-gray-100 mb-3">
                {format(customAnalysis.dateRange.start, 'd MMM yyyy', { locale: tr })} - {format(customAnalysis.dateRange.end, 'd MMM yyyy', { locale: tr })} Aralığı Analizi
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-300">Toplam Mesaj</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{customAnalysis.totalMessages}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-300">Katılımcılar</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{customAnalysis.participants.length}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-300">En Aktif Gün</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {customAnalysis.timeStats.mostActiveDate 
                      ? format(new Date(customAnalysis.timeStats.mostActiveDate), 'd MMM yyyy', { locale: tr })
                      : 'Veri yok'}
                  </p>
                </div>
              </div>
              
              {customAnalysis.messageStats.length > 0 && (
                <div className="mt-4">
                  <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Katılımcı İstatistikleri
                  </h6>
                  
                  <div className="space-y-2">
                    {customAnalysis.messageStats.map((stat, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{stat.sender}</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 mr-2">
                            {stat.count} mesaj
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({stat.averageLength.toFixed(0)} karakter)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h5 className="mt-4 text-lg font-medium text-gray-800 dark:text-gray-100">
                Özel Tarih Aralığı Analizi
              </h5>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Belirli bir tarih aralığı için detaylı analiz yapmak üzere başlangıç ve bitiş tarihlerini seçin.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumFeatures;