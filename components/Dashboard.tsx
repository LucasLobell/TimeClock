"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";
import NavBar from "./NavBar";
import TimeClock from "./TimeClock";
import PageLoadingShell from "./PageLoadingShell";
import ErrorMessage from "./ErrorMessage";
import { getDateKey, useUserTimes } from "@/utils/time";
import { getStrictTimeRulingPreference } from "../utils/preferences";

const Dashboard = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [strictTimeRuling, setStrictTimeRuling] = useState(true);
  const { allTimes, setTimeForDay, isLoading, error } = useUserTimes(userId, selectedDate);

  // Check for active session and get userId
  useEffect(() => {
    account
      .get()
      .then((user) => {
        setUserId(user.$id);
        setStrictTimeRuling(getStrictTimeRulingPreference(user.prefs as Record<string, unknown>));
        setLoading(false);
        setSelectedDate(new Date());
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  if (loading || !selectedDate || isLoading) {
    return <PageLoadingShell />;
  }
  if (error) return <ErrorMessage message={error.message} />;

  const dateKey = selectedDate ? getDateKey(selectedDate) : "";
  const times = (allTimes && allTimes[dateKey]) || {
    morningEntry: "",
    morningExit: "",
    afternoonEntry: "",
    afternoonExit: "",
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <NavBar
        iconHouse={false}
        iconTable={true}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="flex-1 flex items-center justify-center p-4">
        <TimeClock
          selectedDate={selectedDate}
          strictTimeRuling={strictTimeRuling}
          morningEntry={times.morningEntry}
          setMorningEntry={(v) => setTimeForDay({ morningEntry: v })}
          morningExit={times.morningExit}
          setMorningExit={(v) => setTimeForDay({ morningExit: v })}
          afternoonEntry={times.afternoonEntry}
          setAfternoonEntry={(v) => setTimeForDay({ afternoonEntry: v })}
          afternoonExit={times.afternoonExit}
          setAfternoonExit={(v) => setTimeForDay({ afternoonExit: v })}
        />
      </div>
    </div>
  );
};

export default Dashboard;