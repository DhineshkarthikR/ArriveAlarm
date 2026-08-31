import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const BannerLimitation: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 rounded-xl p-3.5 px-4 mb-5 flex items-start justify-between gap-3 text-xs sm:text-sm leading-relaxed backdrop-blur-sm animate-fadeIn">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-amber-800 dark:text-amber-300">Background Location Notice:</span>{' '}
          For reliable alerts when screen is locked, install ArriveAlarm as a PWA. Mobile web browser background location behavior varies by device OS.
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-100 p-1 rounded-md transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
