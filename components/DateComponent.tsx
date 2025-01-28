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

const DateComponent = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isOpen, setIsOpen] = useState(false);

    const handleDateChange = (date: Value) => {
        if (date) {
            setSelectedDate(new Date(date.toString()));
        }
        setIsOpen(false);
    };

    const formattedDate = selectedDate ? dayjs(selectedDate,).format('DD [de] MMMM [de] YYYY') : '';

    return (
      <div className="absolute flex flex-col items-center mt-[50px]">
            <div
                className="flex flex-row items-center text-white cursor-pointer w-[348px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`${inter.variable} font-sans flex-grow text-center text-base font-normal`}>{formattedDate}</div>
                <div className="flex justify-end items-center">
                    <FontAwesomeIcon icon={faChevronDown} />
                </div>
            </div>
            {isOpen && (
                <Calendar 
                    onChange={handleDateChange}
                    value={selectedDate}
                    locale="pt-BR"
                />
            )}
        </div>
    );
};

export default DateComponent;