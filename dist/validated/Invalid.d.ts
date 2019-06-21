import { Validated } from './Validated';
import { Equivalence, Future, Option, Predicate, Result } from '..';
export declare class Invalid<T, E> implements Validated<T, E> {
    private readonly errors;
    constructor(errors: E[]);
    getErrorsOrElse(alternative: E[] | ((value: T) => E[])): E[];
    getOrElse(alternative: T | ((errors: E[]) => T)): T;
    apply<U, V>(this: Invalid<(parameter: U) => V, E>, argumentOrValidatedOrFunction: U | (() => U) | Validated<U, E> | (() => Validated<U, E>)): Validated<V, E>;
    assign<T extends object, K extends string, U>(this: Invalid<T, E>, key: K, memberOrValidatedOrFunction: Validated<U, E> | ((value: T) => Validated<U, E>) | U | ((value: T) => U)): Validated<T & {
        [key in K]: U;
    }, E>;
    concat(otherValidated: Validated<T, E>): Validated<T, E>;
    toFuture(): Future<T, E[]>;
    toOption(): Option<T>;
    toResult(): Result<T, E[]>;
    map<U>(f: (value: T) => U): Validated<U, E>;
    mapErrors(f: (errors: E[]) => E[]): Validated<T, E>;
    match<U>(onValid: (value: T) => U, onInvalid: (list: E[]) => U): U;
    perform(sideEffect: () => void): Validated<T, E>;
    performOnValid(sideEffect: (value: T) => void): Validated<T, E>;
    performOnInvalid(sideEffect: (errors: E[]) => void): Validated<T, E>;
    isInvalid(): boolean;
    isValid(): boolean;
    equals(otherValidated: Validated<T, E>, equality: Equivalence<Validated<T, E>>): boolean;
    test(predicate: (value: T) => boolean): boolean;
    test(predicate: Predicate<T>): boolean;
}
export declare function invalid<T, E>(errors: E | E[]): Invalid<T, E>;
