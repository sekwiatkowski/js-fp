"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const chai = require('chai');
chai.should();
const expect = chai.expect;
describe('None', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!'; };
    it('should be able to apply parameters', () => {
        src_1.none
            .apply(1)
            .apply(() => 2)
            .apply(src_1.some(3))
            .apply(() => src_1.some(4))
            .should.equal(src_1.none);
    });
    it('should ignore attempts to build an object', () => {
        src_1.none
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', src_1.some(1))
            .assign('d', scope => src_1.some(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .should.equal(src_1.none);
    });
    it('should ignore attempts to chain', () => {
        src_1.none.chain(() => src_1.some('text')).should.equal(src_1.none);
    });
    it('should ignore attempts to map over the value', () => {
        src_1.none.map(() => 'mapped over value').should.equal(src_1.none);
    });
    it('should indicate the correct path', () => {
        src_1.none.isSome().should.be.false;
        src_1.none.isNone().should.be.true;
    });
    it('should return the alternative when matched', () => {
        const alternativeText = 'alternative';
        src_1.none.match({
            Some: value => value,
            None: () => alternativeText
        }).should.equal(alternativeText);
    });
    it('should be able to perform side-effects', () => {
        let mutable = 'before side-effect';
        const sideEffectText = 'after side-effect';
        src_1.none.performWhenNone(() => mutable = sideEffectText);
        mutable.should.equal(sideEffectText);
    });
    it('should be able to ignore side-effect meant for the Some path', () => {
        expect(() => src_1.none.perform(() => { throw 'Unexpected side-effect!'; })).not.to.throw();
    });
    it('should return the default value', () => {
        const defaultText = 'default';
        src_1.none.getOrElse(defaultText).should.equal(defaultText);
    });
    it('should return the alternative computation', () => {
        const alternativeText = 'alternative';
        const alternativeComputation = () => alternativeText;
        src_1.none.getOrElse(alternativeComputation).should.equal(alternativeText);
    });
    it('should be replaced with default value', () => {
        const fallbackText = 'fallback';
        src_1.none
            .orElse(() => fallbackText)
            .isSome().should.be.true;
    });
    it('should be replaced with fallback attempt', () => {
        const fallbackText = 'fallback';
        src_1.none
            .orAttempt(() => src_1.some(fallbackText))
            .getOrElse(unsafeGet)
            .should.equal(fallbackText);
    });
    it('should return false when tested', () => {
        src_1.none.test(() => true).should.be.false;
    });
    it('should return none when filtered', () => {
        src_1.none.filter(() => true).isNone();
    });
});
