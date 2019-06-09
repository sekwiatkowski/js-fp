import {list, None, Some} from '../../src'

const chai = require('chai')

chai.should()

describe('List<T>', () => {
    interface NumberValue {
        value: Number
    }
    const createNumber = (value: number): NumberValue => ({value})

    describe('should be able to map over the items', () => {
        it('sequentially', () => {
            const increment = x => x + 1
            const result = list(1, 2, 3)
                .map(increment)
                .toArray()

            result.should.eql([1, 2, 3].map(increment))
        })

        it('in parallel', async() => {
            const result = await list(1, 2, 3)
                .parallelMap(x => x + 1)
                .getOrElse(() => {
                    throw 'Unexpected rejection!'
                })

            result.should.eql([2, 3, 4])
        })
    })

    describe('should be able to sort items', () => {
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

    describe('should be to indicate', () => {
        it('whether it is empty', () => {
            list().isNotEmpty().should.be.false
            list(1).isNotEmpty().should.be.true
        })

        it('whether it is not empty', () => {
            list().isEmpty().should.be.true
            list().isNotEmpty().should.be.false
        })
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

        it('how many items satisfy a predicate', () => {
            list().count(isEven).should.equal(0)
            list(1).count(isEven).should.equal(0)
            list(1, 2).count(isEven).should.equal(1)
            list(1, 2, 3).count(isEven).should.equal(1)
            list(1, 2, 3, 4).count(isEven).should.equal(2)
        })
    })

    describe('should return items', () => {
        it('as Some instance if they do exist', () => {
            list(1).get(0).should.be.instanceOf(Some)
            list(1, 2).get(1).should.be.instanceOf(Some)
        })

        it('and none if they do not exist', () => {
            list().get(0).should.be.instanceOf(None)
            list(1).get(1).should.be.instanceOf(None)
        })
    })

    describe('should be able to take', () => {
        const l = list(1, 2, 3)
        it('the first n items', () => {
            l.take(1).toArray().should.eql([1])
            l.take(2).toArray().should.eql([1, 2])
        })

        it('no items', () => {
            l.take(0).toArray().should.eql([])
        })

        it('the last n items', () => {
            l.take(-1).toArray().should.eql([3])
            l.take(-2).toArray().should.eql([2, 3])
        })
    })
})