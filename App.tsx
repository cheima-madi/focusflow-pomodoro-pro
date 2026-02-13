
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, TimerSettings } from './types';
import { DEFAULT_SETTINGS, ALARM_URL, STORAGE_KEYS } from './constants';
import { ProgressCircle } from './components/ProgressCircle';
import { SettingsModal } from './components/SettingsModal';

const Mascot: React.FC<{ mode: TimerMode; isActive: boolean }> = ({ mode, isActive }) => {
  // Simple CSS mascot: A little "Pomo" character
  const isFocus = mode === TimerMode.FOCUS;
  
  return (
    <div className={`flex flex-col items-center justify-center transition-all duration-500 ${isActive ? 'animate-bounce-slow' : 'opacity-80'}`}>
      <div className={`relative w-16 h-14 rounded-[2rem] flex items-center justify-center shadow-lg transition-colors duration-500 ${isFocus ? 'bg-strawberry' : 'bg-matcha'}`}>
        {/* Leaf */}
        <div className={`absolute -top-3 w-4 h-6 rounded-full transition-colors ${isFocus ? 'bg-matcha' : 'bg-matcha-dark'} rotate-12`}></div>
        {/* Eyes */}
        <div className="flex gap-3">
          <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-900 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-900 animate-pulse"></div>
        </div>
        {/* Mouth */}
        <div className={`absolute bottom-3 w-3 h-1.5 border-b-2 border-slate-800 dark:border-slate-900 rounded-full ${isActive ? 'scale-y-125' : 'scale-y-75'}`}></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.focusDuration);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

    if (savedSessions) setSessionsCompleted(parseInt(savedSessions));
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setTimeLeft(parsed.focusDuration);
    }
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');

    audioRef.current = new Audio(ALARM_URL);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    audioRef.current?.play();

    if (mode === TimerMode.FOCUS) {
      const newCount = sessionsCompleted + 1;
      setSessionsCompleted(newCount);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, newCount.toString());
      setMode(TimerMode.BREAK);
      setTimeLeft(settings.breakDuration);
    } else {
      setMode(TimerMode.FOCUS);
      setTimeLeft(settings.focusDuration);
    }
  }, [mode, sessionsCompleted, settings]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode(TimerMode.FOCUS);
    setTimeLeft(settings.focusDuration);
  };

  const skipMode = () => {
    setIsActive(false);
    if (mode === TimerMode.FOCUS) {
      setMode(TimerMode.BREAK);
      setTimeLeft(settings.breakDuration);
    } else {
      setMode(TimerMode.FOCUS);
      setTimeLeft(settings.focusDuration);
    }
  };

  const updateSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    setIsActive(false);
    setMode(TimerMode.FOCUS);
    setTimeLeft(newSettings.focusDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / (mode === TimerMode.FOCUS ? settings.focusDuration : settings.breakDuration);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-10 transition-all duration-500 overflow-hidden">
      {/* Decorative Blobs */}
      <div className="fixed -top-20 -left-20 w-64 h-64 bg-strawberry/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-matcha/20 rounded-full blur-3xl pointer-events-none"></div>

      <header className="w-full max-w-4xl flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-strawberry rounded-2xl flex items-center justify-center shadow-lg shadow-strawberry/20 rotate-3">
            <span className="text-2xl text-white">🍅</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">PomoCute</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-sm hover:scale-110 active:scale-95 transition-all"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-sm hover:scale-110 active:scale-95 transition-all"
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full z-10">
        <div className="mb-4">
          <Mascot mode={mode} isActive={isActive} />
        </div>

        <div className="relative mb-10">
          <ProgressCircle progress={progress} mode={mode}>
            <div className="flex flex-col items-center">
              <span className={`text-sm font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 ${mode === TimerMode.FOCUS ? 'bg-strawberry/20 text-strawberry-dark' : 'bg-matcha/20 text-matcha-dark'}`}>
                {mode === TimerMode.FOCUS ? 'Focus Time' : 'Tea Break'}
              </span>
              <span className="text-7xl font-mono font-bold tracking-tight text-slate-800 dark:text-white">
                {formatTime(timeLeft)}
              </span>
              <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-3xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-md">
                 <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                   Session #{sessionsCompleted + 1}
                 </span>
              </div>
            </div>
          </ProgressCircle>
        </div>

        <div className="flex flex-col items-center gap-10 w-full">
          <div className="flex items-center gap-8">
            <button
              onClick={resetTimer}
              className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-strawberry-dark hover:scale-110 active:scale-90 transition-all shadow-md"
            >
              <span className="text-xl">🔄</span>
            </button>

            <button
              onClick={toggleTimer}
              className={`h-24 w-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 ${
                isActive 
                  ? 'bg-slate-800 dark:bg-pink-100 dark:text-slate-900' 
                  : (mode === TimerMode.FOCUS ? 'bg-strawberry shadow-strawberry/50' : 'bg-matcha shadow-matcha/50')
              }`}
            >
              <span className="text-4xl">{isActive ? '⏸' : '▶️'}</span>
            </button>

            <button
              onClick={skipMode}
              className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-matcha-dark hover:scale-110 active:scale-90 transition-all shadow-md"
            >
              <span className="text-xl">⏩</span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">Pomo Progress</p>
            <div className="flex justify-center gap-2">
              {[...Array(Math.max(4, sessionsCompleted))].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full transition-all duration-700 ${
                    i < sessionsCompleted ? 'bg-strawberry scale-110 shadow-lg shadow-strawberry/40' : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full mt-8 py-4 text-center">
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          Made with ❤️ for productivity
        </p>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={updateSettings}
      />
    </div>
  );
};

export default App;
