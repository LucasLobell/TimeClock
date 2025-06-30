export interface NavBarProps {
  iconHouse?: boolean;
  iconProfile?: boolean;
  iconTable?: boolean;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}