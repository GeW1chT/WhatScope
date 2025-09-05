'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface WordCloudData {
  text: string;
  value: number;
}

interface WordCloudChartProps {
  data: WordCloudData[];
  width?: number;
  height?: number;
  backgroundColor?: string;
  maxFontSize?: number;
  minFontSize?: number;
}

const WordCloudChart = ({ 
  data, 
  width = 1000, 
  height = 550, 
  backgroundColor = 'transparent',
  maxFontSize = 80,
  minFontSize = 16
}: WordCloudChartProps) => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/70">Kelime verisi bulunamadı.</p>
      </div>
    );
  }

  // Normalize font sizes based on word frequency
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  
  const getFontSize = (value: number) => {
    if (maxValue === minValue) return (maxFontSize + minFontSize) / 2;
    const ratio = (value - minValue) / (maxValue - minValue);
    return minFontSize + (maxFontSize - minFontSize) * ratio;
  };

  // Color palette for tags
  const colors = [
    'bg-blue-500/80 text-white',
    'bg-purple-500/80 text-white',
    'bg-pink-500/80 text-white',
    'bg-red-500/80 text-white',
    'bg-orange-500/80 text-white',
    'bg-yellow-500/80 text-black',
    'bg-green-500/80 text-white',
    'bg-teal-500/80 text-white',
    'bg-cyan-500/80 text-white',
    'bg-indigo-500/80 text-white',
    'bg-violet-500/80 text-white',
    'bg-fuchsia-500/80 text-white',
    'bg-rose-500/80 text-white',
    'bg-emerald-500/80 text-white',
    'bg-lime-500/80 text-black',
    'bg-amber-500/80 text-black',
  ];

  const getColorClass = (index: number) => {
    return colors[index % colors.length];
  };

  return (
    <div 
      className="flex flex-wrap gap-3 p-4 justify-center items-center"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        backgroundColor,
        overflow: 'auto'
      }}
    >
      {data.map((item, index) => {
        const fontSize = getFontSize(item.value);
        const colorClass = getColorClass(index);
        
        return (
          <motion.div
            key={`${item.text}-${index}`}
            className={`px-3 py-2 rounded-full border border-white/20 backdrop-blur-sm cursor-pointer transition-all duration-200 ${colorClass}`}
            style={{
              fontSize: `${Math.max(fontSize * 0.6, 12)}px`,
              fontWeight: fontSize > 40 ? 'bold' : fontSize > 25 ? '600' : '500'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.02,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              zIndex: 10
            }}
            onMouseEnter={() => setHoveredWord(item.text)}
            onMouseLeave={() => setHoveredWord(null)}
          >
            <span className="font-medium">
              {item.text}
            </span>
            <span className="ml-2 text-xs opacity-80">
              ({item.value})
            </span>
          </motion.div>
        );
      })}
      
      {/* Tooltip */}
      {hoveredWord && (
        <motion.div
          className="absolute bg-black/80 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          Kelime: {hoveredWord}
        </motion.div>
      )}
    </div>
  );
};

export default WordCloudChart;