import {List, listFromArray, Monoid, pair, Pair} from '..'
import {ListConcatenation} from '../list/List'
import {StringConcatenation} from '../combination/Monoid'

export interface Writer<V, L> {
    get(): Pair<V, L>
    getValue(): V
    getLog(): L

    map<U>(f: (value: V) => U): Writer<U, L>
    mapLog<M>(f: (value: L) => M, monoid: Monoid<M>): Writer<V, M>
    mapBoth<W, M>(valueMap: (value: V) => W, logMap: (log: L) => M, monoid: Monoid<M>): Writer<W, M>

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
    return {
        //region Access
        get(): Pair<V, L> {
            return pair(value, log)
        },

        getValue(): V {
            return value
        },

        //endregion
        getLog(): L {
            return log
        },
        //endregion

        //region Chaining
        chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L> {
            const nextWriter = f(value)
            return writer(nextWriter.getValue(), monoid, monoid.combine(log)(nextWriter.getLog()))
        },
        //endregion

        //region Mapping
        map<U>(f: (value: V) => U): Writer<U, L> {
            return writer(f(value), monoid, log)
        },

        mapLog<M>(f: (value: L) => M, monoid: Monoid<M>): Writer<V, M> {
            return writer(value, monoid, f(log))
        },

        mapBoth<W, M>(valueMap: (value: V) => W, logMap: (log: L) => M, monoid: Monoid<M>): Writer<W, M> {
            return writer(valueMap(value), monoid, logMap(log))
        },
        //endregion

        //region Modification
        reset(): Writer<V, L> {
            return this.mapLog(log => monoid.identityElement)
        },
        tell(other: L): Writer<V, L> {
            return this.mapLog(log => monoid.combine(log)(other))
        }
        //endregion
    }
}