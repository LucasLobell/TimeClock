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

  if (loading || !selectedDate || isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <div className="w-full h-20 min-h-[80px] flex flex-row items-center justify-between px-8 bg-[#1a1a1a] border-b border-gray-800">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg animate-pulse">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </div>
          </div>
          <div className="flex justify-center flex-grow">
            <div className="w-[348px] h-12 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg animate-pulse">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <Loading />
        </div>
      </div>
    );
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