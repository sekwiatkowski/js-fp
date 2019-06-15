import {createArrayEquality, Equivalence, List, neitherIsUndefinedOrNull, NonEmptyList, strictEquality} from '..'

export function createListEquality<T>(itemEquality: Equivalence<T>): Equivalence<List<T>>{
    return (neitherIsUndefinedOrNull as Equivalence<List<T>>).and(createArrayEquality(itemEquality).adapt<List<T>>(l => l.getArray()))
}

export const strictListEquality = createListEquality(strictEquality)

export function createNonEmptyListEquality<T>(itemEquality: Equivalence<T>): Equivalence<NonEmptyList<T>>{
    return (neitherIsUndefinedOrNull as Equivalence<NonEmptyList<T>>).and(createArrayEquality(itemEquality).adapt<NonEmptyList<T>>(l => l.getArray()))
}

export const strictNonEmptyListEquality = createNonEmptyListEquality(strictEquality)