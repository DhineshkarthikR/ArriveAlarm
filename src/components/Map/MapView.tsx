import React, { lazy, Suspense } from 'react';
import type { Coordinates } from '../../types';

// Lazy load LocationMap to keep maplibre-gl out of the initial critical render path
const LocationMapLazy = lazy(() =>
  import('./LocationMap').then((m) => ({ default: m.LocationMap }))
);

interface MapViewProps {
  destination: Coordinates;
  currentLocation?: Coordinates | null;
  radius: number;
  earlyAlertEnabled?: boolean;
  earlyAlertDistance?: number;
  onDestinationChange?: (coords: Coordinates, address?: string) => void;
  onUseCurrentLocation?: () => void;
  destinationName?: string;
  isInteractive?: boolean;
  followUser?: boolean;
  onToggleFollowUser?: (follow: boolean) => void;
}

export const MapView: React.FC<MapViewProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full min-h-[350px] sm:min-h-[420px] rounded-2xl border border-[#222222] bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-400">Loading Map Engine...</span>
        </div>
      }
    >
      <LocationMapLazy {...props} />
    </Suspense>
  );
};

