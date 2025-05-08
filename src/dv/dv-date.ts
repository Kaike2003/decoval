import { IsDate } from "../helpers/date";
import { ValDateOptions } from "../types/dv/dv-date";
import { ValidationError } from "./error/validation.error";
import { registerValidation } from "./register.validation";
import { skipValidation } from "./skip/skip.validation";

export function DvDate(options: ValDateOptions = {}) {
  const { minDate, maxDate, past, future } = options;

  const min = minDate instanceof Date ? minDate : minDate?.value;
  const max = maxDate instanceof Date ? maxDate : maxDate?.value;

  const minMessage =
    typeof minDate === "object" && "message" in minDate
      ? minDate.message
      : `The date must be after ${min?.toLocaleDateString()}`;

  const maxMessage =
    typeof maxDate === "object" && "message" in maxDate
      ? maxDate.message
      : `The date must be before ${max?.toLocaleDateString()}`;

  const isPast = typeof past === "object" ? past.value : past;
  const isFuture = typeof future === "object" ? future.value : future;

  const pastMessage = typeof past === "object" && "message" in past ? past.message : `The date must be in the past`;

  const futureMessage =
    typeof future === "object" && "message" in future ? future.message : `A data deve estar no futuro`;

  return function (target: any, propertyKey: string) {
    const alreadyApplied = Reflect.getMetadata("valdate:applied", target, propertyKey);
    if (alreadyApplied) {
      throw new Error(`The @ValDate decorator has already been applied to the field"${propertyKey}"`);
    }
    Reflect.defineMetadata("valdate:applied", true, target, propertyKey);

    IsDate("Field must be a valid date")(target, propertyKey);

    registerValidation(target, propertyKey, (value: any) => {
      // Se o valor não for uma data válida, lança um erro
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        throw new ValidationError(`The "${propertyKey}" field must be a valid date.`);
      }

      if (min && value < min) {
        throw new ValidationError(minMessage);
      }

      if (max && value > max) {
        throw new ValidationError(maxMessage);
      }

      const now = new Date();

      if (isPast && value >= now) {
        throw new ValidationError(pastMessage);
      }

      if (isFuture && value <= now) {
        throw new ValidationError(futureMessage);
      }
    });
  };
}
