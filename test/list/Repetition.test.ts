import {emptyList, listFromArray, repeat} from '../../src'

describe('should repeat', () => {
    const value = 'value'

    it('the same value n times', () => {
        repeat(0, value).equals(emptyList()).should.be.true
        repeat(1, value).equals(listFromArray([value])).should.be.true
        repeat(2, value).equals(listFromArray([value, value])).should.be.true
    })

    it('a computation n times, each time with a different index', () => {
        const f = index => index
        repeat(0, f).equals(emptyList()).should.be.true
        repeat(1, f).equals(listFromArray([0])).should.be.true
        repeat(2, f).equals(listFromArray([0, 1])).should.be.true
    })

    it('the result of a single computation n times', () => {
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
})