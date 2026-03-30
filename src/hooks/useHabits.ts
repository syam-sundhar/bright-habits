import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { format } from 'date-fns';

const STORAGE_KEY = 'habit-tracker-habits';

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    icon: '🧘',
    color: 'purple',
    category: 'mindfulness',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    createdAt: new Date().toISOString(),
    completedDates: [],
  },
  {
    id: '2',
    name: 'Workout',
    icon: '🏋️',
    color: 'orange',
    category: 'fitness',
    frequency: 'daily',
    targetDays: [1, 2, 3, 4, 5],
    createdAt: new Date().toISOString(),
    completedDates: [],
  },
  {
    id: '3',
    name: 'Read 30 mins',
    icon: '📚',
    color: 'blue',
    category: 'learning',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    createdAt: new Date().toISOString(),
    completedDates: [],
  },
  {
    id: '4',
    name: 'Drink 8 glasses',
    icon: '💧',
    color: 'green',
    category: 'health',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    createdAt: new Date().toISOString(),
    completedDates: [],
  },
];

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultHabits;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const today = format(new Date(), 'yyyy-MM-dd');

  const toggleHabit = useCallback((habitId: string, date?: string) => {
    const d = date || today;
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        const completed = h.completedDates.includes(d);
        return {
          ...h,
          completedDates: completed
            ? h.completedDates.filter(dd => dd !== d)
            : [...h.completedDates, d],
        };
      })
    );
  }, [today]);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => {
    setHabits(prev => [
      ...prev,
      {
        ...habit,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completedDates: [],
      },
    ]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const editHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => (h.id === id ? { ...h, ...updates } : h)));
  }, []);

  const getStreak = useCallback((habit: Habit): number => {
    let streak = 0;
    const d = new Date();
    const todayStr = format(d, 'yyyy-MM-dd');
    
    // Check if today is completed, if not start from yesterday
    if (!habit.completedDates.includes(todayStr)) {
      d.setDate(d.getDate() - 1);
    }

    while (true) {
      const dateStr = format(d, 'yyyy-MM-dd');
      if (habit.completedDates.includes(dateStr)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, []);

  const getTodayProgress = useCallback(() => {
    const todayDay = new Date().getDay();
    const todayHabits = habits.filter(h => h.targetDays.includes(todayDay));
    const completed = todayHabits.filter(h => h.completedDates.includes(today));
    return { total: todayHabits.length, completed: completed.length };
  }, [habits, today]);

  const getWeekData = useCallback(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayNum = d.getDay();
      const dayHabits = habits.filter(h => h.targetDays.includes(dayNum));
      const completed = dayHabits.filter(h => h.completedDates.includes(dateStr)).length;
      days.push({
        date: dateStr,
        day: format(d, 'EEE'),
        total: dayHabits.length,
        completed,
        percentage: dayHabits.length > 0 ? Math.round((completed / dayHabits.length) * 100) : 0,
      });
    }
    return days;
  }, [habits]);

  return {
    habits,
    today,
    toggleHabit,
    addHabit,
    deleteHabit,
    editHabit,
    getStreak,
    getTodayProgress,
    getWeekData,
  };
}
