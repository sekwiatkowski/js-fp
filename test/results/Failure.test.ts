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

    describe('should perform', () => {
        it('side-effects intended for the failure path', () => {
            let mutable = noSideEffectText

            createFailureOfString().performOnFailure(error => mutable = error)

            mutable.should.equal(error)
        })

        it('no side-effects intended for the success path', () => {
            expect(() => createFailureOfString().performOnSuccess(() => { throw 'Unexpected side-effect!'}))
                .not.to.throw()
        })
    })

    describe('should be able to switch to the success path', () => {
        const fallbackText = 'fallback'

        it('using a default value', () => {
            createFailureOfString()
                .orElse(fallbackText)
                .getOrElse(unsafeGet)
                .should.equal(fallbackText)
        })

        it('using the result of a guaranteed computation', () => {
            createFailureOfString()
                .orElse(() => fallbackText)
                .getOrElse(unsafeGet)
                .should.equal(fallbackText)
        })

        it('using an alternative attempt', () => {
            createFailureOfString()
                .orAttempt(() => success(fallbackText))
                .getOrElse(unsafeGet)
                .should.equal(fallbackText)
        })
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
            .fold(unsafeGet, error => error)
            .should.equal(error)
    })

    describe('should return', () => {
        it('the alternative when the value is requested', () => {
            const alternativeText = 'alternative'
            createFailureOfString()
                .getOrElse(alternativeText)
                .should.equal(alternativeText)
        })

        it('the error when it is requested', () => {
            createFailureOfString()
                .getErrorOrElse(unsafeGet)
                .should.equal(error)
        })
    })
})