export interface ParserInterface<T> {
  parse(): Promise<T[] | void>;
}
