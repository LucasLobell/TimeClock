"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./CCard";

interface PointCardProps {
  label: string;
  storageKey: string;
  value: string;
  setValue: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const PointCard: React.FC<PointCardProps> = ({
  label,
  storageKey,
  value,
  setValue,
  disabled = false,
  placeholder,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) setValue(savedTime);
    // eslint-disable-next-line
  }, []);

  // Save to localStorage whenever value changes
  useEffect(() => {
    if (value) {
      localStorage.setItem(storageKey, value);
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [value, storageKey]);

  const fixPartialTime = (time: string) => {
    if (!time.includes(":")) return time;
    const parts = time.split(":");
    if (parts.length !== 2) return time;

    let [hStr, mStr] = parts;

    if (mStr.length === 1) {
      mStr = mStr + "0";
    }

    if (hStr.length === 1) hStr = "0" + hStr;
    if (mStr.length === 1) mStr = "0" + mStr;

    return `${hStr}:${mStr}`;
  };

  const isValidTime = (time: string) => {
    if (!time.includes(":")) return false;
    const [hStr, mStr] = time.split(":");
    if (hStr.length !== 2 || mStr.length !== 2) return false;
    const hours = parseInt(hStr, 10);
    const minutes = parseInt(mStr, 10);
    if (isNaN(hours) || isNaN(minutes)) return false;
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  };

  const formatTimeInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  };

  const parseTime = (time: string, delta: number) => {
    const [hStr, mStr] = time.split(":");
    if (!hStr || !mStr || mStr.length < 2) return "";
    const hours = parseInt(hStr);
    const minutes = parseInt(mStr);
    if (isNaN(hours) || isNaN(minutes)) return "";

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + delta);

    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const topTime = value ? parseTime(value, -1) : "";
  const bottomTime = value ? parseTime(value, 1) : "";

  return (
    <div className="w-[348px] h-[280px]">
      <Card className="relative h-full rounded-2xl border-[#6b6b6b] shadow-[-1px_1px_6px_1.25px_#59ff00]">
        <CardContent className="p-6">
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="font-['Istok_Web'] text-xl text-[#d9d9d9]">
              {label}
            </h2>
          </div>

          {/* Top Time */}
          <div className="relative w-20 h-[22px] mx-auto mb-2">
            <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-xl text-center text-[#ffffff0d]">
              88:88
            </div>
            <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-xl text-center text-[#ffffffbf]">
              {topTime}
            </div>
          </div>

          {/* Center Time - Editable */}
          <div
            className="relative w-74 h-[90px] mx-auto my-4 cursor-pointer"
            onClick={() => !disabled && setIsEditing(true)}
          >
            <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-[64px] text-center text-[#ffffff14] opacity-90">
              88:88
            </div>

            <input
              type="text"
              value={value}
              onChange={(e) => setValue(formatTimeInput(e.target.value))}
              onFocus={() => !disabled && setIsEditing(true)}
              onBlur={() => {
                setIsEditing(false);

                let fixedTime = fixPartialTime(value);

                if (!isValidTime(fixedTime)) {
                  fixedTime = "";
                }

                setValue(fixedTime);
              }}
              maxLength={5}
              autoFocus={isEditing}
              disabled={disabled}
              placeholder={placeholder}
              className="absolute mt-[2.5px] inset-0 w-full h-full font-['Digital_Numbers-Regular'] text-[64px] text-center text-white bg-transparent outline-none [text-shadow:0px_0px_6px_#59ff00] placeholder-[#ffffff1a] px-2"
            />
          </div>

          {/* Bottom Time */}
          <div className="relative w-20 h-[22px] mx-auto mb-4">
            <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-xl text-center text-[#ffffff0d]">
              88:88
            </div>
            <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-xl text-center text-[#ffffffbf]">
              {bottomTime}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <span className="font-['Inter'] text-base text-white [text-shadow:0px_0px_1.5px_#59ff00]">
              Efetivo
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PointCard;
