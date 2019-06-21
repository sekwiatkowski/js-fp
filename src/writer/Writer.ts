import {
    equivalence,
    Equivalence,
    guardedStrictEquality,
    List,
    listFromArray,
    Monoid,
    neitherIsUndefinedOrNull,
    pair,
    Pair,
    Predicate
} from '..'
import {ListConcatenation} from '../list/List'
import {StringConcatenation} from '../combination/Monoid'

export interface Writer<V, L> {
    //region Access
    get(): Pair<V, L>
    getValue(): V
    getLog(): L
    //endregion

    //region Chaining
    chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L>
    //endregion

    //region Mapping
    map<U>(f: (value: V) => U): Writer<U, L>

    mapLog(f: (log: L) => L): Writer<V, L>
    mapLog<M>(f: (log: L) => M, monoid: Monoid<M>): Writer<V, M>
    //endregion

    //region Modification
    reset(): Writer<V, L>
    tell(other: L): Writer<V, L>
    //endregion

    //region Side-effects
    perform(f: (value: V) => void): void
    performOnLog(f: (log: L) => void): void
    performOnBoth(f: (value: V, log: L) => void): void
    //endregion

    //region Testing
    equals(otherWriter: Writer<V, L>, equality: Equivalence<Writer<V, L>>): boolean

    test(predicate: (value: V) => boolean): boolean
    test(predicate: Predicate<V>): boolean
    test(predicate: ((value: V) => boolean)|Predicate<V>): boolean
    //endregion
}

export function listWriter<V, I=string>(value: V, log: List<I>|I = ListConcatenation.identityElement): Writer<V, List<I>> {
    return writer(value, ListConcatenation, log instanceof List ? log : listFromArray([log]))
}

export function stringWriter<V, I>(value: V, log: string = StringConcatenation.identityElement): Writer<V, string> {
    return writer(value, StringConcatenation, log)
}

export function writer<V, L>(value: V, monoid: Monoid<L>, log: L = monoid.identityElement): Writer<V, L> {
    class WriterImpl implements Writer<V, L> {
        //region Access
        get(): Pair<V, L> {
            return pair(value, log)
        }

        getLog(): L {
            return log
        }

        getValue(): V {
            return value
        }
        //endregion

        //region Chaining
        chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L> {
            const nextWriter = f(value)
            return writer(nextWriter.getValue(), monoid, monoid.combine(log)(nextWriter.getLog()))
        }
        //endregion

        //region Mapping
        map<U>(f: (value: V) => U): Writer<U, L> {
            return writer(f(value), monoid, log)
        }

        mapLog(f: (value: L) => L): Writer<V, L>
        mapLog<M>(f: (value: L) => M, newMonoid: Monoid<M>): Writer<V, M>
        mapLog<M>(f: ((value: L) => L)|((value: L) => M), newMonoid?: Monoid<M>): Writer<V, L|M> {
            if (newMonoid) {
                return writer<V, M>(value, newMonoid, (f as ((value: L) => M))(log))
            }
            else {
                return writer<V, L>(value, monoid, (f as ((value: L) => L))(log))
            }
        }
        //endregion

        //region Modification
        reset(): Writer<V, L> {
            return this.mapLog(() => monoid.identityElement)
        }

        tell(other: L): Writer<V, L> {
            return this.mapLog(log => monoid.combine(log)(other))
        }
        //endregion

        //region Side-effects
        perform(f: (value: V) => void) {
            f(value)
        }

        performOnLog(f: (log: L) => void) {
            f(log)
        }

        performOnBoth(f: (value: V, log: L) => void) {
            f(value, log)
        }
        //endregion

        //region Testing
        equals(otherWriter: Writer<V, L>, equality: Equivalence<Writer<V, L>>): boolean {
            return equality.test(this, otherWriter)
        }

        test(predicate: (value: V) => boolean): boolean
        test(predicate: Predicate<V>): boolean
        test(predicate: ((value: V) => boolean)|Predicate<V>): boolean {
            if (predicate instanceof Function) {
                return predicate(value)
            }
            else {
                return predicate.test(value)
            }
        }
        //endregion
    }

    return new WriterImpl()
}

export function createWriterEquality<V, L>(valueEquality: Equivalence<V> = guardedStrictEquality, logEquality: Equivalence<L> = guardedStrictEquality) {
    return (neitherIsUndefinedOrNull as Equivalence<Writer<V, L>>).and(equivalence((firstWriter, secondWriter) =>
        valueEquality.test(firstWriter.getValue(), secondWriter.getValue()) &&
        logEquality.test(firstWriter.getLog(), secondWriter.getLog())
    ))
}