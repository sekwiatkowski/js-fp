import {box, pair} from '../../src'

require('chai').should()

describe('Pair', () => {
    describe('can return', () => {
        it('the first value', () => {
            pair(1, 2).first().should.equal(1)
        })

        it('the second value', () => {
            pair(1, 2).second().should.equal(2)
        })
    })

    it('can chain', () => {
        pair(1, 2).chain((first, second) => pair(second, first)).equals(pair(2, 1))
    })

    describe('can map', () => {
        const increment = x => x + 1

        it('the first value', () => {
            pair(1, 2).mapFirst(increment).first().should.equal(2)
        })

        it('the second value', () => {
            pair(1, 2).mapSecond(increment).second().should.equal(3)
        })

        it('both values', () => {
            pair(1, 2).mapBoth(increment, increment).toArray().should.eql([ 2, 3])
        })
    })

    describe('can be converted', () => {
        it('to a Box instance', () => {
            pair(1, 2).toBox((first, second) => first + second).equals(box(3)).should.be.true
        })

        it('to an array', () => {
            pair(1, 2).toArray().should.eql([1, 2])
        })
    })

    describe('can perform side-effects', () => {
        it('on the first value', () => {
            let mutable = 0
            pair(1, 2).performOnFirst(first => mutable = first)
            mutable.should.equal(1)
        })

        it('on the second value', () => {
            let mutable = 0
            pair(1, 2).performOnSecond(second => mutable = second)
            mutable.should.equal(2)
        })

        it('on both values', () => {
            let mutable = 0
            pair(1, 2).perform((first, second) => mutable = first + second)
            mutable.should.equal(3)
        })
    })

    describe('can test', () => {
        it('for equality', () => {
            pair(1, 2).equals(pair(1, 2)).should.be.true
        })
    })
})