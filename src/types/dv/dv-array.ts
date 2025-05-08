export type ValArrayOptions = {
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  elementsType?: { value: "any" | "string" | "number" | "boolean"; message: string };
  allowedValues?: { value: any[]; message?: string };
  message?: string;
};
