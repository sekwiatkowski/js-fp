import {Equivalence, equivalence} from './Equivalence'

const isUndefined = (x) => typeof x === 'undefined'
const isNull = (x) => x === null

const eitherIsUndefined = equivalence((x, y) => isUndefined(x) || isUndefined(y))
const eitherIsNull = equivalence((x, y) => isNull(x) || isNull(y))
export const noItemIsUndefinedOrNull = eitherIsUndefined.or(eitherIsNull).not()

const basicStrictEquality = equivalence((x, y) => x === y)
const strictEquality = noItemIsUndefinedOrNull.and(basicStrictEquality)

export const StringEquality: Equivalence<string> = strictEquality
export const NumberEquality: Equivalence<number> = strictEquality
export const BooleanEquality: Equivalence<boolean> = strictEquality
export const DateEquality: Equivalence<any> = (noItemIsUndefinedOrNull as Equivalence<Date>)
    .and(basicStrictEquality.mapParameters(date => date.valueOf()))

export const bothAreNull = equivalence((x, y) => isNull(x) && isNull(y))
const nullableStrictEquality = bothAreNull.or(strictEquality)

export const NullableStringEquality: Equivalence<string> = nullableStrictEquality
export const NullableNumberEquality: Equivalence<number> = nullableStrictEquality
export const NullableBooleanEquality: Equivalence<boolean> = nullableStrictEquality
export const NullableDateEquality: Equivalence<Date> = bothAreNull.or(DateEquality)