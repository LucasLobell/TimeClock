import {
  MIN_MORNING_ENTRY,
  MIN_MORNING_EXIT,
  MIN_MORNING_HOURS,
  MAX_MORNING_HOURS,
  MIN_LUNCH_BREAK,
  MAX_AFTERNOON_ENTRY,
  MIN_AFTERNOON_EXIT,
  MAX_AFTERNOON_EXIT,
  MIN_AFTERNOON_HOURS,
  MAX_AFTERNOON_HOURS,
  MAX_MORNING_ENTRY,
} from "../constants/timeRules";
import {
  timeToMinutes,
  minutesToTime,
  clampTime,
  isValidTime,
  fixPartialTime,
} from "./time";
import {
  autoAfternoonExit,
} from "./timeLogic";

/**
* Morning Entry handler:
* - Not before MIN_MORNING_ENTRY
* - Not after MAX_MORNING_ENTRY
* - Not after morningExit
*/
export function handleMorningEntryChange(
  val: string,
  morningExit: string,
  setMorningEntry: (v: string) => void
) {
  let v = val;
  if (v.length === 5) {
    v = fixPartialTime(v);
  }
  if (isValidTime(v)) {
    v = clampTime(v, MIN_MORNING_ENTRY, MAX_MORNING_ENTRY);
    if (isValidTime(morningExit) && timeToMinutes(v) > timeToMinutes(morningExit)) {
      v = morningExit;
    }
  }
  setMorningEntry(v);
}

/**
 * Morning Exit handler:
 * - Not before MIN_MORNING_EXIT
 * - Not before 3h after morningEntry
 * - Not after 5h after morningEntry
 * - Not before morningEntry
 * - Not after afternoonEntry
 * - Enforces minimum lunch break (afternoonEntry - morningExit >= MIN_LUNCH_BREAK)
 */
export function handleMorningExitChange(
  val: string,
  morningEntry: string,
  afternoonEntry: string,
  setMorningExit: (v: string) => void,
  userChangedMorningExit: React.MutableRefObject<boolean>
) {
  let v = val;
  if (v.length === 5) {
    v = fixPartialTime(v);
  }
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
    if (timeToMinutes(v) < timeToMinutes(morningEntry)) {
      v = morningEntry;
    }
    // Enforce lunch break: morningExit cannot be so late that lunch break is < MIN_LUNCH_BREAK
    if (isValidTime(afternoonEntry)) {
      const minLunchBreak = MIN_LUNCH_BREAK;
      const minAllowedAfternoonEntry = timeToMinutes(v) + minLunchBreak;
      if (timeToMinutes(afternoonEntry) < minAllowedAfternoonEntry) {
        // Clamp morningExit so that lunch break is at least MIN_LUNCH_BREAK
        v = minutesToTime(timeToMinutes(afternoonEntry) - minLunchBreak);
        // Also clamp to min/max exit
        if (timeToMinutes(v) < timeToMinutes(vMin)) v = vMin;
        if (timeToMinutes(v) > timeToMinutes(vMax)) v = vMax;
      }
    }
    if (isValidTime(afternoonEntry) && timeToMinutes(v) > timeToMinutes(afternoonEntry)) {
      v = afternoonEntry;
    }
  }
  setMorningExit(v);
  userChangedMorningExit.current = !wasCorrected;
}

/**
 * Afternoon Entry handler:
 * - At least 30min after morningExit
 * - Not after MAX_AFTERNOON_ENTRY
 * - Not before morningExit
 * - Not after afternoonExit
 */
export function handleAfternoonEntryChange(
  val: string,
  morningExit: string,
  afternoonExit: string,
  setAfternoonEntry: (v: string) => void,
  userChangedAfternoonEntry: React.MutableRefObject<boolean>
) {
  let v = val;
  if (v.length === 5) {
    v = fixPartialTime(v);
  }
  let wasCorrected = false;
  if (isValidTime(v) && isValidTime(morningExit)) {
    const minEntry = timeToMinutes(morningExit) + MIN_LUNCH_BREAK;
    const maxEntry = timeToMinutes(MAX_AFTERNOON_ENTRY);
    const vMin = minutesToTime(minEntry);
    const vMax = minutesToTime(maxEntry);
    const original = v;
    v = clampTime(v, vMin, vMax);
    if (v !== original) wasCorrected = true;
    // Cannot be before morningExit
    if (timeToMinutes(v) < timeToMinutes(morningExit)) {
      v = morningExit;
    }
    // Cannot be after afternoonExit
    if (isValidTime(afternoonExit) && timeToMinutes(v) > timeToMinutes(afternoonExit)) {
      v = afternoonExit;
    }
  }
  setAfternoonEntry(v);
  userChangedAfternoonEntry.current = !wasCorrected;
}

/**
 * Afternoon Exit handler:
 * - Allows up to 5min earlier and 10min later than estimated
 * - Not before MIN_AFTERNOON_EXIT
 * - Not before 3h after afternoonEntry
 * - Not after MAX_AFTERNOON_EXIT
 * - Not after 5h after afternoonEntry
 * - Not before afternoonEntry
 */
export function handleAfternoonExitChange(
  val: string,
  morningEntry: string,
  morningExit: string,
  afternoonEntry: string,
  setAfternoonExit: (v: string) => void,
  userChangedAfternoonExit: React.MutableRefObject<boolean>
) {
  let v = val;
  if (v.length === 5) {
    v = fixPartialTime(v);
  }
  let wasCorrected = false;
  if (
    isValidTime(v) &&
    isValidTime(morningEntry) &&
    isValidTime(morningExit) &&
    isValidTime(afternoonEntry)
  ) {
    const estimated = autoAfternoonExit(morningEntry, morningExit, afternoonEntry);
    const estimatedMinutes = timeToMinutes(estimated);

    // Allow 5min earlier
    let minExit = estimatedMinutes - 5;
    const strictMaxBy5h = timeToMinutes(afternoonEntry) + MAX_AFTERNOON_HOURS * 60;
    const strictMaxBy19 = timeToMinutes(MAX_AFTERNOON_EXIT);

    // Allow up to 10min past these strict maximums
    const maxExit = Math.min(
      estimatedMinutes + 10,
      strictMaxBy5h + 10,
      strictMaxBy19 + 10
    );

    minExit = Math.max(
      minExit,
      timeToMinutes(MIN_AFTERNOON_EXIT),
      timeToMinutes(afternoonEntry) + MIN_AFTERNOON_HOURS * 60
    );

    const vMin = minutesToTime(minExit);
    const vMax = minutesToTime(maxExit);
    const original = v;
    v = clampTime(v, vMin, vMax);
    if (v !== original) wasCorrected = true;
    // Cannot be before afternoonEntry
    if (timeToMinutes(v) < timeToMinutes(afternoonEntry)) {
      v = afternoonEntry;
    }
  }
  setAfternoonExit(v);
  userChangedAfternoonExit.current = !wasCorrected;
}