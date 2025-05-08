import { ValidationSkipError } from "./error/validation.SkipError";
import { validationMetadata } from "./register.validation";

type ValidationErrors = Record<string, string[]>;

export function decoValidation<T extends object>(instance: T): Promise<T> {
  return new Promise((resolve, reject) => {
    const errors: ValidationErrors = {};
    const constructorName = instance.constructor.name;

    for (const key of Object.keys(instance)) {
      const propertyKey = `${constructorName}.${key}`;
      const value = (instance as any)[key];

      const validators = validationMetadata.get(propertyKey);
      if (!validators) continue;

      try {
        for (const validate of validators) {
          validate(value);
        }
      } catch (err) {
        if (err instanceof ValidationSkipError) {
          continue;
        }

        const message = err instanceof Error ? err.message : String(err);
        if (!errors[key]) errors[key] = [];
        errors[key].push(message);
      }
    }

    Object.keys(errors).length > 0 ? reject(errors) : resolve(instance);
  });
}
