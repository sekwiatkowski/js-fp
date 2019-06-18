import {
    BooleanEquality,
    DateEquality,
    Equivalence,
    list,
    NonEmptyList,
    NullableBooleanEquality,
    NullableDateEquality,
    NullableNumberEquality,
    NullableStringEquality,
    NumberEquality,
    StringEquality
} from '../../src'

const chai = require('chai')
chai.should()

export function expectFromTests<T>(equivalences: NonEmptyList<Equivalence<T>>) {
    const test = (x: T, y: T) => equivalences
        .all(equivalence => equivalence.test(x, y))

    return {
        expectTrue: (x: T, y: T) => test(x, y).should.be.true,
        expectFalse: (x: T, y: T) => test(x, y).should.be.false
    }
}

describe('Equality and nullable equality return false', () => {
    const all = list<Equivalence<any>>(
        StringEquality, NumberEquality, BooleanEquality, DateEquality,
        NullableStringEquality, NullableNumberEquality, NullableBooleanEquality, NullableDateEquality)

    const { expectFalse } = expectFromTests(all)

    it('if both arguments are undefined', () => {
        expectFalse(undefined, undefined)
    })

    it('if null and undefined are tested', () => {
        expectFalse(null, undefined)
        expectFalse(undefined, null)
    })
})

describe('Equalities for basic types', () => {
    const equalities = list<Equivalence<any>>(
        StringEquality, NumberEquality, BooleanEquality, DateEquality)

    const { expectFalse } = expectFromTests(equalities)

    it('return false if both arguments are null', () => {
        expectFalse(null, null)
    })
})

describe('Nullable equality for basic types', () => {
    const nullableEqualities = list<Equivalence<any>>(
        NullableStringEquality, NullableNumberEquality, NullableBooleanEquality, NullableDateEquality)

    const { expectTrue } = expectFromTests(nullableEqualities)

    it('return true if both arguments are null', () => {
        expectTrue(null, null)
    })
})

describe('StringEquality and NullableStringEquality', () => {
    const equalities = list(StringEquality, NullableStringEquality)
    const { expectFalse, expectTrue } = expectFromTests(equalities)

    const text = 'text'
    const sameText = 'text'
    const otherText = 'other'

    it('return true if and only if two strings identical in value are tested', () => {
        expectTrue(text, sameText)
        expectTrue(sameText, text)

        expectFalse(text, otherText)
        expectFalse(otherText, text)
    })

    describe('return false', () => {
        it('if a string and null are tested', () => {
            expectFalse(text, null)
            expectFalse(null, text)
        })

        it('if a string and undefined are tested', () => {
            expectFalse(text, undefined)
            expectFalse(undefined, text)
        })
    })
})

describe('NumberEquality and NullableNumberEquality', () => {
    const equalities = list(NumberEquality, NullableNumberEquality)
    const { expectFalse, expectTrue } = expectFromTests(equalities)

    const number = 1
    const sameNumber = 1
    const otherNumber = 0

    it('return true if and only if two strings identical in value are tested', () => {
        expectTrue(number, sameNumber)
        expectTrue(sameNumber, number)

        expectFalse(number, otherNumber)
        expectFalse(otherNumber, number)
    })

    describe('return false', () => {
        it('if a number and null are tested', () => {
            expectFalse(number, null)
            expectFalse(null, number)
        })

        it('if a number and undefined are tested', () => {
            expectFalse(number, undefined)
            expectFalse(undefined, number)
        })
    })
})

describe('BooleanEquality and NullableBooleanEquality', () => {
    const equalities = list(BooleanEquality, NullableBooleanEquality)
    const { expectFalse, expectTrue } = expectFromTests(equalities)

    it('should return true if and only if two booleans in value are tested', () => {
        expectTrue(true, true)
        expectTrue(false, false)
        expectFalse(true, false)
        expectFalse(false, true)
    })

    describe('return false', () => {
        it('if a boolean and null are tested', () => {
            expectFalse(true, null)
            expectFalse(false, null)
            expectFalse(null, true)
            expectFalse(null, false)
        })

        it('if a boolean and undefined are tested', () => {
            expectFalse(true, undefined)
            expectFalse(undefined, true)
            expectFalse(false, undefined)
            expectFalse(undefined, false)
        })
    })
})

describe('DateEquality and NullableDateEquality', () => {
    const equalities = list(DateEquality, NullableDateEquality)
    const { expectFalse, expectTrue } = expectFromTests(equalities)

    const date = new Date(2019, 0, 1)
    const sameDate = new Date(2019, 0, 1)
    const differentDate = new Date(2019, 0, 2)

    it('return true if and only if two dates identical in value are tested', () => {
        expectTrue(date, sameDate)
        expectTrue(sameDate, date)
        expectFalse(date, differentDate)
        expectFalse(differentDate, date)
    })

    describe('return false', () => {
        it('if a date and null are tested', () => {
            expectFalse(date, null)
            expectFalse(null, date)
        })

        it('if a date and null are tested', () => {
            expectFalse(date, undefined)
            expectFalse(undefined, date)
        })
    })
})