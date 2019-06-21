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

export class Writer<V, L> {
    constructor(private readonly value: V, private readonly monoid: Monoid<L>, private readonly log: L) {}

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
        return writer(nextWriter.getValue(), this.monoid, this.monoid.combine(this.log)(nextWriter.getLog()))
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

                return writer(expandedObject, this.monoid, memberOrWriter.getLog())
            }
            else {
                const expandedObject = {
                    ...Object(obj),
                    [key]: memberOrWriter
                }

                return writer(expandedObject, this.monoid, this.monoid.identityElement)
            }
        })
    }
    //endregion

    //region Mapping
    map<U>(f: (value: V) => U): Writer<U, L> {
        return writer(f(this.value), this.monoid, this.log)
    }

    mapLog(f: (value: L) => L): Writer<V, L>
    mapLog<M>(f: (value: L) => M, newMonoid: Monoid<M>): Writer<V, M>
    mapLog<M>(f: ((value: L) => L)|((value: L) => M), newMonoid?: Monoid<M>): Writer<V, L>|Writer<V, M> {
        if (newMonoid) {
            return writer<V, M>(this.value, newMonoid, (f as ((value: L) => M))(this.log))
        }
        else {
            return writer<V, L>(this.value, this.monoid, (f as ((value: L) => L))(this.log))
        }
    }
    //endregion

    //region Modification
    reset(): Writer<V, L> {
        return this.mapLog(() => this.monoid.identityElement)
    }

    tell(other: L): Writer<V, L> {
        return this.mapLog(log => this.monoid.combine(log)(other))
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


export function writer<V, L>(value: V, monoid: Monoid<L>, log: L = monoid.identityElement): Writer<V, L> {

    return new Writer(value, monoid, log)
}

export function listWriter<V, I=string>(value: V, log: List<I>|I = ListConcatenation.identityElement): Writer<V, List<I>> {
    return writer(value, ListConcatenation, log instanceof List ? log : listFromArray([log]))
}

export function listWriterObject<I=string>(log: List<I>|I = ListConcatenation.identityElement) : Writer<object, List<I>> {
    return listWriter({}, log)
}

export function stringWriter<V, I>(value: V, log: string = StringConcatenation.identityElement): Writer<V, string> {
    return writer(value, StringConcatenation, log)
}

export function createWriterEquality<V, L>(valueEquality: Equivalence<V> = guardedStrictEquality, logEquality: Equivalence<L> = guardedStrictEquality) {
    return (neitherIsUndefinedOrNull as Equivalence<Writer<V, L>>).and(equivalence((firstWriter, secondWriter) =>
        valueEquality.test(firstWriter.getValue(), secondWriter.getValue()) &&
        logEquality.test(firstWriter.getLog(), secondWriter.getLog())
    ))
}