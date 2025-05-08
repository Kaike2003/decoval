import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";

export function DvIP(options?: { version?: "v4" | "v6" | "any"; message?: string }) {
  return function (target: any, propertyKey: string) {
    const alreadyApplied = Reflect.getMetadata("valip:applied", target, propertyKey);
    if (alreadyApplied) {
      throw new Error(`The @ValIP decorator has already been applied to the field "${propertyKey}"`);
    }
    Reflect.defineMetadata("valip:applied", true, target, propertyKey);

    const customMessage = options?.message || `The "${propertyKey}" field must be a valid IP`;
    const version = options?.version || "v4";

    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex =
      /([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|([0-9a-fA-F]{1,4}:){1}(:[0-9a-fA-F]{1,4}){1,6}|::([0-9a-fA-F]{1,4}:){1,7}([0-9a-fA-F]{1,4})$/;

    // Função de validação
    registerValidation(target, propertyKey, (value: any) => {
      if (typeof value !== "string") {
        throw new ValidationError(customMessage);
      }

      let isValid = false;

      if (version === "v4" || version === "any") {
        isValid = ipv4Regex.test(value);
      }

      if (version === "v6" || version === "any") {
        isValid = isValid || ipv6Regex.test(value);
      }

      if (!isValid) {
        throw new ValidationError(customMessage);
      }
    });
  };
}
