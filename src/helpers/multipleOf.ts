import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function MultipleOf(value: number, message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (val: any) => {
      if (typeof val !== "number" || val % value !== 0) {
        throw new ValidationError(message || `Property "${key}" must be a multiple of ${value}.`);
      }
    });
  };
}
