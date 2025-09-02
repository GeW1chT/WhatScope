export interface WhatsAppMessage {
  timestamp: Date;
  sender: string;
  content: string;
  type: 'text' | 'media' | 'system';
  mediaType?: 'image' | 'video' | 'audio' | 'document';
  emojis?: string[];
}

export interface MessageStats {
  sender: string;
  count: number;
  averageLength: number;
}

export interface EmojiStats {
  totalEmojis: number;
  emojiCounts: Record<string, number>;
  emojiCountsByUser: Record<string, Record<string, number>>;
  mostUsedEmojis: { emoji: string; count: number }[];
}

export interface TimeStats {
  byHour: Record<number, number>;
  byDay: Record<number, number>;
  byMonth: Record<number, number>;
  byDate: Record<string, number>;
  mostActiveHour: number;
  mostActiveDay: number;
  mostActiveDate: string;
  byYearMonth?: Record<string, number>;
  timeOfDay?: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  weekdayVsWeekend?: {
    weekday: number;
    weekend: number;
  };
}

export interface MediaStats {
  totalMedia: number;
  byType: Record<string, number>;
  byUser: Record<string, Record<string, number>>;
}

// Add the new CommunicationDynamics interface
export interface CommunicationDynamics {
  conversationInitiations: Record<string, number>;
  responseTimes: Record<string, {
    average: number;
    median: number;
    fastest: number;
    slowest: number;
  }>;
  interactionFlow: Record<string, Record<string, number>>;
  mostActiveConversator: string;
  avgResponseTime: number;
}

// Add the new PremiumFeatures interface
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

export interface ChatAnalysis {
  participants: string[];
  totalMessages: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  messageStats: MessageStats[];
  emojiStats: EmojiStats;
  timeStats: TimeStats;
  mediaStats: MediaStats;
  firstMessage?: WhatsAppMessage;
  longestConversationDate?: string;
  conversationInitiations: Record<string, number>;
  responseTimeAverage: Record<string, number>;
  longestSilence?: {
    start: Date;
    end: Date;
    duration: number; // in hours
  };
  sentimentAnalysis?: {
    overallScore: number;
    sentimentByMessage: Array<{
      score: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      messageId: number;
      timestamp: Date;
      intensity: number;
      emotionalCategory?: string;
    }>;
    sentimentByUser: Record<string, {
      score: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      dominantEmotion?: string;
    }>;
    sentimentByDate: Record<string, {
      score: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      emotionalCategories?: Record<string, number>;
    }>;
    emotionalCategories: Record<string, number>;
    dominantEmotion: string;
    happiest: {
      date: string;
      score: number;
    };
    saddest: {
      date: string;
      score: number;
    };
    mostIntenseMessages: Array<{
      score: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      messageId: number;
      timestamp: Date;
      intensity: number;
      emotionalCategory?: string;
    }>;
  };
  // Add the new communication dynamics field
  communicationDynamics?: CommunicationDynamics;
  // Add the new premium features field
  premiumFeatures?: PremiumFeatures;
  messages: WhatsAppMessage[]; // Add this to store messages for reference in UI
}