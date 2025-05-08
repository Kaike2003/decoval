import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function Positive(message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      if (typeof value !== "number" || value <= 0) {
        throw new ValidationError(message || `Property "${key}" must be a positive number.`);
      }
    });
  };
}
