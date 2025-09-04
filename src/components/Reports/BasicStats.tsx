'use client';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ChatAnalysis } from '@/types/chat';

interface BasicStatsProps {
  analysis: ChatAnalysis;
}

const BasicStats = ({ analysis }: BasicStatsProps) => {
  const formatDate = (date: Date) => {
    return format(date, 'd MMMM yyyy', { locale: tr });
  };
  
  // Calculate who sends more messages
  const messageCounts = analysis.messageStats.sort((a, b) => b.count - a.count);
  const mostMessagesUser = messageCounts[0];
  const totalMessages = analysis.totalMessages;
  const mostMessagesPercentage = Math.round((mostMessagesUser.count / totalMessages) * 100);
  
  // Calculate average daily message count
  const daysInChat = Math.round(
    (analysis.dateRange.end.getTime() - analysis.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const averageDailyMessages = Math.round(totalMessages / daysInChat);
  
  // Calculate who initiates more conversations
  const initiations = Object.entries(analysis.conversationInitiations)
    .sort((a, b) => b[1] - a[1]);
  const mostInitiationsUser = initiations[0];
  const totalInitiations = initiations.reduce((sum, [_, count]) => sum + count, 0);
  const initiationsPercentage = Math.round((mostInitiationsUser[1] / totalInitiations) * 100);
  
  return (
    <motion.div 
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-white">
          Temel İstatistikler
        </h3>
      </div>
      
      <div className="space-y-8">
        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <motion.div 
            className="group backdrop-blur-sm bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">💬</span>
              </div>
              <div className="text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
            <p className="text-cyan-300 text-sm font-medium mb-2">Toplam Mesaj</p>
            <p className="text-3xl font-black text-white">{totalMessages.toLocaleString('tr-TR')}</p>
          </motion.div>
          
          <motion.div 
            className="group backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">👥</span>
              </div>
              <div className="text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
            <p className="text-purple-300 text-sm font-medium mb-2">Katılımcılar</p>
            <p className="text-3xl font-black text-white">{analysis.participants.length}</p>
          </motion.div>
          
          <motion.div 
            className="group backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">📅</span>
              </div>
              <div className="text-green-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
            <p className="text-green-300 text-sm font-medium mb-2">İlk Mesaj</p>
            <p className="text-lg font-bold text-white">{formatDate(analysis.dateRange.start)}</p>
          </motion.div>
          
          <motion.div 
            className="group backdrop-blur-sm bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-400/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⏰</span>
              </div>
              <div className="text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
            <p className="text-orange-300 text-sm font-medium mb-2">Son Mesaj</p>
            <p className="text-lg font-bold text-white">{formatDate(analysis.dateRange.end)}</p>
          </motion.div>
        </motion.div>
        
        {/* Activity Comparison */}
        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">🏆</span>
            </div>
            <h4 className="text-2xl font-bold text-white">Kim Daha Aktif?</h4>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-medium text-lg">{mostMessagesUser.sender}</span>
                <div className="text-right">
                  <span className="text-white font-bold text-xl">{mostMessagesUser.count.toLocaleString('tr-TR')}</span>
                  <span className="text-white/70 text-sm ml-2">({mostMessagesPercentage}%)</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full relative overflow-hidden"
                    style={{ width: `${mostMessagesPercentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${mostMessagesPercentage}%` }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {messageCounts.length > 1 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-medium text-lg">{messageCounts[1].sender}</span>
                  <div className="text-right">
                    <span className="text-white font-bold text-xl">{messageCounts[1].count.toLocaleString('tr-TR')}</span>
                    <span className="text-white/70 text-sm ml-2">({Math.round((messageCounts[1].count / totalMessages) * 100)}%)</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full relative overflow-hidden"
                      style={{ width: `${Math.round((messageCounts[1].count / totalMessages) * 100)}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((messageCounts[1].count / totalMessages) * 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.4 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Additional Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-400/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold">🚀</span>
              </div>
              <h4 className="text-xl font-bold text-white">Konuşma Başlatıcısı</h4>
            </div>
            <p className="text-white/80 leading-relaxed">
              <span className="font-bold text-emerald-300">{mostInitiationsUser[0]}</span>, konuşmaların{' '}
              <span className="font-bold text-emerald-300">{initiationsPercentage}%</span>'ini başlatıyor.
            </p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-400/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold">📈</span>
              </div>
              <h4 className="text-xl font-bold text-white">Mesaj Ritmi</h4>
            </div>
            <p className="text-white/80">
              Günde ortalama <span className="font-bold text-violet-300">{averageDailyMessages}</span> mesaj alışverişi yapıyorsunuz.
            </p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-rose-500/10 to-pink-600/10 border border-rose-400/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold">⚡</span>
              </div>
              <h4 className="text-xl font-bold text-white">Yanıt Hızı</h4>
            </div>
            <div className="space-y-3">
              {Object.entries(analysis.responseTimeAverage).map(([sender, time]) => (
                <motion.div 
                  key={sender} 
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white/80">{sender}</span>
                  <span className="font-bold text-rose-300">
                    {time.toFixed(1)} dk
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {analysis.longestSilence && (
            <motion.div 
              className="backdrop-blur-sm bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-400/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold">🤐</span>
                </div>
                <h4 className="text-xl font-bold text-white">En Uzun Sessizlik</h4>
              </div>
              <p className="text-white/80">
                <span className="font-bold text-amber-300">{Math.round(analysis.longestSilence.duration)} saat</span> sessizlik
              </p>
              <p className="text-white/60 text-sm mt-2">
                {formatDate(analysis.longestSilence.start)} - {formatDate(analysis.longestSilence.end)}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BasicStats;