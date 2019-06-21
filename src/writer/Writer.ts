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
    Predicate,
    Semigroup
} from '..'
import {ListConcatenation} from '../list/List'
import {StringConcatenation} from '../combination/Monoid'

export class Writer<V, L> {
    constructor(
        private readonly value: V,
        private readonly log: L,
        private readonly semigroup: Semigroup<L>,
        private readonly _resetLog: () => L) {}

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
    chain<U>(f: (value: V) => Writer<U, L>): Writer<U, L> {
        const nextWriter = f(this.value)
        return new Writer(nextWriter.getValue(), this.semigroup.combine(this.log)(nextWriter.getLog()), this.semigroup, this._resetLog)
    }
    //endregion

    //region
    assign<V extends object, K extends string, W>(
        this: Writer<V, L>,
        key: Exclude<K, keyof V>,
        memberOrWriterOrFunction: Writer<W, L> | ((scope: V) => Writer<W, L>) | W | ((scope: V) => W)): Writer<V & { [key in K]: W }, L> {
        return this.chain(obj => {
            const memberOrWriter = memberOrWriterOrFunction instanceof Function ? memberOrWriterOrFunction(obj) : memberOrWriterOrFunction

            if (memberOrWriter instanceof Writer) {
                const expandedObject = {
                    ...Object(obj),
                    [key]: memberOrWriter.getValue()
                }

                return new Writer(expandedObject, memberOrWriter.getLog(), this.semigroup, this._resetLog)
            }
            else {
                const expandedObject = {
                    ...Object(obj),
                    [key]: memberOrWriter
                }

                return new Writer(expandedObject, this.getLog(), this.semigroup, this._resetLog)
            }
        })
    }
    //endregion

    //region Mapping
    map<U>(f: (value: V) => U): Writer<U, L> {
        return new Writer(f(this.value), this.log, this.semigroup, this._resetLog)
    }

    mapLog(f: (value: L) => L): Writer<V, L>
    mapLog<M>(f: (value: L) => M, monoid: Monoid<M>): Writer<V, M>
    mapLog<M>(f: (value: L) => M, semigroup: Semigroup<M>, resetLog: () => M): Writer<V, M>
    mapLog<M>(f: (value: L) => M, monoidOrSemigroup?: Semigroup<M>, resetLog?: () => M): Writer<V, M>
    mapLog<M>(f: ((value: L) => L)|((value: L) => M), monoidOrSemigroup?: Monoid<M>|Semigroup<M>, resetLog?: () => M): Writer<V, L>|Writer<V, M> {
        if (monoidOrSemigroup) {
            const mapToM = f as ((value: L) => M)
            const logInM = mapToM(this.log)

            if (resetLog) {
                return new Writer(this.value, logInM, monoidOrSemigroup, resetLog)
            }
            else {
                const monoid = monoidOrSemigroup as Monoid<M>
                return new Writer(this.value, logInM, monoid, () => monoid.identityElement)
            }
        }
        else {
            const mapWitinL = f as ((value: L) => L)
            return new Writer(this.value, mapWitinL(this.log), this.semigroup as Semigroup<L>, this._resetLog)
        }
    }
    //endregion

    //region Modification
    reset(): Writer<V, L> {
        return this.mapLog(this._resetLog)
    }

    tell(other: L): Writer<V, L> {
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
    equals(otherWriter: Writer<V, L>, equality: Equivalence<Writer<V, L>>): boolean {
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


export function writer<V, L>(value: V, monoid: Monoid<L>): Writer<V, L>
export function writer<V, L>(value: V, semigroup: Semigroup<L>, log: L): Writer<V, L>
export function writer<V, L>(value: V, semigroupOrMonoid: Semigroup<L>|Monoid<L>, initialLog?: L): Writer<V, L> {

    if (initialLog) {
        return new Writer(value, initialLog, semigroupOrMonoid, () => initialLog)
    }
    else {
        const monoid = semigroupOrMonoid as Monoid<L>

        return new Writer(value, monoid.identityElement, monoid, () => monoid.identityElement)
    }
}

export function listWriter<V, I=string>(value: V, initialLog: List<I>|I = ListConcatenation.identityElement): Writer<V, List<I>> {
    return writer(value, ListConcatenation, initialLog instanceof List ? initialLog : listFromArray([initialLog]))
}

export function listWriterObject<I=string>(initialLog: List<I>|I = ListConcatenation.identityElement) : Writer<object, List<I>> {
    return listWriter({}, initialLog)
}

export function stringWriter<V, I>(value: V, initialLog: string = StringConcatenation.identityElement): Writer<V, string> {
    return writer(value, StringConcatenation, initialLog)
}

export function createWriterEquality<V, L>(valueEquality: Equivalence<V> = guardedStrictEquality, logEquality: Equivalence<L> = guardedStrictEquality) {
    return (neitherIsUndefinedOrNull as Equivalence<Writer<V, L>>).and(equivalence((firstWriter, secondWriter) =>
        valueEquality.test(firstWriter.getValue(), secondWriter.getValue()) &&
        logEquality.test(firstWriter.getLog(), secondWriter.getLog())
    ))
}