
import React, { useState } from 'react';
import { TimerSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSave: (newSettings: TimerSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [focusMin, setFocusMin] = useState(settings.focusDuration / 60);
  const [breakMin, setBreakMin] = useState(settings.breakDuration / 60);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      focusDuration: focusMin * 60,
      breakDuration: breakMin * 60,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-strawberry/20 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl w-full max-w-md border-4 border-white dark:border-slate-800 mx-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-strawberry/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-matcha/10 rounded-full -ml-12 -mb-12"></div>
        
        <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white flex items-center gap-3">
          <span>✨</span> Timer Settings
        </h2>
        
        <div className="space-y-8 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest ml-1">Focus Time (min)</label>
            <div className="relative">
              <input
                type="number"
                value={focusMin}
                onChange={(e) => setFocusMin(Number(e.target.value))}
                className="w-full px-6 py-4 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:border-strawberry transition-all text-lg font-bold"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl">🍅</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest ml-1">Break Time (min)</label>
            <div className="relative">
              <input
                type="number"
                value={breakMin}
                onChange={(e) => setBreakMin(Number(e.target.value))}
                className="w-full px-6 py-4 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:border-matcha transition-all text-lg font-bold"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl">🍵</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-12 relative z-10">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-3xl font-bold text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 px-6 rounded-3xl font-bold text-white bg-slate-800 dark:bg-white dark:text-slate-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
          >
            Apply ✨
          </button>
        </div>
      </div>
    </div>
  );
};
