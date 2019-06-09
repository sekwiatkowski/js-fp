import {list} from '../../src'

const chai = require('chai')

chai.should()

describe('List<T>', () => {
    const createNumber = (value: number) => ({value})

    it('should be able to map over the values', () => {
        const increment = x => x + 1
        const result = list(1, 2, 3)
            .map(increment)
            .toArray()

        result.should.eql([1, 2, 3].map(increment))
    })

    describe('should be able to sort values', () => {
        it('ascendingly', () => {
            const result = list(3, 1, 2)
                .sort()
                .toArray()

            result.should.eql([1, 2, 3])
        })

        it('descendingly', () => {
            const result = list(3, 2, 1)
                .sortDescendingly()
                .toArray()

            result.should.eql([3, 2, 1])
        })

        it('ascendingly by a provided map', () => {
            const result = list(createNumber(3), createNumber(1), createNumber(2))
                .sortBy(x => x.value)
                .map(x => x.value)
                .toArray()

            result.should.eql([1, 2, 3])
        })

        it('descendingly by a provided map', () => {
            const result = list(createNumber(3), createNumber(1), createNumber(2))
                .sortDescendinglyBy(x => x.value)
                .map(x => x.value)
                .toArray()

            result.should.eql([3, 2, 1])
        })
    })

    it('should convert a Future<T[], E> instance', async() => {
        const result = await list(1, 2, 3)
            .parallelMap(x => x + 1)
            .getOrElse(() => {throw 'Unexpected rejection!'})

        result.should.eql([2, 3, 4])
    })

    it('should be able to indicate whether it is empty', () => {
        const empty = list()
        empty.isEmpty().should.be.true
        empty.isNotEmpty().should.be.false

        const nonEmpty = list(1)
        nonEmpty.isEmpty().should.be.false
        nonEmpty.isNotEmpty().should.be.true
    })

    describe('should concatenate with another list', () => {
        it('when the first list is larger than the second', () => {
            list(1, 2, 3).concat(list(4, 5)).toArray().should.eql([1, 2, 3, 4, 5])
        })

        it('when both lists are of equal size', () => {
            list(1, 2).concat(list(3, 4)).toArray().should.eql([1, 2, 3, 4])
        })

        it('when the second list is larger than the first', () => {
            list(1, 2).concat(list(3, 4, 5)).toArray().should.eql([1, 2, 3, 4, 5])
        })
    })

    describe('should be able to test', () => {
        const isEven = (x: number) => x % 2 == 0

        it('if all items satisfy a predicate', () => {
            list().all(isEven).should.be.true
            list(1).all(isEven).should.be.false
            list(1, 2).all(isEven).should.be.false
            list(2).all(isEven).should.be.true
            list(2, 4).all(isEven).should.be.true
        })

        it('if at least one items satisfy a predicate', () => {
            list().some(isEven).should.be.false
            list(1).some(isEven).should.be.false
            list(1, 2).some(isEven).should.be.true
            list(1, 2, 3).some(isEven).should.be.true
            list(2, 4).some(isEven).should.be.true
        })

        it('if no items satisfy a predicate', () => {
            list().none(isEven).should.be.true
            list(1).none(isEven).should.be.true
            list(1, 2).none(isEven).should.be.false
            list(1, 2, 3).none(isEven).should.be.false
            list(2, 4).none(isEven).should.be.false
        })
    })
})