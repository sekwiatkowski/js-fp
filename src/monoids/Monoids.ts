export interface Monoid<T> {
    combine: (a: T) => (b: T) => T,
    identityElement: T
}

export const Max: Monoid<number> = {
    combine: (a: number) => (b: number) => Math.max(a, b),
    identityElement: -Infinity
}

export const Min: Monoid<number> = {
    combine: (a: number) => (b: number) => Math.min(a, b),
    identityElement: +Infinity
}

export const Sum: Monoid<number> = {
    combine: (a: number) => (b: number) => a + b,
    identityElement: 0
}

export const Product: Monoid<number> = {
    combine: (a: number) => (b: number) => a * b,
    identityElement: 1
}

export const ArrayConcatenation: Monoid<any[]> = {
    combine: (a: any[]) => (b: any[]) => a.concat(b),
    identityElement: []
}