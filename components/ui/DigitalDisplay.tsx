import React from "react";
import { Phase } from "../../utils/useFlickerOn";

interface DigitalDisplayProps {
  /** The time string to display, e.g. "08:30" */
  value: string;
  phase: Phase;
  style: React.CSSProperties;
  /** Tailwind font-size class, defaults to small (text-xl) */
  fontSize?: string;
  /** Tailwind text-colour class for the live value layer */
  textColor?: string;
  height?: string;
  width?: string;
  className?: string;
}

/**
 * Read-only layered digital clock display.
 * Renders a dim ghost "88:88" beneath the real value, and applies
 * the flicker-on CSS animation when phase === "flickering".
 */
const DigitalDisplay: React.FC<DigitalDisplayProps> = ({
  value,
  phase,
  style,
  fontSize = "text-xl",
  textColor = "text-[#ffffffbf]",
  height = "h-[22px]",
  width = "w-20",
  className = "",
}) => {
  return (
    <div
      className={`relative ${width} ${height} mx-auto select-none ${
        phase === "flickering" ? "flicker-on" : ""
      } ${className}`}
      style={style}
    >
      {/* Ghost segments */}
      <div
        className={`absolute inset-0 font-['Digital_Numbers-Regular'] ${fontSize} text-center text-[#ffffff0d]`}
      >
        88:88
      </div>
      {/* Live value */}
      <div
        className={`absolute inset-0 font-['Digital_Numbers-Regular'] ${fontSize} text-center ${textColor}`}
      >
        {value}
      </div>
    </div>
  );
};

export default DigitalDisplay;
