export type DeepPartialString<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartialString<T[K]> : string;
};
