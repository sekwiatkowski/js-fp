import {emptyList, inclusiveRange, list, List, listFromArray, range} from '../../src'
import {NonEmptyList} from '../../src/list/NonEmptyList'

describe('range', () => {
    describe('without an end argument should return', () => {
        function checkWithStartOnly(n: number, expected: List<number>) {
            range(n).equals(expected).should.be.true
        }

        it('a list from 0 to n+1 if the start argument is negative', () => {
            checkWithStartOnly(-1, listFromArray([0]))
            checkWithStartOnly(-2, listFromArray([0, -1]))
        })

        it('an empty list if the start argument is zero', () => {
            checkWithStartOnly(0, emptyList())
        })

        it('a list from 0 to n-1 if the start argument is positive', () => {
            checkWithStartOnly(1, listFromArray([0]))
            checkWithStartOnly(2, listFromArray([0, 1]))
        })
    })

    describe('with a defined end argument should return', () => {
        function check(start: number, end: number, expected: List<number>) {
            range(start, end).equals(expected).should.be.true
        }

        it('an empty list if the start argument is equal to the end argument', () => {
            check(0, 0, emptyList())
            check(1, 1, emptyList())
        })

        it('a list from start to end+1 when the start argument is greater than the end argument', () => {
            check(-1, -2, listFromArray([-1]))
            check(-1, -3, listFromArray([-1, -2]))
            check(0, -1, listFromArray([0]))
            check(0, -2, listFromArray([0, -1]))
            check(1, 0, listFromArray([1]))
            check(1, -1, listFromArray([1, 0]))
        })

        it('a list from start to end-1 when the start argument is smaller than the end argument', () => {
            check(-1, 0, listFromArray([-1]))
            check(-1, 1, listFromArray([-1, 0]))
            check(0, 1, listFromArray([0]))
            check(0, 2, listFromArray([0, 1]))
            check(1, 2, listFromArray([1]))
            check(1, 3, listFromArray([1, 2]))
        })
    })
})

describe('inclusiveRange', () => {
    it('without an end argument should return a list from 0 to start', () => {
        function check(n: number, expected: NonEmptyList<number>) {
            inclusiveRange(n).equals(expected).should.be.true
        }

        check(-1, list(0, -1))
        check(-2, list(0, -1, -2))
        check(0, list(0))
        check(1, list(0,1))
        check(2, list(0,1, 2))
    })

    it('with a defined end argument should returna list from start to end', () => {
        function check(start: number, end: number, expected: NonEmptyList<number>) {
            inclusiveRange(start, end).equals(expected).should.be.true
        }

        check(-1, -2, list(-1, -2))
        check(-1, -1, list(-1))
        check(-1, 0, list(-1, 0))
        check(-1, 1, list(-1, 0, 1))
        check(-1, 2, list(-1, 0, 1, 2))

        check(0, -2, list(0, -1, -2))
        check(0, -1, list(0, -1))
        check(0, 0, list(0))
        check(0, 1, list(0, 1))
        check(0, 2, list(0, 1, 2))

        check(1, -2, list(1, 0, -1, -2))
        check(1, -1, list(1, 0, -1))
        check(1, 0, list(1, 0))
        check(1, 1, list(1))
        check(1, 2, list(1, 2))

    })
})