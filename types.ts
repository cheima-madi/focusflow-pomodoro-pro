
export enum TimerMode {
  FOCUS = 'FOCUS',
  BREAK = 'BREAK'
}

export interface TimerSettings {
  focusDuration: number;
  breakDuration: number;
}

export interface AppState {
  timeLeft: number;
  isActive: boolean;
  mode: TimerMode;
  sessionsCompleted: number;
  settings: TimerSettings;
  isDarkMode: boolean;
}
