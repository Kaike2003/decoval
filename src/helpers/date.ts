import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function IsDate(message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        throw new ValidationError(message || `Property "${key}" must be a valid date.`);
      }
    });
  };
}
