import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function LowerCase(message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      if (typeof value !== "string" || value !== value.toLowerCase()) {
        throw new ValidationError(message || `A propriedade "${key}" deve estar em letras menusculas.`);
      }
    });
  };
}
