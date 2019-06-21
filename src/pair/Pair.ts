import {box, Box, equivalence, Equivalence, guardedStrictEquality, neitherIsUndefinedOrNull, Predicate} from '..'

export class Pair<A, B> {
    constructor(private readonly _first: A, private readonly _second: B) {}

    //region Access
    first(): A
    first<T>(f: (second : A) => T): T
    first<T>(f?: (second : A) => T): A|T {
        if (f) {
            return f(this._first)
        }
        else {
            return this._first
        }
    }

    second(): B
    second<T>(f: (second : B) => T): T
    second<T>(f?: (second : B) => T): B|T {
        if (f) {
            return f(this._second)
        }
        else {
            return this._second
        }
    }
    //endregion

    //region Chaining
    chain<C, D>(f: (first: A, second: B) => Pair<C, D>): Pair<C, D> {
        return f(this._first, this._second)
    }
    //endregion

    //region Conversion
    toArray(): [A, B] {
        return [this._first, this._second]
    }

    toBox<C>(f: (A, B) => C): Box<C> {
        return box(f(this._first, this._second))
    }
    //endregion

    //region Mapping
    mapFirst<M>(f: (value: A) => M): Pair<M, B> {
        return new Pair(f(this._first), this._second)
    }

    mapSecond<M>(f: (value: B) => M): Pair<A, M> {
        return new Pair(this._first, f(this._second))
    }
    //endregion

    //region Side-effects
    perform(sideEffect: (first: A, second: B) => void): Pair<A, B> {
        sideEffect(this._first, this._second)
        return new Pair(this._first, this._second)
    }

    performOnFirst(sideEffect: (first: A) => void): Pair<A, B> {
        sideEffect(this._first)
        return new Pair(this._first, this._second)
    }

    performOnSecond(sideEffect: (second: B) => void): Pair<A, B> {
        sideEffect(this._second)
        return new Pair(this._first, this._second)
    }
    //endregion

    //region Testing
    equals(otherPair: Pair<A, B>, equality?: Equivalence<Pair<A, B>>): boolean {
        return (equality || PairEquality).test(this, otherPair)
    }

    test(predicate: (value: [A, B]) => boolean): boolean
    test(predicate: Predicate<[A, B]>): boolean
    test(predicate: ((value: [A, B]) => boolean)|Predicate<[A, B]>): boolean {
        if (predicate instanceof Function) {
            return predicate(this.toArray())
        }
        else {
            return predicate.test(this.toArray())
        }
    }
    //endregion
}

export function pair<A, B>(first: A, second: B): Pair<A, B> {
    return new Pair(first, second)
}

export const PairEquality = neitherIsUndefinedOrNull.and(equivalence<Pair<any, any>>((pair1, pair2) =>
    guardedStrictEquality.test(pair1.first(), pair2.first()) &&
    guardedStrictEquality.test(pair1.second(), pair2.second())
))