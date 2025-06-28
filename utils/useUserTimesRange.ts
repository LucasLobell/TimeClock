import { useEffect, useState } from "react";
import { databases } from "@/app/appwrite";
import { getDateKey } from "./time";
import { Query } from "appwrite";

// Helper to get all date keys between two dates
function getDateKeysInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  let curr = new Date(start);
  while (curr <= end) {
    dates.push(getDateKey(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

export function useUserTimesRange(userId: string | null, startDate: Date | null, endDate: Date | null) {
  const [timesByDate, setTimesByDate] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !startDate || !endDate) return;
    setLoading(true);

    // Example: fetch all times for this user in the date range
    const fetch = async () => {
      const dateKeys = getDateKeysInRange(startDate, endDate);
      // You might want to optimize this with a better query if supported!
      const results: Record<string, any> = {};
      for (const date of dateKeys) {
        // Replace with your real query; batching recommended if possible
        const res = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
          [
            // @ts-ignore
            Query.equal("userId", userId),
            // @ts-ignore
            Query.equal("date", date)
          ]
        );
        results[date] = res.documents[0] || null;
      }
      setTimesByDate(results);
      setLoading(false);
    };

    fetch();
  }, [userId, startDate, endDate]);

  return { timesByDate, loading };
}