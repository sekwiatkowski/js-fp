import { Equivalence, Future, Predicate, Result, Validated } from '..';
export interface Option<A> {
    getOrElse(alternative: A | (() => A)): A;
    apply<B, C>(this: Option<(parameter: B) => C>, argumentOrOptionOrFunction: B | (() => B) | Option<B> | (() => Option<B>)): Option<C>;
    chain<B>(f: (value: A) => Option<B>): Option<B>;
    assign<A extends object, K extends string, B>(this: Option<A>, key: K, memberOrFunctionOrOption: Option<B> | ((value: A) => Option<B>) | B | ((value: A) => B)): Option<A & {
        [key in K]: B;
    }>;
    toFuture<E>(error: E): Future<A, E>;
    toResult<E>(error: E): Result<A, E>;
    toValidated<E>(error: E): Validated<A, E>;
    orElse(alternative: A | (() => A)): Option<A>;
    orAttempt(alternative: () => Option<A>): Option<A>;
    filter(predicate: (value: A) => boolean): Option<A>;
    map<B>(f: (value: A) => B): Option<B>;
    match<B>(onSome: (value: A) => B, onNone: () => B): B;
    perform(sideEffect: () => void): Option<A>;
    performOnSome(sideEffect: (value: A) => void): Option<A>;
    performOnNone(sideEffect: () => void): Option<A>;
    isSome(): boolean;
    isNone(): boolean;
    equals(other: Option<A>, equality: Equivalence<Option<A>>): boolean;
    test(predicate: (value: A) => boolean): boolean;
    test(predicate: Predicate<A>): boolean;
    test(predicate: ((value: A) => boolean) | Predicate<A>): boolean;
}
export declare function option<T>(valueOrFunction: undefined | null | T | (() => T)): Option<T>;
export declare function createOptionEquality<T>(itemEquality?: Equivalence<T>): Equivalence<Option<T>>;
