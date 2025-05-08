export function skipValidation(value: any, options: { optional?: boolean; null?: boolean; empty?: boolean }): boolean {
  const isUndefined = typeof value === "undefined";
  const isNull = value === null;
  const isEmpty = value === "";

  // Se o valor for undefined e a opção optional for true, ignora a validação
  if (options.optional && isUndefined) {
    return true;
  }

  // Se o valor for null e a opção null for true, ignora a validação
  if (options.null && isNull) {
    return true;
  }

  // Se o valor for vazio e a opção empty for true, ignora a validação
  if (options.empty && isEmpty) {
    return true;
  }

  // Caso contrário, não ignora a validação
  return false;
}
