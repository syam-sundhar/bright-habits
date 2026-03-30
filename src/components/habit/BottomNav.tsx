import { Home, BarChart3, Plus, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  active: 'home' | 'stats' | 'settings';
  onNavigate: (tab: 'home' | 'stats' | 'settings') => void;
  onAdd: () => void;
}

const navItems = [
  { id: 'home' as const, icon: Home, label: 'Today' },
  { id: 'stats' as const, icon: BarChart3, label: 'Stats' },
  { id: 'settings' as const, icon: Settings, label: 'Manage' },
];

export function BottomNav({ active, onNavigate, onAdd }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card bottom-nav-shadow z-50">
      <div className="flex items-center justify-around max-w-md mx-auto px-4 pb-6 pt-2">
        {navItems.map((item, i) => (
          i === 1 ? (
            <div key="add-group" className="flex items-center gap-6">
              <NavButton item={navItems[1]} isActive={active === 'stats'} onClick={() => onNavigate('stats')} />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onAdd}
                className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg"
              >
                <Plus className="w-7 h-7" />
              </motion.button>
            </div>
          ) : i === 0 ? (
            <NavButton key={item.id} item={item} isActive={active === item.id} onClick={() => onNavigate(item.id)} />
          ) : (
            <NavButton key={item.id} item={item} isActive={active === item.id} onClick={() => onNavigate(item.id)} />
          )
        ))}
      </div>
    </div>
  );
}

function NavButton({ item, isActive, onClick }: { item: typeof navItems[0]; isActive: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[56px]">
      <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
      <span className={`text-[11px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {item.label}
      </span>
    </button>
  );
}
