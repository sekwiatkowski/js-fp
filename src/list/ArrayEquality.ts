import {
    BooleanEquality,
    bothAreNull,
    DateEquality,
    equivalence,
    Equivalence,
    neitherIsUndefinedOrNull,
    NullableBooleanEquality,
    NullableDateEquality,
    NullableNumberEquality,
    NullableStringEquality,
    NumberEquality,
    StringEquality
} from '..'
import {strictEquality} from '../equivalence/Equality'

const sameLength = NumberEquality.adapt((array: any[]) => array.length)

function createSameItemsEquality<T>(itemEquality: Equivalence<T> = strictEquality): Equivalence<T[]> {
    return equivalence((xs: any[], ys: any[]) => xs.every((x, i) => itemEquality.test(x, ys[i])))
}

export function createArrayEquality<T>(itemEquality: Equivalence<T> = strictEquality): Equivalence<T[]> {
    return neitherIsUndefinedOrNull.and(sameLength.and(createSameItemsEquality(itemEquality)))
}

export const StringArrayEquality = createArrayEquality(StringEquality)
export const NumberArrayEquality = createArrayEquality(NumberEquality)
export const BooleanArrayEquality = createArrayEquality(BooleanEquality)
export const DateArrayEquality = createArrayEquality(DateEquality)

export function createNullableArrayEquality<T>(itemEquality: Equivalence<T> = strictEquality): Equivalence<T[]> {
    return bothAreNull.or(createArrayEquality(itemEquality))
}

export const NullableStringArrayEquality = createNullableArrayEquality(NullableStringEquality)
export const NullableNumberArrayEquality = createNullableArrayEquality(NullableNumberEquality)
export const NullableBooleanArrayEquality = createNullableArrayEquality(NullableBooleanEquality)
export const NullableDateArrayEquality = createNullableArrayEquality(NullableDateEquality)