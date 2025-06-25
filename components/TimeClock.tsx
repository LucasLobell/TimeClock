"use client";

import React, { useEffect, useRef } from "react";
import PointCard from "./PointCard";
import {
  autoMorningExit,
  autoAfternoonEntry,
  autoAfternoonExit,
} from "../utils/timeLogic";
import { TimeClockProps } from "../types/TimeClockProps";
import {
  handleMorningEntryChange,
  handleMorningExitChange,
  handleAfternoonEntryChange,
  handleAfternoonExitChange,
} from "../utils/timeHandlers";
import {
  MIN_LUNCH_BREAK,
  MAX_AFTERNOON_ENTRY,
  MAX_AFTERNOON_EXIT,
  MIN_AFTERNOON_EXIT,
  MIN_MORNING_EXIT,
  MIN_MORNING_HOURS,
  MAX_MORNING_HOURS,
  MAX_AFTERNOON_HOURS,
  MIN_AFTERNOON_HOURS,
  MAX_MORNING_ENTRY,
  MIN_MORNING_ENTRY,
} from "../constants/timeRules";
import {
  isValidTime,
  minutesToTime,
  timeToMinutes
} from "../utils/time";

/**
 * TimeClock component manages the logic and UI for a four-point time clock:
 * - Morning Entry
 * - Morning Exit
 * - Afternoon Entry
 * - Afternoon Exit
 *
 * Enforces business rules such as minimum/maximum times, minimum lunch break,
 * and ensures the chronological order of the points. Also auto-fills dependent
 * fields unless the user has manually changed them.
 *
 * @component
 * @param {TimeClockProps} props - The props for TimeClock.
 */
