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
                .map(scope => scope.a + scope.b + scope.c + scope.d)
                .equals(some(10))
                .should.be.true
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

        it('but switch to none when none is assigned to a member', () => {
            some({})
                .assign('firstMember', none)
                .should.equal(none)
        })
    })

    it('should be able to apply parameters', () => {
        some((a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(some(3))
            .apply(() => some(4))
            .equals(some(10))
            .should.be.true
    })

    it('should map over the value', () => {
        const text = 'mapped over value'
        createSomeOfString()
            .map(() => text)
            .equals(some(text))
            .should.be.true
    })

    it('should indicate the correct path', () => {
        createSomeOfString().isSome().should.be.true
        createSomeOfString().isNone().should.be.false
    })

    it('should return the value when matched', () => {
        createSomeOfString()
            .match(
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
            const instance = createSomeOfString()
            instance
                .orElse(fallbackText)
                .should.equal(instance)

        })

        it('to the result of a guaranteed computation', () => {
            const instance = createSomeOfString()
            instance
                .orElse(() => fallbackText)
                .should.equal(instance)

        })

        it('to an alternative attempt', () => {
            const instance = createSomeOfString()
            instance
                .orAttempt(() => some(fallbackText))
                .should.equal(instance)
        })
    })

    it('should be able to test the contained value', () => {
        createSomeOfString().test(satisfiedPredicate).should.be.true
        createSomeOfString().test(violatedPredicate).should.be.false
    })

    it('should be able to filter', () => {
        const instance = createSomeOfString()
        instance.filter(satisfiedPredicate).should.equal(instance)
        instance.filter(violatedPredicate).should.equal(none)
    })
})