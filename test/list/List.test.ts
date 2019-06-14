import {emptyList, list, listFromArray, none, None, Option, range, some, Some} from '../../src'

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
            const result = listFromArray([1, 2, 3])
                .map(increment)
                .getArray()

            result.should.eql([1, 2, 3].map(increment))
        })

        it('in parallel', async() => {
            const result = await listFromArray([1, 2, 3])
                .parallelMap(x => x + 1)
                .getOrElse(() => {
                    throw 'Unexpected rejection!'
                })

            result.should.eql([2, 3, 4])
        })
    })

    describe('should be able to sort items', () => {
        it('ascendingly', () => {
            const result = listFromArray([3, 1, 2])
                .sort()
                .getArray()

            result.should.eql([1, 2, 3])
        })

        it('descendingly', () => {
            const result = listFromArray([3, 2, 1])
                .sortDescendingly()
                .getArray()

            result.should.eql([3, 2, 1])
        })

        it('ascendingly by a provided map', () => {
            const result = listFromArray([createNumber(3), createNumber(1), createNumber(2)])
                .sortBy(x => x.value)
                .map(x => x.value)
                .getArray()

            result.should.eql([1, 2, 3])
        })

        it('descendingly by a provided map', () => {
            const result = listFromArray([createNumber(3), createNumber(1), createNumber(2)])
                .sortDescendinglyBy(x => x.value)
                .map(x => x.value)
                .getArray()

            result.should.eql([3, 2, 1])
        })
    })

    describe('should concatenate with another list', () => {
        it('when the first list is larger than the second', () => {
            listFromArray([1, 2, 3]).concat(listFromArray([4, 5])).getArray().should.eql([1, 2, 3, 4, 5])
        })

        it('when both lists are of equal size', () => {
            listFromArray([1, 2]).concat(listFromArray([3, 4])).getArray().should.eql([1, 2, 3, 4])
        })

        it('when the second list is larger than the first', () => {
            listFromArray([1, 2]).concat(listFromArray([3, 4, 5])).getArray().should.eql([1, 2, 3, 4, 5])
        })
    })

    describe('should be able to test', () => {
        it('if all items satisfy a predicate', () => {
            emptyList().all(isEven).should.be.true
            listFromArray([1]).all(isEven).should.be.false
            listFromArray([1, 2]).all(isEven).should.be.false
            listFromArray([2]).all(isEven).should.be.true
            listFromArray([2, 4]).all(isEven).should.be.true
        })

        it('if at least one items satisfy a predicate', () => {
            emptyList().some(isEven).should.be.false
            listFromArray([1]).some(isEven).should.be.false
            listFromArray([1, 2]).some(isEven).should.be.true
            listFromArray([1, 2, 3]).some(isEven).should.be.true
            listFromArray([2, 4]).some(isEven).should.be.true
        })

        it('if no items satisfy a predicate', () => {
            emptyList().none(isEven).should.be.true
            listFromArray([1]).none(isEven).should.be.true
            listFromArray([1, 2]).none(isEven).should.be.false
            listFromArray([1, 2, 3]).none(isEven).should.be.false
            listFromArray([2, 4]).none(isEven).should.be.false
        })

        it('how many items satisfy a predicate', () => {
            emptyList().count(isEven).should.equal(0)
            listFromArray([1]).count(isEven).should.equal(0)
            listFromArray([1, 2]).count(isEven).should.equal(1)
            listFromArray([1, 2, 3]).count(isEven).should.equal(1)
            listFromArray([1, 2, 3, 4]).count(isEven).should.equal(2)
        })

        it('for the presence of an item', () => {
            emptyList().contains("A").should.be.false
            emptyList().contains(1).should.be.false
            listFromArray([1]).contains(1).should.be.true
            listFromArray([2]).contains(1).should.be.false
            listFromArray([1, 2]).contains(1).should.be.true
            listFromArray(["A"]).contains("A").should.be.true
            listFromArray(["B"]).contains("A").should.be.false
            listFromArray(["A", "B"]).contains("A").should.be.true
        })
    })

    describe('should safely return items', () => {
        it('as Some instance if they do exist', () => {
            listFromArray([1]).get(0).should.be.instanceOf(Some)
            listFromArray([1, 2]).get(1).should.be.instanceOf(Some)
        })

        it('and none if they do not exist', () => {
            emptyList().get(0).should.be.instanceOf(None)
            listFromArray([1]).get(1).should.be.instanceOf(None)
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
            listFromArray([valueText]).getOrElse(0, defaultText).should.equal(valueText)
            listFromArray([valueText]).getOrElse(0, () => defaultText).should.equal(valueText)
        })
    })

    describe('should be able to take', () => {
        const l = listFromArray([1, 2, 3])
        it('the first n items', () => {
            l.take(1).getArray().should.eql([1])
            l.take(2).getArray().should.eql([1, 2])
        })

        it('no items', () => {
            l.take(0).getArray().should.eql([])
        })

        it('the last n items', () => {
            l.take(-1).getArray().should.eql([3])
            l.take(-2).getArray().should.eql([2, 3])
        })
    })

    it('should be able to filter items', () => {
        emptyList().filter(isEven).getArray().should.eql([])
        listFromArray([1]).filter(isEven).getArray().should.eql([])
        listFromArray([1, 2]).filter(isEven).getArray().should.eql([2])
        listFromArray([1, 2, 3]).filter(isEven).getArray().should.eql([2])
        listFromArray([1, 2, 3, 4]).filter(isEven).getArray().should.eql([2, 4])
    })

    it('should be able to return the number of items', () => {
        emptyList().size().should.equal(0)
        listFromArray([1]).size().should.equal(1)
        listFromArray([1, 2]).size().should.equal(2)
    })

    describe('should perform', () => {
        const sideEffectText = 'side-effect'
        const noSideEffectText = 'no side-effect'

        it('side-effects intended for the non-empty path only if the list contains, in fact, items', () => {
            let mutable = noSideEffectText

            listFromArray([1]).performOnNonEmpty(() => mutable = sideEffectText)

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

            listFromArray([1]).performOnEmpty(() => mutable = sideEffectText)

            mutable.should.equal(noSideEffectText)
        })

        it('side-effects on intended for both paths if the list is empty', () => {
            let mutable = noSideEffectText

            emptyList().perform(() => mutable = sideEffectText)

            mutable.should.equal(sideEffectText)
        })

        it('side-effects on intended for both paths if the list is not empty', () => {
            let mutable = noSideEffectText

            listFromArray([1]).perform(() => mutable = sideEffectText)

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
            emptyList().equals(listFromArray([1])).should.be.false
            listFromArray([1]).equals(emptyList()).should.be.false
            listFromArray([1]).equals(listFromArray([1, 2])).should.be.false
            listFromArray([1, 2]).equals(listFromArray([1])).should.be.false
            listFromArray([1, 1, 2]).equals(listFromArray([1, 2])).should.be.false
        })

        it('in the same sequence', () => {
            listFromArray([1, 2]).equals(listFromArray([1, 2])).should.be.true
            listFromArray([1, 2]).equals(listFromArray([2, 1])).should.be.false
        })

        it('and unequal if the other list is null or undefined', () => {
            emptyList().equals(null).should.be.false
            emptyList().equals(undefined).should.be.false
        })
    })

    describe('should flatten', () => {
        it('arrays of the same size', () => {
            listFromArray([[1, 2], [3, 4]]).flatten().equals(listFromArray([1, 2, 3, 4]))
        })

        it('lists of the same size', () => {
            listFromArray([listFromArray([1, 2]), listFromArray([3, 4])]).flatten().equals(listFromArray([1, 2, 3, 4]))
        })

        it('arrays of the different sizes', () => {
            listFromArray([[1, 2], [3, 4, 5]]).flatten().equals(listFromArray([1, 2, 3, 4, 5]))
        })

        it('lists of different sizes', () => {
            listFromArray([listFromArray([1, 2]), listFromArray( [3, 4, 5])]).flatten().equals(listFromArray([1, 2, 3, 4, 5]))
        })
    })

    describe('should group', () => {
        interface WithKeyAndValue {
            key: string
            value: number
        }

        function create(key: string, value: number) {
            return { key, value }
        }

        it('an empty list as an empty object', () => {
            emptyList<WithKeyAndValue>().groupBy(item => item.key).should.be.empty
        })

        it('a list with one key as an object with one property', () => {
            const A1 = create('A', 1)
            const A2 = create('A', 2)

            listFromArray([A1]).groupBy(item => item.key).should.eql({'A': [A1]})
            listFromArray([A1, A1]).groupBy(item => item.key).should.eql({'A': [A1, A1]})
            listFromArray([A1, A2]).groupBy(item => item.key).should.eql({'A': [A1, A2]})
        })

        it('a list with one key as an object with two properties', () => {
            const A1 = create('A', 1)
            const A2 = create('A', 2)
            const B1 = create('B', 1)
            const B2 = create('B', 2)

            listFromArray([A1, B1]).groupBy(item => item.key).should.eql({'A': [A1], 'B': [B1]})
            listFromArray([A1, A2, B1]).groupBy(item => item.key).should.eql({'A': [A1, A2], 'B': [B1]})
            listFromArray([A1, B1, B2]).groupBy(item => item.key).should.eql({'A': [A1], 'B': [B1, B2]})
            listFromArray([A1, A2, B1, B2]).groupBy(item => item.key).should.eql({'A': [A1, A2], 'B': [B1, B2]})
        })
    })

    describe('should return the first item', () => {
        it('as none if the list is empty', () => {
            emptyList().first().equals(none).should.be.true
        })

        it('as an instance of Some if the list is not empty', () => {
            listFromArray([1]).first().equals(some(1)).should.be.true
        })
    })

    describe('should return the last item', () => {
        it('as none if the list is empty', () => {
            emptyList().last().equals(none).should.be.true
        })

        it('as an instance of Some if the list is not empty', () => {
            listFromArray([1]).last().equals(some(1)).should.be.true
        })
    })

    describe('should search for the first item matching a predicate', () => {
        it('and return none if there are no matches', () => {
            listFromArray([1]).find(isEven).equals(none).should.be.true
        })

        it('and return an instance of Some if there is a match', () => {
            listFromArray([1, 2, 3, 4]).find(isEven).equals(some(2)).should.be.true
        })
    })

    describe('should search for the last item matching a predicate', () => {
        it('and return none if there are no matches', () => {
            listFromArray([1]).findLast(isEven).equals(none).should.be.true
        })

        it('and return an instance of Some if there is a match', () => {
            listFromArray([1, 2, 3, 4]).findLast(isEven).equals(some(4)).should.be.true
        })
    })

    describe('should add an item', () => {
        it('to the end', () => {
            listFromArray([1]).append(2).equals(list(1, 2)).should.be.true
        })

        it('to the start', () => {
            listFromArray([1]).prepend(2).equals(list(2, 1)).should.be.true
        })
    })

    const unusedFunction = () => { throw 'Unexpected function application' }
    function assertNone(actual: Option<number>) {
        actual.should.equal(none)
    }

    function assertSome<T>(actual: Option<T>, expected: T) {
        actual.equals(some(expected)).should.be.true
    }

    const one = {number:1}
    const two = {number:2}
    const three = {number:3}
    const byNumber = x => x.number

    describe('should reduce', () => {
        const addition = (a: number) => (b: number) => a+b

        it('lists with less than two items to none', () => {
            assertNone(emptyList<number>().reduce(unusedFunction))
            assertNone(listFromArray([1]).reduce(unusedFunction))
        })

        it('a list of numbers', () => {
            assertSome(listFromArray([1, 2]).reduce(addition), 3)
            assertSome(listFromArray([1, 2, 3]).reduce(addition), 6)
        })

        it('a list of objects with a numeric member', () => {
            assertSome(listFromArray([one, two]).reduceBy(byNumber, addition), 3)
            assertSome(listFromArray([one, two, three]).reduceBy(byNumber, addition), 6)
        })
    })

    describe('should fold', () => {
        it('an empty list to none', () => {
            assertNone(emptyList<number>().fold(unusedFunction, undefined))
        })

        describe('a list of objects with a numeric member', () => {
            it('with the Max monoid by selecting a number', () => {
                assertNone(emptyList().maxBy(byNumber))
                assertSome(listFromArray([one]).maxBy(byNumber), 1)
                assertSome(listFromArray([one, two]).maxBy(byNumber), 2)
                assertSome(listFromArray([two, one]).maxBy(byNumber), 2)
            })

            it('with the Min monoid by selecting a number', () => {
                assertNone(emptyList().minBy(byNumber))
                assertSome(listFromArray([one]).minBy(byNumber), 1)
                assertSome(listFromArray([one, two]).minBy(byNumber), 1)
                assertSome(listFromArray([two, one]).minBy(byNumber), 1)
            })

            it('with the Sum monoid by selecting a number', () => {
                assertNone(emptyList().sumBy(byNumber))
                assertSome(listFromArray([one]).sumBy(byNumber), 1)
                assertSome(listFromArray([one, two]).sumBy(byNumber), 3)
                assertSome(listFromArray([two, one]).sumBy(byNumber), 3)
            })

            it('with the Product monoid by selecting a number', () => {
                assertNone(emptyList().productBy(byNumber))
                assertSome(listFromArray([one]).productBy(byNumber), 1)
                assertSome(listFromArray([one, two]).productBy(byNumber), 2)
                assertSome(listFromArray([two, one]).productBy(byNumber), 2)
            })
        })

        describe('a list of numbers', () => {
            it('with the Max monoid', () => {
                assertNone(emptyList<number>().max())
                assertSome(listFromArray([1]).max(), 1)
                assertSome(listFromArray([1, 2]).max(), 2)
                assertSome(listFromArray([2, 1]).max(), 2)
            })

            it('with the Min monoid', () => {
                assertNone(emptyList<number>().min())
                assertSome(listFromArray([1]).min(), 1)
                assertSome(listFromArray([1, 2]).min(), 1)
                assertSome(listFromArray([2, 1]).min(), 1)
            })

            it('with the Sum monoid', () => {
                assertNone(emptyList<number>().sum())
                assertSome(listFromArray([1]).sum(), 1)
                assertSome(listFromArray([1, 2]).sum(), 3)
                assertSome(listFromArray([2, 1]).sum(), 3)
            })

            it('with the Product monoid', () => {
                assertNone(emptyList<number>().product())
                assertSome(listFromArray([1]).product(), 1)
                assertSome(listFromArray([1, 2]).product(), 2)
                assertSome(listFromArray([2, 1]).product(), 2)
            })
        })
    })
})