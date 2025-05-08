import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function UpperCase(message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      if (typeof value !== "string" || value !== value.toUpperCase()) {
        throw new ValidationError(message || `A propriedade "${key}" deve estar em letras maiúsculas.`);
      }
    });
  };
}
