"use client";

import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'react-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { Inter } from 'next/font/google';
import { Value } from 'react-calendar/src/shared/types.js';

dayjs.locale('pt-BR')

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

interface DateComponentProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}

const DateComponent = ({ selectedDate, setSelectedDate }: DateComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (date: Value) => {
    if (date) {
      setSelectedDate(new Date(date.toString()));
    }
    setIsOpen(false);
  };

  const formattedDate = selectedDate
    ? dayjs(selectedDate).format('DD [de] MMMM [de] YYYY')
    : '';

  // Don't render calendar until date is set
  if (!selectedDate) return null;

  return (
    <div className="relative flex flex-col items-center h-full">
      <div
        className="flex flex-row items-center text-white cursor-pointer w-[348px] hover:bg-gray-800 rounded-lg px-4 py-2 transition-colors h-12"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`${inter.variable} font-sans flex-grow text-center text-base font-normal`}>{formattedDate}</div>
        <div className="flex justify-end items-center">
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-full mt-2 z-50">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            locale="pt-BR"
          />
        </div>
      )}
    </div>
  );
};

export default DateComponent;