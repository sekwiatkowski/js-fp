"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Box {
    constructor(value) {
        this.value = value;
    }
    get(f) {
        if (f) {
            return f(this.value);
        }
        else {
            return this.value;
        }
    }
    // endregion
    //region Application
    apply(argumentOrBoxOrFunction) {
        const argumentOrBox = argumentOrBoxOrFunction instanceof Function ? argumentOrBoxOrFunction() : argumentOrBoxOrFunction;
        return this.map(f => f(argumentOrBox instanceof Box ? argumentOrBox.get() : argumentOrBox));
    }
    //endregion
    //region Chaining
    chain(f) {
        return f(this.value);
    }
    //endregion
    //region Comprehension
    assign(key, memberOrBoxOrFunction) {
        const memberOrBox = memberOrBoxOrFunction instanceof Function ? memberOrBoxOrFunction(this.value) : memberOrBoxOrFunction;
        const member = memberOrBox instanceof Box ? memberOrBox.get() : memberOrBox;
        return this.map(obj => (Object.assign({}, Object(obj), { [key]: member })));
    }
    //endregion
    //region Combination
    combine(otherValueOrBox, semigroup) {
        const otherValue = otherValueOrBox instanceof Box ? otherValueOrBox.get() : otherValueOrBox;
        return this.map(value => semigroup.combine(value)(otherValue));
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
    toValidated() {
        return __1.valid(this.value);
    }
    //endregion
    //region Mapping
    map(f) {
        return new Box(f(this.value));
    }
    //endregion
    //region Side-effects
    perform(sideEffect) {
        sideEffect(this.value);
        return new Box(this.value);
    }
    //endregion
    //region Testing
    equals(otherBox, equality) {
        return equality.test(this, otherBox);
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
exports.Box = Box;
function box(value) {
    return new Box(value);
}
exports.box = box;
function boxObject() {
    return box({});
}
exports.boxObject = boxObject;
function createBoxEquality(valueEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull.and(valueEquality.adapt(box => box.get()));
}
exports.createBoxEquality = createBoxEquality;
//# sourceMappingURL=Box.js.map