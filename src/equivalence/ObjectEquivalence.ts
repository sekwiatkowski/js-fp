import {equivalence, Equivalence} from './Equivalence'

export const objectEquivalence = <T extends { [key: string]: any }>(equivalences: { [K in keyof T]?: Partial<Equivalence<T[K]>> }): Equivalence<T> =>
    equivalence((x: T, y: T) => {

        for (const [key, memberEquivalence] of Object.entries(equivalences)) {
            const xMember = x[key]
            const yMember = y[key]
            if (!memberEquivalence.test(xMember, yMember)) {
                return false
            }
        }

        return true
    })