import {createOptionEquality, none, Option, some} from '../../src'

const chai = require('chai')
const expect = chai.expect

describe('None', () => {
    it('ignores attempts to apply parameters', () => {
        (none as Option<(a: number) => (b: number) => (c: number) => (d: number) => number>)
            .apply(1)
            .apply(() => 2)
            .apply(some(3))
            .apply(() => some(4))
            .should.equal(none)
    })

    it('ignores attempts to build an object', () => {
        (none as Option<{}>)
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', some(1))
            .assign('d', scope => some(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .should.equal(none)
    })

    it('ignores attempts to chain', () => {
        none.chain(() => some('text')).should.equal(none)
    })

    it('ignores attempts to map', () => {
        none.map(() => 'mapped over value').should.equal(none)
    })

    it('can indicate the correct path', () => {
        none.isSome().should.be.false
        none.isNone().should.be.true
    })

    it('returns the alternative when matched', () => {
        const alternativeText = 'alternative'
        none.match(
            value => value,
            () => alternativeText).should.equal(alternativeText)
    })

    describe('can perform', () => {
        it('side-effects intended for the None path', () => {
            let mutable = 'before side-effect'

            const sideEffectText = 'after side-effect'
            none.performOnNone(() => mutable = sideEffectText)

            mutable.should.equal(sideEffectText)
        })

        it('but no side-effects intended for the Some path', () => {
            expect(() => none.performOnSome(() => { throw 'Unexpected side-effect!' }))
                .not.to.throw()
        })
    })

    describe('can return', () => {
        it('a default value', () => {
            const defaultText = 'default';
            (none as Option<string>).getOrElse(defaultText).should.equal(defaultText)
        })

        it('or the result of an alternative computation', () => {
            const alternativeText = 'alternative'
            const alternativeComputation = () => alternativeText;
            (none as Option<string>).getOrElse(alternativeComputation).should.equal(alternativeText)
        })
    })

    describe('can fall back', () => {
        const equality = createOptionEquality<string>()
        const fallbackText = 'fallback'

        it('to a default value', () => {
            (none as Option<string>)
                .orElse(fallbackText)
                .equals(some(fallbackText), equality)
                .should.be.true
        })

        it('to the result of a guaranteed computation', () => {
            (none as Option<string>)
                .orElse(() => fallbackText)
                .equals(some(fallbackText), equality)
                .should.be.true
        })

        it('or try another computation with an optional result', () => {
            (none as Option<string>)
                .orAttempt(() => some(fallbackText))
                .equals(some(fallbackText), equality)
                .should.be.true
        })
    })

    it('always return false when tested for equality', () => {
        none.test(() => true).should.be.false
    })

    it('always return none when filtered', () => {
        none.filter(() => true).should.equal(none)
    })
})