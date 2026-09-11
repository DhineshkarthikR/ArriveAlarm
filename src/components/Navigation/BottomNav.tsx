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
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border border-[#222222] rounded-2xl px-1 py-1 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={clsx(
                'relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 px-2.5 rounded-xl transition-all cursor-pointer',
                isActive
                  ? 'text-white font-semibold bg-[#161616] border border-[#2A2A2A]'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              <div className="relative">
                <Icon className={clsx('w-4 h-4', isActive && 'text-blue-400')} />
                {item.id === 'active' && isTracking && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-sans tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


