import { useState, useEffect, useRef } from "react";
import React from "react";

export type Phase = "idle" | "flickering" | "on";

const phaseStyle = (phase: Phase): React.CSSProperties =>
  phase === "idle" ? { opacity: 0 } : {};

/**
 * Drives the three-stage flicker-on animation for a digital clock card.
 * Each call generates its own random delays so cards never look synchronised.
 *
 * Stages:
 *   idle       → element is invisible
 *   flickering → CSS `flicker-on` animation plays (defined in globals.css)
 *   on         → fully visible, animation done
 *
 * `topPhase` / `bottomPhase` are for the optional ±1-min adjacent displays.
 * If you only need `mainPhase` (e.g. TotalCard) just ignore the others.
 */
export function useFlickerOn() {
  const [mainPhase, setMainPhase] = useState<Phase>("idle");
  const [topPhase, setTopPhase] = useState<Phase>("idle");
  const [bottomPhase, setBottomPhase] = useState<Phase>("idle");

  const delaysRef = useRef({
    cardDelay: Math.random() * 225,
    topDelay: 80 + Math.random() * 200,
    bottomDelay: 80 + Math.random() * 200,
  });

  useEffect(() => {
    const { cardDelay, topDelay, bottomDelay } = delaysRef.current;

    const mainTimer = setTimeout(() => {
      setMainPhase("flickering");
      const mainDone = setTimeout(() => {
        setMainPhase("on");

        const topTimer = setTimeout(() => {
          setTopPhase("flickering");
          setTimeout(() => setTopPhase("on"), 140);
        }, topDelay);

        const bottomTimer = setTimeout(() => {
          setBottomPhase("flickering");
          setTimeout(() => setBottomPhase("on"), 140);
        }, bottomDelay);

        return () => {
          clearTimeout(topTimer);
          clearTimeout(bottomTimer);
        };
      }, 140);
      return () => clearTimeout(mainDone);
    }, cardDelay);

    return () => clearTimeout(mainTimer);
  }, []);

  return {
    mainPhase,
    topPhase,
    bottomPhase,
    mainStyle: phaseStyle(mainPhase),
    topStyle: phaseStyle(topPhase),
    bottomStyle: phaseStyle(bottomPhase),
  };
}
