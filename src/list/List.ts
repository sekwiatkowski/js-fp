import {
    AnyOrder,
    ArrayConcatenation,
    createArrayEquality,
    DescendingAnyOrder,
    Earliest,
    ensureEquivalenceFunction,
    ensurePredicateFunction,
    Equivalence,
    Future,
    guardedStrictEquality,
    Latest,
    Max,
    Min,
    Monoid,
    neitherIsUndefinedOrNull,
    none,
    NonEmptyList,
    Option,
    Order,
    orderBy,
    orderDescendinglyBy,
    Predicate,
    Product,
    Semigroup,
    some,
    Sum
} from '..'
import {
    allItems,
    appendItem,
    containsItem,
    countItems,
    filterItems,
    findItem,
    findLastItem,
    flatten,
    foldItemsBy,
    forEachItem,
    getItem,
    getItemOrElse,
    groupItemsBy,
    mapItems,
    noItems,
    parallelMapItems,
    prependItem,
    rangeOfItems,
    reduceItemsBy,
    repeatItems,
    someItem,
    sortItems,
    takeItems
} from './ArrayFunctions'

export class List<T> {
    private readonly length: number
    constructor(private readonly items: T[]) {
        this.length = items.length
    }

    //region Access
    first(): Option<T> {
        return getItem(this.items, 0)
    }

    get(index: number): Option<T> {
        return getItem(this.items, index)
    }

    getArray(): T[] {
        return this.items
    }

    getOrElse(index: number, alternative: T|(() => T)): T {
        return getItemOrElse(this.items, index, alternative)
    }

    last(): Option<T> {
        return getItem(this.items, this.length - 1)
    }

    take(n: number): List<T> {
        return new List(takeItems(this.items, n))
    }
    //endregion

    //region Chaining
    flatten<U>(this: List<List<U>>|List<U[]>): List<U> {
        return new List(flatten(this.getArray()))
    }

    chain(f: (item: T) => List<T>): List<T> {
        return this.map(f).flatten()
    }
    //endregion

    //region Combination
    concat(other: T[]|List<T>): List<T> {
        return new List(ArrayConcatenation.combine(this.getArray())(other instanceof Array ? other : other.getArray()))
    }

    combine(other: T[], semigroup: Semigroup<T[]>): List<T>
    combine(other: List<T>, semigroup: Semigroup<List<T>>): List<T>
    combine(other: T[]|List<T>, semigroup: Semigroup<T[]>|Semigroup<List<T>>): List<T> {
        if (other instanceof Array) {
            return new List((semigroup as Semigroup<T[]>).combine(this.items)(other))
        }
        else {
            return (semigroup as Semigroup<List<T>>).combine(this)(other)
        }
    }
    //endregion

    //region Expansion
    append(item: T): NonEmptyList<T> {
        return new NonEmptyList(appendItem(this.items, item))
    }

    prepend(item: T): NonEmptyList<T> {
        return new NonEmptyList(prependItem(this.items, item))
    }
    //endregion

    //region Grouping
    groupBy(computeKey: (item: T) => string): { [id: string]: T[] } {
        return groupItemsBy(this.items, computeKey)
    }
    //endregion

    //region Mapping
    map<U>(f: (item: T) => U): List<U> {
        return new List(mapItems(this.items, f))
    }

    parallelMap<U, E>(f: (item: T) => U): Future<U[], E> {
        return parallelMapItems(this.items, f)
    }
    //endregion

    //region Matching
    match<X>(
        onNonEmpty: (array: T[]) => X,
        onEmpty: () => X) : X {
        return this.length == 0 ? onEmpty() : onNonEmpty(this.items)
    }
    //endregion

    //region Reduction
    reduceBy<U>(by: (item: T) => U, operation: (a: U) => (b: U) => U): Option<U> {
        if (this.length < 2) {
            return none
        }
        else {
            return some(reduceItemsBy(this.items, by, operation))
        }
    }

    reduce(operation: (a: T) => (b: T) => T): Option<T> {
        return this.reduceBy(x => x, operation)
    }

    reduceByWithSemigroup<U>(by: (item: T) => U, semigroup: Semigroup<U>): Option<U> {
        return this.reduceBy(by, semigroup.combine)
    }

    reduceWithSemigroup(semigroup: Semigroup<T>): Option<T> {
        return this.reduce(semigroup.combine)
    }

    foldBy<U>(by: (item: T) => U, operation: (a: U) => (b: U) => U, initialValue: U): Option<U> {
        if(this.length == 0) {
            return none
        }
        else {
            return some(foldItemsBy(this.items, by, operation, initialValue))
        }
    }

    fold(operation: (a: T) => (b: T) => T, initialValue: T): Option<T> {
        return this.foldBy(x => x, operation, initialValue)
    }

    foldByWithMonoid<U>(by: (item: T) => U, monoid: Monoid<U>): Option<U> {
        return this.foldBy(by, monoid.combine, monoid.identityElement)
    }

    foldWithMonoid(monoid: Monoid<T>): Option<T> {
        return this.fold(monoid.combine, monoid.identityElement)
    }

    earliest(this: List<Date>): Option<Date> {
        return this.foldWithMonoid(Earliest)
    }

    earliestBy<U>(this: List<T>, by: (item: T) => Date): Option<Date> {
        return this.foldByWithMonoid(by, Earliest)
    }

