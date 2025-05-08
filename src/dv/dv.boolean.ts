import { ValBooleanOptions } from "../types/dv/dv-boolean";
import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";

export function DvBoolean(options: ValBooleanOptions = {}) {
  const { message, optional = false, empty = false, null: allowNull = false } = options;

  if (optional && allowNull) {
    throw new Error("The 'optional' and 'null' options cannot be used together.");
  }

  return function (target: any, propertyKey: string) {
    const alreadyApplied = Reflect.getMetadata("valboolean:applied", target, propertyKey);
    if (alreadyApplied) {
      throw new Error(`The @DvBoolean decorator has already been applied to the field"${propertyKey}"`);
    }
    Reflect.defineMetadata("valboolean:applied", true, target, propertyKey);

    registerValidation(target, propertyKey, (value: any) => {
      if (value === undefined && optional) return;
      if (value === null && allowNull) return;
      if (value === "" && empty) return;

      if (typeof value !== "boolean") {
        throw new ValidationError(
          typeof message === "string" ? message : `The "${propertyKey}" field must be a boolean value.`
        );
      }
    });
  };
}
