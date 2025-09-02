'use client';

import { ChatAnalysis } from '@/types/chat';
import EmojiChart from '@/components/Charts/EmojiChart';

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
    <div className="space-y-6">
      <EmojiChart emojiStats={analysis.emojiStats} />
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Emoji Kullanım Analizi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Emoji</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{totalEmojis}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mesajların {emojiPercentage}%'inde emoji kullanılmış
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Emoji Şampiyonu</h4>
              
              {emojisByUser.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                        {emojisByUser[0].user}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Toplam {emojisByUser[0].count} emoji ({emojisByUser[0].percentage}%)
                      </p>
                    </div>
                    <div className="flex">
                      {emojisByUser[0].mostUsed.map((item, index) => (
                        <div key={index} className="text-2xl mx-1">{item.emoji}</div>
                      ))}
                    </div>
                  </div>
                  
                  {emojisByUser.length > 1 && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                          {emojisByUser[1].user}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Toplam {emojisByUser[1].count} emoji ({emojisByUser[1].percentage}%)
                        </p>
                      </div>
                      <div className="flex">
                        {emojisByUser[1].mostUsed.map((item, index) => (
                          <div key={index} className="text-2xl mx-1">{item.emoji}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
              Kişilerin Favori Emojileri
            </h4>
            
            <div className="space-y-4">
              {emojisByUser.map((user) => (
                <div key={user.user} className="border-b border-gray-200 dark:border-gray-600 pb-3 last:border-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {user.user}
                  </p>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {user.mostUsed.map((item, index) => (
                      <div 
                        key={index}
                        className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        <span className="text-2xl mb-1">{item.emoji}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {item.count} kez
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiAnalysis;