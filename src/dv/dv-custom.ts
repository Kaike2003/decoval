import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";

type CustomRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

export function DvCustom<T = any>(rules: CustomRule<T> | CustomRule<T>[]) {
  if (!rules || (Array.isArray(rules) && rules.length === 0)) {
    throw new Error("The 'rules' parameter of the @DvCustom decorator cannot be empty or undefined.");
  }

  const ruleList: CustomRule<T>[] = Array.isArray(rules) ? rules : [rules];

  for (const rule of ruleList) {
    if (typeof rule !== "object" || rule === null) {
      throw new Error("Each custom rule must be a valid object.");
    }
    if (typeof rule.validate !== "function") {
      throw new Error("The 'validate' property of each rule must be a function.");
    }
    if (typeof rule.message !== "string" || rule.message.trim() === "") {
      throw new Error("The 'message' property of each rule must be a non-empty string.");
    }
  }

  return function (target: any, propertyKey: string) {
    const appliedDecorators = Reflect.getMetadata("valtcustom:applied", target, propertyKey) ?? new Set<string>();

    if (appliedDecorators.has("DvCustom")) {
      throw new Error(`The @DvCustom decorator has already been applied in the field "${propertyKey}".`);
    }

    appliedDecorators.add("DvCustom");
    Reflect.defineMetadata("valcustom:applied", appliedDecorators, target, propertyKey);

    registerValidation(target, propertyKey, (value: any) => {
      for (const rule of ruleList) {
        const isValid = rule.validate(value);
        if (!isValid) {
          throw new ValidationError(`[${propertyKey}] ${rule.message}`);
        }
      }
    });
  };
}
