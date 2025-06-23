"use client";

import React, { useState, useEffect, useRef } from "react";
import PointCard from "./PointCard";

const MIN_MORNING_ENTRY = "07:00";
const MIN_MORNING_EXIT = "11:30";
const MIN_MORNING_HOURS = 3;
const MAX_MORNING_HOURS = 5;
const MIN_LUNCH_BREAK = 30; // minutes
const MAX_AFTERNOON_ENTRY = "14:00";
const MIN_AFTERNOON_EXIT = "17:00";
const MAX_AFTERNOON_EXIT = "19:00";
const MIN_AFTERNOON_HOURS = 3;
const MAX_AFTERNOON_HOURS = 5;
const WORKDAY_MINUTES = 8 * 60;

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function minutesToTime(mins: number) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}
function clampTime(val: string, min: string, max: string) {
  const v = timeToMinutes(val);
  const vmin = timeToMinutes(min);
  const vmax = timeToMinutes(max);
  if (v < vmin) return min;
  if (v > vmax) return max;
  return val;
}

const TimeClock = () => {
  const [morningEntry, setMorningEntry] = useState("");
  const [morningExit, setMorningExit] = useState("");
  const [afternoonEntry, setAfternoonEntry] = useState("");
  const [afternoonExit, setAfternoonExit] = useState("");

  const userChangedMorningExit = useRef(false);
  const userChangedAfternoonEntry = useRef(false);
  const userChangedAfternoonExit = useRef(false);

  // Helper to check if a time string is valid "HH:MM"
  const isValidTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

  // Predict minimum morning exit (at least 3h after entry, but not before 11:30, and not more than 5h after entry)
  function autoMorningExit(morningEntry: string) {
    if (!isValidTime(morningEntry)) return "";
    const minExit = Math.max(
      timeToMinutes(morningEntry) + MIN_MORNING_HOURS * 60,
      timeToMinutes(MIN_MORNING_EXIT)
    );
    const maxExit = timeToMinutes(morningEntry) + MAX_MORNING_HOURS * 60;
    return minutesToTime(Math.min(minExit, maxExit));
  }

  // Helper to calculate 30 minutes after morningExit, but not after 14:00
  function autoAfternoonEntry(morningExit: string) {
    if (!isValidTime(morningExit)) return "";
    const minEntry = timeToMinutes(morningExit) + MIN_LUNCH_BREAK;
    const maxEntry = timeToMinutes(MAX_AFTERNOON_ENTRY);
    return minutesToTime(Math.min(minEntry, maxEntry));
  }

  // Helper to calculate the default afternoon exit (for comparison)
  function autoAfternoonExit() {
    if (
      isValidTime(morningEntry) &&
      isValidTime(morningExit) &&
      isValidTime(afternoonEntry)
    ) {
      const morningWorked = timeToMinutes(morningExit) - timeToMinutes(morningEntry);
      const remaining = WORKDAY_MINUTES - morningWorked;
      let exitMinutes = timeToMinutes(afternoonEntry) + remaining;
      // Clamp to min/max
      if (exitMinutes < timeToMinutes(MIN_AFTERNOON_EXIT)) exitMinutes = timeToMinutes(MIN_AFTERNOON_EXIT);
      if (exitMinutes > timeToMinutes(MAX_AFTERNOON_EXIT)) exitMinutes = timeToMinutes(MAX_AFTERNOON_EXIT);
      return minutesToTime(exitMinutes);
    }
    return "";
  }

  // --- Auto & Validation Logic ---

  // Auto-set morningExit when morningEntry changes, unless user changed it
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

  // Only start auto-filling afternoonEntry/afternoonExit after user has set morningExit manually at least once
  const [morningExitWasSet, setMorningExitWasSet] = useState(false);

  useEffect(() => {
    if (userChangedMorningExit.current && isValidTime(morningExit)) {
      setMorningExitWasSet(true);
    }
    // If morningEntry changes, reset the flag
    if (!isValidTime(morningExit)) {
      setMorningExitWasSet(false);
    }
    // eslint-disable-next-line
  }, [morningExit, morningEntry]);

  // Auto-set afternoonEntry when morningExit changes, unless user changed it AND only after morningExitWasSet
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

  // Auto-set afternoonExit when any dependency changes, unless user changed it AND only after morningExitWasSet
  useEffect(() => {
    if (
      morningExitWasSet &&
      isValidTime(morningEntry) &&
      isValidTime(morningExit) &&
      isValidTime(afternoonEntry) &&
      (!userChangedAfternoonExit.current ||
        afternoonExit === "" ||
        afternoonExit === autoAfternoonExit())
    ) {
      const autoValue = autoAfternoonExit();
      setAfternoonExit(autoValue);
      userChangedAfternoonExit.current = false;
    }
    // eslint-disable-next-line
  }, [morningEntry, morningExit, afternoonEntry, morningExitWasSet]);

  // --- Handlers with Validation ---

  // Morning Entry: not before 07:00
  const handleMorningEntryChange = (val: string) => {
    let v = val;
    if (isValidTime(v)) {
      v = clampTime(v, MIN_MORNING_ENTRY, "23:59");
    }
    setMorningEntry(v);
  };

  // Morning Exit: not before 11:30, not before 3h after entry, not after 5h after entry
  const handleMorningExitChange = (val: string) => {
    let v = val;
    let wasCorrected = false;
    if (isValidTime(v) && isValidTime(morningEntry)) {
      const minExit = Math.max(
        timeToMinutes(morningEntry) + MIN_MORNING_HOURS * 60,
        timeToMinutes(MIN_MORNING_EXIT)
      );
      const maxExit = timeToMinutes(morningEntry) + MAX_MORNING_HOURS * 60;
      const vMin = minutesToTime(minExit);
      const vMax = minutesToTime(maxExit);
      const original = v;
      v = clampTime(v, vMin, vMax);
      if (v !== original) wasCorrected = true;
    }
    setMorningExit(v);
    // Only set as user-changed if not auto-corrected
    userChangedMorningExit.current = !wasCorrected;
  };

  // Afternoon Entry: at least 30min after morningExit, not after 14:00
  const handleAfternoonEntryChange = (val: string) => {
    let v = val;
    let wasCorrected = false;
    if (isValidTime(v) && isValidTime(morningExit)) {
      const minEntry = timeToMinutes(morningExit) + MIN_LUNCH_BREAK;
      const maxEntry = timeToMinutes(MAX_AFTERNOON_ENTRY);
      const vMin = minutesToTime(minEntry);
      const vMax = minutesToTime(maxEntry);
      const original = v;
      v = clampTime(v, vMin, vMax);
      if (v !== original) wasCorrected = true;
    }
    setAfternoonEntry(v);
    userChangedAfternoonEntry.current = !wasCorrected;
  };

  // Afternoon Exit: not before 17:00 or estimated, not after 19:00, min/max 3-5h after afternoon entry
  const handleAfternoonExitChange = (val: string) => {
    let v = val;
    let wasCorrected = false;
    if (
      isValidTime(v) &&
      isValidTime(morningEntry) &&
      isValidTime(morningExit) &&
      isValidTime(afternoonEntry)
    ) {
      const estimated = autoAfternoonExit();
      const minExit = Math.max(
        timeToMinutes(MIN_AFTERNOON_EXIT),
        timeToMinutes(estimated),
        timeToMinutes(afternoonEntry) + MIN_AFTERNOON_HOURS * 60
      );
      const maxExit = Math.min(
        timeToMinutes(MAX_AFTERNOON_EXIT),
        timeToMinutes(afternoonEntry) + MAX_AFTERNOON_HOURS * 60
      );
      const vMin = minutesToTime(minExit);
      const vMax = minutesToTime(maxExit);
      const original = v;
      v = clampTime(v, vMin, vMax);
      if (v !== original) wasCorrected = true;
    }
    setAfternoonExit(v);
    userChangedAfternoonExit.current = !wasCorrected;
  };

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      <PointCard
        label="Entrada da Manhã"
        storageKey="morningEntry"
        value={morningEntry}
        setValue={handleMorningEntryChange}
      />
      <PointCard
        label="Saída da Manhã"
        storageKey="morningExit"
        value={morningExit}
        setValue={handleMorningExitChange}
      />
      <PointCard
        label="Entrada da Tarde"
        storageKey="afternoonEntry"
        value={afternoonEntry}
        setValue={handleAfternoonEntryChange}
      />
      <PointCard
        label="Saída da Tarde"
        storageKey="afternoonExit"
        value={afternoonExit}
        setValue={handleAfternoonExitChange}
      />
    </div>
  );
};

export default TimeClock;