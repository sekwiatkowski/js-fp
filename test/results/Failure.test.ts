import {failure, success} from '../../src'

require('chai').should()
const expect = require('chai').expect

describe('Failure', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!' }
    const error = 'error'
    const createFailureOfString = () => failure<string, string>(error)
    const noSideEffectText = 'no side-effect'

    it('should ignore attempts to apply parameters', () => {
        failure<((a: number) => (b: number) => (c: number) => (d: number) => number), string>(error)
            .apply(1)
            .apply(() => 2)
            .apply(success(3))
            .apply(() => success(4))
            .getErrorOrElse(unsafeGet)
            .should.equal(error)
    })

    it('should ignore attempts to build an object', () => {
        failure<{}, string>(error)
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', success(3))
            .assign('d', scope => success(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .getErrorOrElse(unsafeGet)
            .should.equal(error)
    })

    it('should perform side-effects meant for the failure path', () => {
        let mutable = noSideEffectText

        createFailureOfString().performOnError(error => mutable = error)

        mutable.should.equal(error)
    })

    it('should ignore side-effects meant for the success path', () => {
        expect(() => createFailureOfString().perform(() => { throw 'Unexpected side-effect!'}))
            .not.to.throw()
    })

    it('should be able to switch to the success path with default value', () => {
        const defaultText = 'default'
        createFailureOfString()
            .orElse(defaultText)
            .getOrElse(unsafeGet)
            .should.equal(defaultText)
    })

    it('should be able to switch to the success path with the result of the guaranteed computation', () => {
        const resultOfGuaranteedComputation = 'alternative'
        createFailureOfString()
            .orElse(() => resultOfGuaranteedComputation)
            .getOrElse(unsafeGet)
            .should.equal(resultOfGuaranteedComputation)
    })

    it('should be able to successfuly attempt to switch to the success path', () => {
        const textInSuccessPath = 'alternative'
        createFailureOfString()
            .orAttempt(() => success(textInSuccessPath))
            .getOrElse(unsafeGet)
            .should.equal(textInSuccessPath)
    })

    it('should indicate the correct path', () => {
        const success = createFailureOfString()
        success.isSuccess().should.be.false
        success.isFailure().should.be.true
    })

    it('should ignore maps over the value', () => {
        expect(() => createFailureOfString().map(() => { throw 'Unexpected map!' }))
            .not.to.throw()
    })

    it('should map over the error', () => {
        const f = error => `mapped over ${error}`
        createFailureOfString()
            .mapError(f)
            .getErrorOrElse(unsafeGet)
            .should.equal(f(error))
    })

    it('should return the error when folded', () => {
        createFailureOfString()
            .fold({
                Success: unsafeGet,
                Failure: error => error
            })
            .should.equal(error)
    })

    it('should return the alternative when the value is requested', () => {
        const alternativeText = 'alternative'
        createFailureOfString()
            .getOrElse(alternativeText)
            .should.equal(alternativeText)
    })

    it('should be able to return the error', () => {
        createFailureOfString()
            .getErrorOrElse(unsafeGet)
            .should.equal(error)
    })
})