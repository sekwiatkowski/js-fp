import {invalid, valid} from '../../src'

describe('Validated', () => {
    it('can perform side-effects on both paths', () => {
        let mutable = 0

        valid('value').performOnBoth(() => { mutable++ })
        invalid('error').performOnBoth(() => { mutable++ })

        mutable.should.equal(2)
    })
})