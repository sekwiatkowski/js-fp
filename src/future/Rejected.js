"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Rejected {
    constructor(error) {
        this.error = error;
    }
    getErrorOrElse(alternative) {
        return this.error;
    }
    getOrElse(alternative) {
        return alternative instanceof Function ? alternative(this.error) : alternative;
    }
    match(pattern) {
        return pattern.Rejected(this.error);
    }
    map(f) {
        return new Rejected(this.error);
    }
    mapError(f) {
        return new Rejected(f(this.error));
    }
    perform(sideEffect) { }
    performOnError(sideEffect) {
        sideEffect(this.error);
    }
    run(whenFulfilled, whenRejected) {
        whenRejected(this.error);
    }
}
function rejected(error) {
    return new Rejected(error);
}
exports.rejected = rejected;
