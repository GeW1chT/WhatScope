import { ChatAnalysis, WhatsAppMessage } from "@/types/chat";

// Define romantic words in Turkish
const romanticWords = ['aşkım', 'canım', 'sevgilim', 'tatlım', 'hayatım', 'birtanem', 'bebeğim', 'seviyorum', 'özledim', 'kalp'];

// Define apology and argument words in Turkish
const apologyWords = ['özür', 'sorry', 'pardon', 'affet', 'kusura bakma', 'üzgünüm', 'hata'];
const argumentWords = ['kızgınım', 'sinirliyim', 'kızdım', 'saçmalama', 'yapma', 'istemiyorum', 'rahatsız', 'kızma'];

// Define funny words and expressions
const funnyWords = ['haha', 'lol', 'ahaha', 'sjsj', 'komik', 'espri', 'gülmekten', 'kahkaha'];

// Define food-related words
const foodWords = ['yemek', 'acıktım', 'kahvaltı', 'öğle yemeği', 'akşam yemeği', 'pizza', 'hamburger', 'yedim', 'yiyelim', 'restoran', 'cafe', 'lezzetli', 'dürüm', 'döner', 'lahmacun'];

// Define excuse phrases
const excuseWords = {
  'trafikte': ['trafik', 'trafikte', 'yoldayım', 'araçtayım', 'otobüsteyim'],
  'toplantıda': ['toplantı', 'toplantıdayım', 'işte', 'meşgulüm', 'işteyim', 'çalışıyorum'],
  'uyuyordum': ['uyuyordum', 'uyumuşum', 'uyku', 'uykudaydım', 'geç uyandım', 'alarm'],
  'telefon': ['şarjım', 'şarj', 'telefonum', 'batarya', 'kısık', 'sessizde', 'duymadım'],
  'dışarıdaydım': ['dışarıdaydım', 'çıktım', 'arkadaşlarla', 'görüşüyordum', 'buluşma']
};

// Interface for relationship analysis results
export interface RelationshipAnalysis {
  romanticAnalysis: {
    romanticWordCounts: Record<string, number>;
    mostRomanticPerson: string;
    romanticScore: number;
    heartEmojisCount: Record<string, number>;
  };
  conflictAnalysis: {
    apologyWordCounts: Record<string, number>;
    argumentWordCounts: Record<string, number>;
    mostApologeticPerson: string;
    mostArgumentativePerson: string;
    conflictResolutionScore: number;
  };
  humorAnalysis: {
    funnyWordCounts: Record<string, number>;
    laughEmojiCounts: Record<string, number>;
    funniestPerson: string;
    humorScore: number;
  };
  timingAnalysis: {
    nightOwlScore: Record<string, number>;
    earlyBirdScore: Record<string, number>;
    sleepPatternType: Record<string, 'nightOwl' | 'earlyBird' | 'balanced'>;
  };
  talkativenessAnalysis: {
    averageMessageLength: Record<string, number>;
    mostTalkativePerson: string;
    longestMessage: {
      sender: string;
      length: number;
      preview: string;
    };
  };
  funnyStats: {
    excuseAnalysis: Record<string, Record<string, number>>;
    favoriteExcuse: Record<string, string>;
    foodObsession: Record<string, number>;
    foodLover: string;
    selfieTaker: string;
    photoShareCount: Record<string, number>;
    emojiPersonality: Record<string, string>;
    slowResponder: {
      person: string;
      averageTime: number; // in minutes
    };
  };
  compatibilityScores: {
    comedyCompatibility: number;
    timeCompatibility: number;
    communicationCompatibility: number;
    emojiCompatibility: number;
    overallCompatibility: number;
  };
  funnyTitles: {
    shakespeareTitle: string; // Person with longest messages
    emojiArtistTitle: string; // Person using most diverse emojis
    patienceTestTitle: string; // Person with fastest responses
    nightBomberTitle: string; // Most active after midnight
  };
}

