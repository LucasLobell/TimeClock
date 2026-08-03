"use client";

import React, { useState } from "react";
import { Card, CardContent } from "./CCard";
import { fixPartialTime, isValidTime, formatTimeInput } from "../utils/time";
import { PointCardProps } from "../types/PointCardProps";
import AlertComponent from "./ui/AlertComponent";
import DigitalDisplay from "./ui/DigitalDisplay";
import { useFlickerOn } from "../utils/useFlickerOn";

const PointCard: React.FC<PointCardProps> = ({
  label,
  value,
  setValue,
  disabled = false,
  placeholder,
  wrongTime = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { mainPhase, mainStyle, topPhase, topStyle, bottomPhase, bottomStyle } =
    useFlickerOn();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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
    <div className="relative items-center justify-center w-[29rem] h-[23.5rem]" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Card className={`relative h-full rounded-2xl border-[#6b6b6b] ${wrongTime ? 'shadow-[-1px_1px_6px_1.25px_#e0cf2f]' : 'shadow-[-1px_1px_6px_1.25px_#59ff00]'} `}>
        <CardContent>
          {/* Title */}
          <div className="text-center mb-4 select-none">
            <h2 className="font-['Istok_Web'] text-xl text-[#d9d9d9]">
              {label}
            </h2>
          </div>

          {/* Top Time */}
          <DigitalDisplay
            value={topTime}
            phase={topPhase}
            style={topStyle}
            className="mb-2"
          />

          {/* Center Time - Editable */}
          <div
            className={`relative select-none w-74 h-[90px] mx-auto my-4 cursor-pointer ${mainPhase === "flickering" ? "flicker-on" : ""}`}
            style={mainStyle}
            onClick={() => !disabled && setIsEditing(true)}
          >
            <div className="absolute select-none inset-0 font-['Digital_Numbers-Regular'] text-[64px] text-center text-[#ffffff14] opacity-90">
              88:88
            </div>

            <input
              type="text"
              key={value}
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
          <DigitalDisplay
            value={bottomTime}
            phase={bottomPhase}
            style={bottomStyle}
            className="mb-4"
          />

          {/* Footer */}
          <div className="text-center select-none">
            <span className="font-['Inter'] text-base text-white [text-shadow:0px_0px_1.5px_#59ff00]">
              Efetivo
            </span>
          </div>
        </CardContent>
      </Card>
      {isHovered && wrongTime && (
        <AlertComponent />      
      )
      }
    </div>
  );
};

export default PointCard;
