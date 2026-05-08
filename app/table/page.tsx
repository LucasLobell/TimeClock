"use client";
import { useEffect, useState } from "react";
import { account } from "@/app/appwrite";
import HistoryTable from "@/components/HistoryTable";
import NavBar from "@/components/NavBar";
import PageLoadingShell from "@/components/PageLoadingShell";

const ProfilePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Always use current month/year for the table, regardless of selectedDate
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  

  


  // Fetch user ID on mount
  useEffect(() => {
    account.get().then(user => {
      setUserId(user.$id);
      setSelectedDate(new Date());
    });
  }, []);

  if (!userId) {
    return <PageLoadingShell />;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <NavBar
        iconHouse={true}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="flex-1 pt-8 px-8 pb-4">
        <HistoryTable userId={userId} month={currentMonth} year={currentYear} />
      </div>
    </div>
  );
};

export default ProfilePage;