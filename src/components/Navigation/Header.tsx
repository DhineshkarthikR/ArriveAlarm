import React from 'react';
import { Sun, Moon, Bell, BellOff, MapPin, FlaskConical, Navigation } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAlarm } from '../../context/AlarmContext';

export const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    isTracking,
    demoMode,
    setDemoMode,
    setActivePage,
    notificationPermission,
    requestNotificationPermission,
  } = useAlarm();

  const notifGranted = notificationPermission === 'granted';

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Brand Tagline */}
        <div
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
            <div className="relative">
              <MapPin className="w-5 h-5 text-white" />
              <Bell className="w-3 h-3 text-amber-300 absolute -bottom-1 -right-1 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
                ArriveAlarm
              </span>
              {isTracking ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Tracking Destination
                </span>
              ) : (
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                  <Navigation className="w-3 h-3 text-indigo-500" />
                  Location → Alert
                </span>
              )}
            </div>
            <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 font-medium">
              Never miss your destination.
            </span>
          </div>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Mode Toggle Button */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              demoMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Toggle GPS Demo Simulator"
          >
            <FlaskConical className={`w-3.5 h-3.5 ${demoMode ? 'text-amber-500 animate-bounce' : ''}`} />
            <span className="hidden xs:inline">Demo Mode</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                demoMode ? 'bg-amber-500 text-white font-bold' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              {demoMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Notification status toggle */}
          <button
            onClick={() => requestNotificationPermission()}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              notifGranted
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title={notifGranted ? 'Notifications enabled' : 'Enable browser notifications'}
          >
            {notifGranted ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
