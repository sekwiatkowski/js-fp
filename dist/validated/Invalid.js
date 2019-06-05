"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Invalid {
    constructor(errors) {
        this.errors = errors;
    }
    apply(parameterOrFunction) {
        return new Invalid(this.errors);
    }
    assign(key, memberOrFunction) {
        return new Invalid(this.errors);
    }
    concat(other) {
        return other.fold(() => this, otherList => new Invalid(this.errors.concat(otherList)));
    }
    getErrorsOrElse(alternative) {
        return this.errors;
    }
    getOrElse(alternative) {
        return alternative instanceof Function ? alternative(this.errors) : alternative;
    }
    isInvalid() {
        return true;
    }
    isValid() {
        return false;
    }
    map(f) {
        return new Invalid(this.errors);
    }
    mapErrors(f) {
        return new Invalid(f(this.errors));
    }
    fold(onValid, onInvalid) {
        return onInvalid(this.errors);
    }
    perform(sideEffect) {
        sideEffect();
        return this;
    }
    performOnValid(sideEffect) {
        return this;
    }
    performOnInvalid(sideEffect) {
        sideEffect(this.errors);
        return this;
    }
    toFuture() {
        return __1.reject(this.errors);
    }
    toOption() {
        return __1.none;
    }
    toResult() {
        return __1.failure(this.errors);
    }
}
exports.Invalid = Invalid;
function invalid(errors) {
    return new Invalid(errors instanceof Array ? errors : [errors]);
}
exports.invalid = invalid;
//# sourceMappingURL=Invalid.js.map