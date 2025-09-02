import { WhatsAppMessage } from "@/types/chat";

// Extended Turkish sentiment lexicon with emotional categories
export const turkishSentimentLexicon: Record<string, { score: number; category?: string }> = {
  // Positive words - Happiness
  "mutlu": { score: 1, category: "happiness" },
  "sevinç": { score: 1, category: "happiness" },
  "keyifli": { score: 1, category: "happiness" },
  "neşeli": { score: 1, category: "happiness" },
  "harika": { score: 2, category: "happiness" },
  "muhteşem": { score: 2, category: "happiness" },
  "şahane": { score: 2, category: "happiness" },
  "süper": { score: 1, category: "happiness" },
  "mükemmel": { score: 2, category: "happiness" },
  "heyecanlı": { score: 1, category: "happiness" },
  
  // Positive words - Satisfaction
  "iyi": { score: 1, category: "satisfaction" },
  "güzel": { score: 1, category: "satisfaction" },
  "hoş": { score: 1, category: "satisfaction" },
  "memnun": { score: 1, category: "satisfaction" },
  "tatmin": { score: 1, category: "satisfaction" },
  "başarılı": { score: 1, category: "satisfaction" },
  "tamam": { score: 0.5, category: "satisfaction" },
  "evet": { score: 0.5, category: "satisfaction" },
  "tamamdır": { score: 0.5, category: "satisfaction" },
  "olur": { score: 0.5, category: "satisfaction" },
  
  // Positive words - Affection
  "seviyorum": { score: 2, category: "affection" },
  "sevgi": { score: 1, category: "affection" },
  "aşk": { score: 2, category: "affection" },
  "sevgili": { score: 1, category: "affection" },
  "canım": { score: 1, category: "affection" },
  "tatlım": { score: 1, category: "affection" },
  "aşkım": { score: 2, category: "affection" },
  "sevgilim": { score: 2, category: "affection" },
  "hayatım": { score: 1, category: "affection" },
  
  // Positive words - Gratitude
  "teşekkür": { score: 1, category: "gratitude" },
  "teşekkürler": { score: 1, category: "gratitude" },
  "sağol": { score: 1, category: "gratitude" },
  "sağolun": { score: 1, category: "gratitude" },
  "minnettarım": { score: 1, category: "gratitude" },
  "rica": { score: 0.5, category: "gratitude" },
  
  // Positive words - Approval
  "tebrikler": { score: 1, category: "approval" },
  "tebrik": { score: 1, category: "approval" },
  "aferin": { score: 1, category: "approval" },
  "bravo": { score: 1, category: "approval" },
  "helal": { score: 1, category: "approval" },
  "gurur": { score: 1, category: "approval" },
  "takdir": { score: 1, category: "approval" },
  
  // Negative words - Sadness
  "üzgün": { score: -1, category: "sadness" },
  "üzüldüm": { score: -1, category: "sadness" },
  "mutsuz": { score: -1, category: "sadness" },
  "kederli": { score: -1, category: "sadness" },
  "hüzünlü": { score: -1, category: "sadness" },
  "acı": { score: -1, category: "sadness" },
  "ağlamak": { score: -1, category: "sadness" },
  "gözyaşı": { score: -1, category: "sadness" },
  
  // Negative words - Anger
  "kızgın": { score: -1, category: "anger" },
  "sinirli": { score: -1, category: "anger" },
  "öfkeli": { score: -2, category: "anger" },
  "öfke": { score: -2, category: "anger" },
  "kızmak": { score: -1, category: "anger" },
  "sinirlendim": { score: -1, category: "anger" },
  "bağırmak": { score: -1, category: "anger" },
  "çıldırmak": { score: -2, category: "anger" },
  "delirmek": { score: -2, category: "anger" },
  
  // Negative words - Disapproval
  "kötü": { score: -1, category: "disapproval" },
  "berbat": { score: -2, category: "disapproval" },
  "korkunç": { score: -2, category: "disapproval" },
  "rezalet": { score: -2, category: "disapproval" },
  "felaket": { score: -2, category: "disapproval" },
  "hayır": { score: -0.5, category: "disapproval" },
  "olmaz": { score: -1, category: "disapproval" },
  "imkansız": { score: -1, category: "disapproval" },
  "yanlış": { score: -0.5, category: "disapproval" },
  "hata": { score: -1, category: "disapproval" },
  "beğenmedim": { score: -1, category: "disapproval" },
  
  // Negative words - Fear
  "korku": { score: -1, category: "fear" },
  "korkuyorum": { score: -1, category: "fear" },
  "endişe": { score: -1, category: "fear" },
  "endişeli": { score: -1, category: "fear" },
  "panik": { score: -2, category: "fear" },
  "tedirgin": { score: -1, category: "fear" },
  "ürkmek": { score: -1, category: "fear" },
  "dehşet": { score: -2, category: "fear" },
  
  // Negative words - Problems
  "sorun": { score: -1, category: "problem" },
  "problem": { score: -1, category: "problem" },
  "sıkıntı": { score: -1, category: "problem" },
  "zorluk": { score: -1, category: "problem" },
  "engel": { score: -1, category: "problem" },
  "arıza": { score: -1, category: "problem" },
  "bozuk": { score: -1, category: "problem" },
  "kriz": { score: -1, category: "problem" },
  
  // Negative words - Regret
  "maalesef": { score: -1, category: "regret" },
  "üzgünüm": { score: -1, category: "regret" },
  "özür": { score: -0.5, category: "regret" },
  "keşke": { score: -0.5, category: "regret" },
  "pişman": { score: -1, category: "regret" },
  "pişmanlık": { score: -1, category: "regret" },
  
  // Common emojis
  "👍": { score: 1, category: "approval" },
  "👎": { score: -1, category: "disapproval" },
  "❤️": { score: 2, category: "affection" },
  "💕": { score: 2, category: "affection" },
  "💔": { score: -1, category: "sadness" },
  "😊": { score: 1, category: "happiness" },
  "😄": { score: 1, category: "happiness" },
  "😁": { score: 1, category: "happiness" },
  "😂": { score: 1, category: "happiness" },
  "🤣": { score: 1, category: "happiness" },
  "😍": { score: 2, category: "affection" },
  "🥰": { score: 2, category: "affection" },
  "😢": { score: -1, category: "sadness" },
  "😭": { score: -1, category: "sadness" },
  "😡": { score: -2, category: "anger" },
  "😠": { score: -1, category: "anger" },
  "😤": { score: -1, category: "anger" },
  "😱": { score: -1, category: "fear" },
  "😨": { score: -1, category: "fear" },
  "😟": { score: -1, category: "fear" },
  "😔": { score: -1, category: "sadness" },
  "😞": { score: -1, category: "sadness" },
  "😒": { score: -0.5, category: "disapproval" },
  "🙄": { score: -0.5, category: "disapproval" },
  "😬": { score: -0.5, category: "disapproval" },
  "👏": { score: 1, category: "approval" },
  "🙏": { score: 1, category: "gratitude" },
};

