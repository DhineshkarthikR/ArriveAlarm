import React from 'react';
import {
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
import { useAlarm } from '../../context/AlarmContext';
import type { ActivePage } from '../../types';

export const Header: React.FC = () => {
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

  const navItems: { id: ActivePage; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create', icon: PlusCircle },
    { id: 'active', label: 'Tracker', icon: Radio },
    { id: 'history', label: 'History', icon: History },
    { id: 'saved', label: 'Saved', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a1a1a] bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          <MapPin className="w-4 h-4 text-white" />
          <span className="font-semibold text-sm tracking-tight text-white">
            ArriveAlarm
          </span>
          {isTracking && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              LIVE
            </span>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#111111]'
                    : 'text-[#666666] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              demoMode
                ? 'bg-[#222222] text-white border border-[#333333]'
                : 'text-[#555555] hover:text-white'
            }`}
            title="Toggle GPS Demo Simulator"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{demoMode ? 'SIM ON' : 'SIM'}</span>
          </button>

          {/* Notification Toggle */}
          <button
            onClick={() => requestNotificationPermission()}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              notifGranted
                ? 'text-white'
                : 'text-[#555555] hover:text-white'
            }`}
            title={notifGranted ? 'Notifications enabled' : 'Enable notifications'}
          >
            {notifGranted ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
