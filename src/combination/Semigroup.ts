export interface Semigroup<T> {
    readonly combine: (a: T) => (b: T) => (T)
}