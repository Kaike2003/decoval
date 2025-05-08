import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function NotEquals(value: number, message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (val: any) => {
      if (val === value) {
        throw new ValidationError(message || `Property "${key}" must not be equal to ${value}.`);
      }
    });
  };
}
