import { List, Monoid, Pair } from '..';
export interface Writer<V, L> {
    get(): Pair<V, L>;
    getValue(): V;
    getLog(): L;
    chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L>;
    map<U>(f: (value: V) => U): Writer<U, L>;
    mapLog(f: (value: L) => L): Writer<V, L>;
    mapLog<M>(f: (value: L) => M, monoid: Monoid<M>): Writer<V, M>;
    reset(): Writer<V, L>;
    tell(other: L): Writer<V, L>;
}
export declare function listWriter<V, I>(value: V, log?: List<I> | I): Writer<V, List<I>>;
export declare function stringWriter<V, I>(value: V, log?: string): Writer<V, string>;
export declare function writer<V, L>(value: V, monoid: Monoid<L>, log?: L): Writer<V, L>;
