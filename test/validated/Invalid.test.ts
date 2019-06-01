import {invalid, valid} from '../../src'

const chai = require('chai')
chai.should()
const expect = chai.expect

describe('Invalid', () => {
    const unsafeGetErrors = () => { throw 'Unexpected failure to get the errors!' }
    const errors = ['error 1', 'error 2']
    const createInvalidInstance = <T>() => invalid<T, string>(errors)
    const noSideEffectText = 'no side-effect'

    it('should ignore attempts to apply parameters', () => {
        createInvalidInstance<((a: number) => (b: number) => (c: number) => (d: number) => number)>()
            .apply(1)
            .apply(() => 2)
            .apply(valid(3))
            .apply(() => valid(4))
            .getErrorsOrElse(unsafeGetErrors)
            .should.eql(errors)
    })

    it('should ignore attempts be build an object with values', () => {
        createInvalidInstance<{}>()
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', valid(3))
            .assign('d', scope => valid(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .getErrorsOrElse(unsafeGetErrors)
            .should.eql(errors)
    })

    it('should return itself when concatenated with a Valid instance', () => {
        createInvalidInstance()
            .concat(valid('value'))
            .getErrorsOrElse(unsafeGetErrors)
            .should.eql(errors)
    })

    it('should concatenate the lists of errors when concatenated with another Invalid instance', () => {
        invalid(['error 1a', 'error 1b'])
            .concat(invalid(['error 2a', 'error 2b']))
            .getErrorsOrElse(unsafeGetErrors)
            .should.eql(['error 1a', 'error 1b', 'error 2a', 'error 2b'])
    })

    it('should return the list of errors when it is requested', () => {
        invalid(errors)
            .getErrorsOrElse(unsafeGetErrors)
            .should.eql(errors)
    })

    it('should return the alternative when the list of errors is requested', () => {
        const alternativeText = 'alternative'
        createInvalidInstance()
            .getOrElse(alternativeText)
            .should.equal(alternativeText)
    })

    it('should indicate the correct path', () => {
        const invalidInstance = createInvalidInstance()

        invalidInstance.isInvalid().should.be.true
        invalidInstance.isValid().should.be.false
    })

    it('should ignore maps', () => {
        expect(() => createInvalidInstance()
            .map(() => { throw 'Unexpected map!' }))
            .not.to.throw()
    })

    it('should be able to map over the list of errors', () => {
        const f = error => `mapped ${error}`
        const mappedErrors = errors.map(f)
        createInvalidInstance()
            .mapErrors(errors => errors.map(f))
            .getErrorsOrElse(unsafeGetErrors)
            .should.eql(mappedErrors)
    })

    it('should map over the errors when matched', () => {
        const f = error => `mapped ${error}`
        const mappedErrors = errors.map(f)
        createInvalidInstance()
            .match({
                Valid: () => { throw 'Unexpected branch!' },
                Invalid: errors => errors.map(f)
            })
            .should.eql(mappedErrors)
    })

    it('should ignore attempts to perform a side-effect meant for the Valid branch', () => {
        expect(() => createInvalidInstance()
            .perform(() => { throw 'Unexpected side-effect!' }))
            .not.to.throw()
    })

    it('should be able to perform side-effects using the errors', () => {
        let mutable = noSideEffectText
        const f = errors => `${errors[0]} ${errors[1]}`
        createInvalidInstance()
            .performWhenInvalid(errors => mutable = f(errors))

        mutable.should.equal(f(errors))
    })
})