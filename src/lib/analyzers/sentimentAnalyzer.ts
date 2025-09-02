import { ChatAnalysis, WhatsAppMessage } from "@/types/chat";
import { analyzeMessageSentiment, analyzeMessageIntensity } from "./advancedTurkishSentiment";

export interface SentimentResult {
  score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  messageId: number;
  timestamp: Date;
  intensity: number;
  emotionalCategory?: string;
}

export interface SentimentAnalysis {
  overallScore: number;
  sentimentByMessage: SentimentResult[];
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
  mostIntenseMessages: SentimentResult[];
}

export const analyzeSentiment = (messages: WhatsAppMessage[], analysis: ChatAnalysis): ChatAnalysis => {
  const sentimentByMessage: SentimentResult[] = [];
  const sentimentScoresByUser: Record<string, { scores: number[], categories: Record<string, number> }> = {};
  const sentimentScoresByDate: Record<string, { scores: number[], categories: Record<string, number> }> = {};
  const globalEmotionalCategories: Record<string, number> = {};
  
  // Initialize sentiment scores by user
  analysis.participants.forEach(participant => {
    sentimentScoresByUser[participant] = { scores: [], categories: {} };
  });
  
  // Analyze sentiment for each message
  messages.forEach((msg, index) => {
    if (msg.type !== 'text') return; // Skip media and system messages
    
    // Get advanced sentiment analysis for the message
    const sentimentResult = analyzeMessageSentiment(msg.content);
    const intensity = analyzeMessageIntensity(msg.content);
    
    // Store sentiment result
    sentimentByMessage.push({
      score: sentimentResult.score,
      sentiment: sentimentResult.sentiment,
      messageId: index,
      timestamp: msg.timestamp,
      intensity,
      emotionalCategory: sentimentResult.emotionalCategory
    });
    
    // Store by user
    sentimentScoresByUser[msg.sender].scores.push(sentimentResult.score);
    
    // Track emotional categories by user
    if (sentimentResult.emotionalCategory) {
      const category = sentimentResult.emotionalCategory;
      sentimentScoresByUser[msg.sender].categories[category] = 
        (sentimentScoresByUser[msg.sender].categories[category] || 0) + 1;
        
      // Also track global emotional categories
      globalEmotionalCategories[category] = (globalEmotionalCategories[category] || 0) + 1;
    }
    
    // Store by date
    const date = msg.timestamp.toISOString().split('T')[0];
    if (!sentimentScoresByDate[date]) {
      sentimentScoresByDate[date] = { scores: [], categories: {} };
    }
    sentimentScoresByDate[date].scores.push(sentimentResult.score);
    
    // Track emotional categories by date
    if (sentimentResult.emotionalCategory) {
      const category = sentimentResult.emotionalCategory;
      sentimentScoresByDate[date].categories[category] = 
        (sentimentScoresByDate[date].categories[category] || 0) + 1;
    }
  });
  
  // Find dominant emotion overall
  let dominantEmotion = 'neutral';
  let highestEmotionCount = 0;
  Object.entries(globalEmotionalCategories).forEach(([category, count]) => {
    if (count > highestEmotionCount) {
      highestEmotionCount = count;
      dominantEmotion = category;
    }
  });
  
  // Calculate average sentiment score by user with dominant emotion
  const sentimentByUser: Record<string, {
    score: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    dominantEmotion?: string;
  }> = {};
  
  Object.entries(sentimentScoresByUser).forEach(([user, data]) => {
    if (data.scores.length === 0) {
      sentimentByUser[user] = { score: 0, sentiment: 'neutral' };
      return;
    }
    
    const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    
    if (avgScore > 0.2) {
      sentiment = 'positive';
    } else if (avgScore < -0.2) {
      sentiment = 'negative';
    }
    
    // Find dominant emotion for user
    let userDominantEmotion: string | undefined;
    let highestCount = 0;
    
    Object.entries(data.categories).forEach(([category, count]) => {
      if (count > highestCount) {
        highestCount = count;
        userDominantEmotion = category;
      }
    });
    
    sentimentByUser[user] = { 
      score: avgScore, 
      sentiment,
      dominantEmotion: userDominantEmotion 
    };
  });
  
  // Calculate average sentiment score by date
  const sentimentByDate: Record<string, {
    score: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    emotionalCategories?: Record<string, number>;
  }> = {};
  
  let happiestDate = '';
  let happiestScore = -Infinity;
  let saddestDate = '';
  let saddestScore = Infinity;
  
  Object.entries(sentimentScoresByDate).forEach(([date, data]) => {
    if (data.scores.length === 0) {
      sentimentByDate[date] = { score: 0, sentiment: 'neutral', emotionalCategories: {} };
      return;
    }
    
    const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    
    if (avgScore > 0.2) {
      sentiment = 'positive';
    } else if (avgScore < -0.2) {
      sentiment = 'negative';
    }
    
    sentimentByDate[date] = { 
      score: avgScore, 
      sentiment,
      emotionalCategories: data.categories
    };
    
    // Track happiest and saddest days
    if (avgScore > happiestScore) {
      happiestScore = avgScore;
      happiestDate = date;
    }
    
    if (avgScore < saddestScore) {
      saddestScore = avgScore;
      saddestDate = date;
    }
  });
  
  // Calculate overall sentiment score
  const allScores = sentimentByMessage.map(item => item.score);
  const overallScore = allScores.length > 0
    ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
    : 0;
    
  // Find most intense messages (top 5)
  const mostIntenseMessages = [...sentimentByMessage]
    .sort((a, b) => (b.intensity * Math.abs(b.score)) - (a.intensity * Math.abs(a.score)))
    .slice(0, 5);
  
  // Add sentiment analysis to the existing analysis
  return {
    ...analysis,
    sentimentAnalysis: {
      overallScore,
      sentimentByMessage,
      sentimentByUser,
      sentimentByDate,
      emotionalCategories: globalEmotionalCategories,
      dominantEmotion,
      happiest: {
        date: happiestDate,
        score: happiestScore
      },
      saddest: {
        date: saddestDate,
        score: saddestScore
      },
      mostIntenseMessages
    }
  };
};

export default analyzeSentiment;