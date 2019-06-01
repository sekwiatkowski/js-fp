import {Option, OptionMatchPattern} from './Option';
import {Future, Result, Validated} from '..';

export declare class Some<A> implements Option<A> {
    private readonly value;
    constructor(value: A);
    apply<B, C>(this: Option<(parameter: B) => C>, parameterOrFunction: B | (() => B) | Option<B> | (() => Option<B>)): Option<C>;
    assign<A extends object, K extends string, B>(this: Some<A>, key: K, memberOrFunction: Option<B> | ((obj: A) => Option<B>) | B | ((obj: A) => B)): Option<A & {
        [key in K]: B;
    }>;
    chain<B>(f: (value: A) => Option<B>): Option<B>;
    test(predicate: (value: A) => boolean): boolean;
    filter(predicate: (value: A) => boolean): Option<A>;
    getOrElse(alternative: A | (() => A)): A;
    isSome(): boolean;
    isNone(): boolean;
    map<B>(f: (value: A) => B): Option<B>;
    match<B>(pattern: OptionMatchPattern<A, B>): B;
    orElse(alternative: A | (() => A)): Option<A>;
    orAttempt(alternative: () => Option<A>): Option<A>;
    perform(sideEffect: (value: A) => void): Option<A>;
    performWhenNone(sideEffect: () => void): Option<A>;
    toResult<E>(error: E): Result<A, E>;
    toValidated(errorMessage: string): Validated<A>;
    toFuture<E>(error: E): Future<A, E>;
}
export declare function some<A>(value: A): Some<A>;
export declare function optionObject(): Option<{}>;
