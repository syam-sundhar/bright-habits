import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit } from '@/types/habit';
import { Lock, Snowflake, ChevronDown, ChevronUp, Flame, Target, TrendingUp } from 'lucide-react';

interface BadgesViewProps {
  habits: Habit[];
  getStreak: (habit: Habit) => number;
}

const MILESTONES = [
  { days: 7,   label: '7 Days',   emoji: '🌱' },
  { days: 15,  label: '15 Days',  emoji: '⚡' },
  { days: 30,  label: '30 Days',  emoji: '🔥' },
  { days: 50,  label: '50 Days',  emoji: '💎' },
  { days: 100, label: '100 Days', emoji: '🏆' },
  { days: 200, label: '200 Days', emoji: '🌟' },
  { days: 300, label: '300 Days', emoji: '👑' },
  { days: 365, label: '365 Days', emoji: '🎖️' },
];

const colorRing: Record<string, string> = {
  blue:   'ring-habit-blue/50   bg-habit-blue/10',
  green:  'ring-habit-green/50  bg-habit-green/10',
  orange: 'ring-habit-orange/50 bg-habit-orange/10',
  pink:   'ring-habit-pink/50   bg-habit-pink/10',
  purple: 'ring-habit-purple/50 bg-habit-purple/10',
};

const colorText: Record<string, string> = {
  blue:   'text-habit-blue',
  green:  'text-habit-green',
  orange: 'text-habit-orange',
  pink:   'text-habit-pink',
  purple: 'text-habit-purple',
};

const colorBg: Record<string, string> = {
  blue:   'bg-habit-blue',
  green:  'bg-habit-green',
  orange: 'bg-habit-orange',
  pink:   'bg-habit-pink',
  purple: 'bg-habit-purple',
};

