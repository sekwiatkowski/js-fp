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
        const stringEquality = createListEquality<string>()
        const numberEquality = createListEquality<number>()
        it('without reference to the index', () => {
            let counter = 0
            const f = () => {
                counter++
                return value
            }
            repeat(0, f).equals(emptyList(), stringEquality).should.be.true
            repeat(1, f).equals(listFromArray([value]), stringEquality).should.be.true
            repeat(2, f).equals(listFromArray([value, value]), stringEquality).should.be.true
            counter.should.equal(3)
        })

        it('with reference to the index', () => {
            const f = (index : number) => index
            repeat(0, f).equals(emptyList<number>(), numberEquality).should.be.true
            repeat(1, f).equals(listFromArray([0]), numberEquality).should.be.true
            repeat(2, f).equals(listFromArray([0, 1]), numberEquality).should.be.true
        })
    })
})