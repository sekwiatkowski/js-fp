"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const None_1 = require("./None");
const __1 = require("..");
class Some {
    constructor(value) {
        this.value = value;
    }
    //region Access
    getOrElse(alternative) {
        return this.value;
    }
    //endregion
    //region Application
    apply(argumentOrFunctionOrOption) {
        const argumentOrOption = argumentOrFunctionOrOption instanceof Function ? argumentOrFunctionOrOption() : argumentOrFunctionOrOption;
        if (argumentOrOption instanceof Some || argumentOrOption instanceof None_1.None) {
            return argumentOrOption.chain(argument => this.map(f => f(argument)));
        }
        else {
            return this.map(f => f(argumentOrOption));
        }
    }
    //endregion
    //region Chaining
    chain(f) {
        return f(this.value);
    }
    //endregion
    //region Comprehension
    assign(key, memberOrOptionOrFunction) {
        return this.chain(scope => {
            const memberOrOption = memberOrOptionOrFunction instanceof Function
                ? memberOrOptionOrFunction(scope)
                : memberOrOptionOrFunction;
            const option = ((memberOrOption instanceof Some || memberOrOption instanceof None_1.None)
                ? memberOrOption
                : some(memberOrOption));
            return option.map(otherValue => (Object.assign({}, Object(scope), { [key]: otherValue })));
        });
    }
    //endregion
    //region Conversion
    toResult(error) {
        return __1.success(this.value);
    }
    toFuture(error) {
        return __1.fulfill(this.value);
    }
    toValidated(errorMessage) {
        return __1.valid(this.value);
    }
    //endregion
    //region Fallback
    orElse(alternative) {
        return this;
    }
    orAttempt(alternative) {
        return this;
    }
    //endregion
    //region Filtering
    filter(predicate) {
        return this.test(predicate) ? this : None_1.none;
    }
    //endregion
    //region Mapping
    map(f) {
        return new Some(f(this.value));
    }
    //endregion
    //region Status
    isSome() {
        return true;
    }
    isNone() {
        return false;
    }
    //endregion
    //region Matching
    match(onSome, onNone) {
        return onSome(this.value);
    }
    //endregion
    //region Side-effects
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
    //endregion
    //region Testing
    equals(other, equality) {
        return equality.test(this, other);
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