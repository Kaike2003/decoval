import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function SpecialChar(message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      if (typeof value !== "string" || !/[^\w\s]/.test(value)) {
        throw new ValidationError(message || `Property "${key}" must contain at least one special character.`);
      }
    });
  };
}
