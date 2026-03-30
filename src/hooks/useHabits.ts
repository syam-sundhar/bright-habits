import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { format, startOfMonth, subDays, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

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

  // Toggle a single subtask checkbox for a given date
  const toggleSubtask = useCallback((habitId: string, subtaskId: string, date?: string) => {
    const d = date || format(new Date(), 'yyyy-MM-dd');
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const updatedSubtasks = (h.subtasks || []).map(st => {
        if (st.id !== subtaskId) return st;
        const done = st.completedDates.includes(d);
        return {
          ...st,
          completedDates: done
            ? st.completedDates.filter(dd => dd !== d)
            : [...st.completedDates, d],
        };
      });
      // Auto-complete parent if ALL scheduled subtasks are done
      const allDone = updatedSubtasks.every(st => st.completedDates.includes(d));
      const parentDone = allDone
        ? (h.completedDates.includes(d) ? h.completedDates : [...h.completedDates, d])
        : h.completedDates.filter(dd => dd !== d);
      return { ...h, subtasks: updatedSubtasks, completedDates: parentDone };
    }));
  }, []);

  // Toggle main habit — if hasSubtasks, also check/uncheck ALL subtasks
  const toggleHabit = useCallback((habitId: string, date?: string) => {
    const d = date || format(new Date(), 'yyyy-MM-dd');
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const completed = h.completedDates.includes(d);
      const newCompletedDates = completed
        ? h.completedDates.filter(dd => dd !== d)
        : [...h.completedDates, d];
      // Sync subtasks
      const updatedSubtasks = h.hasSubtasks
        ? (h.subtasks || []).map(st => ({
            ...st,
            completedDates: completed
              ? st.completedDates.filter(dd => dd !== d)
              : st.completedDates.includes(d) ? st.completedDates : [...st.completedDates, d],
          }))
        : h.subtasks;
      return { ...h, completedDates: newCompletedDates, subtasks: updatedSubtasks };
    }));
  }, []);

  const addSubtask = useCallback((habitId: string, name: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const newSubtask = { id: Date.now().toString(), name, completedDates: [] };
      return { ...h, subtasks: [...(h.subtasks || []), newSubtask] };
    }));
  }, []);

  const deleteSubtask = useCallback((habitId: string, subtaskId: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      return { ...h, subtasks: (h.subtasks || []).filter(s => s.id !== subtaskId) };
    }));
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

  const getMonthlyStats = useCallback((type: 'calendar' | 'rolling' = 'calendar') => {
    const now = new Date();
    const startDate = type === 'calendar' 
      ? startOfDay(startOfMonth(now)) 
      : startOfDay(subDays(now, 29));
    const endDate = endOfDay(now);

    let totalPossible = 0;
    let totalCompleted = 0;
    let perfectDaysCount = 0;
    let productiveDaysCount = 0; // > 50%
    
    // For each day in the range
    const d = new Date(startDate);
    while (d <= endDate) {
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayNum = d.getDay();
      const dayHabits = habits.filter(h => h.targetDays.includes(dayNum));
      
      if (dayHabits.length > 0) {
        const completed = dayHabits.filter(h => h.completedDates.includes(dateStr)).length;
        totalPossible += dayHabits.length;
        totalCompleted += completed;
        
        const perc = (completed / dayHabits.length);
        if (perc === 1) perfectDaysCount++;
        if (perc > 0.5) productiveDaysCount++;
      }
      d.setDate(d.getDate() + 1);
    }

    // Top Habit Logic
    const habitCompletions = habits.map(h => {
      const completions = h.completedDates.filter(date => {
        const dDate = parseISO(date);
        return isWithinInterval(dDate, { start: startDate, end: endDate });
      }).length;
      return { name: h.name, count: completions, id: h.id, icon: h.icon };
    });

    const topHabit = habitCompletions.length > 0 
      ? habitCompletions.reduce((prev, current) => (prev.count > current.count) ? prev : current)
      : null;

    return {
      completionRate: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      perfectDays: perfectDaysCount,
      productiveDays: productiveDaysCount,
      topHabit
    };
  }, [habits]);

  const getHabitProgress = useCallback((habitId: string, type: 'calendar' | 'rolling' = 'calendar') => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const now = new Date();
    const startDate = type === 'calendar' ? startOfMonth(now) : subDays(now, 29);
    const endDate = now;

    let possible = 0;
    const d = new Date(startDate);
    while (d <= endDate) {
      if (habit.targetDays.includes(d.getDay())) possible++;
      d.setDate(d.getDate() + 1);
    }

    const completed = habit.completedDates.filter(date => {
      const dDate = parseISO(date);
      return isWithinInterval(dDate, { start: startDate, end: endDate });
    }).length;

    return possible > 0 ? Math.round((completed / possible) * 100) : 0;
  }, [habits]);

  const getHabit30DayGrid = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayNum = d.getDay();
      const isScheduled = habit ? habit.targetDays.includes(dayNum) : false;
      const isCompleted = habit ? habit.completedDates.includes(dateStr) : false;
      days.push({
        date: dateStr,
        dayLabel: format(d, 'd'),
        dayShort: format(d, 'EEE'),
        isScheduled,
        isCompleted,
        isFuture: d > new Date(),
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
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    getStreak,
    getTodayProgress,
    getWeekData,
    getMonthlyStats,
    getHabitProgress,
    getHabit30DayGrid,
  };
}
