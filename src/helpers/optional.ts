import { ValidationSkipError } from "../dv/error/validation.SkipError";
import { registerValidation } from "../dv/register.validation";

export function Optional() {
  return (target: any, key: string) => {
    registerValidation(target, key, (value: any) => {
      const isSkipped = value === undefined || value === null || value === "";
      if (isSkipped) {
        throw new ValidationSkipError();
      }
    });
  };
}
