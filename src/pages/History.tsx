import React, { useState } from 'react';
import { History as HistoryIcon, Search, Trash2, MapPin, Clock, Radio, X } from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { EmptyState } from '../components/Common/EmptyState';
import { deleteHistoryEntry, clearAllHistory } from '../utils/storage';

export const History: React.FC = () => {
  const { history, refreshStorageData, setActivePage } = useAlarm();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((item) =>
    item.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    refreshStorageData();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all alarm history?')) {
      clearAllHistory();
      refreshStorageData();
    }
  };

  return (
    <div className="space-y-5 animate-slide-up pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-[#888888]" />
            <span>History</span>
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Completed arrivals and tracking sessions.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start py-2 px-3 text-red-400 hover:text-red-300 font-medium text-xs rounded-md border border-red-500/20 hover:border-red-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#555555] pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-9 pr-9 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#333333]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-[#555555] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={history.length === 0 ? 'No History Yet' : 'No Results'}
          description={
            history.length === 0
              ? 'Completed location alarms will appear here.'
              : `No entries match "${searchTerm}".`
          }
          actionText={history.length === 0 ? 'Create Location Alarm' : undefined}
          onAction={history.length === 0 ? () => setActivePage('create') : undefined}
        />
      ) : (
        <div className="space-y-2">
          {filteredHistory.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-[#1a1a1a] rounded-md hover:border-[#2a2a2a] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-[#111111] border border-[#1a1a1a] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#888888]" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-white">
                    {item.destinationName}
                  </h3>
                  <p className="text-xs text-[#555555] truncate max-w-xs sm:max-w-md">
                    {item.address || 'Location'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#555555] mt-1.5">
                    <span className="flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      <span>{item.radius}m</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.durationMinutes} min</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="text-left sm:text-right">
                  <span className="text-xs text-[#888888] block">
                    {new Date(item.arrivedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[11px] text-[#555555]">
                    {new Date(item.arrivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-[#555555] hover:text-red-400 rounded-md transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
