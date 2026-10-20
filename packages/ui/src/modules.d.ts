// The types of the npm modules that have no types of their own. The cms
// does not need them, because its tsconfig accepts an implicit "any".

declare module 'shallow-equal' {
  export function shallowEqualObjects(
    objA: object | null | undefined,
    objB: object | null | undefined,
  ): boolean;
  export function shallowEqualArrays(
    arrA: unknown[] | null | undefined,
    arrB: unknown[] | null | undefined,
  ): boolean;
}

declare module 'min-md5' {
  export default function md5(value: string): string;
}

declare module 'rtl-detect' {
  const rtlDetect: { isRtlLang(locale: string): boolean };
  export default rtlDetect;
}
