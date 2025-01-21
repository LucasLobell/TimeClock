'use client';

import { useState, useEffect } from 'react';

interface TimeDisplay {
  hours: string;
  minutes: string;
  seconds: string;
}

const NeonClock = () => {
  const [time, setTime] = useState<TimeDisplay>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        hours: now.getHours().toString().padStart(2, '0'),
        minutes: now.getMinutes().toString().padStart(2, '0'),
        seconds: now.getSeconds().toString().padStart(2, '0')
      });
    };

    // Update immediately
    updateTime();
    
    // Update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center p-8">
      <div className="bg-black/90 rounded-lg p-8 shadow-[0_0_20px_rgba(62,220,247,0.7)]">
        <div className="flex gap-4 text-7xl font-mono">
          <div className="text-[#3edcf7] animate-pulse shadow-[0_0_20px_rgba(62,220,247,0.7)]">
            {time.hours}
          </div>
          <div className="text-[#3edcf7] animate-pulse">:</div>
          <div className="text-[#3edcf7] animate-pulse shadow-[0_0_20px_rgba(62,220,247,0.7)]">
            {time.minutes}
          </div>
          <div className="text-[#3edcf7] animate-pulse">:</div>
          <div className="text-[#3edcf7] animate-pulse shadow-[0_0_20px_rgba(62,220,247,0.7)]">
            {time.seconds}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeonClock;