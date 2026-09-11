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
    { id: 'create', label: 'Create', icon: PlusCircle },
    { id: 'active', label: 'Tracker', icon: Radio, badge: isTracking ? 'LIVE' : undefined },
    { id: 'history', label: 'History', icon: History },
    { id: 'saved', label: 'Saved', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all">
      <div className="bg-[#0A0A0A]/90 backdrop-blur-md border border-[#222222] rounded-2xl px-4 sm:px-6 py-2.5 shadow-2xl flex items-center justify-between gap-4">
        {/* Brand Logo & Status */}
        <div
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#2A2A2A] flex items-center justify-center group-hover:border-zinc-500 transition-colors">
            <MapPin className="w-4 h-4 text-blue-500" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base tracking-tight text-white font-sans">
              Arrive <span className="text-zinc-600 font-mono">//</span> Alarm
            </span>
            {isTracking ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                GPS ACTIVE
              </span>
            ) : (
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 border border-[#222222] bg-[#111111]">
                READY
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#111111] p-1 rounded-xl border border-[#222222]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#1F1F1F] text-white border border-[#333333]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-md bg-blue-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all active:scale-95 cursor-pointer ${
              demoMode
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-[#111111] border-[#222222] text-zinc-400 hover:text-white'
            }`}
            title="Toggle GPS Demo Simulator"
          >
            <FlaskConical className={`w-3.5 h-3.5 ${demoMode ? 'text-amber-400' : ''}`} />
            <span className="hidden xs:inline text-[11px]">SIM</span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                demoMode ? 'bg-amber-500 text-black' : 'bg-[#222222] text-zinc-400'
              }`}
            >
              {demoMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Notification Toggle */}
          <button
            onClick={() => requestNotificationPermission()}
            className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              notifGranted
                ? 'bg-[#111111] border-[#222222] text-blue-400'
                : 'bg-[#111111] border-[#222222] text-zinc-500 hover:text-zinc-300'
            }`}
            title={notifGranted ? 'Notifications enabled' : 'Enable browser notifications'}
          >
            {notifGranted ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[#111111] border border-[#222222] text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};


