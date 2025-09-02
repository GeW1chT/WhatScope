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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Temel İstatistikler
      </h3>
      
      <div className="space-y-6">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <motion.div 
            className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 transition-all hover:shadow-md"
            whileHover={{ y: -5 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Mesaj</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{totalMessages.toLocaleString('tr-TR')}</p>
          </motion.div>
          
          <motion.div 
            className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 transition-all hover:shadow-md"
            whileHover={{ y: -5 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Katılımcılar</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{analysis.participants.length}</p>
          </motion.div>
          
          <motion.div 
            className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 transition-all hover:shadow-md"
            whileHover={{ y: -5 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">İlk Mesaj Tarihi</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatDate(analysis.dateRange.start)}</p>
          </motion.div>
          
          <motion.div 
            className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 transition-all hover:shadow-md"
            whileHover={{ y: -5 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Son Mesaj Tarihi</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatDate(analysis.dateRange.end)}</p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Kim Daha Aktif?</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">{mostMessagesUser.sender}</span>
                <span className="text-gray-600 dark:text-gray-300">{mostMessagesUser.count} mesaj ({mostMessagesPercentage}%)</span>
              </div>
              <motion.div 
                className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <motion.div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${mostMessagesPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${mostMessagesPercentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                ></motion.div>
              </motion.div>
            </div>
            
            {messageCounts.length > 1 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">{messageCounts[1].sender}</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {messageCounts[1].count} mesaj ({Math.round((messageCounts[1].count / totalMessages) * 100)}%)
                  </span>
                </div>
                <motion.div 
                  className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  <motion.div 
                    className="bg-purple-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.round((messageCounts[1].count / totalMessages) * 100)}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((messageCounts[1].count / totalMessages) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  ></motion.div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-all hover:shadow-md"
            whileHover={{ y: -3 }}
          >
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Konuşmayı Kim Başlatıyor?</h4>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">{mostInitiationsUser[0]}</span>, konuşmaların{' '}
              <span className="font-medium">{initiationsPercentage}%</span>'ini başlatıyor.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-all hover:shadow-md"
            whileHover={{ y: -3 }}
          >
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Mesaj Ritmi</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Günde ortalama <span className="font-medium">{averageDailyMessages}</span> mesaj
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-all hover:shadow-md"
            whileHover={{ y: -3 }}
          >
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Ortalama Yanıt Süresi</h4>
            <div className="space-y-2">
              {Object.entries(analysis.responseTimeAverage).map(([sender, time]) => (
                <motion.div 
                  key={sender} 
                  className="flex justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm text-gray-600 dark:text-gray-300">{sender}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {time.toFixed(1)} dakika
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {analysis.longestSilence && (
            <motion.div 
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-all hover:shadow-md"
              whileHover={{ y: -3 }}
            >
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">En Uzun Sessizlik</h4>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">{Math.round(analysis.longestSilence.duration)}</span> saat
                <span className="text-sm block mt-1">
                  {formatDate(analysis.longestSilence.start)} - {formatDate(analysis.longestSilence.end)}
                </span>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BasicStats;