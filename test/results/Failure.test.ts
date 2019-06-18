import {failure, success} from '../../src'

require('chai').should()
const expect = require('chai').expect

describe('Failure', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!' }
    const error = 'error'
    const createFailureOfString = () => failure<string, string>(error)
    const noSideEffectText = 'no side-effect'

    it('ignores attempts to apply parameters', () => {
        failure<((a: number) => (b: number) => (c: number) => (d: number) => number), string>(error)
            .apply(1)
            .apply(() => 2)
            .apply(success(3))
            .apply(() => success(4))
            .equals(failure(error))
            .should.be.true
    })

    it('ignores attempts to build an object', () => {
        failure<{}, string>(error)
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', success(3))
            .assign('d', scope => success(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .equals(failure(error))
            .should.be.true
    })

    describe('performs side-effects', () => {
        it('intended for the failure path', () => {
            let mutable = noSideEffectText

            createFailureOfString().performOnFailure(error => mutable = error)

            mutable.should.equal(error)
        })

        it('but not for the success path', () => {
            expect(() => createFailureOfString().performOnSuccess(() => { throw 'Unexpected side-effect!'}))
                .not.to.throw()
        })
    })

    describe('can switch to the success path', () => {
        const fallbackText = 'fallback'

        it('using a default value', () => {
            createFailureOfString()
                .orElse(fallbackText)
                .equals(success(fallbackText))
                .should.be.true
        })

        it('using the result of a guaranteed computation', () => {
            createFailureOfString()
                .orElse(() => fallbackText)
                .equals(success(fallbackText))
                .should.be.true
        })

        it('using an alternative attempt', () => {
            createFailureOfString()
                .orAttempt(() => success(fallbackText))
                .equals(success(fallbackText))
                .should.be.true
        })
    })

    it('indicates the correct path', () => {
        const success = createFailureOfString()
        success.isSuccess().should.be.false
        success.isFailure().should.be.true
    })

    describe('maps', () => {
        it('over the error', () => {
            const f = error => `mapped over ${error}`
            createFailureOfString()
                .mapError(f)
                .equals(failure(f(error)))
                .should.be.true
        })

        it('and ignores maps over the value', () => {
            expect(() => createFailureOfString().map(() => { throw 'Unexpected map!' }))
                .not.to.throw()
        })
    })

    it('returns the error when matched', () => {
        createFailureOfString()
            .match(unsafeGet, error => error)
            .should.equal(error)
    })

    describe('returns', () => {
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