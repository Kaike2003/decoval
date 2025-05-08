import { Optional } from "../helpers/optional";
import { DvIdOptions, ID_PATTERNS } from "../types/dv/dv-id";
import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";
import { skipValidation } from "./skip/skip.validation";

export function DvId(options: DvIdOptions = {}) {
  const { type, optional = false, empty = false, null: allowNull = false, regex } = options;

  if (optional && allowNull) {
    throw new Error("The 'optional' and 'null' options cannot be used simultaneously.");
  }

  if (empty && type) {
    throw new Error("The 'empty' option cannot be used with the defined ID type.");
  }

  if (regex && type) {
    throw new Error("It is not recommended to use 'regex' and 'type' at the same time. Choose only one.");
  }

  return function (target: any, propertyKey: string) {
    const alreadyApplied = Reflect.getMetadata("dvid:applied", target, propertyKey);
    if (alreadyApplied) {
      throw new Error(`The @DvId decorator has already been applied to the field "${propertyKey}".`);
    }
    Reflect.defineMetadata("dvid:applied", true, target, propertyKey);

    registerValidation(target, propertyKey, (value: any) => {
      if (
        skipValidation(value, {
          optional: typeof optional === "object" ? optional : optional,
          null: typeof allowNull === "object" ? allowNull : allowNull,
          empty: typeof empty === "object" ? empty : empty,
        })
      )
        return;

      if (typeof value !== "string" && typeof value !== "number") {
        throw new ValidationError(`The "${propertyKey}" field must be a valid ID (string or number).`);
      }

      const strValue = String(value);

      if (type) {
        const pattern = ID_PATTERNS[type];
        if (!pattern) {
          throw new Error(`ID type "${type}" is not supported.`);
        }

        if (!pattern.test(strValue)) {
          throw new ValidationError(`The field "${propertyKey}" is not a valid ${type}.`);
        }
      }

      if (regex) {
        let pattern: RegExp;
        let message = `The field "${propertyKey}" does not match the required pattern.`;

        if (typeof regex === "string" || regex instanceof RegExp) {
          pattern = new RegExp(regex);
        } else {
          pattern = new RegExp(regex.value);
          if (regex.message) message = regex.message;
        }

        if (!pattern.test(strValue)) {
          throw new ValidationError(message);
        }
      }
    });

    if (optional) Optional()(target, propertyKey);
  };
}
