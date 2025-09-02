import { WhatsAppMessage } from "@/types/chat";

/**
 * Parse WhatsApp chat export text file with progressive loading for large files
 * 
 * Expected format:
 * [DD.MM.YY, HH:MM:SS] Sender Name: Message content
 * or
 * [DD.MM.YY, HH:MM:SS] Sender Name: <Media omitted>
 */
export const parseWhatsAppChat = async (chatText: string, onProgress?: (percent: number) => void): Promise<WhatsAppMessage[]> => {
  console.time('parseWhatsAppChat');
  try {
    console.log('Starting chat parsing with text length:', chatText.length);
    console.log('First 100 chars of chat:', chatText.substring(0, 100));
    
    // Normalize line breaks to avoid issues with different platforms
    chatText = chatText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // First check if the chat format looks valid
    const firstLineMatch = chatText.match(/^\s*\[\d{1,2}\.\d{1,2}\.\d{2,4},?\s+\d{1,2}:\d{1,2}(?::\d{1,2})?\]/);
    if (!firstLineMatch) {
      console.warn('Chat format doesn\'t match expected WhatsApp format in the first line');
      // Continue anyway, as the file might have some header content
    }
    
    // Split into processing chunks by line for more reliable processing
    const lines = chatText.split('\n');
    const totalLines = lines.length;
    console.log(`Processing ${totalLines} lines of chat`);
    
    // For very large files, we'll process in smaller chunks to prevent UI freezing
    const chunkSize = totalLines > 10000 ? 50 : 100; // Smaller chunks for very large files
    const messages: WhatsAppMessage[] = [];
    let currentMessage: WhatsAppMessage | null = null;
    let lineIndex = 0;
    let processedLines = 0;
    
    // Process the chat text line by line with progressive loading
    while (lineIndex < lines.length) {
      const chunkStartLine = lineIndex;
      
      // Process a chunk of lines at a time
      while (lineIndex < lines.length && (lineIndex - chunkStartLine) < chunkSize) {
        const line = lines[lineIndex];
        const messageMatch = line.match(/^\[(\d{1,2})\.(\d{1,2})\.(\d{2,4}),?\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\]\s+([^:]+):?\s*(.*)/);
        
        if (messageMatch) {
          // This line starts a new message
          
          // Save the previous message if it exists
          if (currentMessage) {
            messages.push(currentMessage);
          }
          
          // Extract components
          const [
            _, // Full match
            day,
            month,
            year,
            hour,
            minute,
            second,
            sender,
            content
          ] = messageMatch;
          
          // Create date from components
          // Handle both 2-digit and 4-digit year formats
          let yearValue = year;
          if (year.length === 2) {
            yearValue = `20${year}`; // Assuming 20xx for 2-digit years
          }
          
          // Use try-catch to handle potential date parsing errors
          let timestamp: Date;
          try {
            timestamp = new Date(
              parseInt(yearValue),
              parseInt(month) - 1, // JS months are 0-indexed
              parseInt(day),
              parseInt(hour),
              parseInt(minute),
              second ? parseInt(second) : 0
            );
            
            // Check if date is valid
            if (isNaN(timestamp.getTime())) {
              console.warn('Invalid date detected, using current date as fallback');
              timestamp = new Date();
            }
          } catch (e) {
            console.warn('Error parsing date, using current date as fallback', e);
            timestamp = new Date();
          }
          
          // Sanitize content and sender to handle potential encoding issues
          const sanitizedContent = content || '';
          const sanitizedSender = (sender || '').trim();
          
          // Start a new message
          currentMessage = {
            timestamp,
            sender: sanitizedSender,
            content: sanitizedContent,
            type: 'text' // Will be updated if needed
          };
          
        } else if (currentMessage && line.trim().length > 0) {
          // This line is a continuation of the current message
          currentMessage.content += '\n' + line;
        }
        
        lineIndex++;
        processedLines++;
      }
      
      // Update progress
      if (onProgress && totalLines > 0) {
        const progressPercent = Math.min(95, Math.floor((lineIndex / totalLines) * 95));
        onProgress(progressPercent);
      }
      
      // For very large files, yield control back to the browser to prevent freezing
      if (totalLines > 5000 && lineIndex % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      // Log progress for very large files
      if (totalLines > 10000 && chunkStartLine % 5000 === 0) {
        console.log(`Processed ${lineIndex}/${totalLines} lines (${Math.floor((lineIndex / totalLines) * 100)}%)`);
      }
    }
    
    // Don't forget to add the last message
    if (currentMessage) {
      messages.push(currentMessage);
    }
    
    console.log(`Parsed ${messages.length} messages from chat text`);
    
    // Post-process messages to determine types and extract emojis with progress updates
    const totalMessages = messages.length;
    for (let i = 0; i < totalMessages; i++) {
      const message = messages[i];
      const content = message.content || '';
      
      // Determine message type
      if (content.includes('<Media omitted>') || 
          content.includes('omitted>') ||
          content.includes('<Media') ||
          content.includes('omitted')) {
        message.type = 'media';
        
        // Try to determine media type
        if (content.includes('image')) {
          message.mediaType = 'image';
        } else if (content.includes('video')) {
          message.mediaType = 'video';
        } else if (content.includes('audio')) {
          message.mediaType = 'audio';
        } else if (content.includes('document')) {
          message.mediaType = 'document';
        }
      } else if (content.includes('joined') ||
                 content.includes('group') ||
                 content.includes('left') ||
                 content.includes('changed') ||
                 content.includes('removed') ||
                 content.includes('added') ||
                 content.includes('created')) {
        message.type = 'system';
      }
      
      // Try to extract emojis (only for text messages to improve performance)
      if (message.type === 'text') {
        try {
          const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
          const emojis = content.match(emojiRegex) || [];
          if (emojis.length > 0) {
            message.emojis = emojis;
          }
        } catch (e) {
          console.warn('Error detecting emojis:', e);
        }
      }
      
      // Update progress for post-processing
      if (onProgress && i % Math.max(1, Math.floor(totalMessages / 10)) === 0) {
        // Progress from 95-100% during post-processing
        const progressPercent = 95 + Math.min(5, Math.floor((i / totalMessages) * 5));
        onProgress(progressPercent);
      }
    }
  
    // Sort messages by timestamp to ensure correct order
    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    console.log(`Post-processing complete, final message count: ${messages.length}`);
    console.timeEnd('parseWhatsAppChat');
    
    if (onProgress) {
      onProgress(100); // Signal completion
    }
    
    return messages;
  } catch (error) {
    console.error('Error parsing chat:', error);
    console.timeEnd('parseWhatsAppChat');
    throw new Error(`Mesaj ayrıştırma hatası: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export default parseWhatsAppChat;