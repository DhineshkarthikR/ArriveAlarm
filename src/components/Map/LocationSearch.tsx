import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import type { SearchResultItem } from '../../types';
import { searchPlaces } from '../../services/map/geocoding';

interface LocationSearchProps {
  onSelectLocation: (location: { name: string; address: string; lat: number; lng: number }) => void;
  placeholder?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelectLocation,
  placeholder = '🔍 Search destination (e.g. College, Railway Station, Airport...)',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query using MapTiler service
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchRes = await searchPlaces(query);
        setResults(searchRes);
        setIsOpen(searchRes.length > 0);
      } catch (err) {
        console.warn('Location search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: SearchResultItem) => {
    const lat = typeof item.latitude === 'number' ? item.latitude : parseFloat((item as any).lat);
    const lng = typeof item.longitude === 'number' ? item.longitude : parseFloat((item as any).lon);
    const shortName = item.name || (item.address ? item.address.split(',')[0] : 'Selected Location');

    onSelectLocation({
      name: shortName,
      address: item.address || item.name || 'Selected Destination',
      lat,
      lng,
    });
    setQuery(shortName);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full z-30">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3.5 w-4 h-4 text-indigo-500 animate-spin" />
        ) : query ? (
          <button
            onClick={handleClear}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-fadeIn divide-y divide-slate-100 dark:divide-slate-800">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="p-3.5 hover:bg-indigo-50/50 dark:hover:bg-slate-800/60 cursor-pointer flex items-start gap-3 transition-colors group"
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {item.name}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {item.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
