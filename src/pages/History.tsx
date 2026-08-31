import React, { useState } from 'react';
import { History as HistoryIcon, Search, Trash2, MapPin, Clock, Radio, X } from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { Card } from '../components/Common/Card';
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
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <HistoryIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Alarm History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log of completed arrivals and geofence tracking sessions.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-auto py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-xl border border-rose-500/20 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history by destination name..."
            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={history.length === 0 ? 'No Alarm History Yet' : 'No Matching Results'}
          description={
            history.length === 0
              ? 'Your completed location alarms will appear here after you arrive at your destinations.'
              : `No history entries match "${searchTerm}".`
          }
          actionText={history.length === 0 ? '+ Create Location Alarm' : undefined}
          onAction={history.length === 0 ? () => setActivePage('create') : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {item.destinationName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                    {item.address || 'Arrived Location'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Arrived within {item.radius} m</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Duration: {item.durationMinutes} min</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    {new Date(item.arrivedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.arrivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
