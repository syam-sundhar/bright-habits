import { motion } from 'framer-motion';
import { Check, Flame, MoreVertical, Trash2 } from 'lucide-react';
import { Habit } from '@/types/habit';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  onToggle: () => void;
  onDelete?: () => void;
}

const colorClasses: Record<string, { bg: string; check: string; ring: string }> = {
  blue: { bg: 'bg-habit-blue/10', check: 'bg-habit-blue', ring: 'ring-habit-blue/30' },
  green: { bg: 'bg-habit-green/10', check: 'bg-habit-green', ring: 'ring-habit-green/30' },
  orange: { bg: 'bg-habit-orange/10', check: 'bg-habit-orange', ring: 'ring-habit-orange/30' },
  pink: { bg: 'bg-habit-pink/10', check: 'bg-habit-pink', ring: 'ring-habit-pink/30' },
  purple: { bg: 'bg-habit-purple/10', check: 'bg-habit-purple', ring: 'ring-habit-purple/30' },
};

export function HabitCard({ habit, isCompleted, streak, onToggle, onDelete }: HabitCardProps) {
  const colors = colorClasses[habit.color] || colorClasses.blue;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 p-4 rounded-xl bg-card habit-card-shadow transition-all ${isCompleted ? 'opacity-75' : ''}`}
    >
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onToggle}
        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ring-2 ${
          isCompleted
            ? `${colors.check} text-primary-foreground ring-transparent`
            : `${colors.bg} ${colors.ring}`
        }`}
      >
        {isCompleted ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="animate-check-bounce">
            <Check className="w-6 h-6" />
          </motion.div>
        ) : (
          <span className="text-xl">{habit.icon}</span>
        )}
      </motion.button>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-[15px] ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {habit.name}
        </p>
        <p className="text-xs text-muted-foreground capitalize">{habit.category}</p>
      </div>

      {streak > 0 && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/50">
          <Flame className="w-3.5 h-3.5 text-secondary-foreground" />
          <span className="text-xs font-bold text-secondary-foreground">{streak}</span>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}