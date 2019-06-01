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

    it('should be able to build an object that satisfies an interface', () => {
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

    it('should be able to apply parameters', () => {
        some((a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(some(3))
            .apply(() => some(4))
            .getOrElse(unsafeGet)
            .should.equal(10)
    })

    it('should be able to build an object', () => {
        some({})
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', some(3))
            .assign('d', scope => some(scope.c + 1))
            .fold({
                Some: scope => scope.a + scope.b + scope.c + scope.d,
                None: unsafeGet
            })
            .should.equal(10)
    })

    it('should short-circuit object building when none is assigned', () => {
        const notComputedText = 'not computed'
        let mutable = notComputedText

        some({})
            .assign('firstMember', none)
            .assign('secondMember', () => { mutable = 'computed'; return some('second value') })
            .isNone()
            .should.be.true

        mutable.should.equal(notComputedText)
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
            .fold({
                Some: value => value,
                None: unsafeGet
            })
            .should.equal(containedValue)
    })

    it('should be able to perform side-effects meant for the Some path', () => {
        let mutable = 'before side-effect'

        createSomeOfString().perform(value => mutable = value)

        mutable.should.equal(containedValue)
    })

    it('should ignore the side-effects meant for the None path', () => {
        expect(() => createSomeOfString().performWhenNone(() => { throw 'Unexpected side-effect!' }))
            .not.to.throw()
    })

    it('should ignore default value', () => {
        createSomeOfString().getOrElse('default').should.equal(containedValue)
    })

    it('should ignore alternative computation', () => {
        createSomeOfString().getOrElse(() => 'alternative computation').should.equal(containedValue)
    })

    it('should not ignore the alternative attempt', () => {
        createSomeOfString()
            .orAttempt(() => some('fallback'))
            .getOrElse(unsafeGet)
            .should.equal(containedValue)
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