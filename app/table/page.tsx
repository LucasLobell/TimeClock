"use client";
import { useEffect, useState } from "react";
import { account, databases } from "@/app/appwrite";
import DataTable from "./data-table";
import HistoryTable from "@/components/HistoryTable";
import NavBar from "@/components/NavBar";
import { columns, Times } from "./columns";
import { Query } from "appwrite";

async function getData(userId: string, year: number, month: number): Promise<Times[]> {
  try {
    // Get first day and last day of month as ISO strings "YYYY-MM-DD"
    const firstDay = new Date(year, month, 1).toISOString().slice(0, 10);
    const lastDay = new Date(year, month + 1, 0).toISOString().slice(0, 10);

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
      [
        Query.equal("userId", userId),
        Query.greaterThanEqual("date", firstDay),
        Query.lessThanEqual("date", lastDay),
      ]
    );

    return response.documents.map((doc: any) => ({
      userId: doc.userId,
      date: doc.date,
      morningEntry: doc.morningEntry,
      morningExit: doc.morningExit,
      afternoonEntry: doc.afternoonEntry,
      afternoonExit: doc.afternoonExit,
    })) as Times[];
  } catch (error: string | any) {
    alert(`Failed to fetch data: ${error.message}`);
    return [];
  }
}

function getAllDaysInMonth(year: number, month: number): string[] {
  const date = new Date(year, month, 1);
  const days: string[] = [];

  while (date.getMonth() === month) {
    days.push(date.toISOString().slice(0, 10));
    date.setDate(date.getDate() + 1);
  }

  return days;
}


const ProfilePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentMonth = selectedDate?.getMonth() ?? new Date().getMonth();
  const currentYear = selectedDate?.getFullYear() ?? new Date().getFullYear();
  const [data, setData] = useState<Times[]>([]);

  useEffect(() => {
  account.get().then(user => {
    setUserId(user.$id);
    setSelectedDate(new Date()); // Set to current date to trigger fetch
  });
}, []);


useEffect(() => {
  async function fetchData() {
    if (!userId || selectedDate === null) return;

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // Fetch all entries for the month
    const fetchedData = await getData(userId, year, month);

    // Generate all days in month
    const allDays = getAllDaysInMonth(year, month);

    // Map fetched entries by date for quick lookup
    const dataMap = new Map(fetchedData.map(item => [item.date, item]));

    // Merge so every day has an entry, or empty object if none found
    const fullMonthData = allDays.map(day => dataMap.get(day) ?? {
      userId,
      date: day,
      morningEntry: null,
      morningExit: null,
      afternoonEntry: null,
      afternoonExit: null,
    });

    setData(fullMonthData);
  }

  fetchData();
}, [userId, selectedDate]);



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
      {/* <HistoryTable userId={userId} month={currentMonth} year={currentYear} /> */}
      <div className="flex flex-col items-center justify-center h-full absolute inset-0 text-white">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ProfilePage;