import {Future, List, none, option, Option, some} from '..'
import {NonEmptyList} from './NonEmptyList'
import {fulfilled} from '../future/Fulfilled'
import {rejected} from '../future/Rejected'
import {Settled} from '../future/Settled'
import {Ordering} from '../order/Order'

//region Access
export function getItem<T>(items: T[], index: number): Option<T> {
    return option(items[index])
}

export function getItemOrElse<T>(items: T[], index: number, alternative: T|(() => T)): T {
    if (items.length > index) {
        return items[index]
    }
    else {
        return alternative instanceof Function? alternative() : alternative
    }
}

export function takeItems<T>(items: T[], n: number): T[] {
    if(n > 0) {
        return items.slice(0, n)
    }
    else {
        const length = items.length
        return items.slice(length+n, length)
    }
}
//endregion

//region Chaining
export function flatten<U>(items: (NonEmptyList<U>|List<U>|U[])[]): U[] {
    let size = 0
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const item = items[itemIndex]
        if (item instanceof Array) {
            size += item.length
        } else {
            size += item.size()
        }
    }

    const flattened = new Array<U>(size)

    let flattenedIndex = 0
    for(let listIndex = 0; listIndex < items.length; listIndex++) {
        items[listIndex].forEach(item => {
            flattened[flattenedIndex++] = item
        })
    }

    return flattened
}
//endregion

//region Expansion
export function appendItem<T>(items: T[], item: T): T[] {
    return [...items, item]
}

export function prependItem<T>(items: T[], item: T): T[] {
    return [item, ...items]
}
//endregion

//region Filtering
export function filterItems<T>(items: T[], predicate: (item: T) => boolean) {
    return items.filter(predicate)
}
//endregion

//region Reduction
export function reduceItemsBy<T, U>(
    items: T[],
    by: (item: T) => U,
    operation: (a: U) => (b: U) => U) {
    let accumulator = by(items[0])
    for(let i = 1; i < items.length; i++) {
        accumulator = operation(accumulator)(by(items[i]))
    }
    return accumulator
}

export function foldItemsBy<T, U>(
    items: T[],
    by: (item: T) => U,
    operation: (a: U) => (b: U) => U,
    initialValue: U) {
    let accumulator = initialValue
    for(let i = 0; i < items.length; i++) {
        accumulator = operation(accumulator)(by(items[i]))
    }
    return accumulator
}
//endregion

//region Grouping
export function groupItemsBy<T>(items: T[], computeKey: (item: T) => string): { [id: string]: T[] } {
    let dictionary:{ [id: string]: T[] } = {}
    for(let i = 0; i < items.length; i++) {
        const item = items[i]
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
export function mapItems<T, U>(items: T[], f: (T) => U): U[] {
    return items.map(f)
}

export function parallelMapItems<T, U, E>(items: T[], f: (item: T) => U): Future<U[], E> {
    return new Future(() => new Promise<Settled<U[], E>>(resolve => {
        const promises = items.map(x =>
            new Promise<U>(resolve =>
                resolve(f(x))
            )
        )

        return Promise.all(promises)
            .then(mappedItems => resolve(fulfilled(mappedItems)))
            .catch(error => resolve(rejected(error)))
    }))
}
//endregion

//region Construction
export function rangeOfItems(start: number, end?: number): number[] {
    if (start == 0 && end == null || start === end) {
        return []
    }

    function sanitize(start: number, end?: number): { sanitizedStart: number; sanitizedEnd: number } {
        // end is not specified
        if (end == null) {
            return { sanitizedStart: 0, sanitizedEnd: start }
        }
        // end is specified
        else {
            return { sanitizedStart: start, sanitizedEnd: end }
        }
    }

    function configure(start: number, end: number): { size: number; step: number } {
        if (start > end) {
            // Ex.: start: 2, end: 0
            //      size: 2, step: -1
            // Ex.: start: -3, end: -6
            //      size: 3, step: -1
            // Ex.: start: 0, end: -1
            //      size: 1, step: -1
            return { size: Math.abs(start - end), step: -1 }
        }
        else {
            // Ex.: start: 0, end: 1
            //      size: 1, step: 1
            // Ex.: start: -3, end: -6
            //      size: 3, step: -1
            return { size: Math.abs(end - start), step: 1 }
        }
    }

    const { sanitizedStart, sanitizedEnd } = sanitize(start, end)

    const { size, step } = configure(sanitizedStart, sanitizedEnd)

    const range = new Array<number>(size)
    for (let index = 0, item = sanitizedStart; index < size; index++, item += step) {
        range[index] = item
    }

    return range
}

export function repeatItems<T>(times: number, valueOrFunction: T|((index?: number) => T)): T[] {
    const items = new Array<T>(times)
    if (valueOrFunction instanceof Function) {
        for (let index = 0; index < times; index++) {
            items[index] = valueOrFunction(index)
        }
    }
    else {
        for (let index = 0; index < times; index++) {
            items[index] = valueOrFunction
        }
    }
    return items
}
//endregion

//region Search
export function findItem<T>(items: T[], predicate: (item: T) => boolean): Option<T>{
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (predicate(item)) {
            return some(item)
        }
    }

    return none
}

export function findLastItem<T>(items: T[], predicate: (item: T) => boolean): Option<T> {
    for (let index = items.length - 1; index >= 0; index--) {
        const item = items[index]
        if (predicate(item)) {
            return some(item)
        }
    }

    return none
}
//endregion

//region Side-effects
export function forEachItem<T>(items: T[], sideEffect: (item: T) => void) {
    items.forEach(sideEffect)
}
//endregion

//region Sorting
export function sortItems<T>(items: T[], compare: (x: T, y: T) => Ordering): T[] {
    return items.sort(compare)
}

export function sortItemsBy<T, U>(items: T[], by: (item: T) => U, compare: (x: U, y: U) => Ordering): T[] {
    return items.sort((a, b) => compare(by(a), by(b)))
}
//endregion

//region Testing
export function containsItem<T>(items: T[], item: T) {
    for (let i = 0; i < items.length; i++) {
        if (items[i] === item) {
            return true
        }
    }
    return false
}

export function equalItems<T>(thisArray: T[], thatArray: T[]) {
    const thisLength = thisArray.length

    if (thisLength !== thatArray.length) {
        return false
    }

    for (let i = 0; i < thisLength; i++) {
        if (thisArray[i] !== thatArray[i]) {
            return false
        }
    }

    return true
}

export function allItems<T>(items: T[], predicate: (item: T) => boolean): boolean {
    for (let index = 0; index < items.length; index++) {
        if (!predicate(items[index])) {
            return false
        }
    }

    return true
}

export function someItem<T>(items: T[], predicate: (item: T) => boolean): boolean {
    for (let index = 0; index < items.length; index++) {
        if (predicate(items[index])) {
            return true
        }
    }

    return false
}

export function noItems<T>(items: T[], predicate: (item: T) => boolean): boolean {
    return !someItem(items, predicate)
}

export function countItems<T>(items: T[], predicate: (item: T) => boolean): number {
    let count = 0
    for (let index = 0; index < items.length; index++) {
        if (predicate(items[index])) {
            count += 1
        }
    }
    return count
}
//endregion