import {Future, none, Option, option, some} from '..'
import {fulfilled} from '../future/Fulfilled'
import {Settled} from '../future/Settled'
import {rejected} from '../future/Rejected'
import {compare, compareBy, negatedCompare, negatedCompareBy} from './Comparison'
import {Max, Min, Monoid, Product, Sum} from '../monoids/Monoids'

export class List<T> {
    private readonly length: number
    constructor(private readonly items: T[]) {
        this.length = items.length
    }

    //region Access
    first(predicate?: (item: T) => boolean): Option<T> {
        if (predicate == null) {
            return this.get(0)
        }
        else {
            for (let i = 0; i < this.length; i++) {
                const item = this.items[i]
                if (predicate(item)) {
                    return some(item)
                }
            }

            return none
        }
    }

    get(index: number): Option<T> {
        return option(this.items[index])
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

    last(predicate?: (item: T) => boolean): Option<T> {
        const lastIndex = this.length-1
        if (predicate == null) {
            return this.get(lastIndex)
        }
        else {
            for (let i = lastIndex; i >= 0; i--) {
                const item = this.items[i]
                if (predicate(item)) {
                    return some(item)
                }
            }

            return none
        }

    }

    take(n: number): List<T> {
        if(n > 0) {
            return new List(this.items.slice(0, n))
        }
        else {
            const length = this.length
            const res = this.items.slice(length+n, length)
            return new List(res)
        }
    }
    //endregion

    //region Chaining
    flatten<U>(this: List<List<U>|U[]>): List<U> {
        let size = 0
        const listOfArrays = this as List<U[]>
        for (let i = 0; i < listOfArrays.length; i++) {
            size += listOfArrays.items[i].length
        }

        const flattened = new Array<U>(size)

        let flattenedIndex = 0
        for(let listIndex = 0; listIndex < this.length; listIndex++) {
            this.items[listIndex].forEach(item => {
                flattened[flattenedIndex++] = item
            })
        }

        return new List(flattened)
    }

    chain(f: (T) => List<T>): List<T> {
        return this.map(f).flatten()
    }
    //endregion

    //region Concatenation
    concat(otherList: List<T>): List<T> {
        const thisArray = this.items
        const otherArray = otherList.getArray()

        const thisLength = thisArray.length
        const otherLength = otherArray.length

        const concatenation = Array(thisLength + otherLength)

        for(let i = 0; i < thisLength; i++){
            concatenation[i] = thisArray[i]
        }

        for(let j = 0; j < otherLength; j++){
            concatenation[thisLength + j] = otherArray[j]
        }

        return new List(concatenation)
    }
    //endregion

    //region Expansion
    append(item: T) {
        return new List([...this.items, item])
    }

    prepend(item: T) {
        return new List([item, ...this.items])
    }
    //endregion

    //region Filtering
    filter(predicate: (item: T) => boolean): List<T> {
        return new List(this.items.filter(predicate))
    }
    //endregion

    //region Grouping
    groupBy(computeKey: (item: T) => string): { [id: string]: T[] } {
        let dictionary:{ [id: string]: T[] } = {}
        for(let i = 0; i < this.length; i++) {
            const item = this.items[i]
            const key = computeKey(item)
            if (!(key in dictionary)) {
                dictionary[key] = []
            }
            dictionary[key].push(item)
        }
        return dictionary
    }
    //endregion

    //region Mapping
    map<U>(f: (item: T) => U): List<U> {
        return new List(this.items.map(f))
    }

    parallelMap<U, E>(f: (item: T) => U): Future<U[], E> {
        return new Future(() => new Promise<Settled<U[], E>>(resolve => {
            const promises = this.items.map(x =>
                new Promise<U>(resolve =>
                    resolve(f(x))
                )
            )

            return Promise.all(promises)
                .then(items => resolve(fulfilled(items)))
                .catch(error => resolve(rejected(error)))
        }))
    }
    //endregion

    //region Matching
    match<X>(
        onNonEmpty: (array: T[]) => X,
        onEmpty: () => X) : X {
        return this.length == 0 ? onEmpty() : onNonEmpty(this.items)
    }
    //endregion

    //region Folding
    foldBy<U>(by: (item: T) => U, operation: (a: U) => (b: U) => U, initialValue: U): Option<U> {
        if (this.length == 0) {
            return none
        }

        let accumulator = initialValue
        for(let i = 0; i < this.length; i++) {
            accumulator = operation(accumulator)(by(this.items[i]))
        }

        return some(accumulator)
    }

    fold(operation: (a: T) => (b: T) => T, initialValue: T): Option<T> {
        return this.foldBy(x => x, operation, initialValue)
    }

    foldWithMonoid(monoid: Monoid<T>) {
        return this.fold(monoid.operation, monoid.identityElement)
    }

    foldByWithMonoid<U>(by: (item: T) => U, monoid: Monoid<U>) {
        return this.foldBy(by, monoid.operation, monoid.identityElement)
    }

    max(this: List<number>) {
        return this.foldWithMonoid(Max)
    }

    maxBy(by: (item: T) => number) {
        return this.foldByWithMonoid(by, Max)
    }

    min(this: List<number>) {
        return this.foldWithMonoid(Min)
    }

    minBy(by: (item: T) => number) {
        return this.foldByWithMonoid(by, Min)
    }

    sum(this: List<number>) {
        return this.foldWithMonoid(Sum)
    }

    sumBy(by: (item: T) => number) {
        return this.foldByWithMonoid(by, Sum)
    }

    product(this: List<number>) {
        return this.foldWithMonoid(Product)
    }

    productBy(by: (item: T) => number) {
        return this.foldByWithMonoid(by, Product)
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

    forEach(sideEffects: (item: T) => void) {
        this.items.forEach(sideEffects)
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
    sort(): List<T> {
        return new List(this.items.sort(compare))
    }

    sortBy<U>(f: (item: T) => U): List<T> {
        return new List(this.items.sort((a, b) => compareBy(a, b, f)))
    }

    sortDescendingly(): List<T> {
        return new List(this.items.sort(negatedCompare))
    }

    sortDescendinglyBy<U>(f: (item: T) => U): List<T> {
        return new List(this.items.sort((a, b) => negatedCompareBy(a, b, f)))
    }
    //endregion

    //region Testing
    contains(item: T): boolean {
        for (let i = 0; i < this.length; i++) {
            if (this.items[i] === item) {
                return true
            }
        }
        return false
    }

    equals(otherList: List<T>): boolean {
        if (otherList == null) {
            return false
        }

        const otherArray = otherList.getArray()

        if (this.length !== otherArray.length) {
            return false
        }

        for (let i = 0; i < this.length; i++) {
            if (this.items[i] !== otherArray[i]) {
                return false
            }
        }

        return true
    }

    all(predicate: (item: T) => boolean): boolean {
        for (let index = 0; index < this.length; index++) {
            if (!predicate(this.items[index])) {
                return false
            }
        }

        return true
    }

    some(predicate: (item: T) => boolean): boolean {
        for (let index = 0; index < this.length; index++) {
            if (predicate(this.items[index])) {
                return true
            }
        }

        return false
    }

    none(predicate: (item: T) => boolean): boolean {
        return !this.some(predicate)
    }

    count(predicate: (item: T) => boolean): number {
        let count = 0
        for (let index = 0; index < this.length; index++) {
            if (predicate(this.items[index])) {
                count += 1
            }
        }
        return count
    }
    //endregion
}

export function list<T>(...array: T[]): List<T> {
    return new List(array)
}

export function emptyList<T>(): List<T> {
    return new List<T>([])
}

export function listFromArray<T>(array: T[]): List<T> {
    return new List(array)
}