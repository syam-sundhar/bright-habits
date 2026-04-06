import { createContext, useContext } from 'react';
import { Habit } from '@/types/habit';

interface HabitsContextType {
  habits: Habit[];
  today: string;
  toggleHabit: (id: string, date?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => void;
  deleteHabit: (id: string) => void;
  editHabit: (id: string, updates: Partial<Habit>) => void;
  toggleSubtask: (habitId: string, subtaskId: string, date?: string) => void;
  addSubtask: (habitId: string, name: string) => void;
  deleteSubtask: (habitId: string, subtaskId: string) => void;
  getStreak: (habit: Habit) => number;
  getTodayProgress: () => { completed: number; total: number };
  getWeekData: () => { date: string; day: string; total: number; completed: number; percentage: number }[];
  getMonthlyStats: (type: 'calendar' | 'rolling') => {
    completionRate: number;
    perfectDays: number;
    productiveDays: number;
    topHabit: { name: string; count: number; icon: string } | null;
  };
  getHabitProgress: (id: string, type: 'calendar' | 'rolling') => number;
  getHabit30DayGrid: (id: string) => {
    date: string; dayLabel: string; dayShort: string;
    isScheduled: boolean; isCompleted: boolean; isFuture: boolean; isFrozen: boolean;
  }[];
}

export const HabitsContext = createContext<HabitsContextType | null>(null);

export function useHabitsContext() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabitsContext must be used inside HabitsProvider');
  return ctx;
}
