import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function SafeInteger(message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      if (!Number.isSafeInteger(value)) {
        throw new ValidationError(message || `Property "${key}" must be a safe integer.`);
      }
    });
  };
}
