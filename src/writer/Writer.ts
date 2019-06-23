import {
    equivalence,
    Equivalence,
    guardedStrictEquality,
    identity,
    List,
    listFromArray,
    Monoid,
    neitherIsUndefinedOrNull,
    pair,
    Pair,
    Predicate,
    Semigroup
} from '..'
import {ListConcatenation} from '../list/List'
import {StringConcatenation} from '../combination/Monoid'

// V: value
// E: log entry (e.g., string)
// L: log (collection of log entries) (e.g., List<string> or, simply, string)
export class Writer<V, E, L> {
    constructor(
        private readonly value: V,
        private readonly log: L,
        private readonly entryToLog: (single: E) => L,
        private readonly semigroup: Semigroup<L>,
        private readonly emptyLog: L) {}

    //region Access
    get(): Pair<V, L> {
        return pair(this.value, this.log)
    }

    getLog(): L {
        return this.log
    }

    getValue(): V {
        return this.value
    }
    //endregion

    //region Chaining
    chain<W>(f: (value: V) => Writer<W, E, L>): Writer<W, E, L>
    chain<W>(f: (value: V) => W, entry: E): Writer<W, E, L>
    chain<W>(f: ((value: V) => Writer<W, E, L>)|((value: V) => W), entry?: E): Writer<W, E, L> {
        const combineWithAnotherLog = this.semigroup.combine(this.log)

        if (entry) {
            const nextValue = f(this.value) as W
            const otherLog = this.entryToLog(entry)

            return new Writer(nextValue, combineWithAnotherLog(otherLog), this.entryToLog, this.semigroup, this.emptyLog)
        }
        else {
            const otherWriter = f(this.value) as Writer<W, E, L>
            const otherValue = (otherWriter).getValue()
            const otherLog = otherWriter.getLog()

            return new Writer(otherValue, combineWithAnotherLog(otherLog), this.entryToLog, this.semigroup, this.emptyLog)
        }
    }
    //endregion

    //region
    assign<V extends object, K extends string, W>(
        this: Writer<V, E, L>,
        key: Exclude<K, keyof V>,
        memberWriterOrValueOrFunction: W | ((scope: V) => W),
        entry?: E): Writer<V & { [key in K]: W }, E, L>
    assign<V extends object, K extends string, W>(
        this: Writer<V, E, L>,
        key: Exclude<K, keyof V>,
        memberWriterOrValueOrFunction: Writer<W, E, L> | ((scope: V) => Writer<W, E, L>)): Writer<V & { [key in K]: W }, E, L>
    assign<V extends object, K extends string, W>(
        this: Writer<V, E, L>,
        key: Exclude<K, keyof V>,
        memberWriterOrValueOrFunction: Writer<W, E, L> | ((scope: V) => Writer<W, E, L>) | W | ((scope: V) => W),
        log?: E): Writer<V & { [key in K]: W }, E, L> {
        return this.chain(scope => {
            const memberWriterOrValue = memberWriterOrValueOrFunction instanceof Function
                ? memberWriterOrValueOrFunction(scope)
                : memberWriterOrValueOrFunction

            const memberWriter = memberWriterOrValue instanceof Writer
                ? memberWriterOrValue
                : new Writer(memberWriterOrValue, log ? this.entryToLog(log) : this.emptyLog, this.entryToLog, this.semigroup, this.emptyLog)

            return memberWriter.map(member => ({
                ...Object(scope),
                [key]: member
            }))
        })
    }
    //endregion

    //region Mapping
    map<W>(f: (value: V) => W): Writer<W, E, L> {
        return new Writer(f(this.value), this.log, this.entryToLog, this.semigroup, this.emptyLog)
    }

    mapLog(f: (log: L) => L): Writer<V, E, L> {
        return new Writer(this.value, f(this.log), this.entryToLog, this.semigroup, this.emptyLog)
    }
    //endregion

    //region Modification
    reset(): Writer<V, E, L> {
        return this.mapLog(() => this.emptyLog)
    }

    tell(other: L): Writer<V, E, L> {
        return this.mapLog(log => this.semigroup.combine(log)(other))
    }
    //endregion

    //region Side-effects
    perform(f: (value: V) => void) {
        f(this.value)
    }

    performOnLog(f: (log: L) => void) {
        f(this.log)
    }

    performOnBoth(f: (value: V, log: L) => void) {
        f(this.value, this.log)
    }
    //endregion

    //region Testing
    equals(otherWriter: Writer<V, E, L>, equality: Equivalence<Writer<V, E, L>>): boolean {
        return equality.test(this, otherWriter)
    }

    test(predicate: (value: V) => boolean): boolean
    test(predicate: Predicate<V>): boolean
    test(predicate: ((value: V) => boolean)|Predicate<V>): boolean {
        if (predicate instanceof Function) {
            return predicate(this.value)
        }
        else {
            return predicate.test(this.value)
        }
    }
    //endregion
}

export function writer<V, S, M = S>(value: V, entryToLog: (one: S) => M, monoid: Monoid<M>, initialLog?: M, emptyLog?: M): Writer<V, S, M>
export function writer<V, S, M = S>(value: V, entryToLog: (one: S) => M, semigroup: Semigroup<M>, initialLog: M, emptyLog?: M): Writer<V, S, M>
export function writer<V, S, M = S>(value: V, entryToLog: (one: S) => M, semigroupOrMonoid: Semigroup<M>|Monoid<M>, initialLog?: M, emptyLog?: M): Writer<V, S, M> {
    if ('identityElement' in semigroupOrMonoid) {
        const monoid = semigroupOrMonoid as Monoid<M>
        return new Writer(value, initialLog || monoid.identityElement, entryToLog, monoid, emptyLog || monoid.identityElement)
    }
    else {
        const semigroup = semigroupOrMonoid as Semigroup<M>
        const definiteInitialLog = initialLog as M
        return new Writer(value, definiteInitialLog, entryToLog, semigroup, emptyLog || definiteInitialLog)
    }
}

export function listWriter<V, E=string>(value: V, initialLog: List<E>|E = ListConcatenation.identityElement): Writer<V, E, List<E>> {
    return writer(
        value,
        (single: E) => listFromArray([single]),
        ListConcatenation,
        initialLog instanceof List ? initialLog : listFromArray([initialLog]))
}

export function listWriterObject<E=string>(initialLog: List<E>|E = ListConcatenation.identityElement): Writer<object, E, List<E>> {
    return listWriter({}, initialLog)
}

export function stringWriter<V>(value: V, initialLog: string = StringConcatenation.identityElement, semigroup: Semigroup<string> = StringConcatenation): Writer<V, string, string> {
    return writer(value, identity, semigroup, initialLog)
}

export function createWriterEquality<V, E, L = E>(valueEquality: Equivalence<V> = guardedStrictEquality, logEquality: Equivalence<L> = guardedStrictEquality) {
    return (neitherIsUndefinedOrNull as Equivalence<Writer<V, E, L>>).and(equivalence((firstWriter, secondWriter) =>
        valueEquality.test(firstWriter.getValue(), secondWriter.getValue()) &&
        logEquality.test(firstWriter.getLog(), secondWriter.getLog())
    ))
}