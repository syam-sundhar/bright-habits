import { motion } from 'framer-motion';
import { Check, Flame, MoreVertical, Trash2, Pencil, ChevronRight, ListTodo, PauseCircle, PlayCircle } from 'lucide-react';
import { Habit } from '@/types/habit';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  onToggle: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onOpenDetail?: () => void;
  onTogglePause?: () => void;
}

const colorClasses: Record<string, { bg: string; check: string; ring: string }> = {
  blue: { bg: 'bg-habit-blue/10', check: 'bg-habit-blue', ring: 'ring-habit-blue/30' },
  green: { bg: 'bg-habit-green/10', check: 'bg-habit-green', ring: 'ring-habit-green/30' },
  orange: { bg: 'bg-habit-orange/10', check: 'bg-habit-orange', ring: 'ring-habit-orange/30' },
  pink: { bg: 'bg-habit-pink/10', check: 'bg-habit-pink', ring: 'ring-habit-pink/30' },
  purple: { bg: 'bg-habit-purple/10', check: 'bg-habit-purple', ring: 'ring-habit-purple/30' },
};

export function HabitCard({ habit, isCompleted, streak, onToggle, onDelete, onEdit, onOpenDetail, onTogglePause }: HabitCardProps) {
  const colors = colorClasses[habit.color] || colorClasses.blue;
  const hasSubtasks = habit.hasSubtasks && (habit.subtasks?.length ?? 0) > 0;
  const today = new Date().toISOString().slice(0, 10);
  const subtasksDone = habit.subtasks?.filter(s => s.completedDates.includes(today)).length ?? 0;
  const subtasksTotal = habit.subtasks?.length ?? 0;
  const freezesLeft = habit.freezes ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl bg-card habit-card-shadow transition-all duration-300 ${
        isCompleted || habit.isPaused ? 'grayscale opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Check button */}
        <motion.button
          whileTap={habit.isPaused ? undefined : { scale: 0.85 }}
          onClick={habit.isPaused ? undefined : onToggle}
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ring-2 ${
            isCompleted
              ? 'bg-foreground/15 text-foreground ring-transparent'
              : habit.isPaused
              ? 'bg-muted text-muted-foreground ring-transparent cursor-not-allowed'
              : `${colors.bg} ${colors.ring}`
          }`}
        >
          {isCompleted ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="animate-check-bounce">
              <Check className="w-6 h-6" />
            </motion.div>
          ) : habit.isPaused ? (
            <PauseCircle className="w-6 h-6 opacity-50" />
          ) : (
            <span className="text-xl">{habit.icon}</span>
          )}
        </motion.button>

        {/* Name + category */}
        <div className="flex-1 min-w-0" onClick={habit.hasSubtasks ? onOpenDetail : undefined}>
          <p className={`font-semibold text-[15px] ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {habit.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-muted-foreground capitalize">{habit.category}</p>
            {habit.hasSubtasks && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-primary/70 bg-primary/8 px-1.5 py-0.5 rounded-full">
                <ListTodo className="w-2.5 h-2.5" />
                {subtasksDone}/{subtasksTotal}
              </span>
            )}
          </div>
        </div>

        {/* Streak badge */}
        {streak > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/50">
            <Flame className="w-3.5 h-3.5 text-secondary-foreground" />
            <span className="text-xs font-bold text-secondary-foreground">{streak}</span>
          </div>
        )}

        {/* Freeze tokens */}
        {freezesLeft > 0 && (
          <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-blue-50">
            {Array.from({ length: freezesLeft }).map((_, i) => (
              <span key={i} className="text-xs">❄️</span>
            ))}
          </div>
        )}

        {/* Subtask arrow — tappable to open detail */}
        {habit.hasSubtasks && (
          <button
            onClick={onOpenDetail}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Three dots menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[150px]">
            {onTogglePause && (
              <>
                <DropdownMenuItem onClick={onTogglePause} className="font-medium">
                  {habit.isPaused ? <PlayCircle className="w-4 h-4 mr-2 text-primary" /> : <PauseCircle className="w-4 h-4 mr-2 text-orange-500" />}
                  {habit.isPaused ? 'Resume Habit' : 'Pause Habit'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {habit.hasSubtasks && (
              <>
                <DropdownMenuItem onClick={onOpenDetail} className="font-medium">
                  <ListTodo className="w-4 h-4 mr-2 text-primary" />
                  View Steps
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={onEdit} className="font-medium">
              <Pencil className="w-4 h-4 mr-2 text-primary" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Subtask progress bar (when has steps) */}
      {habit.hasSubtasks && subtasksTotal > 0 && (
        <div className="px-4 pb-3">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${colors.check}`}
              initial={{ width: 0 }}
              animate={{ width: `${(subtasksDone / subtasksTotal) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="text-[9px] text-muted-foreground mt-1 font-semibold">
            {subtasksDone === subtasksTotal && subtasksTotal > 0
              ? '✅ All steps completed!'
              : `${subtasksDone} of ${subtasksTotal} steps done`}
          </p>
        </div>
      )}
    </motion.div>
  );
}