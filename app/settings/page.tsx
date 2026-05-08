
'use client';

import { useEffect, useState } from "react";
import { account } from "../appwrite";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import PageLoadingShell from "@/components/PageLoadingShell";

const SettingsPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account
      .get()
      .then((user) => {
        setUserId(user.$id);
        setSelectedDate(new Date());
        setLoggedInUser(user);
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading || !selectedDate) {
    return <PageLoadingShell />;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <NavBar
        iconHouse={true}
        iconProfile={true}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
        <div className="bg-gray-800 rounded-lg p-6 space-y-3">
          <p className="text-gray-300">User ID: <span className="text-white">{userId}</span></p>
          <p className="text-gray-300">Name: <span className="text-white">{loggedInUser?.name}</span></p>
          <p className="text-gray-300">Email: <span className="text-white">{loggedInUser?.email}</span></p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
