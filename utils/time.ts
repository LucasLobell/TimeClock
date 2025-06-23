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