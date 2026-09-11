import React from 'react';
import { Home, PlusCircle, Radio, History, Star, Settings } from 'lucide-react';
import type { ActivePage } from '../../types';
import { useAlarm } from '../../context/AlarmContext';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, isTracking } = useAlarm();

  const navItems: { id: ActivePage; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create', icon: PlusCircle },
    { id: 'active', label: 'Tracker', icon: Radio },
    { id: 'history', label: 'History', icon: History },
    { id: 'saved', label: 'Saved', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-[#1a1a1a]">
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1.5 px-2 rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-[#555555]'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.id === 'active' && isTracking && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-500" />
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
