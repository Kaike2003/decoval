export type ValNumberOptions = {
  min?: number | { value: number; message?: string };
  max?: number | { value: number; message?: string };
  positive?: boolean | { value: boolean; message?: string };
  negative?: boolean | { value: boolean; message?: string };
  integer?: boolean | { value: boolean; message?: string };
  multipleOf?: number | { value: number; message?: string };
  equals?: number | { value: number; message?: string };
  notEquals?: number | { value: number; message?: string };
  finite?: boolean;
  safe?: boolean;
  optional?: boolean;
  null?: boolean;
  empty?: boolean;
};

