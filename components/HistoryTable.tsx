import { useMemo } from "react";
import { useUserTimesRange } from "@/utils/useUserTimesRange";

interface HistoryTableProps {
  userId: string;
  month: number;
  year: number;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ userId, month, year }) => {
  const startDate = useMemo(() => new Date(year, month, 1), [year, month]);
  const endDate = useMemo(() => new Date(year, month + 1, 0), [year, month]);
  const { timesByDate, loading } = useUserTimesRange(userId, startDate, endDate);

  if (loading) return <div>Loading...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Morning Entry</th>
          <th>Morning Exit</th>
          <th>Afternoon Entry</th>
          <th>Afternoon Exit</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(timesByDate).map(([date, times]) => (
          <tr key={date}>
            <td>{date}</td>
            <td>{times?.morningEntry || ""}</td>
            <td>{times?.morningExit || ""}</td>
            <td>{times?.afternoonEntry || ""}</td>
            <td>{times?.afternoonExit || ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTable;