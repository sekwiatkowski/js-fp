import {invalid, valid} from '../../src'

const chai = require('chai')

chai.should()
const expect = chai.expect

describe('Valid', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!' }
    const containedString = 'value'
    const createValidString = () => valid<string, string>(containedString)
    const noSideEffectText = 'no side-effect'

    it('should be able to apply parameters', () => {
        valid((a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(valid(3))
            .apply(() => valid(4))
            .getOrElse(unsafeGet)
            .should.equal(10)
    })

    it('should be able to build an object with values', () => {
        valid({})
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', valid(3))
            .assign('d', scope => valid(scope.c + 1))
            .fold(
                scope => scope.a + scope.b + scope.c + scope.d,
                unsafeGet)
            .should.equal(10)
    })

    it('should return the Invalid instance when an attempt is made to build an object with an Invalid instance', () => {
        const invalidInstance = invalid(['error'])
        invalidInstance.should.equal(invalidInstance)

        valid({})
            .assign('x', invalidInstance)
            .should.eql(invalidInstance)
    })

    it('should return the contained value when requeseted', () => {
        createValidString()
            .getOrElse(unsafeGet)
            .should.equal(containedString)
    })

    it('should be able to return a default value when the errors are requested', () => {
        const defaultValue = ['default']
        createValidString()
            .getErrorsOrElse(defaultValue)
            .should.equal(defaultValue)
    })

    it('should be able to return a the result of a guaranteed computation when the errors are requested', () => {
        const defaultValue = ['default']
        createValidString()
            .getErrorsOrElse(() => defaultValue)
            .should.equal(defaultValue)
    })

    it('should return the other Validated instance when concatenated', () => {
        const otherValidated = valid<string, string>('other string')
        createValidString().concat(otherValidated).should.equal(otherValidated)
    })

    it('should indicate the correct path', () => {
        const validString = createValidString()
        validString.isValid().should.be.true
        validString.isInvalid().should.be.false
    })

    it('should be able to map over the contained string', () => {
        const f = value => `mapped over ${value}`
        createValidString()
            .map(f)
            .getOrElse(unsafeGet)
            .should.equal(f(containedString))
    })

    it('should ignore attempts to map over the errors', () => {
        expect(() => createValidString().mapErrors(() => { throw 'Unexpected map!' }))
            .not.to.throw()
    })

    it('should return the contained value when folded', () => {
        createValidString()
            .fold(
                value => value,
                () => { throw 'Unexpected access!' })
            .should.equal(containedString)
    })

    it('should be able to perform side-effects using the contained value', () => {
        let mutable = noSideEffectText
        const afterSideEffectText = 'after side-effect'
        createValidString().perform(() => mutable = 'after side-effect' )
        mutable.should.equal(afterSideEffectText)
    })

    it('should ignore side-effects intended for the Invalid path', () => {
        expect(() => createValidString().performOnInvalid(() => { throw 'Unexpected side-effect!' }))
            .not.to.throw()
    })
})