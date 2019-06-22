"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Invalid_1 = require("./Invalid");
const __1 = require("..");
class Valid {
    constructor(value) {
        this.value = value;
    }
    //region Access
    getErrorsOrElse(alternative) {
        return alternative instanceof Function ? alternative(this.value) : alternative;
    }
    getOrElse(alternative) {
        return this.value;
    }
    //endregion
    //region Application
    apply(argumentOrFunctionOrValidated) {
        const argumentOrValidated = argumentOrFunctionOrValidated instanceof Function ? argumentOrFunctionOrValidated() : argumentOrFunctionOrValidated;
        if (argumentOrValidated instanceof Invalid_1.Invalid || argumentOrValidated instanceof Valid) {
            return argumentOrValidated.map(argument => this.value(argument));
        }
        else {
            return this.map(f => f(argumentOrValidated));
        }
    }
    //endregion
    //region Concatenation
    concat(otherValidated) {
        return otherValidated;
    }
    //endregion
    //region Conversion
    toFuture() {
        return __1.fulfill(this.value);
    }
    toOption() {
        return __1.some(this.value);
    }
    toResult() {
        return __1.success(this.value);
    }
    //endregion
    //region Mapping
    map(f) {
        return new Valid(f(this.value));
    }
    mapErrors(f) {
        return this;
    }
    //endregion
    //region Matching
    match(onValid, onInvalid) {
        return onValid(this.value);
    }
    //endregion
    //region Side-effects
    perform(sideEffect) {
        sideEffect();
        return this;
    }
    performOnValid(sideEffect) {
        sideEffect(this.value);
        return this;
    }
    performOnInvalid(sideEffect) {
        return this;
    }
    //endregion
    //region Status
    isInvalid() {
        return false;
    }
    isValid() {
        return true;
    }
    //endregion
    //region Testing
    equals(otherValidated, equality) {
        return equality.test(this, otherValidated);
    }
    test(predicate) {
        if (predicate instanceof Function) {
            return predicate(this.value);
        }
        else {
            return predicate.test(this.value);
        }
    }
}
exports.Valid = Valid;
function valid(value) {
    return new Valid(value);
}
exports.valid = valid;
function validatedObject() {
    return valid({});
}
exports.validatedObject = validatedObject;
//# sourceMappingURL=Valid.js.map