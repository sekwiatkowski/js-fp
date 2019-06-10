import {List} from './List'

export function repeat<T>(times: number, valueOrFunction: T|((index?: number) => T)): List<T> {
    const array = new Array(times)
    if (valueOrFunction instanceof Function) {
        for (let index = 0; index < times; index++) {
            array[index] = valueOrFunction(index)
        }
    }
    else {
        for (let index = 0; index < times; index++) {
            array[index] = valueOrFunction
        }
    }
    return new List(array)
}