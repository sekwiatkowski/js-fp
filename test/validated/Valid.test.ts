import {Invalid, invalid, valid} from '../../src'

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

    describe('should be able to build objects', () => {
        it('one member at a time', () => {
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

        it('but switch to Invalid instance when an Invalid instance is assigned to a member', () => {
            valid({})
                .assign('x', invalid(['error']))
                .should.be.instanceOf(Invalid)
        })
    })

    describe('should be able to return', () => {
        it('the value when it is requested', () => {
            createValidString()
                .getOrElse(unsafeGet)
                .should.equal(containedString)
        })

        it('a default value when the errors are requested', () => {
            const defaultValue = ['default']
            createValidString()
                .getErrorsOrElse(defaultValue)
                .should.equal(defaultValue)
        })

        it('the result of a guaranteed computation when the errors are requested', () => {
            const defaultValue = ['default']
            createValidString()
                .getErrorsOrElse(() => defaultValue)
                .should.equal(defaultValue)
        })
    })

    describe('should concatenate', () => {
        it('with another Valid instance by returning the other instance', () => {
            const other = valid<string, string>('another string')
            createValidString().concat(other).should.equal(other)
        })

        it('with an Invalid instance by returning the Invalid instance', () => {
            const other = invalid<string, string>('error')
            createValidString().concat(other).should.equal(other)
        })
    })

    it('should indicate the correct path', () => {
        const validString = createValidString()
        validString.isValid().should.be.true
        validString.isInvalid().should.be.false
    })

    describe('should map', () => {
        it('map over the value', () => {
            const f = value => `mapped over ${value}`
            createValidString()
                .map(f)
                .getOrElse(unsafeGet)
                .should.equal(f(containedString))
        })

        it('but ignore attempts to map over the list of errors', () => {
            expect(() => createValidString().mapErrors(() => { throw 'Unexpected map!' }))
                .not.to.throw()
        })
    })

    it('should return the contained value when folded', () => {
        createValidString()
            .fold(
                value => value,
                () => { throw 'Unexpected access!' })
            .should.equal(containedString)
    })

    describe('should perform', () => {
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
})