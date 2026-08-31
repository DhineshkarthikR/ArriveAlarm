import React from 'react';
import { Home, MapPin, Timer, History, Star, Settings, PlusCircle } from 'lucide-react';
import type { ActivePage } from '../../types';
import { useAlarm } from '../../context/AlarmContext';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, isTracking, activeAlarm } = useAlarm();

  const navItems: { id: ActivePage; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create Alarm', icon: MapPin },
    {
      id: 'active',
      label: 'Active Alarm',
      icon: Timer,
      badge: isTracking ? 'LIVE' : undefined,
    },
    { id: 'history', label: 'History', icon: History },
    { id: 'saved', label: 'Saved Places', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md min-h-[calc(100vh-65px)] p-4 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Quick CTA button */}
        <button
          onClick={() => setActivePage('create')}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-2xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Location Alarm</span>
        </button>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={clsx(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-emerald-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Alarm Quick Bar in Sidebar if active */}
      {isTracking && activeAlarm && (
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-indigo-950 dark:text-indigo-200 truncate max-w-[120px]">
              {activeAlarm.destinationName}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Active
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            Radius: {activeAlarm.radius} m
          </p>
          <button
            onClick={() => setActivePage('active')}
            className="w-full py-1.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 rounded-lg text-center font-medium border border-indigo-200 dark:border-indigo-800 shadow-2xs hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
          >
            View Live Tracker
          </button>
        </div>
      )}
    </aside>
  );
};
