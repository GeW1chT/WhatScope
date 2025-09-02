import { ChatAnalysis, WhatsAppMessage } from "@/types/chat";

export interface PremiumFeatures {
  wordFrequency: Record<string, number>;
  mostActiveDays: Array<{
    date: string;
    messageCount: number;
  }>;
  mediaSharingPatterns: Record<string, {
    dailyAverage: number;
    peakDay: string;
    peakCount: number;
  }>;
  conversationTopics: Array<{
    topic: string;
    frequency: number;
  }>;
  customDateRangeAnalysis: (startDate: Date, endDate: Date) => ChatAnalysis;
}

/**
 * Extract words from message content, removing common Turkish stop words
 */
const extractWords = (content: string): string[] => {
  // Convert to lowercase and remove punctuation
  const cleanContent = content.toLowerCase().replace(/[^\w\sğüşıöç]/g, '');
  
  // Split into words
  const words = cleanContent.split(/\s+/).filter(word => word.length > 2);
  
  // Turkish stop words to filter out
  const stopWords = new Set([
    've', 'ile', 'ama', 'fakat', 'ancak', 'çünkü', 'veya', 'ya', 'ne', 'mı', 'mi', 'mu', 'mü',
    'ben', 'sen', 'o', 'biz', 'siz', 'onlar', 'benim', 'senin', 'onun', 'bizim', 'sizin', 'onların',
    'bu', 'şu', 'o', 'bunu', 'şunu', 'onu', 'bunlar', 'şunlar', 'onlar',
    'bir', 'biraz', 'birkaç', 'çok', 'az', 'daha', 'en', 'her', 'hiç', 'tüm', 'tümü',
    'gün', 'günler', 'zaman', 'zamanlar', 'sadece', 'sadece', 'şimdi', 'şimdi', 'sonra', 'önce',
    'günaydın', 'iyi', 'güzeldir', 'güzeldi', 'güzelleşti', 'güzelleşti', 'güzelleşti', 'güzelleşti'
  ]);
  
  // Filter out stop words and return
  return words.filter(word => !stopWords.has(word));
};

/**
 * Analyze word frequency for premium features
 */
const analyzeWordFrequency = (messages: WhatsAppMessage[]): Record<string, number> => {
  const wordFrequency: Record<string, number> = {};
  
  messages.forEach(message => {
    if (message.type === 'text') {
      const words = extractWords(message.content);
      words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    }
  });
  
  return wordFrequency;
};

/**
 * Find the most active days
 */
const analyzeMostActiveDays = (analysis: ChatAnalysis): Array<{
  date: string;
  messageCount: number;
}> => {
  const activeDays = Object.entries(analysis.timeStats.byDate)
    .map(([date, count]) => ({
      date,
      messageCount: count
    }))
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 10); // Top 10 most active days
  
  return activeDays;
};

/**
 * Analyze media sharing patterns
 */
const analyzeMediaPatterns = (messages: WhatsAppMessage[], participants: string[]): Record<string, {
  dailyAverage: number;
  peakDay: string;
  peakCount: number;
}> => {
  const mediaByUserAndDate: Record<string, Record<string, number>> = {};
  
  // Initialize for all participants
  participants.forEach(participant => {
    mediaByUserAndDate[participant] = {};
  });
  
  // Collect media messages by user and date
  messages.forEach(message => {
    if (message.type === 'media') {
      const date = message.timestamp.toISOString().split('T')[0];
      const sender = message.sender;
      
      if (!mediaByUserAndDate[sender][date]) {
        mediaByUserAndDate[sender][date] = 0;
      }
      
      mediaByUserAndDate[sender][date]++;
    }
  });
  
  // Calculate patterns for each user
  const patterns: Record<string, {
    dailyAverage: number;
    peakDay: string;
    peakCount: number;
  }> = {};
  
  participants.forEach(participant => {
    const userMedia = mediaByUserAndDate[participant];
    const dates = Object.keys(userMedia);
    
    if (dates.length === 0) {
      patterns[participant] = {
        dailyAverage: 0,
        peakDay: '',
        peakCount: 0
      };
      return;
    }
    
    // Calculate daily average
    const totalCount = Object.values(userMedia).reduce((sum, count) => sum + count, 0);
    const dailyAverage = totalCount / dates.length;
    
    // Find peak day
    let peakDay = '';
    let peakCount = 0;
    
    Object.entries(userMedia).forEach(([date, count]) => {
      if (count > peakCount) {
        peakCount = count;
        peakDay = date;
      }
    });
    
    patterns[participant] = {
      dailyAverage,
      peakDay,
      peakCount
    };
  });
  
  return patterns;
};

