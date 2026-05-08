"use client";

import React, { useEffect, useRef, useState } from "react";
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
  MIN_LUNCH_BREAK, MAX_AFTERNOON_EXIT,
  MIN_AFTERNOON_EXIT
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
  strictTimeRuling,
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

  const [wrongTime, setWrongTime] = useState(false);

  // --- Auto & Validation Logic ---

  /**
   * Auto-set morningExit when morningEntry changes,
   * unless user changed it or it matches the auto value.
   */
  useEffect(() => {
    if (!strictTimeRuling) {
      return;
    }

    if (
      isValidTime(morningEntry) &&
      morningExit === ""
    ) {
      const autoValue = autoMorningExit(morningEntry);
      setMorningExit(autoValue);
      userChangedMorningExit.current = false;
    }
    // eslint-disable-next-line
  }, [morningEntry, strictTimeRuling]);

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
  if (!strictTimeRuling) {
    return;
  }

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
    if (!strictTimeRuling) {
      return;
    }

    if (
      morningExitWasSet &&
      isValidTime(morningExit)
    ) {
      const minAfternoonEntry = timeToMinutes(morningExit) + MIN_LUNCH_BREAK;
      const currentAfternoonEntry = isValidTime(afternoonEntry)
        ? timeToMinutes(afternoonEntry)
        : null;
      const autoValue = autoAfternoonEntry(morningExit);

      // If afternoonEntry is missing or lunch break is too short, force update
      if (
        afternoonEntry === "" ||
        currentAfternoonEntry === null ||
        currentAfternoonEntry < minAfternoonEntry
      ) {
        setAfternoonEntry(autoValue);
        userChangedAfternoonEntry.current = false;
      }
    }
    // eslint-disable-next-line
  }, [morningExit, morningExitWasSet, strictTimeRuling, afternoonEntry]);

  /**
   * Auto-set afternoonExit when any dependency changes,
   * unless user changed it or it matches the auto value,
   * whenever required inputs are valid.
   */
  useEffect(() => {
    if (strictTimeRuling) {
      if (
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

        minExit = Math.max(
          minExit,
          timeToMinutes(MIN_AFTERNOON_EXIT),
          timeToMinutes(afternoonEntry) + 3 * 60
        );
        const minAllowed = { min: minExit, max: maxExit };

        const currentMinutes = timeToMinutes(afternoonExit);

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
    }

    handleWrongTime();
    // eslint-disable-next-line
  }, [morningEntry, morningExit, afternoonEntry, strictTimeRuling, afternoonExit]);

  function handleWrongTime() {
    if (!strictTimeRuling) {
      setWrongTime(false);
      return;
    }

    const totalMinutes = morningEntry && morningExit && afternoonEntry && afternoonExit
    ? timeToMinutes(morningExit) - timeToMinutes(morningEntry) +
      timeToMinutes(afternoonExit) - timeToMinutes(afternoonEntry)
    : 0;
    if( afternoonEntry && totalMinutes > 490 ) {
      setWrongTime(true);
    } else {
      setWrongTime(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      <PointCard
        label="Entrada da Manhã"
        storageKey="morningEntry"
        value={morningEntry}
        setValue={val => handleMorningEntryChange(val, morningExit, setMorningEntry, strictTimeRuling)}
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
            strictTimeRuling,
          )
        }
      />
      <div className="relative items-center justify-center">
        <PointCard
          label="Entrada da Tarde"
          storageKey="afternoonEntry"
          value={afternoonEntry}
          setValue={val => handleAfternoonEntryChange(
            val,
            morningExit,
            afternoonExit,
            setAfternoonEntry,
            userChangedAfternoonEntry,
            strictTimeRuling
          )}
          wrongTime={wrongTime}
        />
      </div>
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
          userChangedAfternoonExit,
          strictTimeRuling
        )}
      />
    </div>
  );
};

export default TimeClock;