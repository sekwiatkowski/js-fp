import {none, option, some, Some} from '../../src'

const chai = require('chai')
chai.should()

describe('Some', () => {
    it('should be able to perform side-effects on both paths', () => {
        let mutable = 0

        some('value').perform(() => { mutable++ })
        none.perform(() => { mutable++ })

        mutable.should.equal(2)
    })
})

describe('option', () => {
    it('should map null to None', () => {
        option(null).should.equal(none)
    })

    it('should map undefined to None', () => {
        option(undefined).should.equal(none)
    })

    it('should wrap values inside Some', () => {
        (option(1) instanceof Some).should.be.true
    })

})