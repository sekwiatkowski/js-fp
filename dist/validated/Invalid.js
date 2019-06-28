"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Invalid {
    constructor(errors) {
        this.errors = errors;
    }
    //region Access
    getErrorsOrElse(alternative) {
        return this.errors;
    }
    getOrElse(alternative) {
        return alternative instanceof Function ? alternative(this.errors) : alternative;
    }
    //endregion
    //region Application
    apply(argumentOrValidatedOrFunction) {
        return new Invalid(this.errors);
    }
    //endregion
    //region Concatenation
    concat(otherValidated) {
        return otherValidated.match(() => this, otherList => new Invalid(this.errors.concat(otherList)));
    }
    //endregion
    //region Conversion
    toFuture() {
        return __1.reject(this.errors);
    }
    toOption() {
        return __1.none;
    }
    toResult() {
        return __1.failure(this.errors);
    }
    //endregion
    //region Mapping
    map(f) {
        return new Invalid(this.errors);
    }
    mapErrors(f) {
        return new Invalid(f(this.errors));
    }
    //endregion
    //region Matching
    match(onValid, onInvalid) {
        return onInvalid(this.errors);
    }
    //endregion
    //region Side-effects
    performOnBoth(sideEffect) {
        sideEffect();
        return this;
    }
    perform(sideEffect) {
        return this;
    }
    performOnInvalid(sideEffect) {
        sideEffect(this.errors);
        return this;
    }
    //endregion
    //region Status
    isInvalid() {
        return true;
    }
    isValid() {
        return false;
    }
    //endregion
    //region Testing
    equals(otherValidated, equality) {
        return equality.test(this, otherValidated);
    }
    test(predicate) {
        return false;
    }
}
exports.Invalid = Invalid;
function invalid(errors) {
    return new Invalid(errors instanceof Array ? errors : [errors]);
}
exports.invalid = invalid;
//# sourceMappingURL=Invalid.js.map