import {none, Option, some} from '../../src'

const chai = require('chai')

chai.should()
const expect = chai.expect

describe('None', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!' }

    it('should be able to apply parameters', () => {
        (none as Option<(a: number) => (b: number) => (c: number) => (d: number) => number>)
            .apply(1)
            .apply(() => 2)
            .apply(some(3))
            .apply(() => some(4))
            .should.equal(none)
    })

    it('should ignore attempts to build an object', () => {
        (none as Option<{}>)
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', some(1))
            .assign('d', scope => some(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .should.equal(none)
    })

    it('should ignore attempts to chain', () => {
        none.chain(() => some('text')).should.equal(none)
    })

    it('should ignore attempts to map over the value', () => {
        none.map(() => 'mapped over value').should.equal(none)
    })

    it('should indicate the correct path', () => {
        none.isSome().should.be.false
        none.isNone().should.be.true
    })

    it('should return the alternative when folded', () => {
        const alternativeText = 'alternative'
        none.fold(
            value => value,
            () => alternativeText).should.equal(alternativeText)
    })

    it('should be able to perform side-effects', () => {
        let mutable = 'before side-effect'

        const sideEffectText = 'after side-effect'
        none.performOnNone(() => mutable = sideEffectText)

        mutable.should.equal(sideEffectText)
    })

    it('should be able to ignore side-effect intended for the Some path', () => {
        expect(() => none.performOnSome(() => { throw 'Unexpected side-effect!' })).not.to.throw()
    })

    it('should return the default value', () => {
        const defaultText = 'default';
        (none as Option<string>).getOrElse(defaultText).should.equal(defaultText)
    })

    it('should return the alternative computation', () => {
        const alternativeText = 'alternative'
        const alternativeComputation = () => alternativeText;
        (none as Option<string>).getOrElse(alternativeComputation).should.equal(alternativeText)
    })

    it('should be replaced with default value', () => {
        const fallbackText = 'fallback';
        (none as Option<string>)
            .orElse(() => fallbackText)
            .isSome().should.be.true
    })

    it('should be replaced with fallback attempt', () => {
        const fallbackText = 'fallback';
        (none as Option<string>)
            .orAttempt(() => some(fallbackText))
            .getOrElse(unsafeGet)
            .should.equal(fallbackText)
    })

    it('should return false when tested', () => {
        none.test(() => true).should.be.false
    })

    it('should return none when filtered', () => {
        none.filter(() => true).isNone()
    })
})