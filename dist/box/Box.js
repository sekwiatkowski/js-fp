"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Box {
    constructor(value) {
        this.value = value;
    }
    apply(parameterOrFunction) {
        const parameter = parameterOrFunction instanceof Function ? parameterOrFunction() : parameterOrFunction;
        return this.map(f => f(parameter instanceof Box ? parameter.get() : parameter));
    }
    assign(key, memberOrFunction) {
        const member = memberOrFunction instanceof Function ? memberOrFunction(this.value) : memberOrFunction;
        const memberValue = member instanceof Box ? member.get() : member;
        return this.map(obj => (Object.assign({}, Object(obj), { [key]: memberValue })));
    }
    chain(f) {
        return f(this.value);
    }
    get() {
        return this.value;
    }
    map(f) {
        return new Box(f(this.value));
    }
    perform(sideEffect) {
        sideEffect(this.value);
        return new Box(this.value);
    }
    test(predicate) {
        return predicate(this.value);
    }
    toOption() {
        return __1.some(this.value);
    }
    toResult() {
        return __1.success(this.value);
    }
    toValidated() {
        return __1.valid(this.value);
    }
    toFuture() {
        return __1.fulfill(this.value);
    }
}
exports.Box = Box;
function box(value) {
    return new Box(value);
}
exports.box = box;
function boxObject() {
    return box({});
}
exports.boxObject = boxObject;
//# sourceMappingURL=Box.js.map