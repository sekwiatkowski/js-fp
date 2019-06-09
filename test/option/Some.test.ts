import {none, some} from '../../src'

const chai = require('chai')

chai.should()
const expect = chai.expect

describe('Some', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!' }
    const containedValue = 'value'
    const createSomeOfString = () => some(containedValue)
    const satisfiedPredicate = value => value === containedValue
    const violatedPredicate = value => value === 'something else'

    describe('should be able to build an object', () => {
        it('one member at a time', () => {
            some({})
                .assign('a', 1)
                .assign('b', scope => scope.a + 1)
                .assign('c', some(3))
                .assign('d', scope => some(scope.c + 1))
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
            const objectThatSatisfiesTestInterface: TestInterface = some({})
                .assign('first', firstValue)
                .assign('second', secondValue)
                .getOrElse(unsafeGet)

            objectThatSatisfiesTestInterface.first.should.equal(firstValue)
            objectThatSatisfiesTestInterface.second.should.equal(secondValue)
        })

        it('but short-circuit when none is assigned', () => {
            const notComputedText = 'not computed'
            let mutable = notComputedText

            some({})
                .assign('firstMember', none)
                .assign('secondMember', () => { mutable = 'computed'; return some('second value') })
                .isNone()
                .should.be.true

            mutable.should.equal(notComputedText)
        })
    })

    it('should be able to apply parameters', () => {
        some((a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(some(3))
            .apply(() => some(4))
            .getOrElse(unsafeGet)
            .should.equal(10)
    })

    it('should map over the value', () => {
        createSomeOfString()
            .map(() => 'mapped over value')
            .getOrElse(unsafeGet)
            .should.equal('mapped over value')
    })

    it('should indicate the correct path', () => {
        createSomeOfString().isSome().should.be.true
        createSomeOfString().isNone().should.be.false
    })

    it('should return the value when folded', () => {
        createSomeOfString()
            .fold(
                value => value,
                unsafeGet
            )
            .should.equal(containedValue)
    })

    describe('should perform', () => {
        it('side-effects intended for the Some path', () => {
            let mutable = 'before side-effect'

            createSomeOfString().performOnSome(value => mutable = value)

            mutable.should.equal(containedValue)
        })

        it('no side-effects intended for the None path', () => {
            expect(() => createSomeOfString().performOnNone(() => { throw 'Unexpected side-effect!' }))
                .not.to.throw()
        })
    })

    describe('should not return', () => {
        it('a default value', () => {
            createSomeOfString().getOrElse('default').should.equal(containedValue)
        })

        it('the result of an alternative computation', () => {
            createSomeOfString().getOrElse(() => 'alternative computation').should.equal(containedValue)
        })
    })

    describe('should not fall back', () => {
        const fallbackText = 'fallback'

        it('to a default value', () => {
            createSomeOfString()
                .orElse(fallbackText)
                .getOrElse(unsafeGet)
                .should.equal(containedValue)

        })

        it('to the result of a guaranteed computation', () => {
            createSomeOfString()
                .orElse(() => fallbackText)
                .getOrElse(unsafeGet)
                .should.equal(containedValue)

        })

        it('to an alternative attempt', () => {
            createSomeOfString()
                .orAttempt(() => some(fallbackText))
                .getOrElse(unsafeGet)
                .should.equal(containedValue)
        })
    })

    it('should be able to test the contained value', () => {
        createSomeOfString().test(satisfiedPredicate).should.be.true
        createSomeOfString().test(violatedPredicate).should.be.false
    })

    it('should be able to filter', () => {
        createSomeOfString().filter(satisfiedPredicate).isSome().should.be.true
        createSomeOfString().filter(violatedPredicate).isNone().should.be.true
    })
})