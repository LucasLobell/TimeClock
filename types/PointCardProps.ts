export interface PointCardProps {
  label: string;
  storageKey: string;
  value: string;
  setValue: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
  wrongTime?: boolean;
}