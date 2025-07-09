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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !startDate || !endDate) return;
    
    setLoading(true);
    setError(null);

    const fetchTimes = async () => {
      try {
        // Get all date keys in the range
        const dateKeys = getDateKeysInRange(startDate, endDate);
        
        // Use a single query with date range filtering
        // Appwrite doesn't support IN queries directly, so we'll use a different approach
        const startDateKey = getDateKey(startDate);
        const endDateKey = getDateKey(endDate);
        
        // Query for all documents in the date range for this user
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
          [
            Query.equal("userId", userId),
            Query.greaterThanEqual("date", startDateKey),
            Query.lessThanEqual("date", endDateKey),
            Query.orderAsc("date"),
            Query.limit(100) // Adjust based on your needs
          ]
        );

        // Create a map of date -> times
        const results: Record<string, any> = {};
        
        // Initialize all dates in range with null (no data)
        dateKeys.forEach(dateKey => {
          results[dateKey] = null;
        });

        // Fill in the actual data from the response
        response.documents.forEach(doc => {
          if (doc.date && results.hasOwnProperty(doc.date)) {
            results[doc.date] = doc;
          }
        });

        setTimesByDate(results);
      } catch (err: any) {
        console.error("Error fetching times range:", err);
        setError(err.message || "Failed to fetch time entries");
        
        // Fallback to empty state
        const dateKeys = getDateKeysInRange(startDate, endDate);
        const emptyResults: Record<string, any> = {};
        dateKeys.forEach(dateKey => {
          emptyResults[dateKey] = null;
        });
        setTimesByDate(emptyResults);
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, [userId, startDate, endDate]);

  return { timesByDate, loading, error };
}