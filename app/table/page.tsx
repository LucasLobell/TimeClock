"use client";
import { useEffect, useState } from "react";
import { account } from "@/app/appwrite";
import HistoryTable from "@/components/HistoryTable";
import NavBar from "@/components/NavBar";

const ProfilePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentMonth = selectedDate?.getMonth() ?? new Date().getMonth();
  const currentYear = selectedDate?.getFullYear() ?? new Date().getFullYear();

  // Fetch user ID on mount
  useEffect(() => {
    account.get().then(user => {
      setUserId(user.$id);
      setSelectedDate(new Date()); // <-- Add this line
    });
  }, []);

  if (!userId) return <div>Loading profile...</div>;

  return (
    <div className="h-screen w-screen relative">
      <NavBar
        iconHouse={false}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <h1 className="text-2xl font-bold mb-4">Time Entry History</h1>
      {/* You could add month/year pickers here */}
      <HistoryTable userId={userId} month={currentMonth} year={currentYear} />
    </div>
  );
};

export default ProfilePage;