import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function Max(value: number, message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (propValue: any) => {
      if (typeof propValue !== "number" || propValue > value) {
        throw new ValidationError(message || `Property "${key}" must be at most ${value}.`);
      }
    });
  };
}
