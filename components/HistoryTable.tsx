import { useMemo, useState, useEffect } from "react";
import { useUserTimesRange } from "@/utils/useUserTimesRange";
import { timeToMinutes } from "@/utils/time";
import Loading from "./Loading";
import {
  handleMorningEntryChange,
  handleMorningExitChange,
  handleAfternoonEntryChange,
  handleAfternoonExitChange,
} from "@/utils/timeHandlers";
import { upsertTimesForUserDate } from "@/utils/time";
import { TimeEntry } from "@/types";

interface HistoryTableProps {
  userId: string;
  month: number;
  year: number;
}

const columns = [
  { label: "Date", accessor: (date: string, times: TimeEntry | null) => {
    // Parse date string as local date to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day); // month is 0-indexed
    return dateObj.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }},
  { label: "Morning Entry", accessor: (date: string, times: TimeEntry | null) => times?.morningEntry || "" },
  { label: "Morning Exit", accessor: (date: string, times: TimeEntry | null) => times?.morningExit || "" },
  { label: "Afternoon Entry", accessor: (date: string, times: TimeEntry | null) => times?.afternoonEntry || "" },
  { label: "Afternoon Exit", accessor: (date: string, times: TimeEntry | null) => times?.afternoonExit || "" },
  { label: "Total Hours", accessor: (date: string, times: TimeEntry | null) => {
    if (!times?.morningEntry || !times?.morningExit || !times?.afternoonEntry || !times?.afternoonExit) {
      return "";
    }
    const morningHours = timeToMinutes(times.morningExit) - timeToMinutes(times.morningEntry);
    const afternoonHours = timeToMinutes(times.afternoonExit) - timeToMinutes(times.afternoonEntry);
    const totalMinutes = morningHours + afternoonHours;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }},
];

const EditableTimeCell = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  return editing ? (
    <input
      type="time"
      value={temp}
      onChange={e => setTemp(e.target.value)}
      onBlur={() => {
        setEditing(false);
        if (temp !== value) onChange(temp);
      }}
      className="time-picker bg-gray-700 text-white rounded px-2 py-1 w-24"
      autoFocus
      disabled={disabled}
    />
  ) : (
    <span
      onClick={() => !disabled && setEditing(true)}
      className={`cursor-pointer ${disabled ? "opacity-50" : "hover:underline"}`}
    >
      {value}
    </span>
  );
};

const HistoryTable: React.FC<HistoryTableProps> = ({ userId, month, year }) => {
  const startDate = useMemo(() => new Date(year, month, 1), [year, month]);
  const endDate = useMemo(() => new Date(year, month + 1, 0), [year, month]);
  
  const { timesByDate, loading, error } = useUserTimesRange(userId, startDate, endDate);

  // Local state for editable data
  const [localTimes, setLocalTimes] = useState(timesByDate);

  // Keep localTimes in sync with fetched data
  useEffect(() => {
    setLocalTimes(timesByDate);
  }, [timesByDate]);

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
        <div className="flex-1 overflow-hidden mx-6 mb-6">
          <div className="h-full border border-red-500 rounded-lg shadow-xs overflow-hidden dark:border-red-500 dark:shadow-gray-900">
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="text-red-400 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Data</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Container with better spacing */}
      <div className="flex-1 overflow-hidden mx-6 mb-6">
        <div className="h-full border border-gray-200 rounded-lg shadow-xs overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
          {/* Table wrapper with proper scroll */}
          <div className="overflow-auto h-full">
            <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700 sticky top-0 z-10">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={col.label}
                      className={`py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase dark:text-neutral-400 leading-tight`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {Object.keys(localTimes).length === 0 ? (
                  <tr>
                    <td 
                      colSpan={columns.length} 
                      className="text-center py-8 text-sm text-gray-500 dark:text-neutral-400"
                    >
                      No time entries found for this month
                    </td>
                  </tr>
                ) : (
                  Object.entries(localTimes).map(([date, times]) => (
                      <tr key={date} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                        {columns.map((col, idx) => {
                          const isTimeField = ["Morning Entry", "Morning Exit", "Afternoon Entry", "Afternoon Exit"].includes(col.label);
                          const fieldMap: Record<string, keyof TimeEntry> = {
                            "Morning Entry": "morningEntry",
                            "Morning Exit": "morningExit",
                            "Afternoon Entry": "afternoonEntry",
                            "Afternoon Exit": "afternoonExit",
                          };
                          const field = fieldMap[col.label];

                          return (
                            <td key={idx} className="whitespace-nowrap text-center text-base font-medium text-gray-600 dark:text-neutral-300 py-2 px-4 leading-tight">
                              {isTimeField ? (
                                <EditableTimeCell
                                  value={col.accessor(date, times)}
                                  onChange={async (newVal) => {
                                    const updated: TimeEntry = { ...times };

                                    // Use your existing handlers for validation/correction
                                    if (field === "morningEntry") {
                                      handleMorningEntryChange(
                                        newVal,
                                        times?.morningExit || "",
                                        (v) => { updated.morningEntry = v; }
                                      );
                                    } else if (field === "morningExit") {
                                      handleMorningExitChange(
                                        newVal,
                                        times?.morningEntry || "",
                                        (v) => { updated.morningExit = v; },
                                        { current: true }
                                      );
                                    } else if (field === "afternoonEntry") {
                                      handleAfternoonEntryChange(
                                        newVal,
                                        times?.morningExit || "",
                                        times?.afternoonExit || "",
                                        (v) => { updated.afternoonEntry = v; },
                                        { current: true }
                                      );
                                    } else if (field === "afternoonExit") {
                                      handleAfternoonExitChange(
                                        newVal,
                                        times?.morningEntry || "",
                                        times?.morningExit || "",
                                        times?.afternoonEntry || "",
                                        (v) => { updated.afternoonExit = v; },
                                        { current: true }
                                      );
                                    }

                                    // Save to backend
                                    await upsertTimesForUserDate(userId, date, { [field]: updated[field] || "" });

                                    // Update local state for immediate UI feedback
                                    setLocalTimes(prev => ({
                                      ...prev,
                                      [date]: {
                                        ...prev[date],
                                        [field]: updated[field] || "",
                                      }
                                    }));
                                  }}
                                />
                              ) : (
                                col.accessor(date, times)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
