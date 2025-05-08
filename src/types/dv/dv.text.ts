export type ValTextOptions = {
  empty?: boolean | { value: boolean; message?: string };
  null?: boolean | { value: boolean; message?: string };
  optional?: boolean | { value: boolean; message?: string };
  minLength?: number | { value: number; message?: string };
  maxLength?: number | { value: number; message?: string };
  uppercase?: boolean | { value: boolean; message?: string };
  lowercase?: boolean | { value: boolean; message?: string };
  number?: boolean | { value: boolean; message?: string };
  specialChar?: boolean | { value: boolean; message?: string };
  noSpaces?: boolean | { value: boolean; message?: string };
  emailProviders?: string | string[] | { value: string | string[]; message?: string };
  regex?:
    | string
    | string[]
    | (string | RegExp)[]
    | {
        value: (string | RegExp)[];
        message?: string;
      };
};