const TimeClock = ({
  morningEntry,
  setMorningEntry,
  morningExit,
  setMorningExit,
  afternoonEntry,
  setAfternoonEntry,
  afternoonExit,
  setAfternoonExit,
}: TimeClockProps) => {
  // Track if the user has manually changed each field
  const userChangedMorningExit = useRef(false);
  const userChangedAfternoonEntry = useRef(false);
  const userChangedAfternoonExit = useRef(false);

  // --- Auto & Validation Logic ---

  /**
   * Auto-set morningExit when morningEntry changes,
   * unless user changed it or it matches the auto value.
   */
  useEffect(() => {
    if (
      isValidTime(morningEntry) &&
      (!userChangedMorningExit.current ||
        morningExit === "" ||
        morningExit === autoMorningExit(morningEntry))
    ) {
      const autoValue = autoMorningExit(morningEntry);
      setMorningExit(autoValue);
      userChangedMorningExit.current = false;
    }
    // eslint-disable-next-line
  }, [morningEntry]);

  // Track if morningExit was set by the user at least once
  const [morningExitWasSet, setMorningExitWasSet] = React.useState(false);

  useEffect(() => {
    if (userChangedMorningExit.current && isValidTime(morningExit)) {
      setMorningExitWasSet(true);
    }
    // Reset flag if morningExit is cleared or morningEntry changes
    if (!isValidTime(morningExit)) {
      setMorningExitWasSet(false);
    }
    // eslint-disable-next-line
  }, [morningExit, morningEntry]);

useEffect(() => {
  if (
    isValidTime(morningExit) &&
    isValidTime(afternoonEntry)
  ) {
    const minAfternoonEntry = timeToMinutes(morningExit) + MIN_LUNCH_BREAK;
    if (timeToMinutes(afternoonEntry) < minAfternoonEntry) {
      setAfternoonEntry(minutesToTime(minAfternoonEntry));
    }
  }
  // eslint-disable-next-line
}, [morningExit]);

  /**
   * Auto-set afternoonEntry when morningExit changes,
   * unless user changed it or it matches the auto value,
   * and only after morningExitWasSet.
   */
  useEffect(() => {
    if (
      morningExitWasSet &&
      isValidTime(morningExit)
    ) {
      const minAfternoonEntry = timeToMinutes(morningExit) + MIN_LUNCH_BREAK;
      const currentAfternoonEntry = isValidTime(afternoonEntry)
        ? timeToMinutes(afternoonEntry)
        : null;
      const autoValue = autoAfternoonEntry(morningExit);

      console.log("[AfternoonEntry Effect] morningExit:", morningExit, "afternoonEntry:", afternoonEntry, "userChangedAfternoonEntry:", userChangedAfternoonEntry.current, "minAfternoonEntry:", minAfternoonEntry, "autoValue:", autoValue);

      // If afternoonEntry is missing or lunch break is too short, force update
      if (
        afternoonEntry === "" ||
        currentAfternoonEntry === null ||
        currentAfternoonEntry < minAfternoonEntry
      ) {
        setAfternoonEntry(autoValue);
        userChangedAfternoonEntry.current = false;
        console.log("[AfternoonEntry Effect] Auto-setting afternoonEntry to:", autoValue);
      }
    }
    // eslint-disable-next-line
  }, [morningExit, morningExitWasSet]);

  /**
   * Auto-set afternoonExit when any dependency changes,
   * unless user changed it or it matches the auto value,
   * and only after morningExitWasSet.
   */
  useEffect(() => {
    if (
      morningExitWasSet &&
      isValidTime(morningEntry) &&
      isValidTime(morningExit) &&
      isValidTime(afternoonEntry)
    ) {
      const autoValue = autoAfternoonExit(morningEntry, morningExit, afternoonEntry);
      const estimated = autoValue;
      const estimatedMinutes = timeToMinutes(estimated);
      let minExit = estimatedMinutes - 5;
      const strictMaxBy5h = timeToMinutes(afternoonEntry) + 5 * 60;
      const strictMaxBy19 = timeToMinutes(MAX_AFTERNOON_EXIT);
      const maxExit = Math.min(
        estimatedMinutes + 10,
        strictMaxBy5h + 10,
        strictMaxBy19 + 10
      );
      // Use a valid time string for min
      minExit = Math.max(
        minExit,
        timeToMinutes(MIN_AFTERNOON_EXIT),
        timeToMinutes(afternoonEntry) + 3 * 60
      );
      const minAllowed = { min: minExit, max: maxExit };

      const currentMinutes = timeToMinutes(afternoonExit);

      // If user never changed, or it's empty, or matches auto, or is now invalid (out of allowed range)
      if (
        !userChangedAfternoonExit.current ||
        afternoonExit === "" ||
        afternoonExit === autoValue ||
        currentMinutes < minAllowed.min ||
        currentMinutes > minAllowed.max
      ) {
        setAfternoonExit(autoValue);
        userChangedAfternoonExit.current = false;
      }
    }
    // eslint-disable-next-line
  }, [morningEntry, morningExit, afternoonEntry, morningExitWasSet]);

  // --- Render ---

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      <PointCard
        label="Entrada da Manhã"
        storageKey="morningEntry"
        value={morningEntry}
        setValue={val => handleMorningEntryChange(val, morningExit, setMorningEntry)}
      />
      <PointCard
        label="Saída da Manhã"
        storageKey="morningExit"
        value={morningExit}
        setValue={val =>
          handleMorningExitChange(
            val,
            morningEntry,
            setMorningExit,
            userChangedMorningExit,
          )
        }
      />
      <PointCard
        label="Entrada da Tarde"
        storageKey="afternoonEntry"
        value={afternoonEntry}
        setValue={val => handleAfternoonEntryChange(
          val,
          morningExit,
          afternoonExit,
          setAfternoonEntry,
          userChangedAfternoonEntry
        )}
      />
      <PointCard
        label="Saída da Tarde"
        storageKey="afternoonExit"
        value={afternoonExit}
        setValue={val => handleAfternoonExitChange(
          val,
          morningEntry,
          morningExit,
          afternoonEntry,
          setAfternoonExit,
          userChangedAfternoonExit
        )}
      />
    </div>
  );
};

export default TimeClock;