/**
 * Identify conversation topics based on frequently used words
 */
const identifyConversationTopics = (wordFrequency: Record<string, number>): Array<{
  topic: string;
  frequency: number;
}> => {
  // Convert to array and sort by frequency
  const sortedWords = Object.entries(wordFrequency)
    .map(([word, count]) => ({
      topic: word,
      frequency: count
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 15); // Top 15 topics
  
  return sortedWords;
};

/**
 * Create a custom date range analysis function
 */
const createCustomDateRangeAnalysis = (messages: WhatsAppMessage[], baseAnalysis: ChatAnalysis) => {
  return (startDate: Date, endDate: Date): ChatAnalysis => {
    // Filter messages within the date range
    const filteredMessages = messages.filter(message => {
      const messageDate = message.timestamp;
      return messageDate >= startDate && messageDate <= endDate;
    });
    
    // If no messages in range, return empty analysis
    if (filteredMessages.length === 0) {
      return {
        ...baseAnalysis,
        participants: [],
        totalMessages: 0,
        dateRange: {
          start: startDate,
          end: endDate
        },
        messageStats: [],
        timeStats: {
          byHour: {},
          byDay: {},
          byMonth: {},
          byDate: {},
          mostActiveHour: 0,
          mostActiveDay: 0,
          mostActiveDate: ''
        },
        mediaStats: {
          totalMedia: 0,
          byType: {},
          byUser: {}
        }
      } as ChatAnalysis;
    }
    
    // Re-analyze with filtered messages
    // This is a simplified version - in a real implementation, you would re-run all analyzers
    const participantSet = new Set(filteredMessages.map(msg => msg.sender));
    const participants = Array.from(participantSet);
    
    // Calculate basic stats for filtered messages
    const messageStats = participants.map(participant => {
      const participantMessages = filteredMessages.filter(msg => msg.sender === participant);
      const totalMessages = participantMessages.length;
      const totalLength = participantMessages.reduce((sum, msg) => sum + msg.content.length, 0);
      const averageLength = totalMessages > 0 ? totalLength / totalMessages : 0;
      
      return {
        sender: participant,
        count: totalMessages,
        averageLength
      };
    });
    
    // Simple time stats
    const byDate: Record<string, number> = {};
    filteredMessages.forEach(message => {
      const date = message.timestamp.toISOString().split('T')[0];
      byDate[date] = (byDate[date] || 0) + 1;
    });
    
    let mostActiveDate = '';
    let maxMessages = 0;
    Object.entries(byDate).forEach(([date, count]) => {
      if (count > maxMessages) {
        maxMessages = count;
        mostActiveDate = date;
      }
    });
    
    return {
      ...baseAnalysis,
      participants,
      totalMessages: filteredMessages.length,
      dateRange: {
        start: startDate,
        end: endDate
      },
      messageStats,
      timeStats: {
        ...baseAnalysis.timeStats,
        byDate,
        mostActiveDate
      }
    };
  };
};

/**
 * Analyze premium features for the chat
 */
export const analyzePremiumFeatures = (messages: WhatsAppMessage[], analysis: ChatAnalysis): ChatAnalysis => {
  // Analyze word frequency
  const wordFrequency = analyzeWordFrequency(messages);
  
  // Find most active days
  const mostActiveDays = analyzeMostActiveDays(analysis);
  
  // Analyze media sharing patterns
  const mediaSharingPatterns = analyzeMediaPatterns(messages, analysis.participants);
  
  // Identify conversation topics
  const conversationTopics = identifyConversationTopics(wordFrequency);
  
  // Create custom date range analysis function
  const customDateRangeAnalysis = createCustomDateRangeAnalysis(messages, analysis);
  
  // Add premium features to the existing analysis
  return {
    ...analysis,
    premiumFeatures: {
      wordFrequency,
      mostActiveDays,
      mediaSharingPatterns,
      conversationTopics,
      customDateRangeAnalysis
    }
  };
};

export default analyzePremiumFeatures;