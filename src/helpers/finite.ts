import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function Finite(message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      if (!Number.isFinite(value)) {
        throw new ValidationError(message || `Property "${key}" must be a finite number.`);
      }
    });
  };
}
