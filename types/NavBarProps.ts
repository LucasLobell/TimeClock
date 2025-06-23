export interface NavBarProps {
  iconHouse?: boolean;
  iconProfile?: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}