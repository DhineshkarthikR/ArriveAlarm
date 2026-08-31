import React, { useState } from 'react';
import { MapPin, Bell, Radio, ArrowRight, CheckCircle2 } from 'lucide-react';
import { saveUserSettings } from '../../utils/storage';

export const OnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      saveUserSettings({ onboardingCompleted: true });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 1 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 2 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 3 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Never miss your destination
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Set any location on an interactive map and get real-time proximity tracking wherever you travel.
            </p>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
              <Radio className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Set your alert radius
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose how close you need to be—from 50 meters to custom distances. Optionally configure early distance warnings!
            </p>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Bell className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Start tracking & relax
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              ArriveAlarm monitors your GPS location and triggers audio tone, vibration, and browser notification upon arrival.
            </p>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full mt-6 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group text-sm"
        >
          {step === 3 ? (
            <>
              <span>Get Started</span>
              <CheckCircle2 className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