    latest(this: List<Date>): Option<Date> {
        return this.foldWithMonoid(Latest)
    }

    latestBy<U>(this: List<T>, by: (item: T) => Date): Option<Date> {
        return this.foldByWithMonoid(by, Latest)
    }

    max(this: List<number>): Option<number> {
        return this.foldWithMonoid(Max)
    }

    maxBy(by: (item: T) => number): Option<number> {
        return this.foldByWithMonoid(by, Max)
    }

    min(this: List<number>): Option<number> {
        return this.foldWithMonoid(Min)
    }

    minBy(by: (item: T) => number): Option<number> {
        return this.foldByWithMonoid(by, Min)
    }

    sum(this: List<number>): Option<number> {
        return this.foldWithMonoid(Sum)
    }

    sumBy(by: (item: T) => number): Option<number> {
        return this.foldByWithMonoid(by, Sum)
    }

    product(this: List<number>): Option<number> {
        return this.foldWithMonoid(Product)
    }

    productBy(by: (item: T) => number): Option<number> {
        return this.foldByWithMonoid(by, Product)
    }
    //endregion

    //region Search
    filter(predicate: ((item: T) => boolean)|Predicate<T>): List<T> {
        return new List(filterItems(this.items, ensurePredicateFunction(predicate)))
    }

    find(predicate: ((item: T) => boolean)|Predicate<T>): Option<T>{
        return findItem(this.items, ensurePredicateFunction(predicate))
    }

    findLast(predicate: ((item: T) => boolean)|Predicate<T>): Option<T> {
        return findLastItem(this.items, ensurePredicateFunction(predicate))
    }
    //endregion

    //region Side-effects
    perform(sideEffect: (list: List<T>) => void) {
        sideEffect(this)
    }

    performOnEmpty(sideEffect: (list: List<T>) => void) {
        if (this.length > 0) {
            return
        }

        sideEffect(this)
    }

    performOnNonEmpty(sideEffect: (list: List<T>) => void) {
        if (this.length == 0) {
            return
        }

        sideEffect(this)
    }

    forEach(sideEffect: (item: T) => void) {
        forEachItem(this.items, sideEffect)
    }
    //endregion

    //region Status
    size(): number {
        return this.length
    }

    isEmpty(): boolean {
        return this.length === 0
    }

    isNotEmpty(): boolean {
        return this.length > 0
    }
    //endregion

    //region Sorting
    sort(order: Order<T> = AnyOrder): List<T> {
        return new List(sortItems(this.items, order.get()))
    }

    sortBy<U>(by: (item: T) => U): List<T> {
        return new List(sortItems(this.items, orderBy(by).get()))
    }

    sortDescendingly(): List<T> {
        return new List(sortItems(this.items, DescendingAnyOrder.get()))
    }

    sortDescendinglyBy<U>(by: (item: T) => U): List<T> {
        return new List(sortItems(this.items, orderDescendinglyBy(by).get()))
    }
    //endregion

    //region Testing
    equals(otherList: List<T>, equality: Equivalence<List<T>>): boolean {
        return equality.test(this, otherList)
    }

    contains(item: T, itemEquality: (((x: T, y: T) => boolean)|Equivalence<T>) = guardedStrictEquality): boolean {
        return containsItem(this.items, item, ensureEquivalenceFunction(itemEquality))
    }

    all(predicate: ((item: T) => boolean)|Predicate<T>): boolean {
        return allItems(this.items, ensurePredicateFunction(predicate))
    }

    some(predicate: ((item: T) => boolean)|Predicate<T>): boolean {
        return someItem(this.items, ensurePredicateFunction(predicate))
    }

    none(predicate: ((item: T) => boolean)|Predicate<T>): boolean {
        return noItems(this.items, ensurePredicateFunction(predicate))
    }

    count(predicate: ((item: T) => boolean)|Predicate<T>): number {
        return countItems(this.items, ensurePredicateFunction(predicate))
    }

    test(predicate: (items: T[]) => boolean): boolean
    test(predicate: Predicate<T[]>): boolean
    test(predicate: ((items: T[]) => boolean)|Predicate<T[]>): boolean {
        if (predicate instanceof Function) {
            return predicate(this.items)
        }
        else {
            return predicate.test(this.items)
        }
    }
    //endregion
}

export function emptyList<T>(): List<T> {
    return new List<T>([])
}

export function listFromArray<T>(array: T[]): List<T> {
    return new List(array)
}

export function range(start: number, end?: number): List<number> {
    return listFromArray(rangeOfItems(start, end))
}

export function repeat<T>(times: number, valueOrFunction: T|((index: number) => T)): List<T> {
    return listFromArray(repeatItems(times, valueOrFunction))
}

export function createListEquality<T>(itemEquality: Equivalence<T> = guardedStrictEquality): Equivalence<List<T>> {
    return (neitherIsUndefinedOrNull as Equivalence<List<T>>).and(createArrayEquality(itemEquality).adapt(l => l.getArray()))
}

export const ListConcatenation : Monoid<List<any>> = {
    combine: (xs: List<any>) => (ys: List<any>) => new List(ArrayConcatenation.combine(xs.getArray())(ys.getArray())),
    identityElement: emptyList()
}