"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Success_1 = require("./Success");
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
    match(pattern) {
        return pattern.Failure(this.error);
    }
    orElse(alternative) {
        return Success_1.success(alternative instanceof Function ? alternative(this.error) : alternative);
    }
    orAttempt(alternative) {
        return alternative(this.error);
    }
    perform(sideEffect) {
        return this;
    }
    performOnError(sideEffect) {
        sideEffect(this.error);
        return new Failure(this.error);
    }
}
exports.Failure = Failure;
function failure(error) {
    return new Failure(error);
}
exports.failure = failure;
//# sourceMappingURL=Failure.js.map