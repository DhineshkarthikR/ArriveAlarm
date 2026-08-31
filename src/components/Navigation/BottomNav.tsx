import React from 'react';
import { Home, MapPin, Timer, History, Star, Settings } from 'lucide-react';
import type { ActivePage } from '../../types';
import { useAlarm } from '../../context/AlarmContext';
import { clsx } from 'clsx';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, isTracking } = useAlarm();

  const navItems: { id: ActivePage; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create', icon: MapPin },
    { id: 'active', label: 'Active', icon: Timer },
    { id: 'history', label: 'History', icon: History },
    { id: 'saved', label: 'Saved', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 transition-colors">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={clsx(
                'relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.id === 'active' && isTracking && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
