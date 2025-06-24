"use client";

import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import TimeClock from "./TimeClock";

type TimesForDay = {
  morningEntry: string;
  morningExit: string;
  afternoonEntry: string;
  afternoonExit: string;
};

function getDateKey(date: Date) {
  // Always use YYYY-MM-DD for keys
  return date.toISOString().slice(0, 10);
}

const Dashboard = () => {
  // Start with null to avoid SSR mismatch
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [allTimes, setAllTimes] = useState<Record<string, TimesForDay>>({});

  // Set the date on the client only
  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  // Don't render children until date is set
  if (!selectedDate) return null;

  const dateKey = getDateKey(selectedDate);
  const times = allTimes[dateKey] || {
    morningEntry: "",
    morningExit: "",
    afternoonEntry: "",
    afternoonExit: "",
  };

  // When a time changes, update only the current date's times
  const setTimeForDay = (field: keyof TimesForDay, value: string) => {
    setAllTimes((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        ...times,
        [field]: value,
      },
    }));
  };

  return (
    <div className="h-screen w-screen relative">
      <NavBar
        iconHouse={false}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <TimeClock
            selectedDate={selectedDate}
            morningEntry={times.morningEntry}
            setMorningEntry={(v) => setTimeForDay("morningEntry", v)}
            morningExit={times.morningExit}
            setMorningExit={(v) => setTimeForDay("morningExit", v)}
            afternoonEntry={times.afternoonEntry}
            setAfternoonEntry={(v) => setTimeForDay("afternoonEntry", v)}
            afternoonExit={times.afternoonExit}
            setAfternoonExit={(v) => setTimeForDay("afternoonExit", v)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;