import {createResultEquality, failure, success} from '../../src'

const chai = require('chai')
chai.should()
const expect = chai.expect

describe('Success', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!' }
    const containedValue = 'value'
    const createSuccessOfString = () => success<string, string>(containedValue)
    const noSideEffectText = 'no side-effect'

    const resultOfNumberStringEquality = createResultEquality<number, string>()
    const resultOfStringStringEquality = createResultEquality<string, string>()

    describe('can build an object', () => {
        it('one member at a time', () => {
            success<object, any>({})
                .assign('a', 1)
                .assign('b', scope => scope.a + 1)
                .assign('c', success(3))
                .assign('d', scope => success(scope.c + 1))
                .map(scope => scope.a + scope.b + scope.c + scope.d)
                .equals(success(10), resultOfNumberStringEquality)
                .should.be.true
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

        it('but switches to the failure path when an instance of Failure is assigned to a member', () => {
            const errorText = 'error'
            success<object, string>({})
                .assign('firstMember', failure(errorText))
                .equals(failure(errorText), createResultEquality())
                .should.be.true
        })
    })

    it('can apply parameters', () => {
        const f = (a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d
        success<((a: number) => (b: number) => (c: number) => (d: number) => number), any>(f)
            .apply(1)
            .apply(() => 2)
            .apply(success(3))
            .apply(() => success(4))
            .equals(success(10), resultOfNumberStringEquality)
            .should.be.true
    })

    describe('perform side-effects', () => {
        it('intended for the success path', () => {
            let mutable = noSideEffectText

            createSuccessOfString().performOnSuccess(value => mutable = value)

            mutable.should.equal(containedValue)
        })

        it('but not for the failure path', () => {
            expect(() => createSuccessOfString().performOnFailure(() => { throw 'Unexpected side-effect!' }))
                .not.to.throw()
        })
    })

    describe('does not fall back', () => {
        const fallbackText = 'fallback'

        it('to a default value', () => {
            const instance = createSuccessOfString()
            instance
                .orElse(fallbackText)
                .should.equal(instance)
        })

        it('to the result of a guaranteed computation', () => {
            const instance = createSuccessOfString()
            instance
                .orElse(() => fallbackText)
                .should.equal(instance)
        })

        it('to an alternative attempt', () => {
            const instance = createSuccessOfString()
            instance
                .orAttempt(() => success(fallbackText))
                .should.equal(instance)
        })
    })

    it('indicates the correct path', () => {
        const success = createSuccessOfString()
        success.isSuccess().should.be.true
        success.isFailure().should.be.false
    })

    describe('should map', () => {
        it('over the value', () => {
            const f = (value: string) => `mapped over ${value}`
            createSuccessOfString()
                .map(f)
                .equals(success(f(containedValue)), resultOfStringStringEquality)
                .should.be.true
        })

        it('but ignore maps over the error', () => {
            expect(() => createSuccessOfString().mapError(() => { throw 'Unexpected map!' }))
                .not.to.throw()
        })
    })

    it('returns the value when matched', () => {
        createSuccessOfString()
            .match(value => value, unsafeGet)
            .should.equal(containedValue)
    })

    describe('provides access to', () => {
        it('to the value', () => {
            createSuccessOfString()
                .getOrElse(unsafeGet)
                .should.equal(containedValue)
        })

        it('and returns an alternative when the error is requested', () => {
            const alternativeText = 'alternative'
            createSuccessOfString()
                .getErrorOrElse(alternativeText)
                .should.equal(alternativeText)
        })
    })
})