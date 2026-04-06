import { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHabitsContext } from '@/context/HabitsContext';
import { HabitCard } from '@/components/habit/HabitCard';
import { ProgressRing } from '@/components/habit/ProgressRing';
import { BottomNav } from '@/components/habit/BottomNav';
import { AddHabitSheet } from '@/components/habit/AddHabitSheet';
import { EditHabitSheet } from '@/components/habit/EditHabitSheet';
import { StatsView } from '@/components/habit/StatsView';
import { ManageView } from '@/components/habit/ManageView';
import { BadgesView } from '@/components/habit/BadgesView';
import { Habit } from '@/types/habit';
import { useNotifications } from '@/hooks/useNotifications';

const Index = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'home' | 'stats' | 'settings' | 'badges'>('home');
  const [addOpen, setAddOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useNotifications();

  const {
    habits,
    today,
    toggleHabit,
    addHabit,
    deleteHabit,
    editHabit,
    getStreak,
    getTodayProgress,
    getWeekData,
    getMonthlyStats,
    getHabitProgress,
    getHabit30DayGrid,
  } = useHabitsContext();

  const progress = getTodayProgress();
  const todayDay = new Date().getDay();
  const todayHabits = habits.filter(h => h.targetDays.includes(todayDay));

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤';
    return 'Good Evening 🌙';
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-5 pt-12">
        <AnimatePresence mode="wait">
          {tab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground">{format(new Date(), 'EEEE, MMM d')}</p>
                <h1 className="text-2xl font-extrabold text-foreground mt-1">{greeting()}</h1>
              </div>

              <div className="flex items-center gap-6 p-5 rounded-2xl bg-card habit-card-shadow mb-6">
                <ProgressRing completed={progress.completed} total={progress.total} size={100} />
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {progress.completed === progress.total && progress.total > 0 ? '🎉 All Done!' : `${progress.total - progress.completed} left`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {progress.total > 0
                      ? `${Math.round((progress.completed / progress.total) * 100)}% complete`
                      : 'No habits for today'}
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-foreground mb-3">Today's Habits</h2>
              <div className="space-y-3">
                {todayHabits.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground text-sm">No habits scheduled today. Tap + to add one!</p>
                )}
                {todayHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={habit.completedDates.includes(today)}
                    streak={getStreak(habit)}
                    onToggle={() => toggleHabit(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                    onEdit={() => setEditingHabit(habit)}
                    onOpenDetail={() => navigate(`/habit/${habit.id}`)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-extrabold text-foreground mb-6">Statistics</h1>
              <StatsView
                habits={habits}
                today={today}
                getStreak={getStreak}
                getWeekData={getWeekData}
                getMonthlyStats={getMonthlyStats}
                getHabitProgress={getHabitProgress}
                getHabit30DayGrid={getHabit30DayGrid}
                onToggleDay={toggleHabit}
              />
            </motion.div>
          )}

          {tab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-extrabold text-foreground mb-6">Manage Habits</h1>
              <ManageView habits={habits} onDelete={deleteHabit} />
            </motion.div>
          )}

          {tab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-extrabold text-foreground mb-6">🏅 Badges</h1>
              <BadgesView habits={habits} getStreak={getStreak} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav active={tab} onNavigate={setTab} onAdd={() => setAddOpen(true)} />
      <AddHabitSheet open={addOpen} onClose={() => setAddOpen(false)} onAdd={addHabit} />
      <EditHabitSheet
        habit={editingHabit}
        open={editingHabit !== null}
        onClose={() => setEditingHabit(null)}
        onSave={editHabit}
      />
    </div>
  );
};

export default Index;
