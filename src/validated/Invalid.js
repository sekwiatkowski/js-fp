"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Invalid {
    constructor(errors) {
        this.errors = errors;
    }
    apply(parameterOrFunction) {
        return new Invalid(this.errors);
    }
    assign(key, other) {
        return new Invalid(this.errors);
    }
    concat(other) {
        return other.match({
            Valid: () => this,
            Invalid: otherList => new Invalid(this.errors.concat(otherList))
        });
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
    match(pattern) {
        return pattern.Invalid(this.errors);
    }
    perform(sideEffect) {
        return this;
    }
    performWhenInvalid(sideEffect) {
        sideEffect(this.errors);
        return this;
    }
}
exports.Invalid = Invalid;
function invalid(errors) {
    return new Invalid(errors instanceof Array ? errors : [errors]);
}
exports.invalid = invalid;
