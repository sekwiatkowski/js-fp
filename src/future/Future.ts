import {Settled, SettledMatchPattern} from './Settled'
import {fulfilled} from './Fulfilled'
import {rejected} from './Rejected'

export class Future<T, E> {
    constructor(private readonly createPromise: () => Promise<Settled<T, E>>) {}

    apply<B, C>(this: Future<(parameter: B) => C, E>, parameterValueOrFunction: B | (() => B) | Future<B, E> | (() => Future<B, E>) | Promise<B> | (() => Promise<B>)) : Future<C, E> {
        return new Future(() =>
            new Promise(resolve => {
                this.run(
                    f => {
                        const futureOrPromiseOrValue = parameterValueOrFunction instanceof Function ? parameterValueOrFunction() : parameterValueOrFunction

                        if (futureOrPromiseOrValue instanceof Future) {
                            futureOrPromiseOrValue.run(
                                parameter => resolve(fulfilled(f(parameter))),
                                secondError => resolve(rejected(secondError)))
                        }
                        else if (futureOrPromiseOrValue instanceof Promise) {
                            futureOrPromiseOrValue.then(
                                parameter => { resolve(fulfilled(f(parameter))) })
                                .catch(secondError => resolve(rejected(secondError)))
                        }
                        else {
                            resolve(fulfilled(f(futureOrPromiseOrValue)))
                        }
                    },
                    firstError => resolve(rejected(firstError)))
            })
        )
    }

    assign<T extends object, U>(
        this: Future<T, E>,
        key: string,
        memberValueOrFunction: U | ((value: T) => U) | Future<U, E> | ((value: T) => Future<U, E>) | Promise<U> | ((value: T) => Promise<U>)): Future<T & { [key in string]: U }, E> {
        return new Future(() =>
            new Promise(resolve => {
                this.run(
                    existingObject => {
                        const futureOrPromiseOrValue = memberValueOrFunction instanceof Function ? memberValueOrFunction(existingObject) : memberValueOrFunction

                        if (futureOrPromiseOrValue instanceof Future) {
                            futureOrPromiseOrValue.run(
                                member => {
                                    const updatedObject = {
                                        ...Object(existingObject),
                                        [key]: member
                                    }
                                    resolve(fulfilled(updatedObject))
                                },
                                secondError => resolve(rejected(secondError)))
                        }
                        else if (futureOrPromiseOrValue instanceof Promise) {
                            futureOrPromiseOrValue.then(
                                member => {
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
                                [key]: futureOrPromiseOrValue
                            }

                            resolve(fulfilled(updatedObject))
                        }
                    },
                    firstError => resolve(rejected(firstError))
                )
            })
        )
    }

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

    getOrElse(alternative: T|((error: E) => T)) : Promise<T> {
        return this.createPromise()
            .then(settled => settled.getOrElse(alternative))
    }

    getErrorOrElse(alternative: E|((value: T) => E)): Promise<E> {
        return this.createPromise()
            .then(settled => settled.getErrorOrElse(alternative))
    }

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

    match<X>(pattern: SettledMatchPattern<T, E, X>) : Promise<X> {
        return this.createPromise()
            .then(settled => settled.match(pattern))
    }

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

    perform(sideEffect: (value: T) => void): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve =>
                this.createPromise()
                    .then(settled => {
                        settled.perform(sideEffect)
                        resolve(settled)
                    })
            )
        )
    }

    performOnError(sideEffect: (error: E) => void): Future<T, E> {
        return new Future<T, E>(() =>
            new Promise<Settled<T, E>>(resolve =>
                this.createPromise()
                    .then(settled => {
                        settled.performOnError(sideEffect)
                        resolve(settled)
                    })
            )
        )
    }

    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void) {
        this.createPromise()
            .then(settled => {
                settled.run(whenFulfilled, whenRejected)
            })
    }

}

export function fulfill<T, E>(value : T): Future<T, E> {
    return new Future<T, E>(() => Promise.resolve(fulfilled(value)))
}

export function reject<T, E>(error : E): Future<T, E> {
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