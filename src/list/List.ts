import {Future} from '..'
import {fulfilled} from '../future/Fulfilled'
import {Settled} from '../future/Settled'
import {rejected} from '../future/Rejected'

const compare = (a: any, b: any) => {
    const aIsNull = a === null
    const bIsNull = b === null

    if (aIsNull) {
        if (bIsNull) {
            return 0
        }
        else if (typeof b  === 'undefined') {
            return -1
        }
        else {
            return 1
        }
    }
    else if (typeof a === 'undefined') {
        if (bIsNull) {
            return 1
        }
        else if (typeof b === 'undefined') {
            return 0
        }
        else {
            return 1
        }
    }
    // a is neither null nor undefined
    else if (bIsNull || typeof b === 'undefined') {
        return -1
    }
    else {
        return a < b ? -1 : (a > b ? 1 : 0)
    }
}
const negatedCompare = (a, b) => -compare(a, b)

const compareBy = (a: any, b: any, f: (value: any) => any) => compare(f(a), f(b))

const negatedCompareBy = (a: any, b: any, f: (value: any) => any) => -compareBy(a, b, f)

export class List<T> {
    constructor(private readonly array: T[]) {}

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

    size(): number {
        return this.array.length
    }

    isEmpty(): boolean {
        return this.array.length === 0
    }

    isNotEmpty(): boolean {
        return this.array.length > 0
    }

    toArray(): T[] {
        return this.array
    }

    concat(otherList: List<T>) {
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
}

export function list<T>(...array: T[]): List<T> {
    return new List(array)
}
