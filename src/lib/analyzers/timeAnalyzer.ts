import { ChatAnalysis, WhatsAppMessage } from "@/types/chat";

export const analyzeTimePatterns = (messages: WhatsAppMessage[], analysis: ChatAnalysis): ChatAnalysis => {
  // Time pattern analysis is already mostly covered in messageAnalyzer.ts
  // This function enhances that analysis with more detailed time patterns
  
  // Group messages by year-month for seasonal analysis
  const messagesByYearMonth: Record<string, number> = {};
  
  messages.forEach(msg => {
    const yearMonth = `${msg.timestamp.getFullYear()}-${String(msg.timestamp.getMonth() + 1).padStart(2, '0')}`;
    messagesByYearMonth[yearMonth] = (messagesByYearMonth[yearMonth] || 0) + 1;
  });
  
  // Analyze messages by time of day (morning, afternoon, evening, night)
  const timeOfDayCategories = {
    morning: 0,   // 6-12
    afternoon: 0, // 12-18
    evening: 0,   // 18-22
    night: 0      // 22-6
  };
  
  messages.forEach(msg => {
    const hour = msg.timestamp.getHours();
    
    if (hour >= 6 && hour < 12) {
      timeOfDayCategories.morning++;
    } else if (hour >= 12 && hour < 18) {
      timeOfDayCategories.afternoon++;
    } else if (hour >= 18 && hour < 22) {
      timeOfDayCategories.evening++;
    } else {
      timeOfDayCategories.night++;
    }
  });
  
  // Analyze weekend vs. weekday activity
  const weekdayVsWeekend = {
    weekday: 0, // Monday-Friday
    weekend: 0  // Saturday-Sunday
  };
  
  messages.forEach(msg => {
    const day = msg.timestamp.getDay();
    if (day === 0 || day === 6) { // Sunday or Saturday
      weekdayVsWeekend.weekend++;
    } else {
      weekdayVsWeekend.weekday++;
    }
  });
  
  // Add enhanced time analysis to the existing analysis
  return {
    ...analysis,
    timeStats: {
      ...analysis.timeStats,
      byYearMonth: messagesByYearMonth,
      timeOfDay: timeOfDayCategories,
      weekdayVsWeekend
    }
  };
};

export default analyzeTimePatterns;