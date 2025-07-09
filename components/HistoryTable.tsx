import { useMemo } from "react";
import { useUserTimesRange } from "@/utils/useUserTimesRange";

interface HistoryTableProps {
  userId: string;
  month: number;
  year: number;
}

const columns = [
  { label: "Date", accessor: (date: string, times: any) => date },
  { label: "Morning Entry", accessor: (date: string, times: any) => times?.morningEntry || "" },
  { label: "Morning Exit", accessor: (date: string, times: any) => times?.morningExit || "" },
  { label: "Afternoon Entry", accessor: (date: string, times: any) => times?.afternoonEntry || "" },
  { label: "Afternoon Exit", accessor: (date: string, times: any) => times?.afternoonExit || "" },
];

const HistoryTable: React.FC<HistoryTableProps> = ({ userId, month, year }) => {
  const startDate = useMemo(() => new Date(year, month, 1), [year, month]);
  const endDate = useMemo(() => new Date(year, month + 1, 0), [year, month]);
  const { timesByDate, loading } = useUserTimesRange(userId, startDate, endDate);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-gray-200 rounded-lg shadow-xs overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
            <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={col.label}
                      className={`py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 ${idx !== 0 ? "pl-4" : ""
                        } ${idx !== columns.length - 1 ? "pr-4" : ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {Object.entries(timesByDate).map(([date, times]) => (
                  <tr key={date}>
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        className={`whitespace-nowrap text-center text-sm font-medium text-gray-600 dark:text-neutral-300 ${idx !== 0 ? "pl-4" : ""
                          } ${idx !== columns.length - 1 ? "pr-4" : ""}`}
                      >
                        {col.accessor(date, times)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
