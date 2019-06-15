"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fulfilled_1 = require("./Fulfilled");
const Rejected_1 = require("./Rejected");
class Future {
    constructor(createPromise) {
        this.createPromise = createPromise;
    }
    //region Access
    getOrElse(alternative) {
        return this.createPromise()
            .then(settled => settled.getOrElse(alternative));
    }
    getErrorOrElse(alternative) {
        return this.createPromise()
            .then(settled => settled.getErrorOrElse(alternative));
    }
    //endregion
    //region Application
    apply(argumentOrFutureOrPromiseOrFunction) {
        return new Future(() => new Promise(resolve => {
            this.run(f => {
                const argumentOrFutureOrPromise = argumentOrFutureOrPromiseOrFunction instanceof Function ? argumentOrFutureOrPromiseOrFunction() : argumentOrFutureOrPromiseOrFunction;
                if (argumentOrFutureOrPromise instanceof Future) {
                    argumentOrFutureOrPromise.run(parameter => resolve(Fulfilled_1.fulfilled(f(parameter))), secondError => resolve(Rejected_1.rejected(secondError)));
                }
                else if (argumentOrFutureOrPromise instanceof Promise) {
                    argumentOrFutureOrPromise.then(parameter => { resolve(Fulfilled_1.fulfilled(f(parameter))); })
                        .catch(secondError => resolve(Rejected_1.rejected(secondError)));
                }
                else {
                    resolve(Fulfilled_1.fulfilled(f(argumentOrFutureOrPromise)));
                }
            }, firstError => resolve(Rejected_1.rejected(firstError)));
        }));
    }
    //endregion
    //region Chaining
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
    //endregion
    //region Comprehension
    assign(key, memberOrFutureOrPromiseOrFunction) {
        return new Future(() => new Promise(resolve => {
            this.run(existingObject => {
                const memberOrFutureOrPromise = memberOrFutureOrPromiseOrFunction instanceof Function ? memberOrFutureOrPromiseOrFunction(existingObject) : memberOrFutureOrPromiseOrFunction;
                if (memberOrFutureOrPromise instanceof Future) {
                    memberOrFutureOrPromise.run(member => {
                        const updatedObject = Object.assign({}, Object(existingObject), { [key]: member });
                        resolve(Fulfilled_1.fulfilled(updatedObject));
                    }, secondError => resolve(Rejected_1.rejected(secondError)));
                }
                else if (memberOrFutureOrPromise instanceof Promise) {
                    memberOrFutureOrPromise
                        .then(member => {
                        const updatedObject = Object.assign({}, Object(existingObject), { [key]: member });
                        resolve(Fulfilled_1.fulfilled(updatedObject));
                    })
                        .catch(secondError => resolve(Rejected_1.rejected(secondError)));
                }
                else {
                    const updatedObject = Object.assign({}, Object(existingObject), { [key]: memberOrFutureOrPromise });
                    resolve(Fulfilled_1.fulfilled(updatedObject));
                }
            }, firstError => resolve(Rejected_1.rejected(firstError)));
        }));
    }
    //endregion
    //region Fallback
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
    //endregion
    //region Laziness
    run(whenFulfilled, whenRejected) {
        this.createPromise()
            .then(settled => {
            settled.run(whenFulfilled, whenRejected);
        });
    }
    //endregion
    //region Mapping
    map(f) {
        return new Future(() => new Promise(resolve => this.createPromise()
            .then(settled => resolve(settled.map(f)))));
    }
    //region Matching
    match(onFulfilled, onRejected) {
        return this.createPromise()
            .then(settled => settled.match(onFulfilled, onRejected));
    }
    //endregion
    mapError(f) {
        return new Future(() => new Promise(resolve => this.createPromise()
            .then(settled => resolve(settled.mapError(f)))));
    }
    //endregion
    //region Status
    isFulfilled() {
        return this.match(() => true, () => false);
    }
    isRejected() {
        return this.match(() => false, () => true);
    }
    //endregion
    //region Side-effects
    perform(f) {
        return new Future(() => new Promise(resolve => {
            this.run(firstValue => {
                const futureOrPromise = f();
                const fulfillAgain = () => resolve(Fulfilled_1.fulfilled(firstValue));
                const rejectForFirstTime = error => resolve(Rejected_1.rejected(error));
                if (futureOrPromise instanceof Future) {
                    futureOrPromise.run(fulfillAgain, rejectForFirstTime);
                }
                else {
                    futureOrPromise
                        .then(fulfillAgain)
                        .catch(rejectForFirstTime);
                }
            }, firstError => {
                const futureOrPromise = f();
                const rejectAgain = () => resolve(Rejected_1.rejected(firstError));
                if (futureOrPromise instanceof Future) {
                    futureOrPromise.run(rejectAgain, rejectAgain);
                }
                else {
                    futureOrPromise
                        .then(rejectAgain)
                        .catch(rejectAgain);
                }
            });
        }));
    }
    performOnFulfilled(f) {
        return new Future(() => new Promise(resolve => this.run(firstValue => {
            const fulfillAgain = () => resolve(Fulfilled_1.fulfilled(firstValue));
            const rejectForFirstTime = error => resolve(Rejected_1.rejected(error));
            const futureOrPromise = f(firstValue);
            if (futureOrPromise instanceof Future) {
                futureOrPromise.run(fulfillAgain, rejectForFirstTime);
            }
            else {
                futureOrPromise
                    .then(fulfillAgain)
                    .catch(rejectForFirstTime);
            }
        }, firstError => resolve(Rejected_1.rejected(firstError)))));
    }
    performOnRejected(f) {
        return new Future(() => new Promise(resolve => this.run(firstValue => resolve(Fulfilled_1.fulfilled(firstValue)), firstError => {
            const rejectAgain = () => resolve(Rejected_1.rejected(firstError));
            const futureOrPromise = f(firstError);
            if (futureOrPromise instanceof Future) {
                futureOrPromise.run(rejectAgain, rejectAgain);
            }
            else {
                futureOrPromise.then(rejectAgain).catch(rejectAgain);
            }
        })));
    }
    performSync(sideEffect) {
        return new Future(() => new Promise(resolve => this.createPromise()
            .then(settled => {
            settled.perform(sideEffect);
            resolve(settled);
        })
            .catch()));
    }
    performSyncOnFulfilled(sideEffect) {
        return new Future(() => new Promise(resolve => this.createPromise()
            .then(settled => {
            settled.performOnFulfilled(sideEffect);
            resolve(settled);
        })));
    }
    performSyncOnRejected(sideEffect) {
        return new Future(() => new Promise(resolve => this.createPromise()
            .then(settled => {
            settled.performOnRejected(sideEffect);
            resolve(settled);
        })));
    }
}
exports.Future = Future;
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
function futureObject() {
    return fulfill({});
}
exports.futureObject = futureObject;
//# sourceMappingURL=Future.js.map