import {Earliest, Future, Latest, List, none, Option, Semigroup, some} from '..'
import {ArrayConcatenation, Max, Min, Monoid, Product, Sum} from '../combination/Monoid'
import {
    allItems,
    appendItem,
    containsItem,
    countItems,
    equalItems,
    filterItems,
    findItem,
    findLastItem,
    flatten,
    foldItemsBy,
    forEachItem,
    getItem,
    groupItemsBy,
    mapItems,
    noItems,
    parallelMapItems,
    prependItem,
    rangeOfItems,
    reduceItemsBy,
    someItem,
    sortItems,
    sortItemsBy,
    sortItemsDescendingly,
    sortItemsDescendinglyBy,
    takeItems
} from './ArrayFunctions'

export class NonEmptyList<T> {
    private readonly length: number
    constructor(private readonly items: T[]) {
        this.length = items.length
    }

    //region Access
    first(): T {
        return this.items[0]
    }

    get(index: number): Option<T> {
        return getItem(this.items, index)
    }

    getArray(): T[] {
        return this.items
    }

    getOrElse(index: number, alternative: T|(() => T)): T {
        if (this.length > index) {
            return this.items[index]
        }
        else {
            return alternative instanceof Function? alternative() : alternative
        }
    }

    last(): T {
        return this.items[this.length-1]
    }

    take(n: number): NonEmptyList<T> {
        return new NonEmptyList<T>(takeItems(this.items, n))
    }
    //endregion

    //region Chaining
    flatten<U>(this: NonEmptyList<NonEmptyList<U>|U[]>): NonEmptyList<U> {
        return new NonEmptyList(flatten(this.items))
    }

    chain(f: (T) => NonEmptyList<T>): NonEmptyList<T> {
        return this.map(f).flatten()
    }
    //endregion

    //region Combination
    concat(otherList: NonEmptyList<T>): NonEmptyList<T> {
        return new NonEmptyList(ArrayConcatenation.combine(this.items)(otherList.items))
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

    //region Filtering
    filter(predicate: (item: T) => boolean): List<T> {
        return new List(filterItems(this.items, predicate))
    }
    //endregion

    //region Folding
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

    foldBy<U>(by: (item: T) => U, operation: (a: U) => (b: U) => U, initialValue: U): U {
        return foldItemsBy(this.items, by, operation, initialValue)
    }

    fold(operation: (a: T) => (b: T) => T, initialValue: T): T {
        return this.foldBy(x => x, operation, initialValue)
    }

    foldWithMonoid(monoid: Monoid<T>): T {
        return this.fold(monoid.combine, monoid.identityElement)
    }

    foldByWithMonoid<U>(by: (item: T) => U, monoid: Monoid<U>): U {
        return this.foldBy(by, monoid.combine, monoid.identityElement)
    }

    max(this: NonEmptyList<number>): number {
        return this.foldWithMonoid(Max)
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

    maxBy(by: (item: T) => number): number {
        return this.foldByWithMonoid(by, Max)
    }

    min(this: NonEmptyList<number>): number {
        return this.foldWithMonoid(Min)
    }

    minBy(by: (item: T) => number): number {
        return this.foldByWithMonoid(by, Min)
    }

    sum(this: NonEmptyList<number>): number {
        return this.foldWithMonoid(Sum)
    }

    sumBy(by: (item: T) => number): number {
        return this.foldByWithMonoid(by, Sum)
    }

    product(this: NonEmptyList<number>): number {
        return this.foldWithMonoid(Product)
    }

    productBy(by: (item: T) => number): number {
        return this.foldByWithMonoid(by, Product)
    }
    //endregion

    //region Grouping
    groupBy(computeKey: (item: T) => string): { [id: string]: T[] } {
        return groupItemsBy(this.items, computeKey)
    }
    //endregion

    //region Mapping
    map<U>(f: (item: T) => U): NonEmptyList<U> {
        return new NonEmptyList(mapItems(this.items, f))
    }

    parallelMap<U, E>(f: (item: T) => U): Future<U[], E> {
        return parallelMapItems(this.items, f)
    }
    //endregion

    //region Search
    find(predicate: (item: T) => boolean): Option<T>{
        return findItem(this.items, predicate)
    }

    findLast(predicate?: (item: T) => boolean): Option<T> {
        return findLastItem(this.items, predicate)
    }
    //endregion

    //region Side-effects
    perform(sideEffect: (list: NonEmptyList<T>) => void) {
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
    //endregion

    //region Sorting
    sort(): NonEmptyList<T> {
        return new NonEmptyList(sortItems(this.items))
    }

    sortBy<U>(by: (item: T) => U): NonEmptyList<T> {
        return new NonEmptyList(sortItemsBy(this.items, by))
    }

    sortDescendingly(): NonEmptyList<T> {
        return new NonEmptyList(sortItemsDescendingly(this.items))
    }

    sortDescendinglyBy<U>(by: (item: T) => U): NonEmptyList<T> {
        return new NonEmptyList(sortItemsDescendinglyBy(this.items, by))
    }
    //endregion

    //region Testing
    contains(item: T): boolean {
        return containsItem(this.items, item)
    }

    equals(otherList: NonEmptyList<T>): boolean {
        if (otherList == null) {
            return false
        }

        return equalItems(this.items, otherList.getArray())
    }

    all(predicate: (item: T) => boolean): boolean {
        return allItems(this.items, predicate)
    }

    some(predicate: (item: T) => boolean): boolean {
        return someItem(this.items, predicate)
    }

    none(predicate: (item: T) => boolean): boolean {
        return noItems(this.items, predicate)
    }

    count(predicate: (item: T) => boolean): number {
        return countItems(this.items, predicate)
    }
    //endregion
}

export function list<T>(head: T, ...tail: T[]): NonEmptyList<T> {
    const array = new Array(tail.length+1)
    array[0] = head
    for (let i = 0; i < tail.length; i++) {
        array[i+1] = tail[i]
    }

    return new NonEmptyList(array)
}

export function inclusiveRange(start: number, end?: number): NonEmptyList<number> {
    if (end == null) {
        if (start >= 0) {
            return list(0, ...rangeOfItems(1, start+1))
        }
        else {
            return list(0, ...rangeOfItems(-1, start-1))
        }
    }
    else {
        if (end >= start) {
            return list(start, ...rangeOfItems(start+1, end+1))
        }
        else {
            return list(start, ...rangeOfItems(start-1, end-1))
        }
    }
}
