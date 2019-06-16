import { Equivalence, Predicate } from '..';
export declare class Context<C, T> {
    private f;
    constructor(f: (shared: C) => T);
    get(): (C: any) => T;
    chain<U>(g: (value: T) => Context<C, U>): Context<C, U>;
    assign<U extends object, K extends string, V>(this: Context<C, U>, key: K, memberOrContextOrFunction: Context<C, V> | ((scope: U) => Context<C, V>) | V | ((scope: U) => V)): Context<C, U & {
        [key in K]: V;
    }>;
    assignWithContext<U extends object, K extends string, V>(this: Context<C, U>, key: K, memberOrContextOrFunction: ((shared: C, scope?: U) => Context<C, V>) | ((shared: C, scope?: U) => V)): Context<C, U & {
        [key in K]: V;
    }>;
    runWith(shared: C): T;
    map<U>(g: (input: T) => U): Context<C, U>;
    perform(sideEffect: (value: T) => void): Context<C, T>;
    performWithContext(sideEffect: (shared: C, value: T) => void): Context<C, T>;
    equals(other: T, equality?: Equivalence<T>): ContextualTest<C>;
    test(predicate: (value: T) => boolean): ContextualTest<C>;
    test(predicate: Predicate<T>): ContextualTest<C>;
}
export declare const context: <C, T>(f: (shared: C) => T) => Context<C, T>;
export declare const contextualObject: <E>() => Context<E, {}>;
declare class ContextualTest<C> {
    private f;
    constructor(f: (shared: C) => boolean);
    runWith(shared: C): boolean;
}
export {};
