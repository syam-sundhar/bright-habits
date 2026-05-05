export type HabitColor = 'blue' | 'green' | 'orange' | 'pink' | 'purple';

export type HabitCategory = 'health' | 'fitness' | 'mindfulness' | 'productivity' | 'learning' | 'social';

export interface Subtask {
  id: string;
  name: string;
  completedDates: string[]; // ISO date strings per day
}

export type AppMode = 'home' | 'college';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: HabitColor;
  category: HabitCategory;
  frequency: 'daily' | 'weekly';
  targetDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  createdAt: string;
  completedDates: string[]; // ISO date strings "YYYY-MM-DD"
  hasSubtasks?: boolean;
  subtasks?: Subtask[];
  freezes?: number;      // available freeze tokens (0–2)
  freezeEarned?: number; // highest milestone earned (0 = none, 1 = 7-day, 2 = 30-day)
  frozenDates?: string[]; // dates protected by a freeze (shown in blue)
  reminderTime?: string; // Daily reminder time for push notification (e.g., "09:00")
  isPaused?: boolean; // If true, habit acts as an off day
}

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: 'Health',
  fitness: 'Fitness',
  mindfulness: 'Mindfulness',
  productivity: 'Productivity',
  learning: 'Learning',
  social: 'Social',
};

export const HABIT_ICONS: Record<HabitCategory, string> = {
  health: '💊',
  fitness: '🏋️',
  mindfulness: '🧘',
  productivity: '📋',
  learning: '📚',
  social: '👥',
};

export const COLOR_MAP: Record<HabitColor, string> = {
  blue: 'habit-blue',
  green: 'habit-green',
  orange: 'habit-orange',
  pink: 'habit-pink',
  purple: 'habit-purple',
};
