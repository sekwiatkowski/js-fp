"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Success_1 = require("./Success");
const __1 = require("..");
class Failure {
    constructor(error) {
        this.error = error;
    }
    apply(parameterOrFunction) {
        return new Failure(this.error);
    }
    assign(key, other) {
        return new Failure(this.error);
    }
    chain(f) {
        return new Failure(this.error);
    }
    equals(otherResult) {
        return otherResult.fold(() => false, otherError => this.error === otherError);
    }
    isFailure() {
        return true;
    }
    isSuccess() {
        return false;
    }
    getErrorOrElse(alternative) {
        return this.error;
    }
    getOrElse(alternative) {
        return alternative instanceof Function ? alternative(this.error) : alternative;
    }
    map(f) {
        return new Failure(this.error);
    }
    mapError(f) {
        return new Failure(f(this.error));
    }
    fold(onSuccess, onFailure) {
        return onFailure(this.error);
    }
    orElse(alternative) {
        return Success_1.success(alternative instanceof Function ? alternative(this.error) : alternative);
    }
    orAttempt(alternative) {
        return alternative(this.error);
    }
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
    toFuture() {
        return __1.reject(this.error);
    }
    toOption() {
        return __1.none;
    }
    toValidated() {
        return __1.invalid([this.error]);
    }
}
exports.Failure = Failure;
function failure(error) {
    return new Failure(error);
}
exports.failure = failure;
//# sourceMappingURL=Failure.js.map