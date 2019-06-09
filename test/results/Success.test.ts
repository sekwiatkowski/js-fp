import {Failure, failure, success} from '../../src'

const chai = require('chai')

chai.should()
const expect = chai.expect

describe('Success', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!' }
    const containedValue = 'value'
    const createSuccessOfString = () => success<string, string>(containedValue)
    const noSideEffectText = 'no side-effect'

    describe('should be able to build an object', () => {
        it('one member at a time', () => {
            success({})
                .assign('a', 1)
                .assign('b', scope => scope.a + 1)
                .assign('c', success(3))
                .assign('d', scope => success(scope.c + 1))
                .fold(
                    scope => scope.a + scope.b + scope.c + scope.d,
                    unsafeGet)
                .should.equal(10)
        })

        it('that satisfies an interface', () => {
            interface TestInterface {
                first: string
                second: number
            }

            const firstValue = 'text'
            const secondValue = 1
            const objectThatSatisfiesTestInterface: TestInterface = success({})
                .assign('first', firstValue)
                .assign('second', secondValue)
                .getOrElse(unsafeGet)

            objectThatSatisfiesTestInterface.first.should.equal(firstValue)
            objectThatSatisfiesTestInterface.second.should.equal(secondValue)
        })

        it('but switch to Failure when a Failure instance is assigned to a member', () => {
            success({})
                .assign('firstMember', failure<string, string>('error'))
                .should.be.instanceOf(Failure)
        })
    })

    it('should be able to apply parameters', () => {
        success((a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(success(3))
            .apply(() => success(4))
            .getOrElse(unsafeGet)
            .should.equal(10)
    })

    describe('should perform', () => {
        it('side-effects intended for the success path', () => {
            let mutable = noSideEffectText

            createSuccessOfString().performOnSuccess(value => mutable = value)

            mutable.should.equal(containedValue)
        })

        it('no side-effects intended for the failure path', () => {
            expect(() => createSuccessOfString().performOnFailure(() => { throw 'Unexpected side-effect!' }))
                .not.to.throw()
        })
    })

    describe('should not fall back', () => {
        const fallbackText = 'fallback'

        it('to a default value', () => {
            createSuccessOfString()
                .orElse(fallbackText)
                .getOrElse(unsafeGet)
                .should.equal(containedValue)
        })

        it('to the result of a guaranteed computation', () => {
            createSuccessOfString()
                .orElse(() => fallbackText)
                .getOrElse(unsafeGet)
                .should.equal(containedValue)
        })

        it('to an alternative attempt', () => {
            createSuccessOfString()
                .orAttempt(() => success(fallbackText))
                .getOrElse(unsafeGet)
                .should.equal(containedValue)
        })
    })

    it('should indicate the correct path', () => {
        const success = createSuccessOfString()
        success.isSuccess().should.be.true
        success.isFailure().should.be.false
    })

    describe('should map', () => {
        it('over the value', () => {
            const f = value => `mapped over ${value}`
            createSuccessOfString()
                .map(f)
                .getOrElse(unsafeGet)
                .should.equal(f(containedValue))
        })

        it('but ignore maps over the error', () => {
            expect(() => createSuccessOfString().mapError(() => { throw 'Unexpected map!' }))
                .not.to.throw()
        })
    })

    it('should return the value when folded', () => {
        createSuccessOfString()
            .fold(value => value, unsafeGet)
            .should.equal(containedValue)
    })

    describe('should return', () => {
        it('the value when it is requested', () => {
            createSuccessOfString()
                .getOrElse(unsafeGet)
                .should.equal(containedValue)
        })

        it('the alternative when the error is requested', () => {
            const alternativeText = 'alternative'
            createSuccessOfString()
                .getErrorOrElse(alternativeText)
                .should.equal(alternativeText)
        })
    })
})