import { Option } from './Option';
import { Equivalence, Future, Predicate, Result, Validated } from '..';
export declare class Some<A> implements Option<A> {
    private readonly value;
    constructor(value: A);
    getOrElse(alternative: A | (() => A)): A;
    apply<B, C>(this: Option<(parameter: B) => C>, argumentOrFunctionOrOption: B | (() => B) | Option<B> | (() => Option<B>)): Option<C>;
    chain<B>(f: (value: A) => Option<B>): Option<B>;
    assign<A extends object, K extends string, B>(this: Some<A>, key: Exclude<K, keyof A>, memberOptionOrValueOrFunction: Option<B> | ((value: A) => Option<B>) | B | ((value: A) => B)): Option<A & {
        [key in K]: B;
    }>;
    toResult<E>(error: E): Result<A, E>;
    toFuture<E>(error: E): Future<A, E>;
    toValidated<E>(errorMessage: E): Validated<A, E>;
    orElse(alternative: A | (() => A)): Option<A>;
    orAttempt(alternative: () => Option<A>): Option<A>;
    filter(predicate: (value: A) => boolean): Option<A>;
    map<B>(f: (value: A) => B): Option<B>;
    isSome(): boolean;
    isNone(): boolean;
    match<B>(onSome: (value: A) => B, onNone: () => B): B;
    perform(sideEffect: () => void): Option<A>;
    performOnSome(sideEffect: (value: A) => void): Option<A>;
    performOnNone(sideEffect: () => void): Option<A>;
    equals(other: Option<A>, equality: Equivalence<Option<A>>): boolean;
    test(predicate: (value: A) => boolean): boolean;
    test(predicate: Predicate<A>): boolean;
}
export declare function some<A>(value: A): Some<A>;
export declare function optionObject(): Option<{}>;
