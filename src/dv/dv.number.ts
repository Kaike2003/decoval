import { Equals } from "../helpers/equals";
import { Finite } from "../helpers/finite";
import { Integer } from "../helpers/integer";
import { Max } from "../helpers/max";
import { Min } from "../helpers/min";
import { MultipleOf } from "../helpers/multipleOf";
import { Negative } from "../helpers/negative";
import { NotEquals } from "../helpers/notEquals";
import { Positive } from "../helpers/positive";
import { SafeInteger } from "../helpers/safeInteger";
import { ValNumberOptions } from "../types/dv/dv-number";
import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";

export function DvNumber(options: ValNumberOptions = {}) {
  const {
    min,
    max,
    positive,
    negative,
    multipleOf,
    equals,
    notEquals,
    finite,
    safe,
    integer,
    optional = false,
    empty = false,
    null: allowNull = false,
  } = options;

  // Valores padrão e mensagens
  const minValue = typeof min === "object" ? min.value : min;
  const minMessage = typeof min === "object" ? min.message : `Number must be greater than or equal to ${minValue}`;

  const maxValue = typeof max === "object" ? max.value : max;
  const maxMessage = typeof max === "object" ? max.message : `Number must be less than or equal to ${maxValue}`;

  const positiveValue = typeof positive === "object" ? positive.value : positive;
  const positiveMessage = typeof positive === "object" ? positive.message : `The number must be positive`;

  const negativeValue = typeof negative === "object" ? negative.value : negative;
  const negativeMessage = typeof negative === "object" ? negative.message : `The number must be negative`;

  const multipleOfValue = typeof multipleOf === "object" ? multipleOf.value : multipleOf;
  const multipleOfMessage =
    typeof multipleOf === "object" ? multipleOf.message : `Number must be a multiple of ${multipleOfValue}`;

  const equalsValue = typeof equals === "object" ? equals.value : equals;
  const equalsMessage = typeof equals === "object" ? equals.message : `Number must be equal to ${equalsValue}`;

  const notEqualsValue = typeof notEquals === "object" ? notEquals.value : notEquals;
  const notEqualsMessage =
    typeof notEquals === "object" ? notEquals.message : `Number cannot be equal to ${notEqualsValue}`;

  if (optional && empty) {
    throw new Error("The 'optional' and 'empty' options cannot be used together.");
  }

  if (optional && allowNull) {
    throw new Error("The 'optional' and 'null' options cannot be used together.");
  }

  if (empty && allowNull) {
    throw new Error("The 'empty' and 'null' options cannot be used together.");
  }

  if (positive && negative) {
    throw new Error("The options 'positive' and 'negative' cannot be used together.");
  }

  if (equals !== undefined && notEquals !== undefined) {
    throw new Error("The 'equals' and 'notEquals' options cannot be used together.");
  }

  if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
    throw new Error("The minimum value cannot be greater than the maximum value.");
  }

  if (
    multipleOfValue &&
    minValue !== undefined &&
    minValue % multipleOfValue !== 0 &&
    maxValue !== undefined &&
    maxValue % multipleOfValue !== 0
  ) {
    throw new Error(`Number must be a multiple of ${multipleOfValue}, but the minimum or maximum value conflicts.`);
  }

  return function (target: any, propertyKey: string) {
    const alreadyApplied = Reflect.getMetadata("valnumber:applied", target, propertyKey);
    if (alreadyApplied) {
      throw new Error(`The @ValNumber decorator has already been applied to the field "${propertyKey}"`);
    }
    Reflect.defineMetadata("valnumber:applied", true, target, propertyKey);

    registerValidation(target, propertyKey, (value: any) => {
      const isNull = value === null;
      const isUndefined = value === undefined;
      const isEmptyString = value === "";

      if ((optional && (isUndefined || isEmptyString || isNull)) || (empty && isEmptyString) || (allowNull && isNull)) {
        return;
      }

      if (typeof value !== "number" || isNaN(value)) {
        throw new ValidationError(`The "${propertyKey}" field must be a number`);
      }
    });

    if (integer) {
      const message = typeof integer === "string" ? integer : `The "${propertyKey}" field must be an integer`;
      Integer(message)(target, propertyKey);
    }

    // Validações adicionais
    if (min !== undefined) Min(minValue!, minMessage)(target, propertyKey);
    if (max !== undefined) Max(maxValue!, maxMessage)(target, propertyKey);
    if (positiveValue) Positive(positiveMessage)(target, propertyKey);
    if (negativeValue) Negative(negativeMessage)(target, propertyKey);
    if (multipleOfValue) MultipleOf(multipleOfValue, multipleOfMessage)(target, propertyKey);
    if (equalsValue !== undefined) Equals(equalsValue, equalsMessage)(target, propertyKey);
    if (notEqualsValue !== undefined) NotEquals(notEqualsValue, notEqualsMessage)(target, propertyKey);
    if (finite) Finite("The number must be finite")(target, propertyKey);
    if (safe) SafeInteger("The number must be safe integer")(target, propertyKey);
  };
}
