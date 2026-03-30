import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { Habit } from '@/types/habit';
import { format } from 'date-fns';

interface HabitDetailPageProps {
  habits: Habit[];
  today: string;
  toggleHabit: (id: string, date?: string) => void;
  toggleSubtask: (habitId: string, subtaskId: string, date?: string) => void;
  addSubtask: (habitId: string, name: string) => void;
  deleteSubtask: (habitId: string, subtaskId: string) => void;
}

export function HabitDetailPage({
  habits,
  today,
  toggleHabit,
  toggleSubtask,
  addSubtask,
  deleteSubtask,
}: HabitDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const habit = habits.find(h => h.id === id);
  if (!habit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Habit not found.</p>
      </div>
    );
  }

  const subtasks = habit.subtasks || [];
  const isHabitDone = habit.completedDates.includes(today);
  const completedCount = subtasks.filter(s => s.completedDates.includes(today)).length;
  const progressPct = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  const colorRing: Record<string, string> = {
    blue: 'from-habit-blue to-blue-400',
    green: 'from-habit-green to-emerald-400',
    orange: 'from-habit-orange to-amber-400',
    pink: 'from-habit-pink to-rose-400',
    purple: 'from-habit-purple to-violet-400',
  };
  const gradient = colorRing[habit.color] || colorRing.blue;

  const handleAddSubtask = () => {
    if (!newName.trim()) return;
    addSubtask(habit.id, newName.trim());
    setNewName('');
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`bg-gradient-to-br ${gradient} px-5 pt-12 pb-8`}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-lg">
            {habit.icon}
          </div>
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{habit.category}</p>
            <h1 className="text-white text-2xl font-black leading-tight">{habit.name}</h1>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/20 rounded-full h-2.5 mb-2">
          <motion.div
            className="h-full rounded-full bg-white shadow"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-white/80 text-xs font-semibold">
          <span>{completedCount} of {subtasks.length} done</span>
          <span>{progressPct}%</span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6 space-y-4">

        {/* Main habit toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 shadow-sm"
        >
          <div>
            <p className="font-black text-foreground text-sm">Complete All</p>
            <p className="text-xs text-muted-foreground">
              {isHabitDone ? 'All done today! 🎉' : 'Mark entire habit as done'}
            </p>
          </div>
          <button
            onClick={() => toggleHabit(habit.id)}
            className="transition-transform active:scale-90"
          >
            {isHabitDone ? (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            ) : (
              <Circle className="w-8 h-8 text-muted-foreground/40" />
            )}
          </button>
        </motion.div>

        {/* Sub-tasks section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-foreground uppercase tracking-widest">
              Sub-tasks
            </h2>
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Step
            </button>
          </div>

          {/* Add input */}
          <AnimatePresence>
            {adding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="flex gap-2 p-3 rounded-2xl bg-muted/50 border border-border">
                  <input
                    autoFocus
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                    placeholder="e.g., 10 push-ups"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-medium"
                  />
                  <button
                    onClick={handleAddSubtask}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setAdding(false); setNewName(''); }}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sub-task list */}
          {subtasks.length === 0 && !adding ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm font-bold text-muted-foreground">No steps yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Tap "Add Step" to break this habit into smaller tasks</p>
            </motion.div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence>
                {subtasks.map((st, i) => {
                  const isDone = st.completedDates.includes(today);
                  return (
                    <motion.div
                      key={st.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16, height: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-green-50 border-green-200'
                          : 'bg-card border-border/50'
                      }`}
                    >
                      <button
                        onClick={() => toggleSubtask(habit.id, st.id)}
                        className="shrink-0 transition-transform active:scale-75"
                      >
                        {isDone ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          </motion.div>
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground/40" />
                        )}
                      </button>
                      <span className={`flex-1 text-sm font-semibold ${
                        isDone ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {st.name}
                      </span>
                      <button
                        onClick={() => deleteSubtask(habit.id, st.id)}
                        className="shrink-0 p-1.5 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer date */}
        <p className="text-center text-xs text-muted-foreground/50 pt-4 font-medium">
          {format(new Date(), 'EEEE, MMMM d')}
        </p>
      </div>
    </div>
  );
}
