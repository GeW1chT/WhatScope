import { ChatAnalysis, WhatsAppMessage } from "@/types/chat";

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

/**
 * Analyze communication dynamics including conversation initiations, response times, and interaction flow
 */
export const analyzeCommunicationDynamics = (messages: WhatsAppMessage[], analysis: ChatAnalysis): ChatAnalysis => {
  // Initialize data structures
  const conversationInitiations: Record<string, number> = {};
  const responseTimes: Record<string, number[]> = {};
  const interactionFlow: Record<string, Record<string, number>> = {};
  const userMessageTimes: Record<string, Date> = {};
  
  // Initialize for all participants
  analysis.participants.forEach(participant => {
    conversationInitiations[participant] = 0;
    responseTimes[participant] = [];
    interactionFlow[participant] = {};
    analysis.participants.forEach(otherParticipant => {
      if (participant !== otherParticipant) {
        interactionFlow[participant][otherParticipant] = 0;
      }
    });
  });
  
  let totalResponseTime = 0;
  let responseTimeCount = 0;
  let lastMessageTime: Date | null = null;
  let conversationStarter: string | null = null;
  
  // Process messages to analyze communication patterns
  messages.forEach((message, index) => {
    // Skip non-text messages for response time analysis
    if (message.type !== 'text') return;
    
    const sender = message.sender;
    const messageTime = message.timestamp;
    
    // Track conversation initiations (messages sent after a significant gap)
    if (lastMessageTime) {
      const timeGap = (messageTime.getTime() - lastMessageTime.getTime()) / (1000 * 60 * 60); // in hours
      
      // If more than 2 hours have passed, consider this a new conversation
      if (timeGap > 2) {
        conversationInitiations[sender] = (conversationInitiations[sender] || 0) + 1;
        conversationStarter = sender;
      }
    } else {
      // First message is always a conversation starter
      conversationInitiations[sender] = (conversationInitiations[sender] || 0) + 1;
      conversationStarter = sender;
    }
    
    // Track response times (time between messages from different senders)
    if (lastMessageTime && userMessageTimes[sender] && sender !== messages[index - 1]?.sender) {
      const responseTime = (messageTime.getTime() - userMessageTimes[sender].getTime()) / (1000 * 60); // in minutes
      
      // Only consider response times up to 24 hours to avoid outliers
      if (responseTime > 0 && responseTime <= 1440) {
        responseTimes[sender].push(responseTime);
        totalResponseTime += responseTime;
        responseTimeCount++;
      }
    }
    
    // Track interaction flow (who responds to whom)
    if (index > 0 && messages[index - 1].sender !== sender) {
      const previousSender = messages[index - 1].sender;
      if (interactionFlow[sender] && interactionFlow[sender][previousSender] !== undefined) {
        interactionFlow[sender][previousSender]++;
      }
    }
    
    // Update tracking variables
    userMessageTimes[sender] = messageTime;
    lastMessageTime = messageTime;
  });
  
  // Calculate response time statistics for each user
  const responseTimeStats: Record<string, {
    average: number;
    median: number;
    fastest: number;
    slowest: number;
  }> = {};
  
  Object.entries(responseTimes).forEach(([user, times]) => {
    if (times.length === 0) {
      responseTimeStats[user] = {
        average: 0,
        median: 0,
        fastest: 0,
        slowest: 0
      };
      return;
    }
    
    // Sort times for median calculation
    const sortedTimes = [...times].sort((a, b) => a - b);
    
    // Calculate statistics
    const average = times.reduce((sum, time) => sum + time, 0) / times.length;
    const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
    const fastest = Math.min(...times);
    const slowest = Math.max(...times);
    
    responseTimeStats[user] = {
      average,
      median,
      fastest,
      slowest
    };
  });
  
  // Find the person who initiates conversations most often
  let mostActiveConversator = '';
  let maxInitiations = 0;
  
  Object.entries(conversationInitiations).forEach(([user, count]) => {
    if (count > maxInitiations) {
      maxInitiations = count;
      mostActiveConversator = user;
    }
  });
  
  // Calculate overall average response time
  const avgResponseTime = responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0;
  
  // Add communication dynamics to the existing analysis
  return {
    ...analysis,
    conversationInitiations,
    responseTimeAverage: Object.fromEntries(
      Object.entries(responseTimeStats).map(([user, stats]) => [user, stats.average])
    ),
    // Add the new communication dynamics data
    communicationDynamics: {
      conversationInitiations,
      responseTimes: responseTimeStats,
      interactionFlow,
      mostActiveConversator,
      avgResponseTime
    }
  };
};

export default analyzeCommunicationDynamics;