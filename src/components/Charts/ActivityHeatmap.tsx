'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ActivityData {
  date: string;
  hour: number;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  width?: number;
  height?: number;
}

const ActivityHeatmap = ({ data, width = 800, height = 400 }: ActivityHeatmapProps) => {
  const { heatmapData, maxCount, minCount } = useMemo(() => {
    if (!data || data.length === 0) {
      return { heatmapData: [], maxCount: 0, minCount: 0 };
    }

    const max = Math.max(...data.map(d => d.count));
    const min = Math.min(...data.map(d => d.count));
    
    // Group data by date and hour
    const grouped = data.reduce((acc, item) => {
      const key = `${item.date}-${item.hour}`;
      if (!acc[key]) {
        acc[key] = { ...item };
      } else {
        acc[key].count += item.count;
      }
      return acc;
    }, {} as Record<string, ActivityData>);

    return {
      heatmapData: Object.values(grouped),
      maxCount: max,
      minCount: min
    };
  }, [data]);

  const getIntensityColor = (count: number) => {
    if (maxCount === minCount) return 'rgba(59, 130, 246, 0.3)';
    
    const intensity = (count - minCount) / (maxCount - minCount);
    
    if (intensity === 0) return 'rgba(255, 255, 255, 0.05)';
    if (intensity <= 0.2) return 'rgba(59, 130, 246, 0.2)';
    if (intensity <= 0.4) return 'rgba(59, 130, 246, 0.4)';
    if (intensity <= 0.6) return 'rgba(59, 130, 246, 0.6)';
    if (intensity <= 0.8) return 'rgba(59, 130, 246, 0.8)';
    return 'rgba(59, 130, 246, 1)';
  };

  const getBorderColor = (count: number) => {
    if (maxCount === minCount) return 'rgba(59, 130, 246, 0.5)';
    
    const intensity = (count - minCount) / (maxCount - minCount);
    return `rgba(59, 130, 246, ${Math.max(0.2, intensity)})`;
  };

  // Get unique dates and sort them
  const uniqueDates = useMemo(() => {
    const dates = [...new Set(heatmapData.map(d => d.date))];
    return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [heatmapData]);

  // Hours array (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getCountForDateHour = (date: string, hour: number) => {
    const item = heatmapData.find(d => d.date === date && d.hour === hour);
    return item ? item.count : 0;
  };

  if (!data || data.length === 0) {
    return (
      <motion.div 
        className="flex items-center justify-center h-full backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-white/70 font-medium">Aktivite verisi bulunamadı</p>
        </div>
      </motion.div>
    );
  }

  const cellWidth = Math.max(20, (width - 100) / uniqueDates.length);
  const cellHeight = Math.max(15, (height - 100) / 24);

  return (
    <motion.div 
      className="w-full h-full p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Aktivite Isı Haritası</h3>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <span>Az aktif</span>
          <div className="flex gap-1">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm border border-white/20"
                style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}
              />
            ))}
          </div>
          <span>Çok aktif</span>
        </div>
      </div>

      <div className="overflow-auto">
        <div className="relative" style={{ minWidth: uniqueDates.length * cellWidth + 100 }}>
          {/* Hour labels */}
          <div className="absolute left-0 top-0">
            {hours.map(hour => (
              <div
                key={hour}
                className="text-xs text-white/60 flex items-center justify-end pr-2"
                style={{ 
                  height: cellHeight,
                  lineHeight: `${cellHeight}px`
                }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Date labels */}
          <div className="ml-16">
            <div className="flex mb-2">
              {uniqueDates.map(date => (
                <div
                  key={date}
                  className="text-xs text-white/60 text-center"
                  style={{ width: cellWidth }}
                >
                  {format(new Date(date), 'dd/MM', { locale: tr })}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="relative">
              {hours.map(hour => (
                <div key={hour} className="flex">
                  {uniqueDates.map(date => {
                    const count = getCountForDateHour(date, hour);
                    return (
                      <motion.div
                        key={`${date}-${hour}`}
                        className="border border-white/10 cursor-pointer group relative"
                        style={{
                          width: cellWidth,
                          height: cellHeight,
                          backgroundColor: getIntensityColor(count),
                          borderColor: getBorderColor(count)
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.01 * (hour + uniqueDates.indexOf(date)) }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                          <div>{format(new Date(date), 'dd MMMM yyyy', { locale: tr })}</div>
                          <div>{hour.toString().padStart(2, '0')}:00 - {(hour + 1).toString().padStart(2, '0')}:00</div>
                          <div className="font-semibold">{count} mesaj</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 flex gap-6 text-sm text-white/70">
        <div>
          <span className="text-white/50">En aktif saat: </span>
          <span className="text-white font-medium">
            {heatmapData.length > 0 
              ? `${heatmapData.reduce((max, curr) => curr.count > max.count ? curr : max).hour.toString().padStart(2, '0')}:00`
              : 'Veri yok'
            }
          </span>
        </div>
        <div>
          <span className="text-white/50">Maksimum mesaj: </span>
          <span className="text-white font-medium">{maxCount}</span>
        </div>
        <div>
          <span className="text-white/50">Toplam gün: </span>
          <span className="text-white font-medium">{uniqueDates.length}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;