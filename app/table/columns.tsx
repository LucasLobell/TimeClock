"use client"

import { ColumnDef, ColumnMeta } from "@tanstack/react-table"

export type Times = {
  userId: string;
  date: string;
  morningEntry: string | null;
  morningExit: string | null;
  afternoonEntry: string | null;
  afternoonExit: string | null;
}

export const columns: ColumnDef<Times>[] = [
  {
      accessorKey: "userId",
      header: "ID",
      meta: {
        className: "w-[100px] text-center",
      }
    },
    {
      accessorKey: "date",
      header: "Date",
      meta: {
        className: "w-[100px] text-center",
      }
    },
    {
      accessorKey: "morningEntry",
      header: "Morning Entry",
      meta: {
        className: "w-[100px] text-center",
      }
    },
    {
      accessorKey: "morningExit",
      header: "Morning Exit",
      meta: {
        className: "w-[100px] text-center",
      }
    },
    {
      accessorKey: "afternoonEntry",
      header: "Afternoon Entry",
      meta: {
        className: "w-[100px] text-center",
      }
    },
    {
      accessorKey: "afternoonExit",
      header: "Afternoon Exit",
      meta: {
        className: "w-[100px] text-center",
      }
    },
]
