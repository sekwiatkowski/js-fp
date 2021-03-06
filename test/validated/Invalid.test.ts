import {createValidatedEquality, invalid, valid} from '../../src'

const chai = require('chai')
const expect = chai.expect

describe('Invalid', () => {
    const errors = ['error 1', 'error 2']
    const createInvalidInstance = <T>() => invalid<T, string>(errors)
    const noSideEffectText = 'no side-effect'

    const validatedOfNumberStringEquality = createValidatedEquality<number, string>()

    it('ignores attempts to apply parameters', () => {
        createInvalidInstance<((a: number) => (b: number) => (c: number) => (d: number) => number)>()
            .apply(1)
            .apply(() => 2)
            .apply(valid(3))
            .apply(() => valid(4))
            .equals(invalid(errors), validatedOfNumberStringEquality)
            .should.be.true
    })

    describe('concatenates', () => {
        it('with a Valid instance by returning itself', () => {
            const invalidInstance = createInvalidInstance<string>()
            invalidInstance
                .concat(valid('value'))
                .should.equal(invalidInstance)
        })

        it('with another Invalid instance by concatenating the errors', () => {
            const firstErrors = ['error 1a', 'error 1b']
            const secondErrors = ['error 2a', 'error 2b']
            invalid(firstErrors)
                .concat(invalid(secondErrors))
                .equals(invalid(firstErrors.concat(secondErrors)), createValidatedEquality())
                .should.be.true
        })
    })

    describe('provides access', () => {
        it('to the errors', () => {
            invalid(errors)
                .getErrorsOrElse(() => { throw 'Unexpected failure to get the errors!' })
                .should.eql(errors)
        })

        const fallbackText = 'alternative'

        it('but returns a default when the value is requested', () => {
            createInvalidInstance<string>()
                .getOrElse(fallbackText)
                .should.equal(fallbackText)
        })

        it('... or the result of a guaranteed computation', () => {
            createInvalidInstance<string>()
                .getOrElse(() => fallbackText)
                .should.equal(fallbackText)
        })
    })

    it('indicates the correct path', () => {
        const invalidInstance = createInvalidInstance()

        invalidInstance.isInvalid().should.be.true
        invalidInstance.isValid().should.be.false
    })

    describe('maps', () => {
        it('over the errors', () => {
            const f = (error: string) => `mapped ${error}`
            const mappedErrors = errors.map(f)
            createInvalidInstance()
                .mapErrors(errors => errors.map(f))
                .equals(invalid(mappedErrors), createValidatedEquality())
                .should.be.true
        })

        it('but ignores maps over the value', () => {
            expect(() => createInvalidInstance()
                .map(() => { throw 'Unexpected map!' }))
                .not.to.throw()
        })
    })

    it('maps over the errors when matched', () => {
        const f = (error: string) => `mapped ${error}`
        const mappedErrors = errors.map(f)
        createInvalidInstance()
            .match(
                () => { throw 'Unexpected branch!' },
                errors => errors.map(f))
            .should.eql(mappedErrors)
    })

    describe('performs side-effects', () => {
        it('intended for the invalid path', () => {
            let mutable = noSideEffectText
            const f = (errors: string[]) => `${errors[0]} ${errors[1]}`
            createInvalidInstance()
                .performOnInvalid(errors => mutable = f(errors))

            mutable.should.equal(f(errors))
        })

        it('but not those intended for the valid path', () => {
            expect(() => createInvalidInstance()
                .perform(() => { throw 'Unexpected side-effect!' }))
                .not.to.throw()
        })
    })
})