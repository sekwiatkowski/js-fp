import {none, option, some, Some} from '../../src'

const chai = require('chai')
chai.should()

describe('Option', () => {
    it('can perform side-effects on both paths', () => {
        let mutable = 0

        some('value').perform(() => { mutable++ })
        none.perform(() => { mutable++ })

        mutable.should.equal(2)
    })
})

describe('option', () => {
    it('maps null to None', () => {
        option(null).should.equal(none)
    })

    it('maps undefined to None', () => {
        option(undefined).should.equal(none)
    })

    it('wrap values inside Some', () => {
        (option(1) instanceof Some).should.be.true
    })
})