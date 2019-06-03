import {failure} from '../../src'
import {success} from '../../dist'

const chai = require('chai')

chai.should()
const expect = chai.expect

describe('Result', () => {
    it('should be able to perform side-effects on both paths', () => {
        let mutable = 0

        success('value').perform(() => { mutable++ })
        failure('error').perform(() => { mutable++ })

        mutable.should.equal(2)
    })
})