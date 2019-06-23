import {failure, success} from '../../src'

require('chai').should()

describe('Result', () => {
    it('can perform side-effects on both paths', () => {
        let mutable = 0

        success('value').performOnBoth(() => { mutable++ })
        failure('error').performOnBoth(() => { mutable++ })

        mutable.should.equal(2)
    })
})