import {Equivalence, equivalence} from './Equivalence'

const isUndefined = x => typeof x === 'undefined'
const isNull = x => x === null
const eitherIsUndefined = equivalence((x, y) => isUndefined(x) || isUndefined(y))
const eitherIsNull = equivalence((x, y) => isNull(x) || isNull(y))
export const neitherIsUndefinedOrNull = eitherIsUndefined.or(eitherIsNull).not()

export const strictEquality = equivalence((x, y) => x === y)
export const guardedStrictEquality = neitherIsUndefinedOrNull.and(strictEquality)

export const StringEquality: Equivalence<string> = guardedStrictEquality
export const NumberEquality: Equivalence<number> = guardedStrictEquality
export const BooleanEquality: Equivalence<boolean> = guardedStrictEquality
export const DateEquality: Equivalence<any> = (neitherIsUndefinedOrNull as Equivalence<Date>)
    .and(strictEquality.adapt(date => date.valueOf()))

export const bothAreNull = equivalence((x, y) => isNull(x) && isNull(y))
export const nullableStrictEquality = bothAreNull.or(guardedStrictEquality)

export const NullableStringEquality: Equivalence<string> = nullableStrictEquality
export const NullableNumberEquality: Equivalence<number> = nullableStrictEquality
export const NullableBooleanEquality: Equivalence<boolean> = nullableStrictEquality
export const NullableDateEquality: Equivalence<Date> = bothAreNull.or(DateEquality)