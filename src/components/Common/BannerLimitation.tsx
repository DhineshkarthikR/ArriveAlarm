import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const BannerLimitation: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#111111] border border-[#333333] text-[#A3A3A3] rounded-xl p-3.5 px-4 mb-5 flex items-start justify-between gap-3 text-xs sm:text-sm leading-relaxed animate-fadeIn">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-white mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-white">Background Location Notice:</span>{' '}
          For reliable alerts when screen is locked, install ArriveAlarm as a PWA. Mobile web browser background location behavior varies by device OS.
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setDismissed(true)}
          className="text-[#737373] hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
