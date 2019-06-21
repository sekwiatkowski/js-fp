import { Equivalence, List, Monoid, Pair, Predicate } from '..';
export declare class Writer<V, L> {
    private readonly value;
    private readonly monoid;
    private readonly log;
    constructor(value: V, monoid: Monoid<L>, log: L);
    get(): Pair<V, L>;
    getLog(): L;
    getValue(): V;
    chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L>;
    assign<V extends object, K extends string, W>(this: Writer<V, L>, key: K, memberOrWriterOrFunction: Writer<W, L> | ((scope: V) => Writer<W, L>) | W | ((scope: V) => W)): Writer<V & {
        [key in K]: W;
    }, L>;
    map<U>(f: (value: V) => U): Writer<U, L>;
    mapLog(f: (value: L) => L): Writer<V, L>;
    mapLog<M>(f: (value: L) => M, newMonoid: Monoid<M>): Writer<V, M>;
    reset(): Writer<V, L>;
    tell(other: L): Writer<V, L>;
    perform(f: (value: V) => void): void;
    performOnLog(f: (log: L) => void): void;
    performOnBoth(f: (value: V, log: L) => void): void;
    equals(otherWriter: Writer<V, L>, equality: Equivalence<Writer<V, L>>): boolean;
    test(predicate: (value: V) => boolean): boolean;
    test(predicate: Predicate<V>): boolean;
}
export declare function writer<V, L>(value: V, monoid: Monoid<L>, log?: L): Writer<V, L>;
export declare function listWriter<V, I = string>(value: V, log?: List<I> | I): Writer<V, List<I>>;
export declare function listWriterObject<I = string>(log?: List<I> | I): Writer<object, List<I>>;
export declare function stringWriter<V, I>(value: V, log?: string): Writer<V, string>;
export declare function createWriterEquality<V, L>(valueEquality?: Equivalence<V>, logEquality?: Equivalence<L>): Equivalence<Writer<V, L>>;
