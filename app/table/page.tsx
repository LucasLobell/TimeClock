"use client";
import { useEffect, useState } from "react";
import { account } from "@/app/appwrite";
import HistoryTable from "@/components/HistoryTable";
import NavBar from "@/components/NavBar";
import Loading from "@/components/Loading";

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
        <div className="flex-1 pt-8 px-8 pb-4">
          <Loading />
        </div>
      </div>
    );
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