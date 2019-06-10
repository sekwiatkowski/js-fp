"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const None_1 = require("./None");
const __1 = require("..");
class Some {
    constructor(value) {
        this.value = value;
    }
    apply(parameterOrFunction) {
        const parameter = parameterOrFunction instanceof Function ? parameterOrFunction() : parameterOrFunction;
        if (parameter instanceof Some || parameter instanceof None_1.None) {
            return parameter.chain(parameterValue => this.map(f => f(parameterValue)));
        }
        else {
            return this.map(f => f(parameter));
        }
    }
    assign(key, memberOrFunction) {
        const member = memberOrFunction instanceof Function ? memberOrFunction(this.value) : memberOrFunction;
        if (member instanceof Some || member instanceof None_1.None) {
            return member.map(otherValue => (Object.assign({}, Object(this.value), { [key]: otherValue })));
        }
        else {
            return this.map(obj => (Object.assign({}, Object(obj), { [key]: member })));
        }
    }
    chain(f) {
        return f(this.value);
    }
    equals(other) {
        return other.fold(otherValue => this.value == otherValue, () => false);
    }
    test(predicate) {
        return predicate(this.value);
    }
    filter(predicate) {
        return this.test(predicate) ? this : None_1.none;
    }
    getOrElse(alternative) {
        return this.value;
    }
    isSome() {
        return true;
    }
    isNone() {
        return false;
    }
    map(f) {
        return new Some(f(this.value));
    }
    fold(onSome, onNone) {
        return onSome(this.value);
    }
    orElse(alternative) {
        return this;
    }
    orAttempt(alternative) {
        return this;
    }
    perform(sideEffect) {
        sideEffect();
        return None_1.none;
    }
    performOnSome(sideEffect) {
        sideEffect(this.value);
        return this;
    }
    performOnNone(sideEffect) {
        return this;
    }
    toResult(error) {
        return __1.success(this.value);
    }
    toFuture(error) {
        return __1.fulfill(this.value);
    }
    toValidated(errorMessage) {
        return __1.valid(this.value);
    }
}
exports.Some = Some;
function some(value) {
    return new Some(value);
}
exports.some = some;
function optionObject() {
    return some({});
}
exports.optionObject = optionObject;
//# sourceMappingURL=Some.js.map