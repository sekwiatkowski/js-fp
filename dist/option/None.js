"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Some_1 = require("./Some");
const __1 = require("..");
class None {
    constructor() { }
    //region Access
    getOrElse(alternative) {
        return alternative instanceof Function ? alternative() : alternative;
    }
    //endregion
    //region Application
    apply(argumentOrOptionOrFunction) {
        return exports.none;
    }
    //endregion
    //region Chaining
    chain(f) {
        return exports.none;
    }
    //endregion
    //region Comprehension
    assign(key, memberOrOptionOrFunction) {
        return exports.none;
    }
    //endregion
    //region Conversion
    toFuture(error) {
        return __1.reject(error);
    }
    toResult(error) {
        return __1.failure(error);
    }
    toValidated(error) {
        return __1.invalid([error]);
    }
    //endregion
    //region Fallback
    orElse(alternative) {
        return Some_1.some(alternative instanceof Function ? alternative() : alternative);
    }
    orAttempt(alternative) {
        return alternative();
    }
    //endregion
    //region Filtering
    filter(predicate) {
        return exports.none;
    }
    //endregion
    //region Mapping
    map(f) {
        return exports.none;
    }
    //endregion
    //region Testing
    equals(other, equality) {
        return false;
    }
    test(predicate) {
        return false;
    }
    //endregion
    //region Matching
    match(onSome, onNone) {
        return onNone();
    }
    //endregion
    //region Side-effects
    perform(sideEffect) {
        sideEffect();
        return exports.none;
    }
    performOnSome(sideEffect) {
        return exports.none;
    }
    performOnNone(sideEffect) {
        sideEffect();
        return exports.none;
    }
    //endregion
    //region Status
    isNone() {
        return true;
    }
    isSome() {
        return false;
    }
}
None.value = new None();
exports.None = None;
exports.none = None.value;
//# sourceMappingURL=None.js.map