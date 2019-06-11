export interface Monoid<T> {
    operation: (a: T) => (b: T) => T,
    identityElement: T
}

export const Max: Monoid<number> = {
    operation: (a: number) => (b: number) => Math.max(a, b),
    identityElement: -Infinity
}

export const Min: Monoid<number> = {
    operation: (a: number) => (b: number) => Math.min(a, b),
    identityElement: +Infinity
}

export const Sum: Monoid<number> = {
    operation: (a: number) => (b: number) => a + b,
    identityElement: 0
}

export const Product: Monoid<number> = {
    operation: (a: number) => (b: number) => a * b,
    identityElement: 1
}