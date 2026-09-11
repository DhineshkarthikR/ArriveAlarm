import React from 'react';
import {
  Sun,
  Moon,
  Bell,
  BellOff,
  MapPin,
  FlaskConical,
  Radio,
  Home,
  History,
  Star,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAlarm } from '../../context/AlarmContext';
import type { ActivePage } from '../../types';

export const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    isTracking,
    demoMode,
    setDemoMode,
    activePage,
    setActivePage,
    notificationPermission,
    requestNotificationPermission,
  } = useAlarm();

  const notifGranted = notificationPermission === 'granted';

  const navItems: { id: ActivePage; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create Alarm', icon: PlusCircle },
    { id: 'active', label: 'Active Tracker', icon: Radio, badge: isTracking ? 'LIVE' : undefined },
    { id: 'history', label: 'History', icon: History },
    { id: 'saved', label: 'Saved Places', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all">
      <div className="bg-[#0b1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 shadow-[0_10px_30px_rgba(0,242,255,0.08)] flex items-center justify-between gap-4">
        {/* Brand Logo & Telemetry Indicator */}
        <div
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-[1px] shadow-[0_0_15px_rgba(0,242,255,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070b14] rounded-[11px] flex items-center justify-center relative">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-wider text-white font-mono">
                ARRIVE <span className="text-cyan-400">//</span> ALARM
              </span>
              {isTracking ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  GPS LOCK
                </span>
              ) : (
                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800/80 text-cyan-300/80 border border-cyan-500/10">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  RTK READY
                </span>
              )}
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium tracking-tight">
              Precision Location & Travel Alarms
            </p>
          </div>
        </div>

        {/* Desktop Floating Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,255,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-black rounded-md bg-cyan-400 text-slate-950 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Demo Mode Switcher */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all active:scale-95 cursor-pointer ${
              demoMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle GPS Demo Simulator"
          >
            <FlaskConical className={`w-3.5 h-3.5 ${demoMode ? 'text-amber-400 animate-bounce' : ''}`} />
            <span className="hidden xs:inline">SIM</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                demoMode ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800'
              }`}
            >
              {demoMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Notification Button */}
          <button
            onClick={() => requestNotificationPermission()}
            className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              notifGranted
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={notifGranted ? 'Notifications enabled' : 'Enable browser notifications'}
          >
            {notifGranted ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-all active:scale-95 cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

