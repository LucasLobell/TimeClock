import {
  MIN_MORNING_EXIT,
  MIN_MORNING_HOURS,
  MAX_MORNING_HOURS,
  MAX_AFTERNOON_ENTRY,
  MIN_LUNCH_BREAK,
  WORKDAY_MINUTES,
  MIN_AFTERNOON_EXIT,
  MAX_AFTERNOON_EXIT,
} from "../constants/timeRules";
import { isValidTime, timeToMinutes, minutesToTime } from "./time";

/**
 * Calculates the earliest possible morning exit time based on the morning entry.
 * Ensures the exit is at least the minimum morning hours after entry and not before the minimum allowed exit.
 * @param morningEntry - The morning entry time string (e.g., "08:00").
 * @returns The auto-calculated morning exit time string, or "" if input is invalid.
 */
export function autoMorningExit(morningEntry: string) {
  if (!isValidTime(morningEntry)) return "";
  const minExit = Math.max(
    timeToMinutes(morningEntry) + MIN_MORNING_HOURS * 60,
    timeToMinutes(MIN_MORNING_EXIT)
  );
  const maxExit = timeToMinutes(morningEntry) + MAX_MORNING_HOURS * 60;
  return minutesToTime(Math.min(minExit, maxExit));
}

/**
 * Calculates the earliest possible afternoon entry time based on the morning exit.
 * Ensures the entry is at least the minimum lunch break after morning exit and not after the maximum allowed entry.
 * @param morningExit - The morning exit time string (e.g., "12:00").
 * @returns The auto-calculated afternoon entry time string, or "" if input is invalid.
 */
export function autoAfternoonEntry(morningExit: string) {
  if (!isValidTime(morningExit)) return "";
  const minEntry = timeToMinutes(morningExit) + MIN_LUNCH_BREAK;
  const maxEntry = timeToMinutes(MAX_AFTERNOON_ENTRY);
  return minutesToTime(Math.min(minEntry, maxEntry));
}

/**
 * Calculates the expected afternoon exit time based on the morning entry, morning exit, and afternoon entry.
 * Ensures the exit time completes the workday, but clamps to allowed minimum and maximum afternoon exit times.
 * @param morningEntry - The morning entry time string.
 * @param morningExit - The morning exit time string.
 * @param afternoonEntry - The afternoon entry time string.
 * @returns The auto-calculated afternoon exit time string, or "" if any input is invalid.
 */
export function autoAfternoonExit(
  morningEntry: string,
  morningExit: string,
  afternoonEntry: string
) {
  if (
    isValidTime(morningEntry) &&
    isValidTime(morningExit) &&
    isValidTime(afternoonEntry)
  ) {
    const morningWorked = timeToMinutes(morningExit) - timeToMinutes(morningEntry);
    const remaining = WORKDAY_MINUTES - morningWorked;
    let exitMinutes = timeToMinutes(afternoonEntry) + remaining;
    if (exitMinutes < timeToMinutes(MIN_AFTERNOON_EXIT)) exitMinutes = timeToMinutes(MIN_AFTERNOON_EXIT);
    if (exitMinutes > timeToMinutes(MAX_AFTERNOON_EXIT)) exitMinutes = timeToMinutes(MAX_AFTERNOON_EXIT);
    return minutesToTime(exitMinutes);
  }
  return "";
}