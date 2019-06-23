import { Equivalence, Future, Option, Predicate, Result } from '..';
export interface Validated<T, E> {
    getErrorsOrElse(alternative: E[] | ((value: T) => E[])): E[];
    getOrElse(alternative: T | ((errors: E[]) => T)): T;
    apply<U, V>(this: Validated<(parameter: U) => V, E>, argumentOrFunctionOrValidated: U | Validated<U, E> | (() => U) | (() => Validated<U, E>)): Validated<V, E>;
    concat(otherValidated: Validated<T, E>): Validated<T, E>;
    toFuture(): Future<T, E[]>;
    toResult(): Result<T, E[]>;
    toOption(): Option<T>;
    map<U>(f: (value: T) => U): Validated<U, E>;
    mapErrors(f: (errors: E[]) => E[]): Validated<T, E>;
    match<U>(onValid: (value: T) => U, onInvalid: (list: E[]) => U): U;
    perform(sideEffect: (value: T) => void): Validated<T, E>;
    performOnInvalid(sideEffect: (errors: E[]) => void): Validated<T, E>;
    performOnBoth(sideEffect: () => void): Validated<T, E>;
    isValid(): boolean;
    isInvalid(): boolean;
    equals(otherValidated: Validated<T, E>, equality: Equivalence<Validated<T, E>>): boolean;
    test(predicate: (value: T) => boolean): boolean;
    test(predicate: Predicate<T>): boolean;
    test(predicate: ((value: T) => boolean) | Predicate<T>): boolean;
}
export declare function createValidatedEquality<T, E>(valueEquality?: Equivalence<T>, errorsEquality?: Equivalence<E[]>): Equivalence<Validated<T, E>>;
