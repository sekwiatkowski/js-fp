import {none, option, Some} from '../../src'

const chai = require('chai')
chai.should()

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