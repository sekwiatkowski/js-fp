import {
    BooleanArrayEquality,
    DateArrayEquality,
    Equivalence,
    list,
    NullableBooleanArrayEquality,
    NullableDateArrayEquality,
    NullableNumberArrayEquality,
    NullableStringArrayEquality,
    NumberArrayEquality,
    StringArrayEquality
} from '../../src'
import {expectFromTests} from '../equivalence/Equality.test'

require('chai').should()

describe('Equalities and nullable equalities for arrays of basic types', () => {
    const equalities = list<Equivalence<any[]>>(
        StringArrayEquality, NumberArrayEquality, BooleanArrayEquality, DateArrayEquality,
        NullableStringArrayEquality, NullableNumberArrayEquality, NullableBooleanArrayEquality, NullableDateArrayEquality)

    const { expectFalse, expectTrue } = expectFromTests(equalities)

    it('return true if both arrays are empty', () => {
        expectTrue([], [])
    })

    describe('return false', () => {
        it('if both arguments are undefined', () => {
            expectFalse(undefined, undefined)
        })

        it('if null and undefined are tested', () => {
            expectFalse(null, undefined)
            expectFalse(undefined, null)
        })
    })
})

describe('Equalities for arrays of basic types', () => {
    const equalities = list<Equivalence<any[]>>(
        StringArrayEquality,
        NumberArrayEquality,
        BooleanArrayEquality,
        DateArrayEquality)
    const { expectFalse } = expectFromTests(equalities)

    it('return false if both arrays are null', () => {
        expectFalse(null, null)
    })
})

describe('Nullable equality for basic types', () => {
    const equalities = list<Equivalence<any>>(
        NullableStringArrayEquality,
        NullableNumberArrayEquality,
        NullableBooleanArrayEquality,
        NullableDateArrayEquality)
    const { expectTrue } = expectFromTests(equalities)

    it('return true if both arrays are null', () => {
        expectTrue(null, null)
    })
})

describe('StringArrayEquality and NullableStringArrayEquality', () => {
    const equalities = list(StringArrayEquality, NullableStringArrayEquality)
    const { expectFalse, expectTrue } = expectFromTests(equalities)

    it('return true if all items are the same and in identical order', () => {
        expectTrue(['A'], ['A'])
        expectTrue(['A', 'B'], ['A', 'B'])
    })

    describe('return false', () => {
        it('if the items are not identical', () => {
            expectFalse(['A'], ['B'])
            expectFalse(['A', 'B'], ['C', 'D'])
        })

        it('if the items are the same, but in different orders', () => {
            expectFalse(['A', 'B'], ['B', 'A'])
            expectFalse(['A', 'B', 'C'], ['C', 'B', 'A'])
        })
    })
})

describe('NumberArrayEquality and NullableNumberArrayEquality', () => {
    const equalities = list(NumberArrayEquality, NullableNumberArrayEquality)
    const { expectFalse, expectTrue } = expectFromTests(equalities)

    it('return true if all items are the same and in identical order', () => {
        expectTrue([1], [1])
        expectTrue([1, 2], [1, 2])
    })

    describe('return false', () => {
        it('if the items are not identical', () => {
            expectFalse([1], [2])
            expectFalse([1, 2], [3, 4])
        })

        it('if the items are the same, but in different orders', () => {
            expectFalse([1, 2], [2, 1])
            expectFalse([1, 2, 3], [3, 2, 1])
        })
    })
})

describe('BooleanArrayEquality and NullableBooleanArrayEquality', () => {
    const equalities = list(BooleanArrayEquality, NullableBooleanArrayEquality)
    const { expectFalse, expectTrue } = expectFromTests(equalities)

    it('return true if all items are the same and in identical order', () => {
        expectTrue([true], [true])
        expectTrue([false], [false])
        expectTrue([true, false], [true, false])
        expectTrue([false, true], [false, true])
        expectTrue([true, true], [true, true])
        expectTrue([false, false], [false, false])
    })

    describe('return false', () => {
        it('if the items are not identical', () => {
            expectFalse([true], [false])
            expectFalse([true, false], [false, true])
        })

        it('if the items are the same, but in different orders', () => {
            expectFalse([true, false], [false, true])
            expectFalse([true, true, false], [false, true, true])
        })
    })
})

describe('DateArrayEquality and NullableDateArrayEquality', () => {
    const equalities = list(DateArrayEquality, NullableDateArrayEquality)
    const { expectFalse, expectTrue } = expectFromTests(equalities)

    const first = new Date(2019, 0, 1)
    const second = new Date(2019, 0, 2)
    const third = new Date(2019, 0, 3)
    const fourth = new Date(2019, 0, 4)


    it('return true if all items are the same and in identical order', () => {
        expectTrue([first], [first])
        expectTrue([second], [second])
        expectTrue([first, second], [first, second])
        expectTrue([second, first], [second, first])
    })

    describe('return false', () => {
        it('if the items are not identical', () => {
            expectFalse([first], [second])
            expectFalse([first, second], [third, fourth])
        })

        it('if the items are the same, but in different orders', () => {
            expectFalse([first, second], [second, first])
            expectFalse([first, second, third], [third, second, first])
        })
    })
})