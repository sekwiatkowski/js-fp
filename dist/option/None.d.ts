import { Option } from './Option';
import { Future, Result, Validated } from '..';
export declare class None<A> implements Option<A> {
    static value: Option<never>;
    private constructor();
    apply<B, C>(this: Option<(parameter: B) => C>, parameterOrFunction: B | (() => B) | Option<B> | (() => Option<B>)): Option<C>;
    assign<A extends object, K extends string, B>(this: None<A>, key: K, memberOrFunction: Option<B> | ((obj: A) => Option<B>) | B | ((obj: A) => B)): Option<A & {
        [key in K]: B;
    }>;
    chain<B>(f: (a: A) => Option<B>): Option<B>;
    equals(other: Option<A>): boolean;
    test(predicate: (value: A) => boolean): boolean;
    filter(predicate: (value: A) => boolean): Option<A>;
    getOrElse(alternative: A | (() => A)): A;
    isSome(): boolean;
    isNone(): boolean;
    map<B>(f: (value: A) => B): Option<B>;
    fold<B>(onSome: (value: A) => B, onNone: () => B): B;
    orElse(alternative: A | (() => A)): Option<A>;
    orAttempt(alternative: () => Option<A>): Option<A>;
    perform(sideEffect: () => void): Option<A>;
    performOnSome(sideEffect: (value: A) => void): Option<A>;
    performOnNone(sideEffect: () => void): Option<A>;
    toFuture<E>(error: E): Future<A, E>;
    toResult<E>(error: E): Result<A, E>;
    toValidated<E>(error: E): Validated<A, E>;
}
export declare const none: Option<never>;