// Context modifiers change the meaning of words that come before or after
export const contextModifiers: Record<string, number> = {
  "çok": 1.5,     // Amplifies (very)
  "aşırı": 1.5,   // Amplifies (extremely)
  "biraz": 0.5,   // Diminishes (a little)
  "değil": -1,    // Negates (not)
  "hiç": 1.2,     // Amplifies negative (none at all)
  "asla": 1.2,    // Amplifies negative (never)
  "kesinlikle": 1.5, // Amplifies (definitely)
  "tam": 1.2,     // Amplifies (exactly)
  "gerçekten": 1.3, // Amplifies (really)
  "maalesef": 1.2,  // Amplifies negative (unfortunately)
};

// Negation words flip the meaning of sentiments
export const negationWords = [
  "değil",
  "yok",
  "olmaz",
  "olmayan",
  "olmadı",
  "olmadığı",
  "değildi",
  "değilim",
  "değilsin",
  "değiller",
  "değiliz",
  "hiç",
  "asla",
  "hayır"
];

/**
 * Advanced Turkish sentiment analysis function
 * Detects sentiment with context awareness, negation handling, and intensity modifiers
 */
export const analyzeMessageSentiment = (messageContent: string): {
  score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  emotionalCategories: Record<string, number>;
  emotionalCategory?: string;
} => {
  const lowerContent = messageContent.toLowerCase();
  const words = lowerContent.split(/\s+/);
  let totalScore = 0;
  const emotionalCategories: Record<string, number> = {};
  
  // Analyze each word in context
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const sentimentInfo = turkishSentimentLexicon[word];
    
    if (sentimentInfo) {
      let score = sentimentInfo.score;
      let isNegated = false;
      
      // Check for negation in the 3 preceding words
      for (let j = Math.max(0, i - 3); j < i; j++) {
        if (negationWords.includes(words[j])) {
          isNegated = true;
          break;
        }
      }
      
      // Apply negation
      if (isNegated) {
        score = -score;
      }
      
      // Check for modifiers in the preceding word
      if (i > 0 && contextModifiers[words[i - 1]]) {
        score *= contextModifiers[words[i - 1]];
      }
      
      // Track emotional categories
      if (sentimentInfo.category) {
        emotionalCategories[sentimentInfo.category] = 
          (emotionalCategories[sentimentInfo.category] || 0) + Math.abs(score);
      }
      
      totalScore += score;
    }
    
    // Check for multi-word expressions
    if (i < words.length - 1) {
      const twoWordPhrase = word + " " + words[i + 1];
      if (turkishSentimentLexicon[twoWordPhrase]) {
        let score = turkishSentimentLexicon[twoWordPhrase].score;
        
        // Check for negation in the 3 preceding words
        let isNegated = false;
        for (let j = Math.max(0, i - 3); j < i; j++) {
          if (negationWords.includes(words[j])) {
            isNegated = true;
            break;
          }
        }
        
        // Apply negation
        if (isNegated) {
          score = -score;
        }
        
        // Track emotional categories
        if (turkishSentimentLexicon[twoWordPhrase].category) {
          const category = turkishSentimentLexicon[twoWordPhrase].category!;
          emotionalCategories[category] = (emotionalCategories[category] || 0) + Math.abs(score);
        }
        
        totalScore += score;
      }
    }
  }
  
  // Normalize score to range -1 to 1
  let normalizedScore = 0;
  if (totalScore > 0) {
    normalizedScore = Math.min(totalScore, 5) / 5;
  } else if (totalScore < 0) {
    normalizedScore = Math.max(totalScore, -5) / 5;
  }
  
  // Determine sentiment category
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (normalizedScore > 0.2) {
    sentiment = 'positive';
  } else if (normalizedScore < -0.2) {
    sentiment = 'negative';
  }
  
  // Find dominant emotional category
  let dominantCategory: string | undefined;
  let highestCategoryScore = 0;
  
  Object.entries(emotionalCategories).forEach(([category, score]) => {
    if (score > highestCategoryScore) {
      highestCategoryScore = score;
      dominantCategory = category;
    }
  });
  
  return {
    score: normalizedScore,
    sentiment,
    emotionalCategories,
    emotionalCategory: dominantCategory
  };
};

