import { Home, BarChart3, Plus, Settings, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  active: 'home' | 'stats' | 'settings' | 'badges';
  onNavigate: (tab: 'home' | 'stats' | 'settings' | 'badges') => void;
  onAdd: () => void;
}

export function BottomNav({ active, onNavigate, onAdd }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card bottom-nav-shadow z-50">
      <div className="flex items-center justify-around max-w-md mx-auto px-3 pb-6 pt-2">

        {/* Today */}
        <NavButton
          icon={Home}
          label="Today"
          isActive={active === 'home'}
          onClick={() => onNavigate('home')}
        />

        {/* Stats */}
        <NavButton
          icon={BarChart3}
          label="Stats"
          isActive={active === 'stats'}
          onClick={() => onNavigate('stats')}
        />

        {/* Centre FAB */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onAdd}
          className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg"
        >
          <Plus className="w-7 h-7" />
        </motion.button>

        {/* Manage */}
        <NavButton
          icon={Settings}
          label="Manage"
          isActive={active === 'settings'}
          onClick={() => onNavigate('settings')}
        />

        {/* Badges */}
        <NavButton
          icon={Award}
          label="Badges"
          isActive={active === 'badges'}
          onClick={() => onNavigate('badges')}
        />
      </div>
    </div>
  );
}

function NavButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[48px]">
      <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
      <span className={`text-[11px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </button>
  );
}
