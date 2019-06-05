"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Invalid_1 = require("./Invalid");
const __1 = require("..");
class Valid {
    constructor(value) {
        this.value = value;
    }
    apply(parameterOrFunction) {
        const parameter = parameterOrFunction instanceof Function ? parameterOrFunction() : parameterOrFunction;
        if (parameter instanceof Invalid_1.Invalid || parameter instanceof Valid) {
            return parameter.map(parameterValue => this.value(parameterValue));
        }
        else {
            return this.map(f => f(parameter));
        }
    }
    assign(key, memberOrFunction) {
        const member = memberOrFunction instanceof Function ? memberOrFunction(this.value) : memberOrFunction;
        if (member instanceof Valid || member instanceof Invalid_1.Invalid) {
            return member.map(memberValue => (Object.assign({}, Object(this.value), { [key]: memberValue })));
        }
        else {
            return this.map(obj => (Object.assign({}, Object(obj), { [key]: member })));
        }
    }
    concat(validated) {
        return validated;
    }
    getErrorsOrElse(alternative) {
        return alternative instanceof Function ? alternative(this.value) : alternative;
    }
    getOrElse(alternative) {
        return this.value;
    }
    isInvalid() {
        return false;
    }
    isValid() {
        return true;
    }
    map(f) {
        return new Valid(f(this.value));
    }
    mapErrors(f) {
        return this;
    }
    fold(onValid, onInvalid) {
        return onValid(this.value);
    }
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
    toFuture() {
        return __1.fulfill(this.value);
    }
    toOption() {
        return __1.some(this.value);
    }
    toResult() {
        return __1.success(this.value);
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