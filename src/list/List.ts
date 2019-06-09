import {Future, Option, option} from '..'
import {fulfilled} from '../future/Fulfilled'
import {Settled} from '../future/Settled'
import {rejected} from '../future/Rejected'
import {compare, compareBy, negatedCompare, negatedCompareBy} from './Comparison'

export class List<T> {
    constructor(private readonly array: T[]) {}

    //region Map items
    map<U>(f: (value: T) => U): List<U> {
        return new List(this.array.map(f))
    }

    parallelMap<U, E>(f: (value: T) => U): Future<U[], E> {
        return new Future(() => new Promise<Settled<U[], E>>(resolve => {
            const promises = this.array.map(x =>
                new Promise<U>(resolve =>
                    resolve(f(x))
                )
            )

            return Promise.all(promises)
                .then(values => resolve(fulfilled(values)))
                .catch(error => resolve(rejected(error)))
        }))
    }
    //endregion

    //region Sort items
    sort(): List<T> {
        return new List(this.array.sort(compare))
    }

    sortBy<U>(f: (value: T) => U): List<T> {
        return new List(this.array.sort((a, b) => compareBy(a, b, f)))
    }

    sortDescendingly(): List<T> {
        return new List(this.array.sort(negatedCompare))
    }

    sortDescendinglyBy<U>(f: (value: T) => U): List<T> {
        return new List(this.array.sort((a, b) => negatedCompareBy(a, b, f)))
    }
    //endregion

    //region Size
    size(): number {
        return this.array.length
    }

    isEmpty(): boolean {
        return this.array.length === 0
    }

    isNotEmpty(): boolean {
        return this.array.length > 0
    }
    //endregion

    //region Test items
    all(predicate: (item: T) => boolean): boolean {
        for (let index = 0; index < this.array.length; index++) {
            if (!predicate(this.array[index])) {
                return false
            }
        }

        return true
    }

    some(predicate: (item: T) => boolean): boolean {
        for (let index = 0; index < this.array.length; index++) {
            if (predicate(this.array[index])) {
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
        for (let index = 0; index < this.array.length; index++) {
            if (predicate(this.array[index])) {
                count += 1
            }
        }
        return count
    }
    //endregion

    //region Get item(s)
    get(index: number): Option<T> {
        return option(this.array[index])
    }

    getOrElse(index: number, alternative: T|(() => T)): T {
        if (this.array.length >= index) {
            return this.array[index]
        }
        else {
            return alternative instanceof Function? alternative() : alternative
        }
    }

    take(n: number): List<T> {
        if(n > 0) {
            return new List(this.array.slice(0, n))
        }
        else {
            const length = this.array.length
            const res = this.array.slice(length+n, length)
            return new List(res)
        }
    }

    filter(predicate: (item: T) => boolean): List<T> {
        const filtered = new Array(this.array.length)

        for (let index = 0; index < this.array.length; index++) {
            const item = this.array[index]

            if (predicate(item)) {
                filtered.push(item)
            }
        }

        return new List(filtered)
    }
    //endregion

    //region Concatenate lists
    concat(otherList: List<T>): List<T> {
        const thisArray = this.array
        const otherArray = otherList.toArray()

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

    //region Side-effects
    perform(sideEffect: (list: List<T>) => void) {
        sideEffect(this)
    }

    performOnEmpty(sideEffect: (list: List<T>) => void) {
        if (this.array.length > 0) {
            return
        }

        sideEffect(this)
    }

    performOnNonEmpty(sideEffect: (list: List<T>) => void) {
        if (this.array.length > 0) {
            return
        }

        sideEffect(this)
    }

    forEach(sideEffects: (item: T) => void) {
        this.array.forEach(sideEffects)
    }
    //endregion

    //region Convert list
    toArray(): T[] {
        return this.array
    }
    //endregion
}

export function list<T>(...array: T[]): List<T> {
    return new List(array)
}
