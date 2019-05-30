"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fulfilled_1 = require("./Fulfilled");
const Rejected_1 = require("./Rejected");
class Future {
    constructor(createPromise) {
        this.createPromise = createPromise;
    }
    apply(parameterValueOrFunction) {
        return new Future(() => new Promise(resolve => {
            this.run(f => {
                const futureOrPromiseOrValue = parameterValueOrFunction instanceof Function ? parameterValueOrFunction() : parameterValueOrFunction;
                if (futureOrPromiseOrValue instanceof Future) {
                    futureOrPromiseOrValue.run(parameter => resolve(Fulfilled_1.fulfilled(f(parameter))), secondError => resolve(Rejected_1.rejected(secondError)));
                }
                else if (futureOrPromiseOrValue instanceof Promise) {
                    futureOrPromiseOrValue.then(parameter => { resolve(Fulfilled_1.fulfilled(f(parameter))); })
                        .catch(secondError => resolve(Rejected_1.rejected(secondError)));
                }
                else {
                    resolve(Fulfilled_1.fulfilled(f(futureOrPromiseOrValue)));
                }
            }, firstError => resolve(Rejected_1.rejected(firstError)));
        }));
    }
    assign(key, memberValueOrFunction) {
        return new Future(() => new Promise(resolve => {
            this.run(existingObject => {
                const futureOrPromiseOrValue = memberValueOrFunction instanceof Function ? memberValueOrFunction(existingObject) : memberValueOrFunction;
                if (futureOrPromiseOrValue instanceof Future) {
                    futureOrPromiseOrValue.run(member => {
                        const updatedObject = Object.assign({}, Object(existingObject), { [key]: member });
                        resolve(Fulfilled_1.fulfilled(updatedObject));
                    }, secondError => resolve(Rejected_1.rejected(secondError)));
                }
                else if (futureOrPromiseOrValue instanceof Promise) {
                    futureOrPromiseOrValue.then(member => {
                        const updatedObject = Object.assign({}, Object(existingObject), { [key]: member });
                        resolve(Fulfilled_1.fulfilled(updatedObject));
                    })
                        .catch(secondError => resolve(Rejected_1.rejected(secondError)));
                }
                else {
                    const updatedObject = Object.assign({}, Object(existingObject), { [key]: futureOrPromiseOrValue });
                    resolve(Fulfilled_1.fulfilled(updatedObject));
                }
            }, firstError => resolve(Rejected_1.rejected(firstError)));
        }));
    }
    // There are three scenarios:
    // (1) Both promises are fulfilled
    // (2) The first promise is fulfilled, but the second is rejected.
    // (3) The first promise is rejected.
    chain(f) {
        return new Future(() => new Promise(resolve => this.run(firstValue => {
            const futureOrPromise = f(firstValue);
            if (futureOrPromise instanceof Future) {
                futureOrPromise.run(
                // Scenario 1
                secondValue => resolve(Fulfilled_1.fulfilled(secondValue)), 
                // Scenario 2
                secondError => resolve(Rejected_1.rejected(secondError)));
            }
            else {
                futureOrPromise
                    // Scenario 1
                    .then(secondValue => resolve(Fulfilled_1.fulfilled(secondValue)))
                    // Scenario 2
                    .catch(secondError => resolve(Rejected_1.rejected(secondError)));
            }
        }, 
        // Scenario 3
        firstError => resolve(Rejected_1.rejected(firstError)))));
    }
    getOrElse(alternative) {
        return this.createPromise()
            .then(settled => settled.getOrElse(alternative));
    }
    getErrorOrElse(alternative) {
        return this.createPromise()
            .then(settled => settled.getErrorOrElse(alternative));
    }
    map(f) {
        return new Future(() => new Promise(resolve => this.createPromise()
            .then(settled => resolve(settled.map(f)))));
    }
    mapError(f) {
        return new Future(() => new Promise(resolve => this.createPromise()
            .then(settled => resolve(settled.mapError(f)))));
    }
    match(pattern) {
        return this.createPromise()
            .then(settled => settled.match(pattern));
    }
    orAttempt(alternative) {
        return new Future(() => new Promise(resolve => {
            this.createPromise().then(previousAttempt => previousAttempt.run(() => resolve(previousAttempt), previousError => (alternative instanceof Function ? alternative(previousError) : alternative)
                .run(value => resolve(Fulfilled_1.fulfilled(value)), newError => resolve(Rejected_1.rejected(newError)))));
        }));
    }
    orElse(alternative) {
        return new Future(() => new Promise(resolve => {
            this.createPromise().then(previousAttempt => previousAttempt.run(() => resolve(previousAttempt), previousError => {
                const alternativeValue = alternative instanceof Function ? alternative(previousError) : alternative;
                resolve(Fulfilled_1.fulfilled(alternativeValue));
            }));
        }));
    }
    orPromise(alternative) {
        return new Future(() => new Promise(resolve => {
            this.createPromise().then(previousAttempt => previousAttempt.run(() => resolve(previousAttempt), previousError => (alternative instanceof Function ? alternative(previousError) : alternative)
                .then(value => resolve(Fulfilled_1.fulfilled(value)))
                .catch(newError => resolve(Rejected_1.rejected(newError)))));
        }));
    }
    perform(sideEffect) {
        return new Future(() => new Promise(resolve => this.createPromise()
            .then(settled => {
            settled.perform(sideEffect);
            resolve(settled);
        })));
    }
    performOnError(sideEffect) {
        return new Future(() => new Promise(resolve => this.createPromise()
            .then(settled => {
            settled.performOnError(sideEffect);
            resolve(settled);
        })));
    }
    run(whenFulfilled, whenRejected) {
        this.createPromise()
            .then(settled => {
            settled.run(whenFulfilled, whenRejected);
        });
    }
}
function fulfill(value) {
    return new Future(() => Promise.resolve(Fulfilled_1.fulfilled(value)));
}
exports.fulfill = fulfill;
function reject(error) {
    return new Future(() => Promise.resolve(Rejected_1.rejected(error)));
}
exports.reject = reject;
function future(createPromise) {
    return new Future(() => new Promise(resolve => {
        createPromise()
            .then(value => resolve(Fulfilled_1.fulfilled(value)))
            .catch(error => resolve(Rejected_1.rejected(error)));
    }));
}
exports.future = future;
fulfill((a) => (b) => (c) => (d) => a + b + c + d)
    .apply(1)
    .apply(() => 2)
    .apply(fulfill(3))
    .apply(() => fulfill(4))
    .getOrElse(() => { throw 'rejection'; });