import React from 'react';
import { Home, MapPin, Radio, History, Star, Settings } from 'lucide-react';
import type { ActivePage } from '../../types';
import { useAlarm } from '../../context/AlarmContext';
import { clsx } from 'clsx';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, isTracking } = useAlarm();

  const navItems: { id: ActivePage; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create', icon: MapPin },
    { id: 'active', label: 'Tracker', icon: Radio },
    { id: 'history', label: 'History', icon: History },
    { id: 'saved', label: 'Saved', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#0b1329]/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl px-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={clsx(
                'relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer',
                isActive
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <div className="relative">
                <Icon className={clsx('w-5 h-5', isActive && 'text-cyan-400 text-cyan-glow')} />
                {item.id === 'active' && isTracking && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-[#0b1329] animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-mono tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

