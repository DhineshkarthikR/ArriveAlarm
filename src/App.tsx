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
    <div className="min-h-screen flex flex-col bg-[#000000] text-white relative overflow-x-hidden">
      {/* Subtle grid texture overlay */}
      <div className="fixed inset-0 bg-subtle-grid pointer-events-none -z-10" />

      {/* Floating Header */}
      <Header />

      {/* Main Page Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        <Sidebar />

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
