import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Habit, HabitCategory, HabitColor, CATEGORY_LABELS, HABIT_ICONS } from '@/types/habit';

const colors: HabitColor[] = ['blue', 'green', 'orange', 'pink', 'purple'];
const categories: HabitCategory[] = ['health', 'fitness', 'mindfulness', 'productivity', 'learning', 'social'];
const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const colorHslClasses: Record<HabitColor, string> = {
  blue: 'bg-habit-blue',
  green: 'bg-habit-green',
  orange: 'bg-habit-orange',
  pink: 'bg-habit-pink',
  purple: 'bg-habit-purple',
};

interface EditHabitSheetProps {
  habit: Habit | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Habit>) => void;
}

export function EditHabitSheet({ habit, open, onClose, onSave }: EditHabitSheetProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<HabitColor>('blue');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [targetDays, setTargetDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  // Pre-populate form whenever the habit changes
  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setColor(habit.color);
      setCategory(habit.category);
      setTargetDays(habit.targetDays);
    }
  }, [habit]);

  const handleSave = () => {
    if (!habit || !name.trim()) return;
    onSave(habit.id, {
      name: name.trim(),
      icon: HABIT_ICONS[category],
      color,
      category,
      targetDays,
    });
    onClose();
  };

  const toggleDay = (day: number) => {
    setTargetDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto pb-10">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Edit Habit</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Name */}
          <div>
            <Label className="text-sm font-semibold text-muted-foreground">Habit Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Morning jog"
              className="mt-2 h-12 rounded-xl text-base"
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm font-semibold text-muted-foreground">Category</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {HABIT_ICONS[cat]} {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <Label className="text-sm font-semibold text-muted-foreground">Color</Label>
            <div className="flex gap-3 mt-2">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full ${colorHslClasses[c]} transition-all ${
                    color === c ? 'ring-4 ring-offset-2 ring-ring' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Repeat On */}
          <div>
            <Label className="text-sm font-semibold text-muted-foreground">Repeat On</Label>
            <div className="flex gap-2 mt-2">
              {dayLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    targetDays.includes(i)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 h-14 rounded-xl text-base font-bold">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 h-14 rounded-xl text-base font-bold">
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
