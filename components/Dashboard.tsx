"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";
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
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [allTimes, setAllTimes] = useState<Record<string, TimesForDay>>({});
  const [loading, setLoading] = useState(true);

  // Check for active session on mount
  useEffect(() => {
    account
      .get()
      .then(() => setLoading(false))
      .catch(() => {
        router.replace("/login");
      });
    setSelectedDate(new Date());
  }, [router]);

  // Wait for session check before rendering
  if (loading || !selectedDate) return null;

  const dateKey = getDateKey(selectedDate);
  const times = allTimes[dateKey] || {
    morningEntry: "",
    morningExit: "",
    afternoonEntry: "",
    afternoonExit: "",
  };

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