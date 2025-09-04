'use client';

import { ChatAnalysis } from '@/types/chat';
import EmojiChart from '@/components/Charts/EmojiChart';
import { motion } from 'framer-motion';

interface EmojiAnalysisProps {
  analysis: ChatAnalysis;
}

const EmojiAnalysis = ({ analysis }: EmojiAnalysisProps) => {
  // Calculate emoji usage statistics
  const totalEmojis = analysis.emojiStats.totalEmojis;
  const emojiPercentage = Math.round((totalEmojis / analysis.totalMessages) * 100);
  
  // Get emoji usage by participant
  const emojisByUser = Object.entries(analysis.emojiStats.emojiCountsByUser).map(([user, emojis]) => {
    const userEmojiCount = Object.values(emojis).reduce((sum, count) => sum + count, 0);
    return {
      user,
      count: userEmojiCount,
      percentage: Math.round((userEmojiCount / totalEmojis) * 100),
      mostUsed: Object.entries(emojis)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([emoji, count]) => ({ emoji, count }))
    };
  }).sort((a, b) => b.count - a.count);
  
  return (
    <div className="space-y-8">
      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <EmojiChart emojiStats={analysis.emojiStats} />
      </motion.div>
      
      {/* Analysis Section */}
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">😊</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            Emoji Kullanım Analizi
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Stats & Champion */}
          <div className="space-y-6">
            {/* Total Emoji Stats */}
            <motion.div 
              className="backdrop-blur-sm bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border border-yellow-400/20 rounded-2xl p-6"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">Toplam Emoji</p>
                    <p className="text-3xl font-black text-white">{totalEmojis.toLocaleString('tr-TR')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-300">{emojiPercentage}%</div>
                  <p className="text-white/70 text-sm">mesajlarda emoji</p>
                </div>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full relative overflow-hidden"
                  style={{ width: `${emojiPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${emojiPercentage}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Emoji Champion */}
            <motion.div 
              className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-xl">👑</span>
                </div>
                <h4 className="text-2xl font-bold text-white">Emoji Şampiyonu</h4>
              </div>
              
              {emojisByUser.length > 0 && (
                <div className="space-y-6">
                  {/* Winner */}
                  <motion.div 
                    className="relative p-4 backdrop-blur-sm bg-gradient-to-r from-gold/10 to-yellow-500/10 border border-yellow-400/30 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="absolute top-2 right-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-yellow-300">
                          {emojisByUser[0].user}
                        </span>
                        <p className="text-white/70 text-sm">
                          {emojisByUser[0].count.toLocaleString('tr-TR')} emoji ({emojisByUser[0].percentage}%)
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {emojisByUser[0].mostUsed.map((item, index) => (
                          <motion.div 
                            key={index} 
                            className="text-3xl"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                          >
                            {item.emoji}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Runner up */}
                  {emojisByUser.length > 1 && (
                    <motion.div 
                      className="p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-medium text-white">
                            {emojisByUser[1].user}
                          </span>
                          <p className="text-white/70 text-sm">
                            {emojisByUser[1].count.toLocaleString('tr-TR')} emoji ({emojisByUser[1].percentage}%)
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {emojisByUser[1].mostUsed.map((item, index) => (
                            <div key={index} className="text-2xl">{item.emoji}</div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Right Column - Individual Preferences */}
          <motion.div 
            className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/10 to-blue-600/10 border border-indigo-400/20 rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-xl">🎨</span>
              </div>
              <h4 className="text-2xl font-bold text-white">Kişisel Emoji Tercihleri</h4>
            </div>
            
            <div className="space-y-6">
              {emojisByUser.map((user, userIndex) => (
                <motion.div 
                  key={user.user} 
                  className="pb-6 border-b border-white/10 last:border-0 last:pb-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * userIndex }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-white">{user.user}</span>
                    <div className="text-sm text-indigo-300 font-medium">
                      Top {user.mostUsed.length} favori
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {user.mostUsed.map((item, index) => (
                      <motion.div 
                        key={index}
                        className="group backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300"
                        whileHover={{ scale: 1.1, y: -5 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          {item.emoji}
                        </div>
                        <div className="text-white font-bold text-lg">
                          {item.count}
                        </div>
                        <div className="text-white/60 text-xs">
                          kullanım
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmojiAnalysis;