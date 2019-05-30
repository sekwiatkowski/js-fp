"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        if (member instanceof Box) {
            return member.map(memberValue => {
                return Object.assign({}, Object(this.value), { [key]: memberValue });
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
}
function box(value) {
    return new Box(value);
}
exports.box = box;
