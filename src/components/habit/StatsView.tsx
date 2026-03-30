import { useRef, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { WeekChart } from './WeekChart';
import { Flame, TrendingUp, BarChart3, Star, CheckCircle2, Circle, MinusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DayCell {
  date: string;
  dayLabel: string;
  dayShort: string;
  isScheduled: boolean;
  isCompleted: boolean;
  isFuture: boolean;
}

interface StatsViewProps {
  habits: Habit[];
  today: string;
  getStreak: (habit: Habit) => number;
  getWeekData: () => { date: string; day: string; total: number; completed: number; percentage: number }[];
  getMonthlyStats: (type: 'calendar' | 'rolling') => {
    completionRate: number;
    perfectDays: number;
    productiveDays: number;
    topHabit: { name: string; count: number; icon: string } | null;
  };
  getHabitProgress: (id: string, type: 'calendar' | 'rolling') => number;
  getHabit30DayGrid: (id: string) => DayCell[];
}

// Horizontal 30-day grid for one habit — scrollable
function HabitDayGrid({ habit, grid }: { habit: Habit; grid: DayCell[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const completedCount = grid.filter(d => d.isCompleted).length;
  const scheduledCount = grid.filter(d => d.isScheduled).length;
  const rate = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;

  // Auto-scroll so today is visible (with a few days of context to the right)
  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const todayEl = todayRef.current;
      // Scroll so today appears near the right edge (showing past days)
      const scrollTarget = todayEl.offsetLeft - container.clientWidth + todayEl.clientWidth + 32;
      container.scrollLeft = Math.max(0, scrollTarget);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border/40 overflow-hidden habit-card-shadow"
    >
      {/* Header row */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{habit.icon}</span>
          <span className="text-sm font-black text-foreground">{habit.name}</span>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div className="flex items-center gap-1">
            <Flame className={`w-3.5 h-3.5 ${completedCount > 0 ? 'text-orange-400' : 'text-muted-foreground/25'}`} />
          </div>
          <span className="text-xs font-black text-foreground tabular-nums">{completedCount}/{scheduledCount}</span>
          <span className={`text-xs font-black tabular-nums px-2 py-0.5 rounded-full ${
            rate >= 80 ? 'bg-green-100 text-green-600' :
            rate >= 50 ? 'bg-amber-100 text-amber-600' :
            'bg-red-100 text-red-500'
          }`}>{rate}%</span>
        </div>
      </div>

      {/* Scrollable 30-day grid — scrollbar hidden */}
      <div
        ref={scrollRef}
        className="overflow-x-auto px-4 pb-3 no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div className="flex gap-1.5 min-w-max">
          {grid.map((cell, i) => {
            const isToday = cell.date === new Date().toISOString().slice(0, 10);
            return (
              <div
                key={cell.date}
                ref={isToday ? todayRef : undefined}
                className="flex flex-col items-center gap-1"
              >
                {/* Day box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.012, duration: 0.25 }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center relative
                    ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                    ${cell.isFuture ? 'opacity-30' : ''}
                    ${cell.isCompleted
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm shadow-green-200'
                      : cell.isScheduled
                        ? 'bg-red-100'
                        : 'bg-muted/40'
                    }
                  `}
                >
                  {cell.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : cell.isScheduled ? (
                    <MinusCircle className="w-3 h-3 text-red-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
                  )}
                </motion.div>
                {/* Day number */}
                <span className={`text-[9px] font-bold tabular-nums ${
                  isToday ? 'text-primary' : 'text-muted-foreground/60'
                }`}>
                  {cell.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400 to-emerald-500" />
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">Done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100" />
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted/40" />
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">Off day</span>
        </div>
      </div>
    </motion.div>
  );
}

export function StatsView({ habits, today, getStreak, getWeekData, getMonthlyStats, getHabitProgress, getHabit30DayGrid }: StatsViewProps) {
  const weekData = getWeekData();
  const calendarStats = getMonthlyStats('calendar');
  const bestStreak = Math.max(...habits.map(h => getStreak(h)), 0);

  const summaryCards = [
    { icon: TrendingUp, label: 'Monthly Rate', value: `${calendarStats.completionRate}%`, bg: 'bg-blue-50', iconColor: 'text-blue-500' },
    { icon: Flame, label: 'Best Streak', value: `${bestStreak}d`, bg: 'bg-orange-50', iconColor: 'text-orange-500' },
    { icon: Star, label: 'Perfect Days', value: `${calendarStats.perfectDays}`, bg: 'bg-amber-50', iconColor: 'text-amber-500' },
    { icon: BarChart3, label: 'Productive Days', value: `${calendarStats.productiveDays}`, bg: 'bg-green-50', iconColor: 'text-green-500' },
  ];

  return (
    <div className="space-y-6 pb-8">

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden border border-border/50 bg-card habit-card-shadow"
      >
        <div className="bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-4">
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">This Month</p>
          <p className="text-white font-black text-lg">Calendar Stats</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {summaryCards.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className={`p-3.5 rounded-2xl ${m.bg} flex items-center gap-3`}
            >
              <m.icon className={`w-4 h-4 ${m.iconColor} shrink-0`} />
              <div>
                <p className="text-xl font-black text-foreground tabular-nums leading-none">{m.value}</p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide mt-0.5">{m.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Performer */}
        {calendarStats.topHabit && calendarStats.topHabit.count > 0 && (
          <div className="mx-4 mb-4 p-3.5 rounded-2xl bg-violet-50 border border-violet-100 flex items-center gap-3">
            <span className="text-2xl shrink-0">{calendarStats.topHabit.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-violet-600 uppercase tracking-tight">⭐ Top Performer</p>
              <p className="text-sm font-extrabold text-foreground truncate">{calendarStats.topHabit.name}</p>
              <p className="text-[10px] text-muted-foreground">{calendarStats.topHabit.count} completions this month</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Weekly Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-3xl bg-card border border-border/50 habit-card-shadow"
      >
        <h3 className="font-black text-foreground mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500 inline-block" />
          Weekly Overview
        </h3>
        <WeekChart data={weekData} today={today} />
      </motion.div>

      {/* 30-Day Activity Grid per habit */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-green-400 to-emerald-500 inline-block" />
          <h3 className="font-black text-foreground text-sm uppercase tracking-widest">30-Day Activity</h3>
        </div>
        <div className="space-y-3">
          {habits.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <HabitDayGrid
                habit={habit}
                grid={getHabit30DayGrid(habit.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