export function BadgesView({ habits, getStreak }: BadgesViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (habits.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        Add habits to earn streak badges!
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      {habits.map((habit, hi) => {
        const streak = getStreak(habit);
        const next = MILESTONES.find(m => streak < m.days);
        const lastEarned = [...MILESTONES].reverse().find(m => streak >= m.days);
        const isOpen = expanded.has(habit.id);
        const totalCompleted = habit.completedDates.length;
        const freezesLeft = habit.freezes ?? 0;
        const freezeEarned = habit.freezeEarned ?? 0;
        const frozenDatesCount = (habit.frozenDates ?? []).length;

        return (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hi * 0.06 }}
            className="rounded-2xl bg-card habit-card-shadow overflow-hidden"
          >
            {/* ── Collapsed header (always visible) ── */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-2 ${colorRing[habit.color]}`}>
                  <span className="text-xl">{habit.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{habit.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Flame className={`w-3 h-3 ${streak > 0 ? 'text-orange-400' : 'text-muted-foreground/30'}`} />
                    <p className={`text-xs font-bold ${streak > 0 ? colorText[habit.color] : 'text-muted-foreground'}`}>
                      {streak} day streak
                    </p>
                    {lastEarned && (
                      <span className="text-xs ml-1">{lastEarned.emoji}</span>
                    )}
                  </div>
                </div>

                {/* Next badge hint */}
                {next ? (
                  <div className="text-right mr-1">
                    <p className="text-[10px] text-muted-foreground">Next</p>
                    <p className="text-xs font-bold text-foreground">{next.emoji} {next.days - streak}d</p>
                  </div>
                ) : streak > 0 ? (
                  <div className="px-2 py-1 rounded-full bg-yellow-400/15 text-yellow-500 text-[10px] font-bold mr-1">
                    MAX ✨
                  </div>
                ) : null}

                {/* Dropdown toggle */}
                <button
                  onClick={() => toggle(habit.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Mini progress bar to next milestone */}
              {next && (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${colorBg[habit.color]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(streak / next.days) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1 font-medium">
                    {streak}/{next.days} days to {next.emoji} {next.label}
                  </p>
                </div>
              )}
            </div>

            {/* ── Expanded dropdown with streak details ── */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  key="details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4 border-t border-border/40 pt-4">

                    {/* Streak stats row */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: Flame, label: 'Current Streak', value: `${streak}d`, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { icon: Target, label: 'Total Done', value: `${totalCompleted}`, color: 'text-green-600', bg: 'bg-green-50' },
                        { icon: TrendingUp, label: 'Frozen Days', value: `${frozenDatesCount}`, color: 'text-blue-500', bg: 'bg-blue-50' },
                      ].map(stat => (
                        <div key={stat.label} className={`${stat.bg} rounded-xl p-2.5 flex flex-col gap-0.5`}>
                          <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                          <p className={`text-sm font-black ${stat.color} tabular-nums`}>{stat.value}</p>
                          <p className="text-[9px] text-muted-foreground font-bold leading-tight">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Badge grid */}
                    <div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wide mb-2">Milestone Badges</p>
                      <div className="grid grid-cols-4 gap-2">
                        {MILESTONES.map(milestone => {
                          const isEarned = streak >= milestone.days;
                          return (
                            <motion.div
                              key={milestone.days}
                              whileTap={isEarned ? { scale: 0.92 } : {}}
                              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                                isEarned
                                  ? `ring-2 ${colorRing[habit.color]}`
                                  : 'bg-muted/40 opacity-50'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isEarned ? `ring-1 ${colorRing[habit.color]}` : 'bg-muted'
                              }`}>
                                {isEarned ? (
                                  <span className="text-lg">{habit.icon}</span>
                                ) : (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              {isEarned && (
                                <span className="absolute -top-1 -right-1 text-[13px] leading-none">
                                  {milestone.emoji}
                                </span>
                              )}
                              <p className={`text-[10px] font-semibold leading-tight text-center ${
                                isEarned ? colorText[habit.color] : 'text-muted-foreground'
                              }`}>
                                {milestone.label}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Freeze section */}
                    <div className="pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Snowflake className="w-4 h-4 text-blue-400" />
                        <p className="text-xs font-black text-foreground uppercase tracking-wide">Streak Freezes</p>
                        <span className="ml-auto text-[10px] text-muted-foreground">max 2</span>
                      </div>
                      <div className="flex gap-3">
                        {[{ milestone: 7, label: '7-day bonus', tier: 1 }, { milestone: 30, label: '30-day bonus', tier: 2 }].map(ft => {
                          const isEarned = freezeEarned >= ft.tier;
                          const isAvailable = isEarned && freezesLeft >= ft.tier;
                          return (
                            <div key={ft.tier} className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                              isAvailable
                                ? 'border-blue-300 bg-blue-50'
                                : isEarned
                                  ? 'border-border/60 bg-muted/30 opacity-60'
                                  : 'border-border/30 bg-muted/20 opacity-40'
                            }`}>
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isAvailable ? 'bg-blue-100' : 'bg-muted'}`}>
                                {isEarned ? (
                                  <Snowflake className={`w-5 h-5 ${isAvailable ? 'text-blue-500' : 'text-muted-foreground'}`} />
                                ) : (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              <p className={`text-[10px] font-bold text-center ${isAvailable ? 'text-blue-600' : 'text-muted-foreground'}`}>
                                {isAvailable ? 'Ready ❄️' : isEarned ? 'Used' : ft.label}
                              </p>
                              {!isEarned && (
                                <p className="text-[9px] text-muted-foreground">Earn at {ft.milestone}d</p>
                              )}
                            </div>
                          );
                        })}
                        <div className="flex-1 flex flex-col justify-center gap-1 p-3 rounded-xl bg-muted/20 border border-border/30">
                          <p className="text-[9px] text-muted-foreground font-bold uppercase">How it works</p>
                          <p className="text-[9px] text-muted-foreground leading-tight">
                            Missed days auto-frozen. Shows <span className="text-blue-500 font-bold">blue ❄️</span> in grid.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
