import {list} from '../../src/list/List'

const chai = require('chai')

chai.should()

describe('List<T>', () => {

    interface Number {
        value: 1
    }

    const createNumber = (value: number) => ({value})

    it('should be able to map over the values', async() => {
        const increment = x => x + 1
        const result = list(1, 2, 3)
            .map(increment)
            .toArray()

        result.should.eql([1, 2, 3].map(increment))
    })

    it('should be able to sort values', async() => {
        const result = list(3, 1, 2)
            .sort()
            .toArray()

        result.should.eql([1, 2, 3])
    })

    it('should be able to sort values by a provided map', async() => {
        const result = list(createNumber(3), createNumber(1), createNumber(2))
            .sortBy(x => x.value)
            .map(x => x.value)
            .toArray()

        result.should.eql([1, 2, 3])
    })

    it('should be able to sort values descendingly', async() => {
        const result = list(3, 2, 1)
            .sortDescendingly()
            .toArray()

        result.should.eql([3, 2, 1])
    })

    it('should be able to sort values descendingly by a provided map', async() => {
        const result = list(createNumber(3), createNumber(1), createNumber(2))
            .sortDescendinglyBy(x => x.value)
            .map(x => x.value)
            .toArray()

        result.should.eql([3, 2, 1])
    })

    it('should be convertible to a Future<T[], E> instance', async() => {
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

})