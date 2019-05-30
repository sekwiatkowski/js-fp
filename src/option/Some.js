"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const None_1 = require("./None");
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
            return member
                .map(otherValue => {
                return Object.assign({}, Object(this.value), { [key]: otherValue });
            });
        }
        else {
            return this.map(obj => {
                return Object.assign({}, Object(obj), { [key]: member });
            });
        }
    }
    chain(f) {
        return f(this.value);
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
    match(pattern) {
        return pattern.Some(this.value);
    }
    orElse(alternative) {
        return this;
    }
    orAttempt(alternative) {
        return this;
    }
    perform(sideEffect) {
        sideEffect(this.value);
        return new Some(this.value);
    }
    performWhenNone(sideEffect) {
        return new Some(this.value);
    }
}
exports.Some = Some;
function some(value) {
    return new Some(value);
}
exports.some = some;
