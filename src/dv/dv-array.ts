import { ValArrayOptions } from "../types/dv/dv-array";
import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";

export function DvArray(options: ValArrayOptions = {}) {
  const {
    minLength = { value: 0, message: "The array must contain at least {minLength.value} elements." },
    maxLength = { value: Infinity, message: "The array must contain at most {maxLength.value} elements." },
    elementsType = { value: "any", message: "The array elements must be of type {elementsType.value}." },
    allowedValues = {
      value: [],
      message: "The array elements must be one of the allowed values: {allowedValues.value.join(', ')}.",
    },
    message = "The array contains invalid elements.",
  } = options;

  const interpolateMessage = (message: string, data: any) => {
    return message.replace(/{([^}]+)}/g, (_, key) => data[key] || "");
  };

  return function (target: any, propertyKey: string) {
    const alreadyApplied = Reflect.getMetadata("valarray:applied", target, propertyKey);
    if (alreadyApplied) {
      throw new Error(`The @ValArray decorator has already been applied to the field "${propertyKey}"`);
    }
    Reflect.defineMetadata("valarray:applied", true, target, propertyKey);

    registerValidation(target, propertyKey, (value: any) => {
      if (!Array.isArray(value)) {
        throw new ValidationError(interpolateMessage(`The field "${propertyKey}" must be an array.`, {}));
      }

      if (value.length < minLength.value) {
        throw new ValidationError(interpolateMessage(minLength.message, { minLength }));
      }

      if (value.length > maxLength.value) {
        throw new ValidationError(interpolateMessage(maxLength.message, { maxLength }));
      }

      if (elementsType.value !== "any") {
        for (const item of value) {
          if (typeof item !== elementsType.value) {
            throw new ValidationError(interpolateMessage(elementsType.message, { elementsType }));
          }
        }
      }

      if (allowedValues.value.length > 0) {
        for (const item of value) {
          if (!allowedValues.value.includes(item)) {
            throw new ValidationError(interpolateMessage(allowedValues.message || message, { allowedValues }));
          }
        }
      }
    });
  };
}
