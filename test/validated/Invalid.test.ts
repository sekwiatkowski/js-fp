import {invalid, valid} from '../../src'

const chai = require('chai')
chai.should()
const expect = chai.expect

describe('Invalid', () => {
    const errors = ['error 1', 'error 2']
    const createInvalidInstance = <T>() => invalid<T, string>(errors)
    const noSideEffectText = 'no side-effect'

    it('should ignore attempts to apply parameters', () => {
        createInvalidInstance<((a: number) => (b: number) => (c: number) => (d: number) => number)>()
            .apply(1)
            .apply(() => 2)
            .apply(valid(3))
            .apply(() => valid(4))
            .equals(invalid(errors))
            .should.be.true
    })

    it('should ignore attempts be build an object with values', () => {
        createInvalidInstance<{}>()
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', valid(3))
            .assign('d', scope => valid(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .equals(invalid(errors))
            .should.be.true
    })

    describe('should concatenate', () => {
        it('with a Valid instance by returning itself', () => {
            const invalidInstance = createInvalidInstance()
            invalidInstance
                .concat(valid('value'))
                .should.equal(invalidInstance)
        })

        it('with another Invalid instance by concatenating the lists of errors when concatenated', () => {
            const firstErrors = ['error 1a', 'error 1b']
            const secondErrors = ['error 2a', 'error 2b']
            invalid(firstErrors)
                .concat(invalid(secondErrors))
                .equals(invalid(firstErrors.concat(secondErrors)))
                .should.be.true
        })

    })

    describe('should return', () => {
        it('should return the list of errors when it is requested', () => {
            invalid(errors)
                .getErrorsOrElse(() => { throw 'Unexpected failure to get the errors!' })
                .should.eql(errors)
        })

        const fallbackText = 'alternative'

        it('the default when the value is requested', () => {
            createInvalidInstance()
                .getOrElse(fallbackText)
                .should.equal(fallbackText)
        })

        it('the result of a guaranteed computation when the value is requested', () => {
            createInvalidInstance()
                .getOrElse(() => fallbackText)
                .should.equal(fallbackText)
        })
    })

    it('should indicate the correct path', () => {
        const invalidInstance = createInvalidInstance()

        invalidInstance.isInvalid().should.be.true
        invalidInstance.isValid().should.be.false
    })

    describe('should map', () => {
        it('over the list of errors', () => {
            const f = error => `mapped ${error}`
            const mappedErrors = errors.map(f)
            createInvalidInstance()
                .mapErrors(errors => errors.map(f))
                .equals(invalid(mappedErrors))
                .should.be.true
        })

        it('but ignore maps over the value', () => {
            expect(() => createInvalidInstance()
                .map(() => { throw 'Unexpected map!' }))
                .not.to.throw()
        })
    })

    it('should map over the errors when folded', () => {
        const f = error => `mapped ${error}`
        const mappedErrors = errors.map(f)
        createInvalidInstance()
            .fold(
                () => { throw 'Unexpected branch!' },
                errors => errors.map(f))
            .should.eql(mappedErrors)
    })

    describe('should perform', () => {
        it('side-effects for the Invalid path using the errors', () => {
            let mutable = noSideEffectText
            const f = errors => `${errors[0]} ${errors[1]}`
            createInvalidInstance()
                .performOnInvalid(errors => mutable = f(errors))

            mutable.should.equal(f(errors))
        })

        it('not perform side-effect intended for the Valid path', () => {
            expect(() => createInvalidInstance()
                .performOnValid(() => { throw 'Unexpected side-effect!' }))
                .not.to.throw()
        })
    })
})