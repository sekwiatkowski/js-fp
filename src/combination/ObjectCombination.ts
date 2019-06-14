import {Semigroup} from './Semigroup'

export const objectCombination = <T extends { [key: string]: any }>(semigroups: { [K in keyof T]: Semigroup<T[K]> }): Semigroup<T> => (
    {
        combine: (a: T) => (b: T) => {
            return Object.keys(semigroups).reduce((combinedObject, key) => {

                combinedObject[key] = semigroups[key].combine(a[key])(b[key])
                return combinedObject

            }, {}) as T
        }
    })