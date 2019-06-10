import {List} from './List'

export function range<T>(start: number, end?: number): List<T> {
    if (!end) {
        end = start
        start = 0
    }

    const array = new Array(end-start)

    for (let index = 0, item = start; index < end-start; index++, item++) {
        array[index] = item
    }

    return new List(array)
}

export function rangeInclusive<T>(start: number, end?: number) {
    if (!end) {
        end = start
        start = 0
    }

    return this.range(start, end+1)
}