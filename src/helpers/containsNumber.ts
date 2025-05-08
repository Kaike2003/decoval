import { ValidationError } from "../dv/error/validation.error";
import { registerValidation } from "../dv/register.validation";

export function ContainsNumber(message?: string) {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      if (typeof value !== "string") return;

      if (!/\d/.test(value)) {
        throw new ValidationError(message || `O campo "${key}" deve conter pelo menos um número.`);
      }
    });
  };
}
