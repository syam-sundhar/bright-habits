import { Habit, CATEGORY_LABELS } from '@/types/habit';
import { Trash2, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface ManageViewProps {
  habits: Habit[];
  onDelete: (id: string) => void;
  onOpenDetail: (id: string) => void;
}

export function ManageView({ habits, onDelete, onOpenDetail }: ManageViewProps) {
  return (
    <div className="space-y-3">
      {habits.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-semibold">No habits yet</p>
          <p className="text-sm mt-1">Tap + to create your first habit</p>
        </div>
      )}
      {habits.map((habit, i) => (
        <motion.div
          key={habit.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`flex items-center gap-4 p-4 rounded-2xl bg-card habit-card-shadow ${habit.isPaused ? 'grayscale opacity-75' : ''}`}
        >
          <span className="text-2xl">{habit.icon}</span>
          <div className="flex-1 min-w-0" onClick={habit.hasSubtasks ? () => onOpenDetail(habit.id) : undefined}>
            <p className="font-semibold text-foreground text-[15px] flex items-center gap-2">
              <span className="truncate">{habit.name}</span>
              {habit.isPaused && (
                <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded-full whitespace-nowrap">
                  Paused
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {CATEGORY_LABELS[habit.category]} · {habit.targetDays.map(d => dayLabels[d]).join(', ')}
            </p>
          </div>
          
          {habit.hasSubtasks && (
            <button
              onClick={() => onOpenDetail(habit.id)}
              className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors"
              title="View steps"
            >
              <ListTodo className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
