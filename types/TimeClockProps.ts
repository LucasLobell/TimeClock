export interface TimeClockProps {
  selectedDate: Date;
  morningEntry: string;
  setMorningEntry: (v: string) => void;
  morningExit: string;
  setMorningExit: (v: string) => void;
  afternoonEntry: string;
  setAfternoonEntry: (v: string) => void;
  afternoonExit: string;
  setAfternoonExit: (v: string) => void;
}