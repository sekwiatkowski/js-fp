import {failure, success} from '../../src'

const chai = require('chai')

chai.should()
const expect = chai.expect

describe('Success', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!' }
    const containedValue = 'value'
    const createSuccessOfString = () => success<string, string>(containedValue)
    const noSideEffectText = 'no side-effect'

    it('should be able to apply parameters', () => {
        success((a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(success(3))
            .apply(() => success(4))
            .getOrElse(unsafeGet)
            .should.equal(10)
    })

    it('should be able to build an object', () => {
        success({})
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', success(3))
            .assign('d', scope => success(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .getOrElse(unsafeGet)
            .should.equal(10)
    })

    it('should short-circuit object building when a failure is assigned', () => {
        const notComputedText = 'not computed'
        let mutable = notComputedText

        success({})
            .assign('firstMember', failure<string, string>('error'))
            .assign('secondMember', () => { mutable = 'computed'; return success('second value') })
            .isFailure()
            .should.be.true

        mutable.should.equal(notComputedText)
    })

    it('should perform side-effects meant for the success path', () => {
        let mutable = noSideEffectText

        createSuccessOfString().perform(value => mutable = value)

        mutable.should.equal(containedValue)
    })

    it('should ignore side-effects meant for the failure path', () => {
        expect(() => createSuccessOfString().performOnError(() => { throw 'Unexpected side-effect!' }))
            .not.to.throw()
    })

    it('should ignore the default value', () => {
        createSuccessOfString()
            .orElse('default')
            .getOrElse(unsafeGet)
            .should.equal(containedValue)
    })

    it('should ignore the alternative guaranteed computation', () => {
        createSuccessOfString()
            .orAttempt(() => success('alternative'))
            .getOrElse(unsafeGet)
            .should.equal(containedValue)
    })

    it('should indicate the correct path', () => {
        const success = createSuccessOfString()
        success.isSuccess().should.be.true
        success.isFailure().should.be.false
    })

    it('should map over the value', () => {
        const f = value => `mapped over ${value}`
        createSuccessOfString()
            .map(f)
            .getOrElse(unsafeGet)
            .should.equal(f(containedValue))
    })

    it('should ignore maps over the error', () => {
        expect(() => createSuccessOfString().mapError(() => { throw 'Unexpected map!' }))
            .not.to.throw()
    })

    it('should return the contained value when matched', () => {
        createSuccessOfString()
            .match({
                Success: value => value,
                Failure: unsafeGet
            })
            .should.equal(containedValue)
    })

    it('should return the alternative when the error is requested', () => {
        const alternativeText = 'alternative'
        createSuccessOfString()
            .getErrorOrElse(alternativeText)
            .should.equal(alternativeText)
    })

    it('should be able to return the contained value', () => {
        createSuccessOfString()
            .getOrElse(unsafeGet)
            .should.equal(containedValue)
    })
})