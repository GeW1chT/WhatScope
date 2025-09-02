'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ChatAnalysis } from '@/types/chat';

interface AnalysisContextType {
  analysis: ChatAnalysis | null;
  setAnalysisResults: (results: ChatAnalysis) => void;
  clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);

  const setAnalysisResults = (results: ChatAnalysis) => {
    setAnalysis(results);
    
    // Also store in localStorage for persistence across page refreshes
    try {
      localStorage.setItem('whatsscope-analysis', JSON.stringify(results));
    } catch (error) {
      console.error('Error saving analysis to localStorage:', error);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    try {
      localStorage.removeItem('whatsscope-analysis');
    } catch (error) {
      console.error('Error removing analysis from localStorage:', error);
    }
  };

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysisResults, clearAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  
  if (context === undefined) {
    throw new Error('useAnalysisContext must be used within an AnalysisProvider');
  }
  
  return context;
};