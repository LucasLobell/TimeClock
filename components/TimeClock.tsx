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
  isValidTime,
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

  /**
   * Auto-set afternoonEntry when morningExit changes,
   * unless user changed it or it matches the auto value,
   * and only after morningExitWasSet.
   */
  useEffect(() => {
    if (
      morningExitWasSet &&
      isValidTime(morningExit) &&
      (!userChangedAfternoonEntry.current ||
        afternoonEntry === "" ||
        afternoonEntry === autoAfternoonEntry(morningExit))
    ) {
      const autoValue = autoAfternoonEntry(morningExit);
      setAfternoonEntry(autoValue);
      userChangedAfternoonEntry.current = false;
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
      isValidTime(afternoonEntry) &&
      (!userChangedAfternoonExit.current ||
        afternoonExit === "" ||
        afternoonExit === autoAfternoonExit(morningEntry, morningExit, afternoonEntry))
    ) {
      const autoValue = autoAfternoonExit(morningEntry, morningExit, afternoonEntry);
      setAfternoonExit(autoValue);
      userChangedAfternoonExit.current = false;
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
        setValue={val => handleMorningExitChange(
          val,
          morningEntry,
          afternoonEntry,
          setMorningExit,
          userChangedMorningExit
        )}
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