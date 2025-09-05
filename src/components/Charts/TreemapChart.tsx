'use client';

import { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface TreemapData {
  name: string;
  size: number;
  children?: TreemapData[];
}

interface TreemapChartProps {
  data: TreemapData[];
  width?: number;
  height?: number;
  title?: string;
  colorScheme?: string[];
}

const TreemapChart = ({ 
  data, 
  width = 800, 
  height = 400, 
  title = "Treemap Görselleştirmesi",
  colorScheme = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88', '#ff0088', '#8dd1e1', '#d084d0']
}: TreemapChartProps) => {
  
  // Process data for treemap
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Add colors to data items
    return data.map((item, index) => ({
      ...item,
      fill: colorScheme[index % colorScheme.length]
    }));
  }, [data, colorScheme]);

  // Custom content renderer for treemap cells
  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name, size } = props;
    
    // Don't render if too small
    if (width < 20 || height < 20) return null;

    const fontSize = Math.min(width / 8, height / 4, 16);
    const textColor = '#ffffff';
    const fillColor = (payload && payload.fill) || colorScheme[index % colorScheme.length] || '#8884d8';
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: fillColor,
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 0.8
          }}
          rx={4}
        />
        {width > 40 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - fontSize / 2}
              textAnchor="middle"
              fill={textColor}
              fontSize={fontSize}
              fontWeight="bold"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + fontSize / 2}
              textAnchor="middle"
              fill={textColor}
              fontSize={fontSize * 0.8}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
            >
              {size}
            </text>
          </>
        )}
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-2">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: data.fill || '#8884d8' }}
            />
            <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Değer: <span className="font-medium">{data.size}</span>
          </p>
        </motion.div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <motion.div 
        className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Treemap verisi bulunamadı</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4" style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={processedData}
            dataKey="size"
            aspectRatio={4/3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {processedData.slice(0, 8).map((item, index) => (
          <motion.div
            key={item.name}
            className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.fill || '#8884d8' }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.name} ({item.size})
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TreemapChart;