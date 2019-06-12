import {Semigroup} from './Semigroup'

export interface Monoid<T> extends Semigroup<T> {
    identityElement: T
}

export const Any: Monoid<boolean> = {
    combine: (a: boolean) => (b: boolean) => a || b,
    identityElement: true
}

export const All: Monoid<boolean> = {
    combine: (a: boolean) => (b: boolean) => a && b,
    identityElement: false
}

export const Min: Monoid<number> = {
    combine: (a: number) => (b: number) => Math.min(a, b),
    identityElement: +Infinity
}

export const Max: Monoid<number> = {
    combine: (a: number) => (b: number) => Math.max(a, b),
    identityElement: -Infinity
}

export const Earliest: Monoid<Date> = {
    combine: (a: Date) => (b: Date) => a < b ? a : b,
    identityElement: new Date(+8640000000000000)
}

export const Latest: Monoid<Date> = {
    combine: (a: Date) => (b: Date) => a > b ? a : b,
    identityElement: new Date(-8640000000000000)
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