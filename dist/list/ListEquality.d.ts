import { Equivalence, List, NonEmptyList } from '..';
export declare function createListEquality<T>(itemEquality: Equivalence<T>): Equivalence<List<T>>;
export declare const strictListEquality: Equivalence<List<{}>>;
export declare function createNonEmptyListEquality<T>(itemEquality: Equivalence<T>): Equivalence<NonEmptyList<T>>;
export declare const strictNonEmptyListEquality: Equivalence<NonEmptyList<{}>>;
