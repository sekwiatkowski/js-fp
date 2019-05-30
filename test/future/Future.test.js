"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const chai = require('chai');
chai.should();
describe('Future', () => {
    const value = 'value';
    const error = 'error';
    const map = value => `mapped over ${value}`;
    const unsafeGet = () => { throw 'Unexpected error!'; };
    const unsafeGetError = () => { throw 'Unexpected value!'; };
    const noSideEffectText = 'no side-effect';
    const sideEffectText = 'performed side-effect';
    it('should be able to apply parameters (in the future)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield src_1.fulfill((a) => (b) => (c) => (d) => (e) => (f) => a + b + c + d + e + f)
            .apply(1)
            .apply(() => 2)
            .apply(src_1.fulfill(3))
            .apply(() => src_1.fulfill(4))
            .apply(Promise.resolve(5))
            .apply(() => Promise.resolve(6))
            .getOrElse(unsafeGet);
        result.should.equal(21);
    }));
    it('should be able to build an object using values and guaranteed computations', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield src_1.fulfill({})
            .assign('x', 1)
            .assign('y', () => 2)
            .match({
            Resolved: scope => scope.x + scope.y,
            Rejected: () => { throw 'Unexpected rejection!'; }
        });
        result.should.equal(3);
    }));
    it('should be able to build an object using promises', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield src_1.fulfill({})
            .assign('x', () => Promise.resolve(1))
            .assign('y', Promise.resolve(2))
            .match({
            Resolved: scope => scope.x + scope.y,
            Rejected: () => { throw 'Unexpected rejection!'; }
        });
        result.should.equal(3);
    }));
    it('should reject the entire promise of an object if the promise of the second member is rejected', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield src_1.fulfill({})
            .assign('x', Promise.resolve(1))
            .assign('y', Promise.reject(2))
            .match({
            Resolved: () => { throw 'Unexpected resolution!'; },
            Rejected: () => 'rejected'
        });
        result.should.equal('rejected');
    }));
    it('should reject the entire promise of an object if the promise of the first member is rejected', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield src_1.fulfill({})
            .assign('x', Promise.reject(1))
            .assign('y', Promise.resolve(2))
            .match({
            Resolved: () => { throw 'Unexpected resolution!'; },
            Rejected: () => 'rejected'
        });
        result.should.equal('rejected');
    }));
    it('should be able to build an object using futures', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield src_1.fulfill({})
            .assign('x', src_1.future(() => Promise.resolve(1)))
            .assign('y', () => src_1.future(() => Promise.resolve(2)))
            .match({
            Resolved: scope => scope.x + scope.y,
            Rejected: () => { throw 'Unexpected rejection!'; }
        });
        result.should.equal(3);
    }));
    it('should be able to get the value of the resolved promise', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.fulfill(value)
            .getOrElse(unsafeGet);
        got.should.equal(value);
    }));
    it('should be able to get the error of the rejected promise', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.reject(error)
            .getErrorOrElse(unsafeGetError);
        got.should.equal(error);
    }));
    it('should be able to map over the value of a resolved promise', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.fulfill(value)
            .map(map)
            .getOrElse(unsafeGet);
        got.should.equal(map(value));
    }));
    it('should be able map over the reason of a promise rejection', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.reject(error)
            .mapError(map)
            .getErrorOrElse(unsafeGetError);
        got.should.equal(map(error));
    }));
    it('should be able to perform side-effects using the value of a resolved promise', done => {
        let mutable = noSideEffectText;
        src_1.fulfill(error)
            .perform(() => mutable = sideEffectText)
            .run(() => {
            mutable.should.equal(sideEffectText);
            done();
        }, () => {
            throw 'Unexpected rejection!';
        });
    });
    it('should ignore attempts to perform side-effects using the value if the promise is rejected', done => {
        let mutable = noSideEffectText;
        src_1.reject(error)
            .perform(() => mutable = sideEffectText)
            .run(() => {
            throw 'Unexpected resolution!';
        }, () => {
            mutable.should.equal(noSideEffectText);
            done();
        });
    });
    it('should be able to perform side-effects using the error of a rejected promise', done => {
        let mutable = noSideEffectText;
        src_1.reject(error)
            .performOnError(() => mutable = sideEffectText)
            .run(() => {
            throw 'Unexpected resolution!';
        }, () => {
            mutable.should.equal(sideEffectText);
            done();
        });
    });
    it('should ignore attempts to perform side-effects using the error if the promise is resolved', done => {
        let mutable = noSideEffectText;
        src_1.fulfill(value)
            .performOnError(() => mutable = sideEffectText)
            .run(() => {
            mutable.should.equal(noSideEffectText);
            done();
        }, () => {
            throw 'Unexpected rejection!';
        });
    });
    it('should map over the value of the resolved promise when matched', () => __awaiter(this, void 0, void 0, function* () {
        const actualValue = yield src_1.fulfill(value)
            .match({
            Resolved: map,
            Rejected: () => { throw 'Unexpected rejection!'; }
        });
        const expectedValue = map(value);
        actualValue.should.equal(expectedValue);
    }));
    it('should map over the value of the rejected promise when matched', () => __awaiter(this, void 0, void 0, function* () {
        const actualValue = yield src_1.reject(error)
            .match({
            Resolved: () => { throw 'Unexpected resolution!'; },
            Rejected: map
        });
        const expectedValue = map(error);
        actualValue.should.equal(expectedValue);
    }));
    it('should be able to continue with a fallback promise if the first promise is rejected', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.reject(error)
            .orPromise(Promise.resolve(value))
            .getOrElse(unsafeGet);
        got.should.equal(value);
    }));
    it('should be able to continue with a fallback promise if the first and second promise are rejected', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.reject(error)
            .orPromise(Promise.reject(error))
            .orPromise(() => Promise.resolve(value))
            .getOrElse(unsafeGet);
        got.should.equal(value);
    }));
    it('should continue on the rejection path if the fallback promise is rejected', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.reject(error)
            .orPromise(() => Promise.reject(error))
            .getErrorOrElse(unsafeGetError);
        got.should.equal(error);
    }));
    it('should be able to continue with a fallback future if the first promise is rejected', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.reject(error)
            .orAttempt(src_1.fulfill(value))
            .getOrElse(unsafeGet);
        got.should.equal(value);
    }));
    it('should be able to continue with a fallback future if the first and second futures are rejected', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.reject(error)
            .orAttempt(src_1.reject(error))
            .orAttempt(() => src_1.fulfill(value))
            .getOrElse(unsafeGet);
        got.should.equal(value);
    }));
    it('should continue on the rejection path if the fallback future is rejected', () => __awaiter(this, void 0, void 0, function* () {
        const got = yield src_1.reject(error)
            .orAttempt(() => src_1.reject(error))
            .getErrorOrElse(unsafeGetError);
        got.should.equal(error);
    }));
    it('should be able to continue with a default value', () => __awaiter(this, void 0, void 0, function* () {
        const defaultValue = 'default';
        const got = yield src_1.reject(error)
            .orElse(defaultValue)
            .getOrElse(unsafeGet);
        got.should.equal(defaultValue);
    }));
    it('should be able to continue with the result of a guaranteed computation', () => __awaiter(this, void 0, void 0, function* () {
        const defaultValue = 'default';
        const got = yield src_1.reject(error)
            .orElse(() => defaultValue)
            .getOrElse(unsafeGet);
        got.should.equal(defaultValue);
    }));
});