export const analyzeRelationship = (messages: WhatsAppMessage[], analysis: ChatAnalysis): ChatAnalysis & { relationshipAnalysis: RelationshipAnalysis } => {
  const participants = analysis.participants;
  const emojiAnalysis = analysis.emojiStats;
  
  // Initialize relationship analysis
  const relationshipAnalysis: RelationshipAnalysis = {
    romanticAnalysis: {
      romanticWordCounts: {},
      mostRomanticPerson: '',
      romanticScore: 0,
      heartEmojisCount: {},
    },
    conflictAnalysis: {
      apologyWordCounts: {},
      argumentWordCounts: {},
      mostApologeticPerson: '',
      mostArgumentativePerson: '',
      conflictResolutionScore: 0,
    },
    humorAnalysis: {
      funnyWordCounts: {},
      laughEmojiCounts: {},
      funniestPerson: '',
      humorScore: 0,
    },
    timingAnalysis: {
      nightOwlScore: {},
      earlyBirdScore: {},
      sleepPatternType: {},
    },
    talkativenessAnalysis: {
      averageMessageLength: {},
      mostTalkativePerson: '',
      longestMessage: {
        sender: '',
        length: 0,
        preview: '',
      },
    },
    funnyStats: {
      excuseAnalysis: {},
      favoriteExcuse: {},
      foodObsession: {},
      foodLover: '',
      selfieTaker: '',
      photoShareCount: {},
      emojiPersonality: {},
      slowResponder: {
        person: '',
        averageTime: 0,
      },
    },
    compatibilityScores: {
      comedyCompatibility: 0,
      timeCompatibility: 0,
      communicationCompatibility: 0,
      emojiCompatibility: 0,
      overallCompatibility: 0,
    },
    funnyTitles: {
      shakespeareTitle: '',
      emojiArtistTitle: '',
      patienceTestTitle: '',
      nightBomberTitle: '',
    },
  };

  // Initialize counters for each participant
  participants.forEach(participant => {
    relationshipAnalysis.romanticAnalysis.romanticWordCounts[participant] = 0;
    relationshipAnalysis.romanticAnalysis.heartEmojisCount[participant] = 0;
    
    relationshipAnalysis.conflictAnalysis.apologyWordCounts[participant] = 0;
    relationshipAnalysis.conflictAnalysis.argumentWordCounts[participant] = 0;
    
    relationshipAnalysis.humorAnalysis.funnyWordCounts[participant] = 0;
    relationshipAnalysis.humorAnalysis.laughEmojiCounts[participant] = 0;
    
    relationshipAnalysis.timingAnalysis.nightOwlScore[participant] = 0;
    relationshipAnalysis.timingAnalysis.earlyBirdScore[participant] = 0;
    
    relationshipAnalysis.talkativenessAnalysis.averageMessageLength[participant] = 0;
    
    relationshipAnalysis.funnyStats.excuseAnalysis[participant] = {};
    relationshipAnalysis.funnyStats.foodObsession[participant] = 0;
    relationshipAnalysis.funnyStats.photoShareCount[participant] = 0;
    relationshipAnalysis.funnyStats.emojiPersonality[participant] = '';
    
    // Initialize excuse types
    Object.keys(excuseWords).forEach(excuseType => {
      relationshipAnalysis.funnyStats.excuseAnalysis[participant][excuseType] = 0;
    });
  });

  // Process messages for relationship analysis
  const participantMessages = participants.map(p => 0);
  const participantCharCounts = participants.map(p => 0);
  
  messages.forEach(msg => {
    const senderIndex = participants.indexOf(msg.sender);
    const content = msg.content.toLowerCase();
    
    // Message length for talkativeness
    const msgLength = msg.content.length;
    participantMessages[senderIndex]++;
    participantCharCounts[senderIndex] += msgLength;
    
    // Check for longest message
    if (msgLength > relationshipAnalysis.talkativenessAnalysis.longestMessage.length) {
      relationshipAnalysis.talkativenessAnalysis.longestMessage = {
        sender: msg.sender,
        length: msgLength,
        preview: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : '')
      };
    }
    
    // Check timing (night owl vs early bird)
    const hour = msg.timestamp.getHours();
    if (hour >= 22 || hour < 3) {
      relationshipAnalysis.timingAnalysis.nightOwlScore[msg.sender]++;
    }
    if (hour >= 5 && hour < 9) {
      relationshipAnalysis.timingAnalysis.earlyBirdScore[msg.sender]++;
    }
    
    // Check for romantic words
    romanticWords.forEach(word => {
      if (content.includes(word)) {
        relationshipAnalysis.romanticAnalysis.romanticWordCounts[msg.sender]++;
      }
    });
    
    // Check for heart emojis
    if (msg.emojis && msg.emojis.some(emoji => emoji.includes('❤') || emoji === '💕' || emoji === '💓' || emoji === '💗' || emoji === '💖' || emoji === '💘')) {
      relationshipAnalysis.romanticAnalysis.heartEmojisCount[msg.sender]++;
    }
    
    // Check for apology words
    apologyWords.forEach(word => {
      if (content.includes(word)) {
        relationshipAnalysis.conflictAnalysis.apologyWordCounts[msg.sender]++;
      }
    });
    
    // Check for argument words
    argumentWords.forEach(word => {
      if (content.includes(word)) {
        relationshipAnalysis.conflictAnalysis.argumentWordCounts[msg.sender]++;
      }
    });
    
    // Check for funny words
    funnyWords.forEach(word => {
      if (content.includes(word)) {
        relationshipAnalysis.humorAnalysis.funnyWordCounts[msg.sender]++;
      }
    });
    
    // Check for laugh emojis
    if (msg.emojis && msg.emojis.some(emoji => emoji === '😂' || emoji === '🤣' || emoji === '😹' || emoji === '😆')) {
      relationshipAnalysis.humorAnalysis.laughEmojiCounts[msg.sender]++;
    }
    
    // Check for food words
    foodWords.forEach(word => {
      if (content.includes(word)) {
        relationshipAnalysis.funnyStats.foodObsession[msg.sender]++;
      }
    });
    
    // Check for excuses
    Object.keys(excuseWords).forEach(excuseType => {
      excuseWords[excuseType].forEach(word => {
        if (content.includes(word)) {
          relationshipAnalysis.funnyStats.excuseAnalysis[msg.sender][excuseType]++;
        }
      });
    });
    
    // Check for photo sharing
    if (msg.type === 'media' && msg.mediaType === 'image') {
      relationshipAnalysis.funnyStats.photoShareCount[msg.sender]++;
    }
  });
  
  // Calculate average message lengths
  participants.forEach((participant, index) => {
    if (participantMessages[index] > 0) {
      relationshipAnalysis.talkativenessAnalysis.averageMessageLength[participant] = 
        participantCharCounts[index] / participantMessages[index];
    }
  });
  
  // Find most romantic person
  let maxRomanticScore = -1;
  participants.forEach(participant => {
    const romanticScore = 
      relationshipAnalysis.romanticAnalysis.romanticWordCounts[participant] +
      relationshipAnalysis.romanticAnalysis.heartEmojisCount[participant] * 2;
    
    if (romanticScore > maxRomanticScore) {
      maxRomanticScore = romanticScore;
      relationshipAnalysis.romanticAnalysis.mostRomanticPerson = participant;
    }
  });
  relationshipAnalysis.romanticAnalysis.romanticScore = maxRomanticScore;
  
  // Find most apologetic and argumentative persons
  let maxApologyScore = -1;
  let maxArgumentScore = -1;
  participants.forEach(participant => {
    const apologyScore = relationshipAnalysis.conflictAnalysis.apologyWordCounts[participant];
    const argumentScore = relationshipAnalysis.conflictAnalysis.argumentWordCounts[participant];
    
    if (apologyScore > maxApologyScore) {
      maxApologyScore = apologyScore;
      relationshipAnalysis.conflictAnalysis.mostApologeticPerson = participant;
    }
    
    if (argumentScore > maxArgumentScore) {
      maxArgumentScore = argumentScore;
      relationshipAnalysis.conflictAnalysis.mostArgumentativePerson = participant;
    }
  });
  
  // Calculate conflict resolution score (ratio of apologies to arguments)
  const totalApologies = participants.reduce((sum, p) => 
    sum + relationshipAnalysis.conflictAnalysis.apologyWordCounts[p], 0);
  const totalArguments = participants.reduce((sum, p) => 
    sum + relationshipAnalysis.conflictAnalysis.argumentWordCounts[p], 0);
  
  relationshipAnalysis.conflictAnalysis.conflictResolutionScore = 
    totalArguments > 0 ? (totalApologies / totalArguments) * 100 : 100;
  
  // Find funniest person
  let maxHumorScore = -1;
  participants.forEach(participant => {
    const humorScore = 
      relationshipAnalysis.humorAnalysis.funnyWordCounts[participant] +
      relationshipAnalysis.humorAnalysis.laughEmojiCounts[participant] * 2;
    
    if (humorScore > maxHumorScore) {
      maxHumorScore = humorScore;
      relationshipAnalysis.humorAnalysis.funniestPerson = participant;
    }
  });
  relationshipAnalysis.humorAnalysis.humorScore = maxHumorScore;
  
  // Determine sleep pattern type for each participant
  participants.forEach(participant => {
    const nightScore = relationshipAnalysis.timingAnalysis.nightOwlScore[participant];
    const morningScore = relationshipAnalysis.timingAnalysis.earlyBirdScore[participant];
    
    if (nightScore > morningScore * 2) {
      relationshipAnalysis.timingAnalysis.sleepPatternType[participant] = 'nightOwl';
    } else if (morningScore > nightScore * 2) {
      relationshipAnalysis.timingAnalysis.sleepPatternType[participant] = 'earlyBird';
    } else {
      relationshipAnalysis.timingAnalysis.sleepPatternType[participant] = 'balanced';
    }
  });
  
  // Find most talkative person
  let maxAvgLength = -1;
  participants.forEach(participant => {
    const avgLength = relationshipAnalysis.talkativenessAnalysis.averageMessageLength[participant];
    if (avgLength > maxAvgLength) {
      maxAvgLength = avgLength;
      relationshipAnalysis.talkativenessAnalysis.mostTalkativePerson = participant;
    }
  });
  
  // Find favorite excuse for each person
  participants.forEach(participant => {
    let maxExcuseCount = -1;
    let favoriteExcuse = '';
    
    Object.keys(excuseWords).forEach(excuseType => {
      const count = relationshipAnalysis.funnyStats.excuseAnalysis[participant][excuseType];
      if (count > maxExcuseCount) {
        maxExcuseCount = count;
        favoriteExcuse = excuseType;
      }
    });
    
    relationshipAnalysis.funnyStats.favoriteExcuse[participant] = favoriteExcuse;
  });
  
  // Find food lover
  let maxFoodScore = -1;
  participants.forEach(participant => {
    const foodScore = relationshipAnalysis.funnyStats.foodObsession[participant];
    if (foodScore > maxFoodScore) {
      maxFoodScore = foodScore;
      relationshipAnalysis.funnyStats.foodLover = participant;
    }
  });
  
  // Find selfie taker
  let maxPhotoCount = -1;
  participants.forEach(participant => {
    const photoCount = relationshipAnalysis.funnyStats.photoShareCount[participant];
    if (photoCount > maxPhotoCount) {
      maxPhotoCount = photoCount;
      relationshipAnalysis.funnyStats.selfieTaker = participant;
    }
  });
  
  // Determine emoji personality based on most used emoji
  participants.forEach(participant => {
    if (emojiAnalysis.emojiCountsByUser[participant]) {
      let maxCount = 0;
      let dominantEmoji = '';
      
      Object.entries(emojiAnalysis.emojiCountsByUser[participant]).forEach(([emoji, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantEmoji = emoji;
        }
      });
      
      // Assign personality based on dominant emoji
      let personality = '';
      if (dominantEmoji.includes('❤') || dominantEmoji === '💕' || dominantEmoji === '💓') {
        personality = 'Romantik';
      } else if (dominantEmoji === '😂' || dominantEmoji === '🤣') {
        personality = 'Komedyen';
      } else if (dominantEmoji === '👍' || dominantEmoji === '🙏') {
        personality = 'Olumlu';
      } else if (dominantEmoji === '😡' || dominantEmoji === '😠') {
        personality = 'Öfkeli';
      } else if (dominantEmoji === '😭' || dominantEmoji === '😢') {
        personality = 'Duygusal';
      } else if (dominantEmoji === '🤔' || dominantEmoji === '🧐') {
        personality = 'Düşünceli';
      } else {
        personality = 'Karma';
      }
      
      relationshipAnalysis.funnyStats.emojiPersonality[participant] = personality;
    } else {
      relationshipAnalysis.funnyStats.emojiPersonality[participant] = 'Emoji Kullanmıyor';
    }
  });
  
  // Find slow responder
  let maxResponseTime = -1;
  participants.forEach(participant => {
    const responseTime = analysis.responseTimeAverage[participant];
    if (responseTime > maxResponseTime) {
      maxResponseTime = responseTime;
      relationshipAnalysis.funnyStats.slowResponder = {
        person: participant,
        averageTime: responseTime
      };
    }
  });
  
  // Calculate compatibility scores (only if there are 2 participants)
  if (participants.length === 2) {
    // Comedy compatibility - based on similar humor patterns
    const p1 = participants[0];
    const p2 = participants[1];
    
    const humorSimilarity = Math.min(
      relationshipAnalysis.humorAnalysis.funnyWordCounts[p1], 
      relationshipAnalysis.humorAnalysis.funnyWordCounts[p2]
    ) / Math.max(
      relationshipAnalysis.humorAnalysis.funnyWordCounts[p1], 
      relationshipAnalysis.humorAnalysis.funnyWordCounts[p2] || 1
    );
    
    relationshipAnalysis.compatibilityScores.comedyCompatibility = humorSimilarity * 100;
    
    // Time compatibility - based on activity in similar hours
    const sleepPatternMatch = relationshipAnalysis.timingAnalysis.sleepPatternType[p1] === 
      relationshipAnalysis.timingAnalysis.sleepPatternType[p2];
    
    relationshipAnalysis.compatibilityScores.timeCompatibility = sleepPatternMatch ? 90 : 40;
    
    // Communication compatibility - based on similar message lengths
    const avgLength1 = relationshipAnalysis.talkativenessAnalysis.averageMessageLength[p1];
    const avgLength2 = relationshipAnalysis.talkativenessAnalysis.averageMessageLength[p2];
    
    const communicationSimilarity = Math.min(avgLength1, avgLength2) / Math.max(avgLength1, avgLength2 || 1);
    relationshipAnalysis.compatibilityScores.communicationCompatibility = communicationSimilarity * 100;
    
    // Emoji compatibility - based on similar emoji usage
    const emojiSet1 = new Set(Object.keys(emojiAnalysis.emojiCountsByUser[p1] || {}));
    const emojiSet2 = new Set(Object.keys(emojiAnalysis.emojiCountsByUser[p2] || {}));
    
    const commonEmojis = [...emojiSet1].filter(emoji => emojiSet2.has(emoji)).length;
    const totalUniqueEmojis = new Set([...emojiSet1, ...emojiSet2]).size;
    
    relationshipAnalysis.compatibilityScores.emojiCompatibility = 
      totalUniqueEmojis > 0 ? (commonEmojis / totalUniqueEmojis) * 100 : 50;
    
    // Overall compatibility
    relationshipAnalysis.compatibilityScores.overallCompatibility = (
      relationshipAnalysis.compatibilityScores.comedyCompatibility +
      relationshipAnalysis.compatibilityScores.timeCompatibility +
      relationshipAnalysis.compatibilityScores.communicationCompatibility +
      relationshipAnalysis.compatibilityScores.emojiCompatibility
    ) / 4;
  }
  
  // Assign funny titles
  relationshipAnalysis.funnyTitles.shakespeareTitle = relationshipAnalysis.talkativenessAnalysis.mostTalkativePerson;
  
  // Find emoji artist (most diverse emoji user)
  let maxEmojiDiversity = -1;
  participants.forEach(participant => {
    const emojiDiversity = Object.keys(emojiAnalysis.emojiCountsByUser[participant] || {}).length;
    if (emojiDiversity > maxEmojiDiversity) {
      maxEmojiDiversity = emojiDiversity;
      relationshipAnalysis.funnyTitles.emojiArtistTitle = participant;
    }
  });
  
  // Find fastest responder
  let minResponseTime = Number.MAX_VALUE;
  participants.forEach(participant => {
    const responseTime = analysis.responseTimeAverage[participant] || Number.MAX_VALUE;
    if (responseTime < minResponseTime && responseTime > 0) {
      minResponseTime = responseTime;
      relationshipAnalysis.funnyTitles.patienceTestTitle = participant;
    }
  });
  
  // Find night bomber (most active after midnight)
  let maxNightScore = -1;
  participants.forEach(participant => {
    const nightScore = relationshipAnalysis.timingAnalysis.nightOwlScore[participant];
    if (nightScore > maxNightScore) {
      maxNightScore = nightScore;
      relationshipAnalysis.funnyTitles.nightBomberTitle = participant;
    }
  });
  
  return {
    ...analysis,
    relationshipAnalysis
  };
};

export default analyzeRelationship;