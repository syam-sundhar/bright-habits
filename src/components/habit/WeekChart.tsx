import { motion } from 'framer-motion';

interface DayData {
  day: string;
  percentage: number;
  completed: number;
  total: number;
  date: string;
}

interface WeekChartProps {
  data: DayData[];
  today: string;
}

export function WeekChart({ data, today }: WeekChartProps) {
  return (
    <div className="flex items-end justify-between gap-2 h-32 px-2">
      {data.map((d, i) => {
        const isToday = d.date === today;
        return (
          <div key={d.date} className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-full flex justify-center" style={{ height: 80 }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(d.percentage, 4)}%` }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                className={`w-8 rounded-t-lg ${
                  isToday ? 'bg-primary' : d.percentage === 100 ? 'bg-success' : 'bg-muted-foreground/20'
                }`}
                style={{ position: 'absolute', bottom: 0 }}
              />
            </div>
            <span className={`text-[11px] font-semibold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
