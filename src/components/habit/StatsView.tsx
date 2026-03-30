import { Habit } from '@/types/habit';
import { WeekChart } from './WeekChart';
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsViewProps {
  habits: Habit[];
  today: string;
  getStreak: (habit: Habit) => number;
  getWeekData: () => { date: string; day: string; total: number; completed: number; percentage: number }[];
}

export function StatsView({ habits, today, getStreak, getWeekData }: StatsViewProps) {
  const weekData = getWeekData();
  const totalCompletionsThisWeek = weekData.reduce((sum, d) => sum + d.completed, 0);
  const totalPossibleThisWeek = weekData.reduce((sum, d) => sum + d.total, 0);
  const weeklyRate = totalPossibleThisWeek > 0 ? Math.round((totalCompletionsThisWeek / totalPossibleThisWeek) * 100) : 0;
  const bestStreak = Math.max(...habits.map(h => getStreak(h)), 0);
  const perfectDays = weekData.filter(d => d.total > 0 && d.percentage === 100).length;

  const stats = [
    { icon: TrendingUp, label: 'Weekly Rate', value: `${weeklyRate}%`, color: 'text-habit-blue' },
    { icon: Flame, label: 'Best Streak', value: `${bestStreak}d`, color: 'text-habit-orange' },
    { icon: Trophy, label: 'Perfect Days', value: `${perfectDays}`, color: 'text-secondary' },
    { icon: Target, label: 'Total Habits', value: `${habits.length}`, color: 'text-habit-purple' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-2xl bg-card habit-card-shadow"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-card habit-card-shadow">
        <h3 className="font-bold text-foreground mb-4">Weekly Overview</h3>
        <WeekChart data={weekData} today={today} />
      </div>

      <div className="p-5 rounded-2xl bg-card habit-card-shadow">
        <h3 className="font-bold text-foreground mb-4">Habit Streaks</h3>
        <div className="space-y-3">
          {habits.map(habit => {
            const streak = getStreak(habit);
            return (
              <div key={habit.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{habit.icon}</span>
                  <span className="text-sm font-medium text-foreground">{habit.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className={`w-4 h-4 ${streak > 0 ? 'text-secondary' : 'text-muted-foreground/30'}`} />
                  <span className="text-sm font-bold text-foreground">{streak}d</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
