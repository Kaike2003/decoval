export type ValDateOptions = {
  minDate?: Date | { value: Date; message: string };
  maxDate?: Date | { value: Date; message: string };
  past?: boolean | { value: boolean; message: string };
  future?: boolean | { value: boolean; message: string };
};
