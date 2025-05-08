import { ValEnumOptions } from "../types/dv/val-enum";
import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";

export function DvEnum(options: ValEnumOptions) {
  const { values, in: inOption } = options;

  const enumValues = Array.isArray(values)
    ? values
    : Object.values(values).filter((v) => typeof v !== "number" || !Object.values(values).includes(v.toString()));

  const inMessage = inOption?.message || `The field must be one of the following values: ${enumValues.join(", ")}.`;

  return function (target: any, propertyKey: string) {
    const alreadyApplied = Reflect.getMetadata("valenum:applied", target, propertyKey);
    if (alreadyApplied) {
      throw new Error(`The @ValEnum decorator has already been applied to the field "${propertyKey}"`);
    }
    Reflect.defineMetadata("valenum:applied", true, target, propertyKey);

    registerValidation(target, propertyKey, (value: any) => {
      if (!enumValues.includes(value)) {
        throw new ValidationError(inMessage.replace("{property}", propertyKey));
      }
    });
  };
}
