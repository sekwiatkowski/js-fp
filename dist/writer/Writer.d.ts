import { Equivalence, List, Monoid, Pair, Predicate } from '..';
export interface Writer<V, L> {
    get(): Pair<V, L>;
    getValue(): V;
    getLog(): L;
    chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L>;
    map<U>(f: (value: V) => U): Writer<U, L>;
    mapLog(f: (log: L) => L): Writer<V, L>;
    mapLog<M>(f: (log: L) => M, monoid: Monoid<M>): Writer<V, M>;
    reset(): Writer<V, L>;
    tell(other: L): Writer<V, L>;
    perform(f: (value: V) => void): any;
    performOnLog(f: (log: L) => void): any;
    performOnBoth(f: (value: V, log: L) => void): any;
    equals(otherWriter: Writer<V, L>, equality: Equivalence<Writer<V, L>>): boolean;
    test(predicate: (value: V) => boolean): boolean;
    test(predicate: Predicate<V>): boolean;
    test(predicate: ((value: V) => boolean) | Predicate<V>): boolean;
}
export declare function listWriter<V, I>(value: V, log?: List<I> | I): Writer<V, List<I>>;
export declare function stringWriter<V, I>(value: V, log?: string): Writer<V, string>;
export declare function writer<V, L>(value: V, monoid: Monoid<L>, log?: L): Writer<V, L>;
export declare function createWriterEquality<V, L>(valueEquality?: Equivalence<V>, logEquality?: Equivalence<L>): Equivalence<Writer<V, L>>;
