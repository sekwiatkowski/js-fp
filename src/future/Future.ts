import {Settled} from './Settled'
import {fulfilled} from './Fulfilled'
import {rejected} from './Rejected'
import {Equivalence, Predicate} from '..'

export class Future<T, E> {
    constructor(private readonly createPromise: () => Promise<Settled<T, E>>) {}

    //region Access
    getOrElse(alternative: T|((error: E) => T)) : Promise<T> {
        return this.createPromise()
            .then(settled => settled.getOrElse(alternative))
    }

    getErrorOrElse(alternative: E|((value: T) => E)): Promise<E> {
        return this.createPromise()
            .then(settled => settled.getErrorOrElse(alternative))
    }
    //endregion

    //region Application
    apply<B, C>(
        this: Future<(parameter: B) => C, E>,
        argumentOrFutureOrPromiseOrFunction: B | (() => B) | Future<B, E> | (() => Future<B, E>) | Promise<B> | (() => Promise<B>)) : Future<C, E> {
        return new Future(() =>
            new Promise(resolve => {
                this.run(
                    f => {
                        const argumentOrFutureOrPromise = argumentOrFutureOrPromiseOrFunction instanceof Function ? argumentOrFutureOrPromiseOrFunction() : argumentOrFutureOrPromiseOrFunction

                        if (argumentOrFutureOrPromise instanceof Future) {
                            argumentOrFutureOrPromise.run(
                                parameter => resolve(fulfilled(f(parameter))),
                                secondError => resolve(rejected(secondError)))
                        }
                        else if (argumentOrFutureOrPromise instanceof Promise) {
                            argumentOrFutureOrPromise
                                .then(parameter => { resolve(fulfilled(f(parameter))) })
                                .catch(secondError => resolve(rejected(secondError)))
                        }
                        else {
                            resolve(fulfilled(f(argumentOrFutureOrPromise)))
                        }
                    },
                    firstError => resolve(rejected(firstError)))
            })
        )
    }
    //endregion

    //region Chaining
    // There are three scenarios:
    // (1) Both promises are fulfilled
    // (2) The first promise is fulfilled, but the second is rejected.
    // (3) The first promise is rejected.
    chain<U>(f: ((value: T) => Future<U, E>) | ((value: T) => Promise<U>)): Future<U, E> {
        return new Future<U, E>(() =>
            new Promise<Settled<U, E>>(resolve =>
                this.run(
                    firstValue => {
                        const futureOrPromise = f(firstValue)

                        if (futureOrPromise instanceof Future) {
                            futureOrPromise.run(
                                // Scenario 1
                                secondValue => resolve(fulfilled(secondValue)),
                                // Scenario 2
                                secondError => resolve(rejected(secondError)))
                        }
                        else {
                            futureOrPromise
                            // Scenario 1
                                .then(secondValue => resolve(fulfilled(secondValue)))
                                // Scenario 2
                                .catch(secondError => resolve(rejected(secondError)))
                        }
                    },
                    // Scenario 3
                    firstError => resolve(rejected(firstError))
                )
            )
        )
    }
    //endregion

    //region Comprehension
    assign<T extends object, K extends string, U>(
        this: Future<T, E>,
        key: K,
        memberOrFutureOrPromiseOrFunction: Future<U, E> | ((value: T) => Future<U, E>) | Promise<U> | ((value: T) => Promise<U>) | U | ((value: T) => U)): Future<T & { [key in K]: U }, E> {
        return new Future(() =>
            new Promise(resolve => {
                this.run(
                    existingObject => {
                        const memberOrFutureOrPromise = memberOrFutureOrPromiseOrFunction instanceof Function ? memberOrFutureOrPromiseOrFunction(existingObject) : memberOrFutureOrPromiseOrFunction

                        if (memberOrFutureOrPromise instanceof Future) {
                            memberOrFutureOrPromise.run(
                                member => {
                                    const updatedObject = {
                                        ...Object(existingObject),
                                        [key]: member
                                    }
                                    resolve(fulfilled(updatedObject))
                                },
                                secondError => resolve(rejected(secondError)))
                        }
                        else if (memberOrFutureOrPromise instanceof Promise) {
                            memberOrFutureOrPromise
                                .then(member => {
                                    const updatedObject = {
                                        ...Object(existingObject),
                                        [key]: member
                                    }
                                    resolve(fulfilled(updatedObject))
                                })
                                .catch(secondError => resolve(rejected(secondError)))
                        }
                        else {
                            const updatedObject = {
                                ...Object(existingObject),
                                [key]: memberOrFutureOrPromise
                            }

                            resolve(fulfilled(updatedObject))
                        }
                    },
                    firstError => resolve(rejected(firstError))
                )
            })
        )
    }
    //endregion

