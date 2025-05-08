import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function Integer(message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      if (!Number.isInteger(value)) {
        throw new ValidationError(message || `Property "${key}" must be an integer.`);
      }
    });
  };
}