/**
 * Analyze message for context-aware intensity
 * This helps detect if a message is emphatic or intense
 */
export const analyzeMessageIntensity = (messageContent: string): number => {
  const lowerContent = messageContent.toLowerCase();
  
  // Intensity markers
  const intensifiers = [
    "!!!", "!!", 
    "ASLA", "KESİNLİKLE", "LÜTFEN", "ÇOK", "HİÇ",
    "asla", "kesinlikle", "lütfen", "çok", "hiç"
  ];
  
  // ALL CAPS is an intensity indicator
  const wordCount = lowerContent.split(/\s+/).length;
  const capsWordCount = messageContent.split(/\s+/).filter(word => 
    word === word.toUpperCase() && word.length > 2
  ).length;
  
  // Calculate caps ratio (percentage of words in ALL CAPS)
  const capsRatio = wordCount > 0 ? capsWordCount / wordCount : 0;
  
  // Count exclamation marks
  const exclamationCount = (lowerContent.match(/!/g) || []).length;
  
  // Check for intensifiers
  let intensifierCount = 0;
  intensifiers.forEach(intensifier => {
    if (lowerContent.includes(intensifier)) {
      intensifierCount++;
    }
  });
  
  // Calculate overall intensity (0-1 scale)
  const intensity = Math.min(
    (capsRatio * 2 + exclamationCount * 0.2 + intensifierCount * 0.3), 
    1
  );
  
  return intensity;
};

// Export analysis functions
export default {
  analyzeMessageSentiment,
  analyzeMessageIntensity,
  turkishSentimentLexicon,
  contextModifiers,
  negationWords
};