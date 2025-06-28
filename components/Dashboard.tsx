"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";
import NavBar from "./NavBar";
import TimeClock from "./TimeClock";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import { getDateKey, useUserTimes } from "@/utils/time";

const Dashboard = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { allTimes, setTimeForDay, isLoading, error } = useUserTimes(userId, selectedDate);

  // Check for active session and get userId
  useEffect(() => {
    account
      .get()
      .then((user) => {
        setUserId(user.$id);
        setLoading(false);
        setSelectedDate(new Date());
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  if (loading || !selectedDate || isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const dateKey = selectedDate ? getDateKey(selectedDate) : "";
  const times = (allTimes && allTimes[dateKey]) || {
    morningEntry: "",
    morningExit: "",
    afternoonEntry: "",
    afternoonExit: "",
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
    </div>
  );
};

export default Dashboard;