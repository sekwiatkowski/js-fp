import {List, list, None, Some} from '../../src'
import {range} from '../../src/list/List'

const chai = require('chai')

chai.should()

describe('List<T>', () => {
    interface NumberValue {
        value: Number
    }
    const createNumber = (value: number): NumberValue => ({value})

    const isEven = (x: number) => x % 2 == 0

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

    describe('should safely return items', () => {
        it('as Some instance if they do exist', () => {
            list(1).get(0).should.be.instanceOf(Some)
            list(1, 2).get(1).should.be.instanceOf(Some)
        })

        it('and none if they do not exist', () => {
            list().get(0).should.be.instanceOf(None)
            list(1).get(1).should.be.instanceOf(None)
        })
    })

    describe('should return a default',  () => {
        const defaultText = "default"
        it('when an item at the provided index does not exists', () => {
            list().getOrElse(0, defaultText).should.equal(defaultText)
            list().getOrElse(0, () => defaultText).should.equal(defaultText)
        })

        it('but not when the item at the provided index exists', () => {
            const valueText = "value"
            list(valueText).getOrElse(0, defaultText).should.equal(valueText)
            list(valueText).getOrElse(0, () => defaultText).should.equal(valueText)
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

    it('should be able to filter items', () => {
        list().filter(isEven).toArray().should.eql([])
        list(1).filter(isEven).toArray().should.eql([])
        list(1, 2).filter(isEven).toArray().should.eql([2])
        list(1, 2, 3).filter(isEven).toArray().should.eql([2])
        list(1, 2, 3, 4).filter(isEven).toArray().should.eql([2, 4])
    })

    it('should be able to return the number of items', () => {
        list().size().should.equal(0)
        list(1).size().should.equal(1)
        list(1, 2).size().should.equal(2)
    })

    describe('should perform', () => {
        const sideEffectText = 'side-effect'
        const noSideEffectText = 'no side-effect'

        it('side-effects intended for the non-empty path only if the list contains, in fact, items', () => {
            let mutable = noSideEffectText

            list(1).performOnNonEmpty(() => mutable = sideEffectText)

            mutable.should.equal(sideEffectText)
        })

        it('and not if the list is empty', () => {
            let mutable = noSideEffectText

            list().performOnNonEmpty(() => mutable = sideEffectText)

            mutable.should.equal(noSideEffectText)
        })

        it('side-effects intended for the empty path only if the list is, in fact, empty', () => {
            let mutable = noSideEffectText

            list().performOnEmpty(() => mutable = sideEffectText)

            mutable.should.equal(sideEffectText)
        })

        it('and not if the list contains values', () => {
            let mutable = noSideEffectText

            list(1).performOnEmpty(() => mutable = sideEffectText)

            mutable.should.equal(noSideEffectText)
        })

        it('side-effects on intended for both paths if the list is empty', () => {
            let mutable = noSideEffectText

            list().perform(() => mutable = sideEffectText)

            mutable.should.equal(sideEffectText)
        })

        it('side-effects on intended for both paths if the list is not empty', () => {
            let mutable = noSideEffectText

            list(1).perform(() => mutable = sideEffectText)

            mutable.should.equal(sideEffectText)
        })

        it('side-effects on individual items', () => {
            function checkSize(n: number) {
                let count = 0
                range(n).forEach(() => count++)
                count.should.equal(n)
            }

            checkSize(0)
            checkSize(1)
            checkSize(2)
        })
    })

    describe('should consider another list to be', () => {
        it('equal if it contains the same items', () => {
            list().equals(list()).should.be.true
            list().equals(list(1)).should.be.false
            list(1).equals(list()).should.be.false
            list(1).equals(list(1, 2)).should.be.false
            list(1, 2).equals(list(1)).should.be.false
            list(1, 1, 2).equals(list(1, 2)).should.be.false
        })

        it('in the same sequence', () => {
            list(1, 2).equals(list(1, 2)).should.be.true
            list(1, 2).equals(list(2, 1)).should.be.false
        })

        it('and unequal if the other list is null or undefined', () => {
            list().equals(null).should.be.false
            list().equals(undefined).should.be.false
        })
    })
})

describe('range', () => {
    describe('should return a list', () => {
        it('from 0 to n-1 when called with only with the start argument', () => {
            function check(n: number, expected: List<number>) {
                range(n).equals(expected).should.be.true
            }

            check(0, list())
            check(1, list(0))
            check(2, list(0, 1))
        })

        it('from start to end-1 when called with a start argument and an end argument', () => {
            function check(start: number, end: number, expected: List<number>) {
                range(start, end).equals(expected).should.be.true
            }

            check(0, 0, list())
            check(0, 1, list(0))
            check(0, 2, list(0, 1))
            check(1, 1, list())
            check(1, 2, list(1))
            check(1, 3, list(1, 2))
        })
    })
})