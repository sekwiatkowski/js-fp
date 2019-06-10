import {emptyList, list, List, range, rangeInclusive} from '../../src'

describe('range', () => {
    describe('should return a list', () => {
        it('from 0 to n-1 when called with only with the start argument', () => {
            function check(n: number, expected: List<number>) {
                range(n).equals(expected).should.be.true
            }

            check(0, emptyList())
            check(1, list(0))
            check(2, list(0, 1))
        })

        it('from start to end-1 when called with a start argument and an end argument', () => {
            function check(start: number, end: number, expected: List<number>) {
                range(start, end).equals(expected).should.be.true
            }

            check(0, 0, emptyList())
            check(0, 1, list(0))
            check(0, 2, list(0, 1))
            check(1, 1, emptyList())
            check(1, 2, list(1))
            check(1, 3, list(1, 2))
        })
    })
})

describe('rangeInclusive', () => {
    describe('should return a list', () => {
        it('from 0 to n when called with only with the start argument', () => {
            function check(n: number, expected: List<number>) {
                rangeInclusive(n).equals(expected).should.be.true
            }

            check(0, list(0))
            check(1, list(0, 1))
            check(2, list(0, 1, 2))
        })

        it('from start to end when called with a start argument and an end argument', () => {
            function check(start: number, end: number, expected: List<number>) {
                rangeInclusive(start, end).equals(expected).should.be.true
            }

            check(0, 0, list(0))
            check(0, 1, list(0, 1))
            check(0, 2, list(0, 1, 2))
            check(1, 1, list(1))
            check(1, 2, list(1, 2))
            check(1, 3, list(1, 2, 3))
        })
    })
})