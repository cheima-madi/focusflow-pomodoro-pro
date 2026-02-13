
import React from 'react';

interface ProgressCircleProps {
  progress: number;
  mode: 'FOCUS' | 'BREAK';
  children: React.ReactNode;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ progress, mode, children }) => {
  const size = 320;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  const colorClass = mode === 'FOCUS' ? 'stroke-strawberry' : 'stroke-matcha';
  const glowClass = mode === 'FOCUS' ? 'drop-shadow-[0_0_8px_rgba(255,143,163,0.6)]' : 'drop-shadow-[0_0_8px_rgba(149,213,178,0.6)]';

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/50 dark:text-white/5"
        />
        {/* Progress Bar */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} ${glowClass} transition-all duration-300 ease-linear`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};
