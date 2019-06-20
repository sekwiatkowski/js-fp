import {invalid, valid} from '../../src'

const chai = require('chai')
const expect = chai.expect

describe('Valid', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!' }
    const containedString = 'value'
    const createValidString = () => valid<string, string>(containedString)
    const noSideEffectText = 'no side-effect'

    it('can apply parameters', () => {
        valid((a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(valid(3))
            .apply(() => valid(4))
            .equals(valid(10))
            .should.be.true
    })

    describe('can build objects', () => {
        it('one member at a time', () => {
            valid({})
                .assign('a', 1)
                .assign('b', scope => scope.a + 1)
                .assign('c', valid(3))
                .assign('d', scope => valid(scope.c + 1))
                .map(scope => scope.a + scope.b + scope.c + scope.d)
                .equals(valid(10))
                .should.be.true
        })

        it('but switches to the Invalid path when an instance of Invalid is assigned to a member', () => {
            const errors = ['error']
            valid({})
                .assign('x', invalid(errors))
                .equals(invalid(errors))
                .should.be.true
        })
    })

    describe('provides access', () => {
        it('to the value', () => {
            createValidString()
                .getOrElse(unsafeGet)
                .should.equal(containedString)
        })

        const fallback = ['fallback']
        it('but returns a default when the errors are requested', () => {
            createValidString()
                .getErrorsOrElse(fallback)
                .should.equal(fallback)
        })

        it('... or the result of a guaranteed computation', () => {
            createValidString()
                .getErrorsOrElse(() => fallback)
                .should.equal(fallback)
        })
    })

    describe('concatenates', () => {
        it('with another Valid instance by returning that other instance', () => {
            const other = valid<string, string>('another string')
            createValidString().concat(other).should.equal(other)
        })

        it('with an Invalid instance by returning the Invalid instance', () => {
            const other = invalid<string, string>('error')
            createValidString().concat(other).should.equal(other)
        })
    })

    it('indicates the correct path', () => {
        const validString = createValidString()
        validString.isValid().should.be.true
        validString.isInvalid().should.be.false
    })

    describe('maps', () => {
        it('over the value', () => {
            const f = value => `mapped over ${value}`
            createValidString()
                .map(f)
                .equals(valid(f(containedString)))
                .should.be.true
        })

        it('but ignores attempts to map over the list of errors', () => {
            expect(() => createValidString().mapErrors(() => { throw 'Unexpected map!' }))
                .not.to.throw()
        })
    })

    it('should return the contained value when matched', () => {
        createValidString()
            .match(
                value => value,
                () => { throw 'Unexpected access!' })
            .should.equal(containedString)
    })

    describe('perform side-effects', () => {
        it('intended for the valid path', () => {
            let mutable = noSideEffectText
            const afterSideEffectText = 'after side-effect'
            createValidString().perform(() => mutable = 'after side-effect' )
            mutable.should.equal(afterSideEffectText)
        })

        it('ignore side-effects intended for the invalid path', () => {
            expect(() => createValidString().performOnInvalid(() => { throw 'Unexpected side-effect!' }))
                .not.to.throw()
        })
    })
})