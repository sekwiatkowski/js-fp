"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const chai = require('chai');
chai.should();
describe('Box', () => {
    const valueText = 'value';
    it('should be able to apply parameters', () => {
        src_1.box(a => b => c => d => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(src_1.box(3))
            .apply(() => src_1.box(4))
            .get()
            .should.equal(10);
    });
    it('should be able to build an object', () => {
        src_1.box({})
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', src_1.box(3))
            .assign('d', scope => src_1.box(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .get()
            .should.equal(10);
    });
    it('should be able to chain boxes', () => {
        src_1.box(valueText)
            .chain(value => src_1.box(`${value} in new box`))
            .get()
            .should.equal(`${valueText} in new box`);
    });
    it('should be able to return the boxed value', () => {
        src_1.box(valueText)
            .get()
            .should.equal(valueText);
    });
    it('should be able to map over the value', () => {
        const f = value => `mapped over ${value}`;
        src_1.box(valueText)
            .map(f)
            .get()
            .should.equal(f(valueText));
    });
    it('should be able to test the value', () => {
        src_1.box(valueText)
            .test(boxedValue => boxedValue === valueText)
            .should.be.true;
        src_1.box(valueText)
            .test(boxedValue => boxedValue !== valueText)
            .should.be.false;
    });
    it('should be able to perform a side-effect using the value', () => {
        let mutable = 'no side-effect';
        const f = value => `side-effect using ${value}`;
        src_1.box(valueText)
            .perform(value => mutable = f(value));
        mutable
            .should.equal(f(valueText));
    });
});
