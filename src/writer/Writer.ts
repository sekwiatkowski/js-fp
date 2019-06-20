import {List, listFromArray, Monoid, pair, Pair} from '..'
import {ListConcatenation} from '../list/List'
import {StringConcatenation} from '../combination/Monoid'

export interface Writer<V, L> {
    get(): Pair<V, L>
    getValue(): V
    getLog(): L
    map<U>(f: (value: V) => U): Writer<U, L>
    chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L>
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

        //region Mapping
        map<U>(f: (value: V) => U): Writer<U, L> {
            return writer(f(value), monoid, log)
        },
        //endregion

        //region Chaining
        chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L> {
            const nextWriter = f(value)
            return writer(nextWriter.getValue(), monoid, monoid.combine(log)(nextWriter.getLog()))
        }
        //endregion
    }
}