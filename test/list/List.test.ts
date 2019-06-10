import {emptyList, list, none, None, range, repeat, some, Some} from '../../src'

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
            emptyList().isNotEmpty().should.be.false
            list(1).isNotEmpty().should.be.true
        })

        it('whether it is not empty', () => {
            emptyList().isEmpty().should.be.true
            emptyList().isNotEmpty().should.be.false
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
            emptyList().all(isEven).should.be.true
            list(1).all(isEven).should.be.false
            list(1, 2).all(isEven).should.be.false
            list(2).all(isEven).should.be.true
            list(2, 4).all(isEven).should.be.true
        })

        it('if at least one items satisfy a predicate', () => {
            emptyList().some(isEven).should.be.false
            list(1).some(isEven).should.be.false
            list(1, 2).some(isEven).should.be.true
            list(1, 2, 3).some(isEven).should.be.true
            list(2, 4).some(isEven).should.be.true
        })

        it('if no items satisfy a predicate', () => {
            emptyList().none(isEven).should.be.true
            list(1).none(isEven).should.be.true
            list(1, 2).none(isEven).should.be.false
            list(1, 2, 3).none(isEven).should.be.false
            list(2, 4).none(isEven).should.be.false
        })

        it('how many items satisfy a predicate', () => {
            emptyList().count(isEven).should.equal(0)
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
            emptyList().get(0).should.be.instanceOf(None)
            list(1).get(1).should.be.instanceOf(None)
        })
    })

    describe('should return a default',  () => {
        const defaultText = "default"
        it('when an item at the provided index does not exists', () => {
            emptyList().getOrElse(0, defaultText).should.equal(defaultText)
            emptyList().getOrElse(0, () => defaultText).should.equal(defaultText)
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
        emptyList().filter(isEven).toArray().should.eql([])
        list(1).filter(isEven).toArray().should.eql([])
        list(1, 2).filter(isEven).toArray().should.eql([2])
        list(1, 2, 3).filter(isEven).toArray().should.eql([2])
        list(1, 2, 3, 4).filter(isEven).toArray().should.eql([2, 4])
    })

    it('should be able to return the number of items', () => {
        emptyList().size().should.equal(0)
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

            emptyList().performOnNonEmpty(() => mutable = sideEffectText)

            mutable.should.equal(noSideEffectText)
        })

        it('side-effects intended for the empty path only if the list is, in fact, empty', () => {
            let mutable = noSideEffectText

            emptyList().performOnEmpty(() => mutable = sideEffectText)

            mutable.should.equal(sideEffectText)
        })

        it('and not if the list contains values', () => {
            let mutable = noSideEffectText

            list(1).performOnEmpty(() => mutable = sideEffectText)

            mutable.should.equal(noSideEffectText)
        })

        it('side-effects on intended for both paths if the list is empty', () => {
            let mutable = noSideEffectText

            emptyList().perform(() => mutable = sideEffectText)

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
            emptyList().equals(emptyList()).should.be.true
            emptyList().equals(list(1)).should.be.false
            list(1).equals(emptyList()).should.be.false
            list(1).equals(list(1, 2)).should.be.false
            list(1, 2).equals(list(1)).should.be.false
            list(1, 1, 2).equals(list(1, 2)).should.be.false
        })

        it('in the same sequence', () => {
            list(1, 2).equals(list(1, 2)).should.be.true
            list(1, 2).equals(list(2, 1)).should.be.false
        })

        it('and unequal if the other list is null or undefined', () => {
            emptyList().equals(null).should.be.false
            emptyList().equals(undefined).should.be.false
        })
    })

    describe('should flatten', () => {
        it('arrays of the same size', () => {
            list([1, 2], [3, 4]).flatten().equals(list(1, 2, 3, 4))
        })

        it('lists of the same size', () => {
            list(list(1, 2), list(3, 4)).flatten().equals(list(1, 2, 3, 4))
        })

        it('arrays of the different sizes', () => {
            list([1, 2], [3, 4, 5]).flatten().equals(list(1, 2, 3, 4, 5))
        })

        it('lists of different sizes', () => {
            list(list(1, 2), list(3, 4, 5)).flatten().equals(list(1, 2, 3, 4, 5))
        })

        it('two empty arrays by returning an empty list', () => {
            list([], []).equals(emptyList())
        })

        it('two empty lists by returning another empty list', () => {
            list(emptyList(), emptyList()).equals(emptyList())
        })
    })

    describe('should return the first item', () => {
        it('as none', () => {
            it('if the list is empty', () => {
                emptyList().first().should.equal(none)
            })

            it('if the predicate does not match any items', () => {
                emptyList().first(isEven).equals(none).should.be.true
                list(1).first(isEven).equals(none).should.be.true
            })
        })

        it('as an instance of Some', () => {
            it('if the list is not empty', () => {
                list(1, 2).first().equals(some(1)).should.be.true
            })

            it('if the predicate matches an item', () => {
                list(1, 2, 3, 4).first(isEven).equals(some(2)).should.be.true
            })
        })
    })

    describe('should return the last item', () => {
        it('as none', () => {
            it('if the list is empty', () => {
                emptyList().last().should.equal(none)
            })

            it('if the predicate does not match any items', () => {
                emptyList().last(isEven).equals(none).should.be.true
                list(1).last(isEven).equals(none).should.be.true
            })
        })

        it('as an instance of Some', () => {
            it('if the list is not empty', () => {
                list(1, 2).last().equals(some(2)).should.be.true
            })

            it('if the predicate matches an item', () => {
                list(1, 2, 3, 4).last(isEven).equals(some(4)).should.be.true
            })
        })
    })

    describe('should add an item', () => {
        it('to the end', () => {
            list(1).append(2).equals(list(1, 2)).should.be.true
        })

        it('to the start', () => {
            list(1).prepend(2).equals(list(2, 1)).should.be.true
        })
    })
})

describe('should repeat', () => {
    const value = 'value'

    it('the same value n times', () => {
        repeat(0, value).equals(emptyList()).should.be.true
        repeat(1, value).equals(list(value)).should.be.true
        repeat(2, value).equals(list(value, value)).should.be.true
    })

    it('a computation n times, each time with a different index', () => {
        const f = index => index
        repeat(0, f).equals(emptyList()).should.be.true
        repeat(1, f).equals(list(0)).should.be.true
        repeat(2, f).equals(list(0, 1)).should.be.true
    })

    it('the result of a single computation n times', () => {
        let counter = 0
        const f = () => {
            counter++
            return value
        }
        repeat(0, f).equals(emptyList()).should.be.true
        repeat(1, f).equals(list(value)).should.be.true
        repeat(2, f).equals(list(value, value)).should.be.true
        counter.should.equal(3)
    })
})