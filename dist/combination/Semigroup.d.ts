export interface Semigroup<T> {
    combine: (a: T) => (b: T) => (T);
}
