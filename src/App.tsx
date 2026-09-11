import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AlarmProvider, useAlarm } from './context/AlarmContext';
import { Header } from './components/Navigation/Header';
import { BottomNav } from './components/Navigation/BottomNav';
import { TriggerModal } from './components/Alarm/TriggerModal';
import { DemoModePanel } from './components/Alarm/DemoModePanel';
import { OnboardingModal } from './components/Common/OnboardingModal';

// Pages
import { Home } from './pages/Home';
import { CreateAlarm } from './pages/CreateAlarm';
import { ActiveAlarm } from './pages/ActiveAlarm';
import { SavedPlaces } from './pages/SavedPlaces';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { getUserSettings } from './utils/storage';

const MainContent: React.FC = () => {
  const {
    activePage,
    isArrivedModalOpen,
    activeAlarm,
    stopAlarm,
    snoozeAlarm,
    keepTracking,
  } = useAlarm();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    const settings = getUserSettings();
    if (!settings.onboardingCompleted) {
      setIsOnboardingOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-x-hidden">
      <Header />

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-10">
        <main className="w-full">
          {activePage === 'home' && <Home />}
          {activePage === 'create' && <CreateAlarm />}
          {activePage === 'active' && <ActiveAlarm />}
          {activePage === 'saved' && <SavedPlaces />}
          {activePage === 'history' && <History />}
          {activePage === 'settings' && <Settings />}
        </main>
      </div>

      <BottomNav />

      <TriggerModal
        isOpen={isArrivedModalOpen}
        alarm={activeAlarm}
        onStop={stopAlarm}
        onSnooze={snoozeAlarm}
        onKeepTracking={keepTracking}
      />

      <DemoModePanel />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AlarmProvider>
        <MainContent />
      </AlarmProvider>
    </ThemeProvider>
  );
}

export default App;
