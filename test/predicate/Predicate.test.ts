import {list, predicate} from '../../src'

const chai = require('chai')
chai.should()

describe('Predicate', () => {
    const isEven = predicate((x: number) => x % 2 === 0)
    const isOdd = predicate((x: number) => x % 2 === 1)

    interface Person {
        id: number
    }

    it('can test the provided input', () => {
        isEven.test(1).should.be.false
        isEven.test(2).should.be.true
    })

    it('can be adapted', () => {
        const adapt = (p: Person) => p.id
        isEven.adapt(adapt).test({id: 1}).should.be.false
        isEven.adapt(adapt).test({id: 2}).should.be.true
    })

    it('can be negated', () => {
        const negatedIsEven = isEven.not()

        list(0, 1, 2).forEach(x => negatedIsEven.test(x).should.equal(isOdd.test(x)))
    })

    it('can be combined under logical disjunction', () => {
        const isEvenOrOdd = isEven.or(isOdd)

        list(0, 1, 2).forEach(x => isEvenOrOdd.test(x).should.be.true)
    })

    it('can be combined under logical conjunction', () => {
        const isEvenAndOdd = isEven.and(isOdd)

        list(0, 1, 2).forEach(x => isEvenAndOdd.test(x).should.be.false)
    })
})