import { useState } from 'react';

interface FileUploadHookResult {
  file: File | null;
  fileContent: string | null;
  isLoading: boolean;
  error: string | null;
  fileWarning: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  reset: () => void;
}

export const useFileUpload = (): FileUploadHookResult => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.txt')) {
      setError('Lütfen .txt formatında bir WhatsApp sohbet dosyası yükleyin.');
      setFile(null);
      setFileContent(null);
      return;
    }

    // Check file size - increase limit to 15MB for better performance with large files
    if (file.size > 15 * 1024 * 1024) {
      setError('Dosya boyutu çok büyük (15MB limit). Daha küçük bir sohbet seçin veya sohbeti birkaç parçaya bölün.');
      setFile(null);
      setFileContent(null);
      return;
    }

    setFile(file);
    setIsLoading(true);
    setError(null);
    
    // Set warning for large files
    if (file.size > 5 * 1024 * 1024) {
      setFileWarning('Bu dosya oldukça büyük. Analiz işlemi birkaç dakika sürebilir.');
    } else if (file.size > 1000 * 1024) {
      setFileWarning('Büyük dosya. Analiz birkaç saniye sürebilir.');
    } else {
      setFileWarning(null);
    }

    try {
      console.log(`Reading file: ${file.name}, size: ${(file.size / 1024).toFixed(2)} KB`);
      
      // Use FileReader for better compatibility with different encodings
      const reader = new FileReader();
      
      const result = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            const content = e.target.result as string;
            console.log(`File read complete. Content length: ${content.length} characters`);
            // Check if content looks like a WhatsApp chat
            if (content.length === 0) {
              reject(new Error('Dosya içeriği boş.'));
              return;
            }
            
            // Try to detect and fix common encoding issues
            let processedContent = content;
            
            // Fix for Turkish encoding issues in WhatsApp exports
            if (content.includes('\u00c3')) {
              console.log('Detected possible encoding issues, attempting to fix...');
              // Common Turkish character replacements that might be corrupted
              processedContent = processedContent
                .replace(/\u00c3\u0087/g, '\u00c7') // Ç
                .replace(/\u00c3\u00a7/g, '\u00e7') // ç
                .replace(/\u00c3\u0096/g, '\u00d6') // Ö
                .replace(/\u00c3\u00b6/g, '\u00f6') // ö
                .replace(/\u00c3\u009c/g, '\u00dc') // Ü
                .replace(/\u00c3\u00bc/g, '\u00fc') // ü
                .replace(/\u00c3\u0084/g, '\u00c4') // Ä
                .replace(/\u00c3\u00a4/g, '\u00e4') // ä
                .replace(/\u00c3\u009e/g, '\u00de') // Þ
                .replace(/\u00c3\u00be/g, '\u00fe') // þ
                .replace(/\u00c3\u0130/g, '\u0130') // İ
                .replace(/\u00c3\u00b1/g, '\u0131'); // ı
            }
            
            resolve(processedContent);
          } else {
            reject(new Error('Dosya içeriği okunamadı'));
          }
        };
        reader.onerror = () => reject(new Error('Dosya okuma hatası'));
        reader.readAsText(file, 'UTF-8');
      });
      
      setFileContent(result);
    } catch (err) {
      console.error('File reading error:', err);
      setError('Dosya okunamadı. Lütfen tekrar deneyin.');
      setFileContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
    }
  };

  const reset = () => {
    setFile(null);
    setFileContent(null);
    setError(null);
    setFileWarning(null);
  };

  return {
    file,
    fileContent,
    isLoading,
    error,
    fileWarning,
    handleFileChange,
    handleFileDrop,
    reset
  };
};

export default useFileUpload;