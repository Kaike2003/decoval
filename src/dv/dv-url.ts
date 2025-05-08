import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";
import { skipValidation } from "./skip/skip.validation";

export function DvURL(options?: { message?: string; allowNull?: boolean }) {
  return function (target: any, propertyKey: string) {
    const customMessage = options?.message || `The "${propertyKey}" field must be a valid URL`;

    const urlRegex = /^(https?:\/\/)?([\w\d\-]+\.)+[a-z]{2,6}(:\d+)?(\/[\w\d\-._~:/?#[\]@!$&'()*+,;%=]*)?$/i;

    registerValidation(target, propertyKey, (value: any) => {
      const skipOpts = {
        optional: true,
        null: options?.allowNull ?? true,
        empty: true,
      };

      if (skipValidation(value, skipOpts)) return;

      if (typeof value !== "string") {
        throw new ValidationError(customMessage);
      }

      if (!urlRegex.test(value)) {
        throw new ValidationError(customMessage);
      }
    });
  };
}
