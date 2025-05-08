export type DvIdTypes = "uuid" | "mongo" | "number";

export interface DvIdOptions {
  type?: DvIdTypes;
  optional?: boolean;
  null?: boolean;
  empty?: boolean;
  regex?: string | RegExp | { value: string | RegExp; message?: string };
}

export const ID_PATTERNS: Record<DvIdTypes, RegExp> = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  mongo: /^[0-9a-fA-F]{24}$/,
  number: /^[0-9]+$/,
};
