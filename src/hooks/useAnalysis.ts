import { useState, useEffect } from 'react';
import { ChatAnalysis } from '@/types/chat';
import parseWhatsAppChat from '@/lib/parsers/whatsappParser';
import analyzeMessages from '@/lib/analyzers/messageAnalyzer';
import analyzeEmojis from '@/lib/analyzers/emojiAnalyzer';
import analyzeTimePatterns from '@/lib/analyzers/timeAnalyzer';
import analyzeSentiment from '@/lib/analyzers/sentimentAnalyzer';
import analyzeCommunicationDynamics from '@/lib/analyzers/communicationAnalyzer';
import analyzePremiumFeatures from '@/lib/analyzers/premiumAnalyzer';
import analyzeRelationship from '@/lib/analyzers/relationshipAnalyzer';

interface AnalysisHookResult {
  analysis: ChatAnalysis | null;
  isAnalyzing: boolean;
  progress: number; // 0-100
  error: string | null;
  startAnalysis: (chatContent: string) => Promise<ChatAnalysis | null>;
  resetAnalysis: () => void;
}

export const useAnalysis = (): AnalysisHookResult => {
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async (chatContent: string): Promise<ChatAnalysis | null> => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: Parse chat (20% of progress)
      setProgress(5);
      console.log('Starting chat parsing...');
      
      // Validate input text
      if (!chatContent || chatContent.trim().length === 0) {
        throw new Error('Boş dosya. Lütfen geçerli bir WhatsApp sohbet dosyası yükleyin.');
      }
      
      // Check for basic WhatsApp export format
      if (!chatContent.includes('[') || !chatContent.includes(']')) {
        throw new Error('Geçersiz WhatsApp sohbet formatı. Lütfen doğru biçimde dışa aktarılmış bir dosya yükleyin.');
      }
      
      try {
        // Parse the chat content with progress updates
        const updateParseProgress = (percent: number) => {
          // Map parse progress (0-100) to our overall progress (5-25)
          const mappedProgress = 5 + Math.floor((percent / 100) * 20);
          setProgress(mappedProgress);
        };
        
        const messages = await parseWhatsAppChat(chatContent, updateParseProgress);
        console.log(`Parsing complete, found ${messages.length} messages`);
        
        if (messages.length === 0) {
          throw new Error('Sohbette hiç mesaj bulunamadı. Lütfen doğru formatta bir WhatsApp sohbet dosyası yükleyin.');
        }
        
        // If there are too many messages, limit to the most recent ones
        // to prevent performance issues
        const MAX_MESSAGES = 30000; // Increased limit with better performance
        const messagesToAnalyze = messages.length > MAX_MESSAGES 
          ? messages.slice(messages.length - MAX_MESSAGES) 
          : messages;
          
        if (messages.length > MAX_MESSAGES) {
          console.log(`Limiting analysis to the most recent ${MAX_MESSAGES} messages out of ${messages.length} total`);
        }
      
        setProgress(25);
        // Yield control back to browser
        await new Promise(resolve => setTimeout(resolve, 0));

        // Step 2: Basic message analysis (35% of progress)
        console.log('Starting basic message analysis...');
        const baseAnalysis = analyzeMessages(messagesToAnalyze);
        setProgress(35);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Step 3: Emoji analysis (45% of progress)
        console.log('Starting emoji analysis...');
        const analysisWithEmojis = analyzeEmojis(messagesToAnalyze, baseAnalysis);
        setProgress(45);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Step 4: Time pattern analysis (55% of progress)
        console.log('Starting time analysis...');
        const analysisWithTime = analyzeTimePatterns(messagesToAnalyze, analysisWithEmojis);
        setProgress(55);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Step 5: Sentiment analysis (65% of progress)
        console.log('Starting sentiment analysis...');
        const analysisWithSentiment = analyzeSentiment(messagesToAnalyze, analysisWithTime);
        setProgress(65);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Step 6: Communication dynamics analysis (75% of progress)
        console.log('Starting communication dynamics analysis...');
        const analysisWithCommunication = analyzeCommunicationDynamics(messagesToAnalyze, analysisWithSentiment);
        setProgress(75);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Step 7: Premium features analysis (85% of progress)
        console.log('Starting premium features analysis...');
        const analysisWithPremium = analyzePremiumFeatures(messagesToAnalyze, analysisWithCommunication);
        setProgress(85);
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Step 8: Relationship analysis (95% of progress)
        console.log('Starting relationship analysis...');
        const analysisWithRelationship = analyzeRelationship(messagesToAnalyze, analysisWithPremium);
        setProgress(95);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Add messages to the analysis for reference in UI components
        const finalAnalysis = {
          ...analysisWithRelationship,
          messages: messagesToAnalyze
        };

        setProgress(100);
        console.log('Analysis complete!');

        setAnalysis(finalAnalysis);
        return finalAnalysis;
      } catch (parseError) {
        console.error('Error during parsing:', parseError);
        throw new Error(`Mesaj ayrıştırma hatası: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      let errorMessage = 'Analiz sırasında bir hata oluştu.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Check for specific error conditions
      if (errorMessage.includes('not a function') || errorMessage.includes('is undefined')) {
        errorMessage = 'Analiz işleminde beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.';
      } else if (errorMessage.includes('memory') || errorMessage.includes('heap')) {
        errorMessage = 'Dosya çok büyük olduğu için işlenemedi. Daha küçük bir sohbet dosyası deneyiniz.';
      } else if (errorMessage.includes('RegExp')) {
        errorMessage = 'Sohbet formatı okunamadı. Lütfen standart WhatsApp dışa aktarım formatında bir dosya kullanın.';
      } else if (errorMessage.includes('Mesaj ayrıştırma')) {
        // Keep the original error message from the parser
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('geçersiz')) {
        errorMessage = 'Dosya formatı geçersiz. Lütfen dışa aktarım sırasında "Medya olmadan" seçeneğini kullanın.';
      }
      
      setError(errorMessage);
      setAnalysis(null);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setProgress(0);
    setError(null);
  };

  return {
    analysis,
    isAnalyzing,
    progress,
    error,
    startAnalysis,
    resetAnalysis
  };
};

export default useAnalysis;