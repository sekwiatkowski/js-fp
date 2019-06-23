import { Equivalence, List, Monoid, Pair, Predicate, Semigroup } from '..';
export declare class Writer<V, E, L> {
    private readonly value;
    private readonly log;
    private readonly entryToLog;
    private readonly semigroup;
    private readonly emptyLog;
    constructor(value: V, log: L, entryToLog: (single: E) => L, semigroup: Semigroup<L>, emptyLog: L);
    get(): Pair<V, L>;
    getLog(): L;
    getValue(): V;
    chain<W>(f: (value: V) => Writer<W, E, L>): Writer<W, E, L>;
    chain<W>(f: (value: V) => W, entry: E): Writer<W, E, L>;
    assign<V extends object, K extends string, W>(this: Writer<V, E, L>, key: Exclude<K, keyof V>, memberWriterOrValueOrFunction: W | ((scope: V) => W), entry?: E): Writer<V & {
        [key in K]: W;
    }, E, L>;
    assign<V extends object, K extends string, W>(this: Writer<V, E, L>, key: Exclude<K, keyof V>, memberWriterOrValueOrFunction: Writer<W, E, L> | ((scope: V) => Writer<W, E, L>)): Writer<V & {
        [key in K]: W;
    }, E, L>;
    map<W>(f: (value: V) => W): Writer<W, E, L>;
    mapLog(f: (log: L) => L): Writer<V, E, L>;
    reset(): Writer<V, E, L>;
    tell(other: L): Writer<V, E, L>;
    perform(f: (value: V) => void): void;
    performOnLog(f: (log: L) => void): void;
    performOnBoth(f: (value: V, log: L) => void): void;
    equals(otherWriter: Writer<V, E, L>, equality: Equivalence<Writer<V, E, L>>): boolean;
    test(predicate: (value: V) => boolean): boolean;
    test(predicate: Predicate<V>): boolean;
}
export declare function writer<V, S, M = S>(value: V, entryToLog: (one: S) => M, monoid: Monoid<M>, initialLog?: M, emptyLog?: M): Writer<V, S, M>;
export declare function writer<V, S, M = S>(value: V, entryToLog: (one: S) => M, semigroup: Semigroup<M>, initialLog: M, emptyLog?: M): Writer<V, S, M>;
export declare function listWriter<V, E = string>(value: V, initialLog?: List<E> | E): Writer<V, E, List<E>>;
export declare function listWriterObject<E = string>(initialLog?: List<E> | E): Writer<object, E, List<E>>;
export declare function stringWriter<V>(value: V, initialLog?: string, semigroup?: Semigroup<string>): Writer<V, string, string>;
export declare function createWriterEquality<V, E, L = E>(valueEquality?: Equivalence<V>, logEquality?: Equivalence<L>): Equivalence<Writer<V, E, L>>;
