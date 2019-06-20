import {List, listFromArray, Monoid, pair, Pair} from '..'
import {ListConcatenation} from '../list/List'
import {StringConcatenation} from '../combination/Monoid'

export interface Writer<V, L> {
    get(): Pair<V, L>
    getValue(): V
    getLog(): L

    map<U>(f: (value: V) => U): Writer<U, L>

    mapLog(f: (value: L) => L): Writer<V, L>
    mapLog<M>(f: (value: L) => M, monoid: Monoid<M>): Writer<V, M>

    mapBoth<W, M>(mapOverValue: (value: V) => W, mapOverLog: (log: L) => L): Writer<W, M>
    mapBoth<W, M>(mapOverValue: (value: V) => W, mapOverLog: (log: L) => M, monoid: Monoid<M>): Writer<W, M>

    chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L>

    reset(): Writer<V, L>
    tell(other: L): Writer<V, L>
}

export function listWriter<V, I>(value: V, log: List<I>|I = ListConcatenation.identityElement): Writer<V, List<I>> {
    return writer(value, ListConcatenation, log instanceof List ? log : listFromArray([log]))
}

export function stringWriter<V, I>(value: V, log: string = StringConcatenation.identityElement): Writer<V, string> {
    return writer(value, StringConcatenation, log)
}

export function writer<V, L>(value: V, monoid: Monoid<L>, log: L = monoid.identityElement): Writer<V, L> {
    class WriterImpl implements Writer<V, L> {
        chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L> {
            const nextWriter = f(value)
            return writer(nextWriter.getValue(), monoid, monoid.combine(log)(nextWriter.getLog()))
        }

        get(): Pair<V, L> {
            return pair(value, log)
        }

        getLog(): L {
            return log
        }

        getValue(): V {
            return value
        }

        map<U>(f: (value: V) => U): Writer<U, L> {
            return writer(f(value), monoid, log)
        }

        mapBoth<W>(mapOverValue: (value: V) => W, mapOverLog: (log: L) => L): Writer<W, L>
        mapBoth<W, M>(mapOverValue: (value: V) => W, mapOverLog: (log: L) => M, monoid: Monoid<M>): Writer<W, M>
        mapBoth<W, M>(mapOverValue: (value: V) => W, mapOverLog: (log: L) => L|M, monoid?: Monoid<M>): Writer<W, L|M> {
            return this
                .map(mapOverValue)
                .mapLog(mapOverLog, monoid)
        }

        mapLog(f: (value: L) => L): Writer<V, L>
        mapLog<M>(f: (value: L) => M, newMonoid: Monoid<M>): Writer<V, M>
        mapLog<M>(f: ((value: L) => L)|((value: L) => M), newMonoid?: Monoid<M>): Writer<V, L|M> {
            if (monoid) {
                return writer<V, M>(value, newMonoid, (f as ((value: L) => M))(log))
            }
            else {
                return writer<V, L>(value, monoid, (f as ((value: L) => L))(log))
            }
        }

        reset(): Writer<V, L> {
            return this.mapLog(() => monoid.identityElement)
        }

        tell(other: L): Writer<V, L> {
            return this.mapLog(log => monoid.combine(log)(other))
        }

    }

    return new WriterImpl()
}