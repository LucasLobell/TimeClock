"use client";

import React from "react";
import { Card, CardContent } from "../CCard";
import { useFlickerOn } from "../../utils/useFlickerOn";

interface TotalCardProps {
  label?: string;
  /** Total hours worked, formatted as "HH:MM" */
  value: string;
}

const parseTime = (time: string, delta: number): string => {
  const [hStr, mStr] = time.split(":");
  if (!hStr || !mStr || mStr.length < 2) return "";
  const totalMins = parseInt(hStr) * 60 + parseInt(mStr) + delta;
  if (isNaN(totalMins) || totalMins < 0) return "";
  const h = String(Math.floor(totalMins / 60)).padStart(2, "0");
  const m = String(totalMins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const TotalCard: React.FC<TotalCardProps> = ({
  label = "Total de Horas",
  value,
}) => {
  const { mainPhase, mainStyle, topPhase, topStyle, bottomPhase, bottomStyle } =
    useFlickerOn();

  const topTime = value ? parseTime(value, -1) : "";
  const bottomTime = value ? parseTime(value, 1) : "";

  return (
    <div className="relative w-[125px] my-6">
      <Card className="w-full border-[#6b6b6b] shadow-[-1px_1px_6px_1.25px_#59ff00] rounded-2xl">
        <CardContent className="p-2">

          {/* Label */}
          <div className="text-center mb-2 select-none">
            <h2 className="font-['Istok_Web'] text-[11px] text-[#d9d9d9]">
              {label}
            </h2>
          </div>

          {/* Main Time */}
          <div
            className={`relative w-full h-[25px] mx-auto select-none ${
              mainPhase === "flickering" ? "flicker-on" : ""
            }`}
            style={mainStyle}
          >
            <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-[19px] leading-none text-center text-[#ffffff14]">
              88:88
            </div>
            <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-[19px] leading-none text-center text-white [text-shadow:0px_0px_6px_#59ff00]">
              {value}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalCard;