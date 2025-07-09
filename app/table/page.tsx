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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <HistoryTable userId={userId} month={currentMonth} year={currentYear} />
      </div>
    </div>
  );
};

export default ProfilePage;