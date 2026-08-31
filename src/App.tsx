import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AlarmProvider, useAlarm } from './context/AlarmContext';
import { Header } from './components/Navigation/Header';
import { Sidebar } from './components/Navigation/Sidebar';
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-full overflow-hidden">
          {activePage === 'home' && <Home />}
          {activePage === 'create' && <CreateAlarm />}
          {activePage === 'active' && <ActiveAlarm />}
          {activePage === 'saved' && <SavedPlaces />}
          {activePage === 'history' && <History />}
          {activePage === 'settings' && <Settings />}
        </main>
      </div>

      <BottomNav />

      {/* Arrival Trigger Overlay Modal */}
      <TriggerModal
        isOpen={isArrivedModalOpen}
        alarm={activeAlarm}
        onStop={stopAlarm}
        onSnooze={snoozeAlarm}
        onKeepTracking={keepTracking}
      />

      {/* Developer Demo GPS Simulator Panel */}
      <DemoModePanel />

      {/* First-time onboarding modal */}
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
