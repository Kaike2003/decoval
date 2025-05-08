import { ContainsNumber } from "../helpers/containsNumber";
import { LowerCase } from "../helpers/lowerCase";
import { Optional } from "../helpers/optional";
import { SpecialChar } from "../helpers/specialChar";
import { UpperCase } from "../helpers/uppercase";
import { ValTextOptions } from "../types/dv/dv.text";
import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";
import { skipValidation } from "./skip/skip.validation";

export function DvText(options: ValTextOptions = {}) {
  // Normalize options to ensure consistency
  const {
    empty = false,
    null: allowNull = false,
    optional = false,
    lowercase = false,
    maxLength = 40,
    minLength = 3,
    number = false,
    specialChar = false,
    uppercase = false,
    noSpaces = false,
    emailProviders = false,
    regex = false,
  } = options;

  // Check for conflicts at the start
  if (lowercase && uppercase) {
    throw new Error("The options 'lowercase' and 'uppercase' cannot be used together.");
  }

  if (optional && empty) {
    throw new Error(
      "The options 'optional' and 'empty' cannot be used together. 'optional' allows empty values, but 'empty' requires a non-empty value."
    );
  }

  // Normalize minLength and maxLength values
  const minLen = typeof minLength === "object" ? minLength.value : minLength;
  const maxLen = typeof maxLength === "object" ? maxLength.value : maxLength;

  if (minLen > maxLen) {
    throw new Error("The value of 'minLength' cannot be greater than 'maxLength'.");
  }

  return function (target: any, propertyKey: string) {
    const alreadyApplied = Reflect.getMetadata("valtext:applied", target, propertyKey);
    if (alreadyApplied) {
      throw new Error(`The @ValText decorator has already been applied to the field "${propertyKey}".`);
    }
    Reflect.defineMetadata("valtext:applied", true, target, propertyKey);

    // Helper to skip validation when necessary
    const shouldSkipValidation = (value: any) =>
      skipValidation(value, {
        optional: typeof optional === "object" ? optional.value : optional,
        null: typeof allowNull === "object" ? allowNull.value : allowNull,
        empty: typeof empty === "object" ? empty.value : empty,
      });

    // Base validation to check string value and empty checks
    registerValidation(target, propertyKey, (value: any) => {
      if (shouldSkipValidation(value)) return;

      if (typeof value !== "string") {
        throw new ValidationError(`The "${propertyKey}" field must be a string.`);
      }

      if (!empty && value === "") {
        throw new ValidationError(`The "${propertyKey}" field is required.`);
      }
    });

    // Optional flag
    if (optional) Optional()(target, propertyKey);

    // MinLength and MaxLength validation
    const minLengthValue = typeof minLength === "object" ? minLength.value : minLength;
    const maxLengthValue = typeof maxLength === "object" ? maxLength.value : maxLength;
    const minLengthMessage =
      typeof minLength === "object"
        ? minLength.message
        : `The "${propertyKey}" field must have at least ${minLengthValue} characters.`;
    const maxLengthMessage =
      typeof maxLength === "object"
        ? maxLength.message
        : `The "${propertyKey}" field must be at most ${maxLengthValue} characters long.`;

    registerValidation(target, propertyKey, (value: any) => {
      if (shouldSkipValidation(value)) return;

      if (typeof value === "string" && value.length < minLengthValue) {
        throw new ValidationError(minLengthMessage as string);
      }
    });

    registerValidation(target, propertyKey, (value: any) => {
      if (shouldSkipValidation(value)) return;

      if (typeof value === "string" && value.length > maxLengthValue) {
        throw new ValidationError(maxLengthMessage as string);
      }
    });

    // Other validations
    if (uppercase) UpperCase(`The "${propertyKey}" field must contain only uppercase letters.`)(target, propertyKey);
    if (lowercase) LowerCase(`The "${propertyKey}" field must contain only lowercase letters.`)(target, propertyKey);
    if (number) ContainsNumber(`The "${propertyKey}" field must contain at least one number`)(target, propertyKey);

    if (noSpaces) {
      registerValidation(target, propertyKey, (value: any) => {
        if (shouldSkipValidation(value)) return;

        if (typeof value === "string" && /\s/.test(value)) {
          throw new ValidationError(`The "${propertyKey}" field must not contain spaces.`);
        }
      });
    }

    if (specialChar)
      SpecialChar(`The "${propertyKey}" field must contain at least one special character`)(target, propertyKey);

    // Email providers validation
    if (emailProviders) {
      let allowed: string[] = [];
      let customMessage = "";

      if (typeof emailProviders === "string") {
        allowed = [emailProviders];
        customMessage = `The email must be from the provider ${allowed[0]}`;
      } else if (Array.isArray(emailProviders)) {
        allowed = emailProviders;
        customMessage = `The email must be from one of the following providers: ${allowed.join(", ")}`;
      } else if (typeof emailProviders === "object") {
        allowed = Array.isArray(emailProviders.value) ? emailProviders.value : [emailProviders.value];
        customMessage =
          emailProviders.message || `The email must be from one of the following providers: ${allowed.join(", ")}`;
      }

      registerValidation(target, propertyKey, (value: any) => {
        if (shouldSkipValidation(value)) return;

        if (typeof value !== "string") return;

        const match = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/i.exec(value);
        if (!match || !match[1]) {
          throw new ValidationError(`The "${propertyKey}" field must be a valid email.`);
        }

        const domain = match[1].toLowerCase();
        if (!allowed.some((prov) => domain === prov.toLowerCase())) {
          throw new ValidationError(customMessage);
        }
      });
    }

    // Regex validation
    if (regex) {
      let patterns: (string | RegExp)[] = [];
      let customMessage = "";

      if (typeof regex === "string" || regex instanceof RegExp) {
        patterns = [regex];
        customMessage = `${propertyKey} does not match the required pattern.`;
      } else if (Array.isArray(regex)) {
        patterns = regex;
        customMessage = `${propertyKey} does not match any of the required patterns.`;
      } else if (typeof regex === "object") {
        patterns = Array.isArray(regex.value) ? regex.value : [regex.value];
        customMessage = regex.message || `${propertyKey} does not match any of the required patterns.`;
      }

      registerValidation(target, propertyKey, (value: any) => {
        if (shouldSkipValidation(value)) return;

        if (typeof value !== "string") return;
        const cleanValue = value.replace(/\s+/g, "");

        const isValid = patterns.some((pattern) =>
          typeof pattern === "string" ? cleanValue.startsWith(pattern) : pattern.test(cleanValue)
        );

        if (!isValid) throw new ValidationError(customMessage);
      });
    }
  };
}
