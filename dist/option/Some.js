"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const None_1 = require("./None");
const Option_1 = require("./Option");
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
    assign(key, memberOptionOrValueOrFunction) {
        return this.chain(scope => {
            const memberOptionOrValue = memberOptionOrValueOrFunction instanceof Function
                ? memberOptionOrValueOrFunction(scope)
                : memberOptionOrValueOrFunction;
            const memberOption = (memberOptionOrValue instanceof Some || memberOptionOrValue instanceof None_1.None)
                ? memberOptionOrValue
                : Option_1.option(memberOptionOrValue);
            return memberOption.map(member => (Object.assign({}, Object(scope), { [key]: member })));
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
        sideEffect(this.value);
        return this;
    }
    performOnBoth(sideEffect) {
        sideEffect();
        return None_1.none;
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