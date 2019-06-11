"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Success_1 = require("./Success");
const __1 = require("..");
class Failure {
    constructor(error) {
        this.error = error;
    }
    //region Access
    getErrorOrElse(alternative) {
        return this.error;
    }
    getOrElse(alternative) {
        return alternative instanceof Function ? alternative(this.error) : alternative;
    }
    //endregion
    //region Application
    apply(argumentOrFunctionOrResult) {
        return new Failure(this.error);
    }
    //endregion
    //region Chaining
    chain(f) {
        return new Failure(this.error);
    }
    //endregion
    //region Comprehension
    assign(key, other) {
        return new Failure(this.error);
    }
    //endregion
    //region Conversion
    toFuture() {
        return __1.reject(this.error);
    }
    toOption() {
        return __1.none;
    }
    toValidated() {
        return __1.invalid([this.error]);
    }
    //endregion
    //region Fallback
    orElse(alternative) {
        return Success_1.success(alternative instanceof Function ? alternative(this.error) : alternative);
    }
    orAttempt(alternative) {
        return alternative(this.error);
    }
    //endregion
    //region Mapping
    map(f) {
        return new Failure(this.error);
    }
    mapError(f) {
        return new Failure(f(this.error));
    }
    //endregion
    //region Matching
    match(onSuccess, onFailure) {
        return onFailure(this.error);
    }
    //endregion
    //region Side-effects
    perform(sideEffect) {
        sideEffect();
        return this;
    }
    performOnSuccess(sideEffect) {
        return this;
    }
    performOnFailure(sideEffect) {
        sideEffect(this.error);
        return this;
    }
    //endregion
    //region Status
    isFailure() {
        return true;
    }
    isSuccess() {
        return false;
    }
    //endregion
    //region Testing
    equals(otherResult) {
        return otherResult.match(() => false, otherError => this.error === otherError);
    }
}
exports.Failure = Failure;
function failure(error) {
    return new Failure(error);
}
exports.failure = failure;
//# sourceMappingURL=Failure.js.map