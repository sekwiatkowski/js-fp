import {emptyList, listFromArray, repeat} from '../../src'

require('chai').should()

describe('repeat can', () => {
    const value = 'value'

    it('repeat the same value n times', () => {
        repeat(0, value).equals(emptyList()).should.be.true
        repeat(1, value).equals(listFromArray([value])).should.be.true
        repeat(2, value).equals(listFromArray([value, value])).should.be.true
    })

    describe('repeat the same computation n times', () => {
        it('without reference to the index', () => {
            let counter = 0
            const f = () => {
                counter++
                return value
            }
            repeat(0, f).equals(emptyList()).should.be.true
            repeat(1, f).equals(listFromArray([value])).should.be.true
            repeat(2, f).equals(listFromArray([value, value])).should.be.true
            counter.should.equal(3)
        })

        it('with reference to the index', () => {
            const f = index => index
            repeat(0, f).equals(emptyList()).should.be.true
            repeat(1, f).equals(listFromArray([0])).should.be.true
            repeat(2, f).equals(listFromArray([0, 1])).should.be.true
        })
    })
})