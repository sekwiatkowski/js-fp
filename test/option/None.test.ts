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

    it('should perform', () => {
        it('side-effects intended for the None path', () => {
            let mutable = 'before side-effect'

            const sideEffectText = 'after side-effect'
            none.performOnNone(() => mutable = sideEffectText)

            mutable.should.equal(sideEffectText)
        })

        it('no side-effect intended for the Some path', () => {
            expect(() => none.performOnSome(() => { throw 'Unexpected side-effect!' }))
                .not.to.throw()
        })
    })

    it('should return', () => {
        it('a default value', () => {
            const defaultText = 'default';
            (none as Option<string>).getOrElse(defaultText).should.equal(defaultText)
        })

        it('the result of an alternative computation', () => {
            const alternativeText = 'alternative'
            const alternativeComputation = () => alternativeText;
            (none as Option<string>).getOrElse(alternativeComputation).should.equal(alternativeText)
        })
    })

    it('should fall back', () => {
        it('to a Some instance with the result of an alternative computation', () => {
            const defaultValue = 'default value';
            (none as Option<string>)
                .orElse(() => defaultValue)
                .isSome().should.be.true
        })

        it('to an alternative attempt', () => {
            const alternativeText = 'fallback';
            (none as Option<string>)
                .orAttempt(() => some(alternativeText))
                .getOrElse(unsafeGet)
                .should.equal(alternativeText)
        })
    })

    it('should return false when tested', () => {
        none.test(() => true).should.be.false
    })

    it('should always return none when filtered', () => {
        none.filter(() => true).should.equal(none)
    })
})