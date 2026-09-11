import React from 'react';
import { MapPin, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = MapPin,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#333333] rounded-2xl bg-[#0A0A0A] my-4">
      <div className="w-12 h-12 rounded-2xl bg-[#111111] border border-[#333333] flex items-center justify-center text-white mb-3 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#A3A3A3] max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#E5E5E5] text-black text-xs sm:text-sm font-medium rounded-xl shadow-sm transition-all transform active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
