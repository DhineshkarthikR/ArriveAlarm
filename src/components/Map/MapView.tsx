import React from 'react';
import type { Coordinates } from '../../types';
import { LocationMap } from './LocationMap';

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
  return <LocationMap {...props} />;
};
