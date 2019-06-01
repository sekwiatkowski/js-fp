"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Some_1 = require("./Some");
const __1 = require("..");
class None {
    constructor() { }
    apply(parameterOrFunction) {
        return exports.none;
    }
    assign(key, memberOrFunction) {
        return exports.none;
    }
    chain(f) {
        return exports.none;
    }
    test(predicate) {
        return false;
    }
    filter(predicate) {
        return exports.none;
    }
    getOrElse(alternative) {
        return alternative instanceof Function ? alternative() : alternative;
    }
    isSome() {
        return false;
    }
    isNone() {
        return true;
    }
    map(f) {
        return exports.none;
    }
    match(pattern) {
        return pattern.None();
    }
    orElse(alternative) {
        return Some_1.some(alternative instanceof Function ? alternative() : alternative);
    }
    orAttempt(alternative) {
        return alternative();
    }
    perform(sideEffect) {
        return exports.none;
    }
    performWhenNone(sideEffect) {
        sideEffect();
        return exports.none;
    }
    toFuture(error) {
        return __1.reject(error);
    }
    toResult(error) {
        return __1.failure(error);
    }
    toValidated(error) {
        return __1.invalid([error]);
    }
}
None.value = new None();
exports.None = None;
exports.none = None.value;
//# sourceMappingURL=None.js.map