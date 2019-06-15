"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Fulfilled {
    constructor(value) {
        this.value = value;
    }
    getErrorOrElse(alternative) {
        return alternative instanceof Function ? alternative(this.value) : alternative;
    }
    getOrElse(alternative) {
        return this.value;
    }
    map(f) {
        return new Fulfilled(f(this.value));
    }
    mapError(f) {
        return new Fulfilled(this.value);
    }
    match(onFulfilled, onRejected) {
        return onFulfilled(this.value);
    }
    orAttempt(alternative) {
        return this;
    }
    perform(sideEffect) {
        sideEffect();
        return this;
    }
    performOnFulfilled(sideEffect) {
        sideEffect(this.value);
        return this;
    }
    performOnRejected(sideEffect) {
        return this;
    }
    run(whenFulfilled, whenRejected) {
        whenFulfilled(this.value);
    }
}
function fulfilled(value) {
    return new Fulfilled(value);
}
exports.fulfilled = fulfilled;
//# sourceMappingURL=Fulfilled.js.map