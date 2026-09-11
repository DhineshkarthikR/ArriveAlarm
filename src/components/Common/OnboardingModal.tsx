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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-fadeIn">
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 1 ? 'w-8 bg-white' : 'w-2 bg-[#333333]'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 2 ? 'w-8 bg-white' : 'w-2 bg-[#333333]'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 3 ? 'w-8 bg-white' : 'w-2 bg-[#333333]'
            }`}
          />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#111111] border border-[#333333] text-white flex items-center justify-center mx-auto shadow-sm">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Never miss your destination
            </h2>
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              Set any location on an interactive map and get real-time proximity tracking wherever you travel.
            </p>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#111111] border border-[#333333] text-white flex items-center justify-center mx-auto shadow-sm">
              <Radio className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Set your alert radius
            </h2>
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              Choose how close you need to be—from 50 meters to custom distances. Optionally configure early distance warnings!
            </p>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#111111] border border-[#333333] text-white flex items-center justify-center mx-auto shadow-sm">
              <Bell className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Start tracking & relax
            </h2>
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              ArriveAlarm monitors your GPS location and triggers audio tone, vibration, and browser notification upon arrival.
            </p>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full mt-6 py-3.5 px-4 bg-white hover:bg-neutral-200 active:bg-neutral-300 text-black font-medium rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group text-sm"
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
