import {Semigroup} from './Semigroup'

export interface Monoid<T> extends Semigroup<T> {
    readonly identityElement: T
}

//region Boolean
export const Any: Monoid<boolean> = {
    combine: (x: boolean) => (y: boolean) => x || y,
    identityElement: true
}

export const All: Monoid<boolean> = {
    combine: (x: boolean) => (y: boolean) => x && y,
    identityElement: false
}
//endregion

//region Date
export const Earliest: Monoid<Date> = {
    combine: (x: Date) => (y: Date) => x < y ? x : y,
    identityElement: new Date(+8640000000000000)
}

export const Latest: Monoid<Date> = {
    combine: (x: Date) => (y: Date) => x > y ? x : y,
    identityElement: new Date(-8640000000000000)
}
//endregion

//region Number
export const Min: Monoid<number> = {
    combine: (x: number) => (y: number) => Math.min(x, y),
    identityElement: +Infinity
}

export const Max: Monoid<number> = {
    combine: (x: number) => (y: number) => Math.max(x, y),
    identityElement: -Infinity
}

export const Sum: Monoid<number> = {
    combine: (x: number) => (y: number) => x + y,
    identityElement: 0
}

export const Product: Monoid<number> = {
    combine: (x: number) => (y: number) => x * y,
    identityElement: 1
}
//endregion Number

//region String
export const StringConcatenation: Monoid<string> = {
    combine: (x: string) => (y: string) => x + y,
    identityElement: ''
}
//endregion

//region Array
export const ArrayConcatenation: Monoid<any[]> = {
    combine: (xs: any[]) => (ys: any[]) => xs.concat(ys),
    identityElement: []
}
//endregion
