export interface NavBarProps {
  iconHouse?: boolean;
  iconProfile?: boolean;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}