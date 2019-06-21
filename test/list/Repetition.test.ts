import {createListEquality, emptyList, listFromArray, repeat} from '../../src'

require('chai').should()

describe('repeat can', () => {
    const value = 'value'
    const equality = createListEquality<string>()

    it('repeat the same value n times', () => {
        repeat(0, value).equals(emptyList(), equality).should.be.true
        repeat(1, value).equals(listFromArray([value]), equality).should.be.true
        repeat(2, value).equals(listFromArray([value, value]), equality).should.be.true
    })

    describe('repeat the same computation n times', () => {
        const equality = createListEquality<string>()
        it('without reference to the index', () => {
            let counter = 0
            const f = () => {
                counter++
                return value
            }
            repeat(0, f).equals(emptyList(), equality).should.be.true
            repeat(1, f).equals(listFromArray([value]), equality).should.be.true
            repeat(2, f).equals(listFromArray([value, value]), equality).should.be.true
            counter.should.equal(3)
        })

        it('with reference to the index', () => {
            const f = index => index
            repeat(0, f).equals(emptyList(), equality).should.be.true
            repeat(1, f).equals(listFromArray([0]), equality).should.be.true
            repeat(2, f).equals(listFromArray([0, 1]), equality).should.be.true
        })
    })
})