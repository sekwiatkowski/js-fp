import {fulfill, future, futureObject, predicate, reject} from '../../src'

const chai = require('chai')

chai.should()

describe('Future', () => {
    const value = 'value'
    const error = 'error'

    const map = value => `mapped over ${value}`

    const unsafeGet = () => { throw 'Unexpected error!' }
    const unsafeGetError = () => { throw 'Unexpected value!' }

    const noSideEffectText = 'no side-effect'
    const sideEffectText = 'performed side-effect'

    const timeout = 30

    describe('should be able to build an object', () => {
        it('using values and guaranteed computations', async() => {
            const result = await fulfill({})
                .assign('a', 1)
                .assign('b', () => 2)
                .assign('c', fulfill(3))
                .assign('d',() => fulfill(4))
                .assign('e', Promise.resolve(5))
                .assign('f', () => Promise.resolve(6))
                .match(
                    scope => scope.a + scope.b + scope.c + scope.d + scope.e + scope.f,
                    () => { throw 'Unexpected rejection!' })

            result.should.equal(21)
        })

        it('using promises', async() => {
            const result = await fulfill({})
                .assign('x', () => Promise.resolve(1))
                .assign('y', Promise.resolve(2))
                .match(
                    scope => scope.x + scope.y,
                    () => { throw 'Unexpected rejection!' })

            result.should.equal(3)
        })

        it('using futures', async() => {
            const result = await fulfill({})
                .assign('x', future<number, string>(() => Promise.resolve(1)))
                .assign('y', () => future<number, string>(() => Promise.resolve(2)))
                .match(
                    scope => scope.x + scope.y,
                    () => { throw 'Unexpected rejection!' })

            result.should.equal(3)
        })

        it('that satisfies an interface', async() => {
            interface TestInterface {
                first: string
                second: number
            }

            const firstValue = 'text'
            const secondValue = 1
            const objectThatSatisfiesTestInterface: TestInterface = await fulfill({})
                .assign('first', firstValue)
                .assign('second', secondValue)
                .getOrElse(unsafeGet)

            objectThatSatisfiesTestInterface.first.should.equal(firstValue)
            objectThatSatisfiesTestInterface.second.should.equal(secondValue)
        })

        it('but reject if a rejected promise is assigned', async() => {
            const result = await fulfill({})
                .assign('x', Promise.reject(1))
                .assign('y', Promise.resolve(2))
                .match(
                    () => { throw 'Unexpected resolution!' },
                    () => 'rejected')

            result.should.equal('rejected')
        })

        it('but reject the object if a resolved promise is followed by a rejected promise', async() => {
            const result = await fulfill({})
                .assign('x', Promise.resolve(1))
                .assign('y', Promise.reject(2))
                .match(
                    () => { throw 'Unexpected resolution!' },
                    () => 'rejected')

            result.should.equal('rejected')
        })

    })

    it('should be able to apply parameters (in the future)', async() => {
        const result = await fulfill((a: number) => (b: number) => (c: number) => (d: number) => (e: number) => (f: number) => a + b + c + d +e + f)
            .apply(1)
            .apply(() => 2)
            .apply(fulfill(3))
            .apply(() => fulfill(4))
            .apply(Promise.resolve(5))
            .apply(() => Promise.resolve(6))
            .getOrElse(unsafeGet)

        result.should.equal(21)
    })

    describe('should promise to return', () => {
        it('the value of a resolved promise', async() => {
            const got = await fulfill(value)
                .getOrElse(unsafeGet)

            got.should.equal(value)
        })

        it('the error associated with a rejected promise', async() => {
            const got = await reject(error)
                .getErrorOrElse(unsafeGetError)

            got.should.equal(error)
        })
    })

    describe('should map over', () => {
        it('the value of a resolved promise', async() => {
            const got = await fulfill(value)
                .map(map)
                .getOrElse(unsafeGet)

            got.should.equal(map(value))
        })

        it('the error associated with a rejected promise', async() => {
            const got = await reject(error)
                .mapError(map)
                .getErrorOrElse(unsafeGetError)

            got.should.equal(map(error))
        })
    })

    describe('should perform', () => {
        it('side-effects using the value of a resolved promise', done => {
            let mutable = noSideEffectText

            fulfill(error)
                .performSyncOnFulfilled(() => mutable = sideEffectText)
                .run(
                    () => {
                        mutable.should.equal(sideEffectText)
                        done()
                    },
                    () => {
                        throw 'Unexpected rejection!'
                    })
        })

        it('no side-effects intended for the fulfillment path if the promise is rejected', done => {
            let mutable = noSideEffectText

            reject(error)
                .performSyncOnFulfilled(() => mutable = sideEffectText)
                .run(
                    () => {
                        throw 'Unexpected resolution!'
                    },
                    () => {
                        mutable.should.equal(noSideEffectText)
                        done()
                    })
        })

        it('side-effects using the error of a rejected promise', done => {
            let mutable = noSideEffectText

            reject(error)
                .performSyncOnRejected(() => mutable = sideEffectText)
                .run(
                    () => {
                        throw 'Unexpected resolution!'
                    },
                    () => {
                        mutable.should.equal(sideEffectText)
                        done()
                    })
        })

        it('no side-effects intended for the rejection path the promise is resolved', done => {
            let mutable = noSideEffectText

            fulfill(value)
                .performSyncOnRejected(() => mutable = sideEffectText)
                .run(
                    () => {
                        mutable.should.equal(noSideEffectText)
                        done()
                    },
                    () => {
                        throw 'Unexpected rejection!'
                    })
        })
    })

    describe('should match', () => {
        it('by mapping over the value of a resolved promise', async() => {
            const actualValue = await fulfill(value)
                .match(
                    map,
                    () => { throw 'Unexpected rejection!' })

            const expectedValue = map(value)
            actualValue.should.equal(expectedValue)
        })

        it('by mapping over the error associated with a rejected promise', async() => {
            const actualValue = await reject(error)
                .match(
                    () => { throw 'Unexpected resolution!' },
                    map)

            const expectedValue = map(error)
            actualValue.should.equal(expectedValue)
        })
    })

    describe('should fall back', () => {
        it('to a promise if the future is in the rejection state', async() => {
            const got = await reject(error)
                .orPromise(Promise.resolve(value))
                .getOrElse(unsafeGet)

            got.should.equal(value)
        })

        it('to a promise if the future is in the rejection state and the first fallback promise has been rejected', async() => {
            const got = await reject(error)
                .orPromise(Promise.reject(error))
                .orPromise(() => Promise.resolve(value))
                .getOrElse(unsafeGet)

            got.should.equal(value)
        })

        it('but continue on the rejection path if the fallback promise is rejected', async() => {
            const got = await reject(error)
                .orPromise(() => Promise.reject(error))
                .getErrorOrElse(unsafeGetError)

            got.should.equal(error)
        })

        it('to a future if the future is in the rejection state', async() => {
            const got = await reject(error)
                .orAttempt(fulfill(value))
                .getOrElse(unsafeGet)

            got.should.equal(value)
        })

        it('to a future if the future is in the rejection state and the first fallback future has been rejected', async() => {
            const got = await reject(error)
                .orAttempt(reject(error))
                .orAttempt(() => fulfill(value))
                .getOrElse(unsafeGet)

            got.should.equal(value)
        })

        it('but continue on the rejection path if the fallback future is rejected', async() => {
            const got = await reject(error)
                .orAttempt(() => reject(error))
                .getErrorOrElse(unsafeGetError)

            got.should.equal(error)
        })

        it('to a default value', async() => {
            const defaultValue = 'default'
            const got = await reject(error)
                .orElse(defaultValue)
                .getOrElse(unsafeGet)

            got.should.equal(defaultValue)
        })

        it('to the result of a guaranteed computation', async() => {
            const defaultValue = 'default'
            const got = await reject(error)
                .orElse(() => defaultValue)
                .getOrElse(unsafeGet)

            got.should.equal(defaultValue)
        })
    })

    describe('should skip over errors maps', () => {
        it('when chaining', async() => {
            let sideEffectText = noSideEffectText

            const secondErrorText = 'second error'

            const result = await fulfill<string, string>('The first step succeeds.')
                .mapError(() => {
                    sideEffectText = 'side-effect!'
                    return 'first error'
                })
                .chain(() => reject('But the second step fails.'))
                .mapError(() => secondErrorText)
                .getErrorOrElse(unsafeGetError)

            result.should.equal(secondErrorText)
            sideEffectText.should.equal(noSideEffectText)
        })

        it('when assigning', async() => {
            let sideEffectText = noSideEffectText

            const secondErrorText = 'second error'

            const result = await futureObject()
                .assign('first', () => fulfill('The first assignment succeeds.'))
                .mapError(() => {
                    sideEffectText = 'side-effect!'
                    return 'first error'
                })
                .assign('second', () => reject('The second assignment fails.'))
                .mapError(() => secondErrorText)
                .getErrorOrElse(unsafeGetError)

            result.should.equal(secondErrorText)
            sideEffectText.should.equal(noSideEffectText)
        })
    })

    it('should synchronously perform a side-effect on both paths', async() => {
        let mutable = 0

        await fulfill({})
            .performSync(() => mutable += 1)
            .getOrElse(unsafeGet)

        await reject({})
            .performSync(() => mutable += 1)
            .getErrorOrElse(unsafeGet)

        mutable.should.equal(2)
    })

    describe('should asynchronously perform', () => {
        it('chained side-effects on the value if the future is fulfilled', async() => {
            let mutable = []

            await fulfill({})
                .performOnFulfilled(() => new Promise(resolve => {
                    setTimeout(() => {
                        mutable.push('first')
                        resolve()
                    }, timeout)
                }))
                .performOnFulfilled(() => new Promise(resolve => {
                    mutable.push('second')
                    resolve()
                }))
                .getOrElse(unsafeGet)

            mutable.should.eql(['first', 'second'])
        })

        it('no side-effects intended for the fulfillment path if the future is rejected', async() => {
            let mutable = []

            await reject({})
                .performOnFulfilled(() => new Promise(resolve => {
                    setTimeout(() => {
                        mutable.push('first')
                        resolve()
                    }, timeout)
                }))
                .performOnFulfilled(() => new Promise(resolve => {
                    mutable.push('second')
                    resolve()
                }))
                .getErrorOrElse(unsafeGet)

            mutable.should.eql([])
        })

        it('chained side-effect on the error if the future is rejected', async() => {
            let mutable = []

            await reject({})
                .performOnRejected(() => new Promise(resolve => {
                    setTimeout(() => {
                        mutable.push('first')
                        resolve()
                    }, timeout)
                }))
                .performOnRejected(() => new Promise(resolve => {
                    mutable.push('second')
                    resolve()
                }))
                .getErrorOrElse(unsafeGet)

            mutable.should.eql(['first', 'second'])
        })

        it('no side-effects intended for the rejection path if the future is fulfilled', async() => {
            let mutable = []

            await fulfill({})
                .performOnRejected(() => new Promise(resolve => {
                    setTimeout(() => {
                        mutable.push('first')
                        resolve()
                    }, timeout)
                }))
                .performOnRejected(() => new Promise(resolve => {
                    mutable.push('second')
                    resolve()
                }))
                .getOrElse(unsafeGet)

            mutable.should.eql([])
        })

        it('chained side-effects on both paths', async() => {
            let mutable = []

            await fulfill({})
                .perform(() => new Promise(resolve => {
                    setTimeout(() => {
                        mutable.push('first')
                        resolve()
                    }, timeout)
                }))
                .perform(() => new Promise(resolve => {
                    mutable.push('second')
                    resolve()
                }))
                .getOrElse(unsafeGet)

            await reject({})
                .perform(() => new Promise(resolve => {
                    setTimeout(() => {
                        mutable.push('third')
                        resolve()
                    }, timeout)
                }))
                .perform(() => new Promise(resolve => {
                    mutable.push('fourth')
                    resolve()
                }))
                .getErrorOrElse(unsafeGet)

            mutable.should.eql(['first', 'second', 'third', 'fourth'])
        })
    })

    describe('should indicate the status', () => {
        it('when rejected', async() => {
            const createRejectedFuture = () => reject({})

            const isFulfilled = await createRejectedFuture().isFulfilled()
            isFulfilled.should.be.false

            const isRejected = await createRejectedFuture().isRejected()
            isRejected.should.be.true
        })

        it('when fulfilled', async() => {
            const createFulfilledFuture = () => fulfill({})

            const isFulfilled = await createFulfilledFuture().isFulfilled()
            isFulfilled.should.be.true

            const isRejected = await createFulfilledFuture().isRejected()
            isRejected.should.be.false
        })
    })

    describe('should reject a future', () => {
        it('if a side-effect in the fulfillment path is rejected', async() => {
            const createFutureWithRejectedSideEffectOnFulfilled = () => fulfill({})
                .performOnFulfilled(() => Promise.reject({}))

            const isFulfilled = await createFutureWithRejectedSideEffectOnFulfilled().isFulfilled()
            isFulfilled.should.be.false

            const isRejected = await createFutureWithRejectedSideEffectOnFulfilled().isRejected()
            isRejected.should.be.true
        })

        it('if a side-effect on both paths is rejected', async() => {
            const createFutureWithRejectedSideEffectOnBothPaths = () => fulfill({})
                .perform(() => Promise.reject({}))

            const isFulfilled = await createFutureWithRejectedSideEffectOnBothPaths().isFulfilled()
            isFulfilled.should.be.false

            const isRejected = await createFutureWithRejectedSideEffectOnBothPaths().isRejected()
            isRejected.should.be.true
        })
    })

    describe('should determine equality', () => {
        describe('with another future by', () => {
            it('returning true when two fulfilled futures with the same value are tested', async() => {
                (await fulfill(1).equals(fulfill(1))).should.be.true
            })

            it('returning false when two fulfilled futures with different values are tested', async() => {
                const oneAndTwoResult = await fulfill(1).equals(fulfill(2))
                oneAndTwoResult.should.be.false

                const twoAndOneResult = await fulfill(2).equals(fulfill(1))
                twoAndOneResult.should.be.false
            })

            it('returning true when two rejected futures with the same error are tested', async() => {
                (await reject('error').equals(reject('error'))).should.be.true
            })

            it('returning false when two rejected futures with different errors are tested', async() => {
                const oneAndTwoResult = await reject(1).equals(reject(2))
                oneAndTwoResult.should.be.false

                const twoAndOneResult = await reject(2).equals(reject(1))
                twoAndOneResult.should.be.false
            })
        })

        describe('with a promise by', () => {
            it('returning true when a fulfilled future is compared with a fulfilled promise of the same value', async() => {
                (await fulfill(1).equals(Promise.resolve(1))).should.be.true
            })

            it('returning false when a fulfilled future is compared with a fulfilled promise of a different value', async() => {
                (await fulfill(1).equals(Promise.resolve(2))).should.be.false
            })

            it('returning true when a rejected future is compared with a rejected promise with the same error', async() => {
                (await reject(1).equals(Promise.reject(1))).should.be.true
            })

            it('returning false when a rejected future is compared with a rejected promise with a different error', async() => {
                (await reject(1).equals(Promise.reject(2))).should.be.false
            })
        })
    })

    describe('should test', () => {
        const isEven = x => x % 2 == 0
        const isEvenPredicate = predicate(isEven)

        describe('fulfilled futures', () => {
            it('using a predicate function', async() => {
                const one = await fulfill(1).test(isEven)
                one.should.be.false

                const two = await fulfill(2).test(isEven)
                two.should.be.true
            })

            it('using a Predicate instance', async() => {

                const one = await fulfill(1).test(isEvenPredicate)
                one.should.be.false

                const two = await fulfill(2).test(isEvenPredicate)
                two.should.be.true
            })
        })

        describe('rejected futures', () => {
            it('using a predicate function', async() => {
                const one = await reject(1).test(isEven)
                one.should.be.false

                const two = await reject(2).test(isEvenPredicate)
                two.should.be.false
            })

            it('using a Predicate instance', async() => {

                const one = await reject(1).test(isEvenPredicate)
                one.should.be.false

                const two = await reject(2).test(isEvenPredicate)
                two.should.be.false
            })
        })

    })

})