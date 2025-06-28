import { databases } from "@/app/appwrite";
import { ID, Query } from "appwrite";
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * Ensures a time string is in HH:MM format and clamps minutes to 59 if greater.
 * Only applies correction if the string contains a colon and is split into two parts.
 * @param time - The time string to fix (e.g., "12:62" becomes "12:59").
 * @returns The corrected time string.
 */
export function fixPartialTime(time: string) {
  if (!time.includes(":")) return time;
  const parts = time.split(":");
  if (parts.length !== 2) return time;

  let [hStr, mStr] = parts;

  if (mStr.length === 1) {
    mStr = mStr + "0";
  }

  if (hStr.length === 1) hStr = "0" + hStr;
  if (mStr.length === 1) mStr = "0" + mStr;

  // Clamp minutes to 59 if greater
  let minutes = parseInt(mStr, 10);
  if (!isNaN(minutes) && minutes > 59) {
    mStr = "59";
  }

  return `${hStr}:${mStr}`;
}

/**
 * Converts a time string in HH:MM format to the total number of minutes.
 * @param t - The time string (e.g., "08:30").
 * @returns The total minutes (e.g., 510).
 */
export function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Converts a number of minutes to a time string in HH:MM format.
 * @param mins - The total minutes.
 * @returns The time string (e.g., 510 becomes "08:30").
 */
export function minutesToTime(mins: number) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Clamps a time string between a minimum and maximum time.
 * @param val - The time string to clamp.
 * @param min - The minimum allowed time string.
 * @param max - The maximum allowed time string.
 * @returns The clamped time string.
 */
export function clampTime(val: string, min: string, max: string) {
  const v = timeToMinutes(val);
  const vmin = timeToMinutes(min);
  const vmax = timeToMinutes(max);
  if (v < vmin) return min;
  if (v > vmax) return max;
  return val;
}

/**
 * Checks if a time string is valid in HH:MM 24-hour format.
 * @param time - The time string to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidTime(time: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

/**
 * Formats a string as a time input in HH:MM format as the user types.
 * Only allows up to 4 digits, inserting a colon after the first two.
 * @param val - The raw input string.
 * @returns The formatted time string.
 */
export function formatTimeInput(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

export async function getTimesForUserDate(userId: string, date: string) {
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
    // Appwrite query: filter by userId and date
    // @ts-ignore
    Query.equal("userId", userId),
    // @ts-ignore
    Query.equal("date", date),
  ]);
  return res.documents[0] || null;
}

export async function upsertTimesForUserDate(userId: string, date: string, data: Partial<Record<string, string>>) {
  // Try to find existing doc
  const existing = await getTimesForUserDate(userId, date);
  if (existing) {
    // Update only the provided fields
    return databases.updateDocument(DB_ID, COLLECTION_ID, existing.$id, data);
  } else {
    // Create new doc
    return databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
      userId,
      date,
      ...data,
    });
  }
}

export function useUserTimes(userId: string | null, selectedDate: Date | null) {
  const dateKey = selectedDate ? selectedDate.toISOString().slice(0, 10) : "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["userTimes", userId, dateKey],
    queryFn: () =>
      userId && dateKey
        ? getTimesForUserDate(userId, dateKey)
        : Promise.resolve(null),
    enabled: !!userId && !!selectedDate,
  });

  const [allTimes, setAllTimes] = useState<Record<string, any>>({});
  const upsertTimeout = useRef<NodeJS.Timeout | null>(null);
  const pendingFields = useRef<Partial<Record<string, string>>>({});

  useEffect(() => {
    if (!userId || !selectedDate) return;
    const dateKey = selectedDate.toISOString().slice(0, 10);
    getTimesForUserDate(userId, dateKey).then((doc) => {
      setAllTimes((prev) => ({
        ...prev,
        [dateKey]: {
          morningEntry: doc?.morningEntry || "",
          morningExit: doc?.morningExit || "",
          afternoonEntry: doc?.afternoonEntry || "",
          afternoonExit: doc?.afternoonExit || "",
        },
      }));
    });
  }, [userId, selectedDate]);

  const setTimeForDay = useCallback(
    (fields: Partial<Record<string, string>>) => {
      if (!userId || !selectedDate) return;
      const dateKey = selectedDate.toISOString().slice(0, 10);

      setAllTimes((prev) => {
        const prevDay = prev[dateKey] || {
          morningEntry: "",
          morningExit: "",
          afternoonEntry: "",
          afternoonExit: "",
        };
        const updatedDay = { ...prevDay, ...fields };
        return {
          ...prev,
          [dateKey]: updatedDay,
        };
      });

      // Merge fields into pendingFields
      pendingFields.current = { ...pendingFields.current, ...fields };

      // Debounce upsert
      if (upsertTimeout.current) clearTimeout(upsertTimeout.current);
      upsertTimeout.current = setTimeout(() => {
        const toUpsert = { ...pendingFields.current };
        pendingFields.current = {};

        // Only upsert if at least one valid time is present
        const validEntries = Object.entries(toUpsert).filter(
          ([, v]) => v && isValidTime(v)
        );
        if (validEntries.length === 0) {
          // Nothing valid to save, skip DB call
          return;
        }

        // Only upsert valid fields
        const validFields = Object.fromEntries(validEntries);

        upsertTimesForUserDate(userId, dateKey, validFields).catch((e) => {
          console.error(e);
        });
      }, 100); // 100ms debounce
    },
    [userId, selectedDate]
  );

  return {
    allTimes: {
      [dateKey]: {
        morningEntry: data?.morningEntry || "",
        morningExit: data?.morningExit || "",
        afternoonEntry: data?.afternoonEntry || "",
        afternoonExit: data?.afternoonExit || "",
      },
    },
    setTimeForDay,
    isLoading,
    error,
  };
}

// Helper to get YYYY-MM-DD string from selectedDate
export function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}