import { ValidatorFn } from "../types/types";

export interface ValidationMap {
  [propertyKey: string]: ValidatorFn[];
}

const validationMetadata = new Map<string, ValidatorFn[]>();

function getValidationKey(target: any, key: string): string {
  const constructor = typeof target === "function" ? target.name : target.constructor.name;
  return `${constructor}.${key}`;
}

export function registerValidation(target: any, key: string, validator: ValidatorFn) {
  const propertyKey = getValidationKey(target, key);

  if (!validationMetadata.has(propertyKey)) {
    validationMetadata.set(propertyKey, []);
  }

  const validators = validationMetadata.get(propertyKey)!;

  if (!validators.includes(validator)) {
    validators.push(validator);
  }
}

export { validationMetadata };
