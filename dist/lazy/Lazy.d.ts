import { Equivalence, Predicate } from '..';
export declare class Lazy<A> {
    private readonly lazyValue;
    constructor(lazyValue: () => A);
    get(): () => A;
    apply<B, C>(this: Lazy<(parameter: B) => C>, argumentOrFunction: B | Lazy<B> | (() => B) | (() => Lazy<B>)): Lazy<C>;
    chain<B>(f: (value: A) => Lazy<B>): Lazy<B>;
    assign<A extends object, K extends string, B>(this: Lazy<A>, key: K, memberOrLazyOrFunction: Lazy<B> | ((scope: A) => Lazy<B>) | B | ((scope: A) => B)): Lazy<A & {
        [key in K]: B;
    }>;
    run(): A;
    map<U>(f: (input: A) => U): Lazy<U>;
    perform(sideEffect: (value: A) => void): Lazy<A>;
    equals(otherLazy: Lazy<A>, equality?: Equivalence<Lazy<any>>): boolean;
    test(predicate: (value: A) => boolean): boolean;
    test(predicate: Predicate<A>): boolean;
}
export declare function lazy<T>(f: () => T): Lazy<T>;
export declare function lazyObject(): Lazy<{}>;
export declare const LazyEquality: Equivalence<{}>;
