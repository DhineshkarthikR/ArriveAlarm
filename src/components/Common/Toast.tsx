import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start gap-3 transition-all duration-300 animate-slide-up bg-[#111111] border-[#333333] text-white`}
          >
            <div className="shrink-0 pt-0.5">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-white" />
              ) : (
                <Info className="w-5 h-5 text-white" />
              )}
            </div>

            <div className="flex-1 space-y-0.5">
              <h4 className="text-xs font-bold tracking-tight text-white">{toast.title}</h4>
              {toast.message && <p className="text-[11px] text-[#A3A3A3] leading-snug">{toast.message}</p>}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#A3A3A3] hover:text-white p-0.5 rounded-lg transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
