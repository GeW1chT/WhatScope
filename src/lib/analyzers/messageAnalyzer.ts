import { ChatAnalysis, MessageStats, WhatsAppMessage } from "@/types/chat";

export const analyzeMessages = (messages: WhatsAppMessage[]): ChatAnalysis => {
  // Extract unique participants
  const participants = [...new Set(messages.map(msg => msg.sender))];
  
  // Calculate message statistics per sender
  const messageCountBySender: Record<string, number> = {};
  const messageLengthSumBySender: Record<string, number> = {};
  
  messages.forEach(msg => {
    if (!messageCountBySender[msg.sender]) {
      messageCountBySender[msg.sender] = 0;
      messageLengthSumBySender[msg.sender] = 0;
    }
    
    messageCountBySender[msg.sender]++;
    messageLengthSumBySender[msg.sender] += msg.content.length;
  });
  
  const messageStats: MessageStats[] = participants.map(sender => ({
    sender,
    count: messageCountBySender[sender] || 0,
    averageLength: messageCountBySender[sender] 
      ? messageLengthSumBySender[sender] / messageCountBySender[sender] 
      : 0
  }));
  
  // Find first and last message to determine date range
  const sortedMessages = [...messages].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  const firstMessage = sortedMessages[0];
  const lastMessage = sortedMessages[sortedMessages.length - 1];
  
  // Calculate time statistics
  const messagesByHour: Record<number, number> = {};
  const messagesByDay: Record<number, number> = {};
  const messagesByMonth: Record<number, number> = {};
  const messagesByDate: Record<string, number> = {};
  
  messages.forEach(msg => {
    const hour = msg.timestamp.getHours();
    const day = msg.timestamp.getDay();
    const month = msg.timestamp.getMonth();
    const date = msg.timestamp.toISOString().split('T')[0];
    
    messagesByHour[hour] = (messagesByHour[hour] || 0) + 1;
    messagesByDay[day] = (messagesByDay[day] || 0) + 1;
    messagesByMonth[month] = (messagesByMonth[month] || 0) + 1;
    messagesByDate[date] = (messagesByDate[date] || 0) + 1;
  });
  
  // Find most active hour, day, and date
  const mostActiveHour = Object.entries(messagesByHour)
    .sort((a, b) => b[1] - a[1])[0][0];
    
  const mostActiveDay = Object.entries(messagesByDay)
    .sort((a, b) => b[1] - a[1])[0][0];
    
  const mostActiveDate = Object.entries(messagesByDate)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Calculate conversation initiations (who starts conversations)
  const conversationInitiations: Record<string, number> = {};
  let prevMessageTime: Date | null = null;
  let prevSender: string | null = null;
  
  // Consider a new conversation after 3 hours of silence
  const conversationBreakThreshold = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  
  sortedMessages.forEach(msg => {
    if (!prevMessageTime || 
        (msg.timestamp.getTime() - prevMessageTime.getTime() > conversationBreakThreshold)) {
      // New conversation started
      conversationInitiations[msg.sender] = (conversationInitiations[msg.sender] || 0) + 1;
    }
    
    prevMessageTime = msg.timestamp;
    prevSender = msg.sender;
  });
  
  // Calculate average response times
  const responseTimeAverage: Record<string, number> = {};
  const responseTimeSums: Record<string, number> = {};
  const responseTimeCounts: Record<string, number> = {};
  
  for (let i = 1; i < sortedMessages.length; i++) {
    const currentMsg = sortedMessages[i];
    const prevMsg = sortedMessages[i - 1];
    
    // Only calculate response time if sender changed
    if (currentMsg.sender !== prevMsg.sender) {
      const responseTime = currentMsg.timestamp.getTime() - prevMsg.timestamp.getTime();
      
      // Ignore responses that took more than 1 day
      if (responseTime < 24 * 60 * 60 * 1000) {
        if (!responseTimeSums[currentMsg.sender]) {
          responseTimeSums[currentMsg.sender] = 0;
          responseTimeCounts[currentMsg.sender] = 0;
        }
        
        responseTimeSums[currentMsg.sender] += responseTime;
        responseTimeCounts[currentMsg.sender]++;
      }
    }
  }
  
  // Calculate average response time for each participant
  participants.forEach(participant => {
    if (responseTimeCounts[participant] && responseTimeCounts[participant] > 0) {
      // Convert to minutes
      responseTimeAverage[participant] = 
        responseTimeSums[participant] / responseTimeCounts[participant] / (60 * 1000);
    } else {
      responseTimeAverage[participant] = 0;
    }
  });
  
  // Find longest silence period
  let longestSilence = {
    start: new Date(),
    end: new Date(),
    duration: 0
  };
  
  for (let i = 1; i < sortedMessages.length; i++) {
    const currentMsg = sortedMessages[i];
    const prevMsg = sortedMessages[i - 1];
    
    const silenceDuration = 
      (currentMsg.timestamp.getTime() - prevMsg.timestamp.getTime()) / (60 * 60 * 1000); // in hours
    
    if (silenceDuration > longestSilence.duration) {
      longestSilence = {
        start: prevMsg.timestamp,
        end: currentMsg.timestamp,
        duration: silenceDuration
      };
    }
  }
  
  // Find the date with longest conversation (most messages)
  const longestConversationDate = mostActiveDate;
  
  // Calculate media statistics
  const mediaStats = {
    totalMedia: messages.filter(msg => msg.type === 'media').length,
    byType: {} as Record<string, number>,
    byUser: {} as Record<string, Record<string, number>>
  };
  
  // Initialize media stats by user
  participants.forEach(participant => {
    mediaStats.byUser[participant] = {};
  });
  
  messages.forEach(msg => {
    if (msg.type === 'media' && msg.mediaType) {
      // Count by media type
      mediaStats.byType[msg.mediaType] = (mediaStats.byType[msg.mediaType] || 0) + 1;
      
      // Count by user and media type
      if (!mediaStats.byUser[msg.sender][msg.mediaType]) {
        mediaStats.byUser[msg.sender][msg.mediaType] = 0;
      }
      mediaStats.byUser[msg.sender][msg.mediaType]++;
    }
  });
  
  // Create empty emoji stats (will be filled by emojiAnalyzer)
  const emojiStats = {
    totalEmojis: 0,
    emojiCounts: {},
    emojiCountsByUser: {},
    mostUsedEmojis: []
  };
  
  return {
    participants,
    totalMessages: messages.length,
    dateRange: {
      start: firstMessage.timestamp,
      end: lastMessage.timestamp
    },
    messageStats,
    emojiStats,
    timeStats: {
      byHour: messagesByHour,
      byDay: messagesByDay,
      byMonth: messagesByMonth,
      byDate: messagesByDate,
      mostActiveHour: parseInt(mostActiveHour),
      mostActiveDay: parseInt(mostActiveDay),
      mostActiveDate
    },
    mediaStats,
    firstMessage,
    longestConversationDate,
    conversationInitiations,
    responseTimeAverage,
    longestSilence: longestSilence.duration > 0 ? longestSilence : undefined
  };
};

export default analyzeMessages;