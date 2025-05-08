export class ValidationSkipError extends Error {
  constructor() {
    super("Skip further validations for this optional field.");
    this.name = "ValidationSkipError";
  }
}
