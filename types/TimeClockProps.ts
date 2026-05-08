export interface TimeClockProps {
  selectedDate: Date;
  strictTimeRuling: boolean;
  morningEntry: string;
  setMorningEntry: (v: string) => void;
  morningExit: string;
  setMorningExit: (v: string) => void;
  afternoonEntry: string;
  setAfternoonEntry: (v: string) => void;
  afternoonExit: string;
  setAfternoonExit: (v: string) => void;
}