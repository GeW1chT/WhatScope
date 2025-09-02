import { ChatAnalysis, WhatsAppMessage } from "@/types/chat";

export const analyzeEmojis = (messages: WhatsAppMessage[], analysis: ChatAnalysis): ChatAnalysis => {
  const emojiCounts: Record<string, number> = {};
  const emojiCountsByUser: Record<string, Record<string, number>> = {};
  let totalEmojis = 0;
  
  // Initialize emoji counts by user
  analysis.participants.forEach(participant => {
    emojiCountsByUser[participant] = {};
  });
  
  // Count emojis in messages
  messages.forEach(msg => {
    if (msg.emojis && msg.emojis.length > 0) {
      msg.emojis.forEach(emoji => {
        // Count total occurrences
        emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
        totalEmojis++;
        
        // Count by user
        if (!emojiCountsByUser[msg.sender][emoji]) {
          emojiCountsByUser[msg.sender][emoji] = 0;
        }
        emojiCountsByUser[msg.sender][emoji]++;
      });
    }
  });
  
  // Find most used emojis (top 20)
  const mostUsedEmojis = Object.entries(emojiCounts)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  // Update emoji stats in the analysis
  analysis.emojiStats = {
    totalEmojis,
    emojiCounts,
    emojiCountsByUser,
    mostUsedEmojis
  };
  
  return analysis;
};

export default analyzeEmojis;