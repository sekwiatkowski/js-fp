"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const chai = require('chai');
chai.should();
const expect = chai.expect;
describe('Valid', () => {
    const unsafeGet = () => { throw 'Unexpected failure to get the value!'; };
    const containedString = 'value';
    const createValidString = () => src_1.valid(containedString);
    const noSideEffectText = 'no side-effect';
    it('should be able to apply parameters', () => {
        src_1.valid((a) => (b) => (c) => (d) => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(src_1.valid(3))
            .apply(() => src_1.valid(4))
            .getOrElse(unsafeGet)
            .should.equal(10);
    });
    it('should be able to build an object with values', () => {
        src_1.valid({})
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', src_1.valid(3))
            .assign('d', scope => src_1.valid(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .getOrElse(unsafeGet)
            .should.equal(10);
    });
    it('should return the Invalid instance when an attempt is made to build an object with an Invalid instance', () => {
        const invalidInstance = src_1.invalid(['error']);
        invalidInstance.should.equal(invalidInstance);
        src_1.valid({})
            .assign('x', invalidInstance)
            .should.eql(invalidInstance);
    });
    it('should return the contained value when requeseted', () => {
        createValidString()
            .getOrElse(unsafeGet)
            .should.equal(containedString);
    });
    it('should be able to return a default value when the errors are requested', () => {
        const defaultValue = ['default'];
        createValidString()
            .getErrorsOrElse(defaultValue)
            .should.equal(defaultValue);
    });
    it('should be able to return a the result of a guaranteed computation when the errors are requested', () => {
        const defaultValue = ['default'];
        createValidString()
            .getErrorsOrElse(() => defaultValue)
            .should.equal(defaultValue);
    });
    it('should return the other Validated instance when concatenated', () => {
        const otherValidated = src_1.valid('other string');
        createValidString().concat(otherValidated).should.equal(otherValidated);
    });
    it('should indicate the correct path', () => {
        const validString = createValidString();
        validString.isValid().should.be.true;
        validString.isInvalid().should.be.false;
    });
    it('should be able to map over the contained string', () => {
        const f = value => `mapped over ${value}`;
        createValidString()
            .map(f)
            .getOrElse(unsafeGet)
            .should.equal(f(containedString));
    });
    it('should ignore attempts to map over the errors', () => {
        expect(() => createValidString().mapErrors(() => { throw 'Unexpected map!'; }))
            .not.to.throw();
    });
    it('should return the contained value when matched', () => {
        createValidString()
            .match({
            Valid: value => value,
            Invalid: () => { throw 'Unexpected access!'; }
        })
            .should.equal(containedString);
    });
    it('should be able to perform side-effects using the contained value', () => {
        let mutable = noSideEffectText;
        const afterSideEffectText = 'after side-effect';
        createValidString().perform(() => mutable = 'after side-effect');
        mutable.should.equal(afterSideEffectText);
    });
    it('should ignore side-effects meant for the Invalid path', () => {
        expect(() => createValidString().performWhenInvalid(() => { throw 'Unexpected side-effect!'; }))
            .not.to.throw();
    });
});
