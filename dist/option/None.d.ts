import { Option } from './Option';
import { Future, Result, Validated } from '..';
export declare class None<A> implements Option<A> {
    static value: Option<never>;
    private constructor();
    getOrElse(alternative: A | (() => A)): A;
    apply<B, C>(this: Option<(parameter: B) => C>, argumentOrOptionOrFunction: B | (() => B) | Option<B> | (() => Option<B>)): Option<C>;
    chain<B>(f: (a: A) => Option<B>): Option<B>;
    assign<A extends object, K extends string, B>(this: None<A>, key: K, memberOrOptionOrFunction: Option<B> | ((value: A) => Option<B>) | B | ((value: A) => B)): Option<A & {
        [key in K]: B;
    }>;
    toFuture<E>(error: E): Future<A, E>;
    toResult<E>(error: E): Result<A, E>;
    toValidated<E>(error: E): Validated<A, E>;
    orElse(alternative: A | (() => A)): Option<A>;
    orAttempt(alternative: () => Option<A>): Option<A>;
    filter(predicate: (value: A) => boolean): Option<A>;
    map<B>(f: (value: A) => B): Option<B>;
    equals(other: Option<A>): boolean;
    test(predicate: (value: A) => boolean): boolean;
    match<B>(onSome: (value: A) => B, onNone: () => B): B;
    perform(sideEffect: () => void): Option<A>;
    performOnSome(sideEffect: (value: A) => void): Option<A>;
    performOnNone(sideEffect: () => void): Option<A>;
    isNone(): boolean;
    isSome(): boolean;
}
export declare const none: Option<never>;
