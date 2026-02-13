
import { TimerMode, TimerSettings } from './types';

export const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25 * 60, // 25 minutes
  breakDuration: 5 * 60,  // 5 minutes
};

export const ALARM_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export const STORAGE_KEYS = {
  SESSIONS: 'pomodoro_sessions_count',
  SETTINGS: 'pomodoro_settings',
  THEME: 'pomodoro_theme'
};
