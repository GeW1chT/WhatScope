'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useFileUpload from '@/hooks/useFileUpload';
import useAnalysis from '@/hooks/useAnalysis';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import Link from 'next/link';

const FileUpload = () => {
  const router = useRouter();
  const { file, fileContent, isLoading, error, fileWarning, handleFileChange, handleFileDrop } = useFileUpload();
  const { isAnalyzing, progress, startAnalysis } = useAnalysis();
  const { setAnalysisResults } = useAnalysisContext();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleAnalyze = async () => {
    if (fileContent) {
      try {
        console.log('Starting analysis...');
        console.log('File content length:', fileContent.length, 'First 50 chars:', fileContent.substring(0, 50));
        const result = await startAnalysis(fileContent);
        if (result) {
          console.log('Analysis completed successfully, saving results to context...');
          // Save analysis results to context
          setAnalysisResults(result);
          // Navigate to analyze page
          router.push('/analyze');
        } else {
          console.error('Analysis returned null result');
        }
      } catch (error) {
        console.error('Analysis error:', error);
      }
    } else {
      console.error('No file content to analyze');
    }
  };
  
  return (
    <motion.div 
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105' 
            : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          handleFileDrop(e);
          setIsDragging(false);
        }}
        onClick={() => document.getElementById('file-input')?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          id="file-input"
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <motion.div
            animate={isDragging ? { y: [0, -10, 0] } : {}}
            transition={{ repeat: isDragging ? Infinity : 0, duration: 0.5 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </motion.div>
          
          <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200">
            {file ? file.name : 'WhatsApp sohbet dosyanızı buraya sürükleyin'}
          </p>
          
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {file ? `${(file.size / 1024).toFixed(2)} KB` : 'veya dosya seçmek için tıklayın'}
          </p>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 sm:mt-2">
            Sadece .txt formatındaki WhatsApp sohbet dışa aktarım dosyaları desteklenir
          </p>
        </div>
      </motion.div>
      
      {error && (
        <motion.div 
          className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm border border-red-200 dark:border-red-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Analiz sırasında bir hata oluştu:</p>
              <p className="mt-1">{error}</p>
              <motion.button 
                className="mt-2 text-red-600 dark:text-red-400 hover:underline text-sm flex items-center"
                onClick={() => document.getElementById('file-input')?.click()}
                whileHover={{ x: 5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Başka bir dosya seç
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      
      {file && !error && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.button
            onClick={handleAnalyze}
            disabled={isLoading || isAnalyzing}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
            whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </motion.svg>
                <span>
                  {progress < 20 ? 'Mesajlar ayrıştırılıyor...' : 
                   progress < 40 ? 'Analiz ediliyor...' : 
                   progress < 60 ? 'Emoji analizi...' : 
                   progress < 80 ? 'Zaman analizi...' : 
                   progress < 100 ? 'Tamamlanıyor...' : 
                   'Sonuçlandırılıyor...'} {progress}%
                </span>
              </div>
            ) : (
              'Analiz Et'
            )}
          </motion.button>
          
          {/* Progress bar */}
          {isAnalyzing && (
            <motion.div 
              className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      <motion.div 
        className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dosya Bilgileri</h3>
        
        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between items-center">
            <span>Desteklenen maksimum dosya boyutu:</span>
            <span className="font-semibold">10MB</span>
          </div>
          
          {file && (
            <div className="flex justify-between items-center">
              <span>Seçilen dosya boyutu:</span>
              <span className="font-semibold">
                {file.size < 1024 * 1024
                  ? `${(file.size / 1024).toFixed(2)} KB`
                  : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
              </span>
            </div>
          )}
          
          {file && file.size > 500 * 1024 && (
            <motion.div 
              className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-700 dark:text-yellow-300 mt-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fileWarning || 'Büyük dosya tespiti, analiz biraz zaman alabilir'}
              </p>
            </motion.div>
          )}
          
          <p>Büyük sohbetler için WhatsApp dışa aktarımını birden fazla parçaya bölebilirsiniz.</p>
        </div>
      </motion.div>
      
      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <Link 
          href="/privacy-policy" 
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Gizlilik Politikası
        </Link>
        <span className="mx-2">•</span>
        <span>Tüm verileriniz gizlidir ve sunucularımıza yüklenmez</span>
      </div>
    </motion.div>
  );
};

export default FileUpload;