    //region Fallback
    orAttempt(alternative: Future<T, E>|((error: E) => Future<T, E>)): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve => {
                this.createPromise().then(previousAttempt =>
                    previousAttempt.run(
                        () => resolve(previousAttempt),
                        previousError =>
                            (alternative instanceof Function ? alternative(previousError) : alternative)
                                .run(
                                    value => resolve(fulfilled(value)),
                                    newError => resolve(rejected(newError))
                                )
                    ))
            })
        )
    }

    orElse(alternative: T|((error: E) => T)): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve => {
                this.createPromise().then(previousAttempt =>
                    previousAttempt.run(
                        () => resolve(previousAttempt),
                        previousError => {
                            const alternativeValue = alternative instanceof Function ? alternative(previousError) : alternative

                            resolve(fulfilled(alternativeValue))
                        })
                )
            }))
    }

    orPromise(alternative: Promise<T>|((error: E) => Promise<T>)): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve => {
                this.createPromise().then(previousAttempt =>
                    previousAttempt.run(
                        () => resolve(previousAttempt),
                        previousError => (alternative instanceof Function ? alternative(previousError) : alternative)
                            .then(value => resolve(fulfilled(value)))
                            .catch(newError => resolve(rejected(newError)))
                    ))
            })
        )
    }
    //endregion

    //region Laziness
    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void) {
        this.createPromise()
            .then(settled => {
                settled.run(whenFulfilled, whenRejected)
            })
    }
    //endregion

    //region Mapping
    map<U>(f : (value: T) => U): Future<U, E> {
        return new Future(() =>
            new Promise<Settled<U, E>>(resolve =>
                this.createPromise()
                    .then(settled => resolve(settled.map(f)))
            )
        )
    }

    mapError<F>(f : (error: E) => F): Future<T, F> {
        return new Future(() =>
            new Promise<Settled<T, F>>(resolve =>
                this.createPromise()
                    .then(settled => resolve(settled.mapError(f)))
            )
        )
    }
    //endregion

    //region Matching
    match<X>(
        onFulfilled: (value: T) => X,
        onRejected: (error: E) => X): Promise<X> {
        return this.createPromise()
            .then(settled => settled.match(onFulfilled, onRejected))
    }
    //endregion

    //region Parallel computation
    both(otherFutureOrPromise: Future<T, E>|Promise<T>): Promise<[Settled<T, E>, Settled<T, E>]> {
        const otherPromise = otherFutureOrPromise instanceof Future ?
            otherFutureOrPromise.createPromise() :
            new Promise<Settled<T, E>>(resolve => {
                otherFutureOrPromise
                    .then(value => { resolve(fulfilled(value)) })
                    .catch(error => resolve(rejected(error)))
            })

        return Promise.all([this.createPromise(), otherPromise])
    }
    //endregion

    //region Status
    isFulfilled() : Promise<boolean> {
        return this.match(
        () => true,
        () => false)
    }

    isRejected() : Promise<boolean> {
        return this.match(
        () => false,
        () => true)
    }
    //endregion

    //region Side-effects
    perform<U>(f: (() => Future<U, E>) | (() => Promise<U>)): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve => {
                this.run(
                    firstValue => {
                        const futureOrPromise = f()

                        const fulfillAgain = () => resolve(fulfilled(firstValue))
                        const rejectForFirstTime = (error: E) => resolve(rejected(error))

                        if (futureOrPromise instanceof Future) {
                            futureOrPromise.run(fulfillAgain, rejectForFirstTime)
                        }
                        else {
                            futureOrPromise
                                .then(fulfillAgain)
                                .catch(rejectForFirstTime)
                        }
                    },
                    firstError => {
                        const futureOrPromise = f()

                        const rejectAgain = () => resolve(rejected(firstError))

                        if (futureOrPromise instanceof Future) {
                            futureOrPromise.run(rejectAgain, rejectAgain)
                        }
                        else {
                            futureOrPromise
                                .then(rejectAgain)
                                .catch(rejectAgain)
                        }
                    }
                )
            })
        )
    }

    performOnFulfilled<U>(f: ((value: T) => Future<U, E>) | ((value: T) => Promise<U>)): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve =>
                this.run(
                    firstValue => {
                        const fulfillAgain = () => resolve(fulfilled(firstValue))
                        const rejectForFirstTime = (error: E) => resolve(rejected(error))

                        const futureOrPromise = f(firstValue)

                        if (futureOrPromise instanceof Future) {
                            futureOrPromise.run(fulfillAgain, rejectForFirstTime)
                        }
                        else {
                            futureOrPromise
                                .then(fulfillAgain)
                                .catch(rejectForFirstTime)
                        }
                    },
                    firstError => resolve(rejected(firstError))
                )
            )
        )
    }

    performOnRejected<U>(f: ((error: E) => Future<U, E>) | ((error: E) => Promise<U>)): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve =>
                this.run(
                    firstValue => resolve(fulfilled(firstValue)),
                    firstError => {
                        const rejectAgain = () => resolve(rejected(firstError))

                        const futureOrPromise = f(firstError)

                        if (futureOrPromise instanceof Future) {
                            futureOrPromise.run(rejectAgain, rejectAgain)
                        }
                        else {
                            futureOrPromise.then(rejectAgain).catch(rejectAgain)
                        }
                    }
                )
            )
        )
    }

    performSync(sideEffect: () => void): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve =>
                this.createPromise()
                    .then(settled => {
                        settled.perform(sideEffect)
                        resolve(settled)
                    })
                    .catch()
            )
        )
    }

    performSyncOnFulfilled(sideEffect: (value: T) => void): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve =>
                this.createPromise()
                    .then(settled => {
                        settled.performOnFulfilled(sideEffect)
                        resolve(settled)
                    })
            )
        )
    }

    performSyncOnRejected(sideEffect: (error: E) => void): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve =>
                this.createPromise()
                    .then(settled => {
                        settled.performOnRejected(sideEffect)
                        resolve(settled)
                    })
            )
        )
    }
    //endregion

    //region Testing
    equals(otherFutureOrPromise: Future<T, E>|Promise<T>, equality: Equivalence<Settled<T, E>>): Promise<boolean> {
        return this.both(otherFutureOrPromise)
            .then(settled => equality.test(settled[0], settled[1]))
    }

    test(predicate: (value: T) => boolean): Promise<boolean>
    test(predicate: Predicate<T>): Promise<boolean>
    test(predicate: ((value: T) => boolean)|Predicate<T>): Promise<boolean> {
        return this.match(
            value => predicate instanceof Function ? predicate(value) : predicate.test(value),
            error => false
        )
    }
    //endregion
}

export function fulfill<T, E>(value: T): Future<T, E> {
    return new Future<T, E>(() => Promise.resolve(fulfilled(value)))
}

export function reject<T, E>(error: E): Future<T, E> {
    return new Future<T, E>(() => Promise.resolve(rejected(error)))
}

export function future<T, E>(createPromise: () => Promise<T>): Future<T, E> {
    return new Future<T, E>(() =>
        new Promise(resolve => {
            createPromise()
                .then(value => resolve(fulfilled<T, E>(value)))
                .catch(error => resolve(rejected<T, E>(error)))
        }))
}

export function futureObject<E>() : Future<{}, E> {
    return fulfill({})
}