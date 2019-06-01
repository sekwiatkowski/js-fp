import {fulfill, future, reject} from '../../src'

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

    it('should be able to build an object that satisfies an interface', async() => {
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

    it('should be able to build an object using values and guaranteed computations', async() => {
        const result = await fulfill({})
            .assign('a', 1)
            .assign('b', () => 2)
            .assign('c', fulfill(3))
            .assign('d',() => fulfill(4))
            .assign('e', Promise.resolve(5))
            .assign('f', () => Promise.resolve(6))
            .fold({
                Resolved: scope => scope.a + scope.b + scope.c + scope.d + scope.e + scope.f,
                Rejected: () => { throw 'Unexpected rejection!' }
            })

        result.should.equal(21)
    })

    it('should be able to build an object using promises', async() => {
        const result = await fulfill({})
            .assign('x', () => Promise.resolve(1))
            .assign('y', Promise.resolve(2))
            .fold({
                Resolved: scope => scope.x + scope.y,
                Rejected: () => { throw 'Unexpected rejection!' }
            })

        result.should.equal(3)
    })

    it('should reject the entire promise of an object if the promise of the second member is rejected', async() => {
        const result = await fulfill({})
            .assign('x', Promise.resolve(1))
            .assign('y', Promise.reject(2))
            .fold({
                Resolved: () => { throw 'Unexpected resolution!' },
                Rejected: () => 'rejected'
            })

        result.should.equal('rejected')
    })

    it('should reject the entire promise of an object if the promise of the first member is rejected', async() => {
        const result = await fulfill({})
            .assign('x', Promise.reject(1))
            .assign('y', Promise.resolve(2))
            .fold({
                Resolved: () => { throw 'Unexpected resolution!' },
                Rejected: () => 'rejected'
            })

        result.should.equal('rejected')
    })


    it('should be able to build an object using futures', async() => {
        const result = await fulfill({})
            .assign('x', future<number, string>(() => Promise.resolve(1)))
            .assign('y', () => future<number, string>(() => Promise.resolve(2)))
            .fold({
                Resolved: scope => scope.x + scope.y,
                Rejected: () => { throw 'Unexpected rejection!' }
            })

        result.should.equal(3)
    })

    it('should be able to get the value of the resolved promise', async() => {
        const got = await fulfill(value)
            .getOrElse(unsafeGet)

        got.should.equal(value)
    })

    it('should be able to get the error of the rejected promise', async() => {
        const got = await reject(error)
            .getErrorOrElse(unsafeGetError)

        got.should.equal(error)
    })

    it('should be able to map over the value of a resolved promise', async() => {
        const got = await fulfill(value)
            .map(map)
            .getOrElse(unsafeGet)

        got.should.equal(map(value))
    })

    it('should be able map over the reason of a promise rejection', async() => {
        const got = await reject(error)
            .mapError(map)
            .getErrorOrElse(unsafeGetError)

        got.should.equal(map(error))
    })

    it('should be able to perform side-effects using the value of a resolved promise', done => {
        let mutable = noSideEffectText

        fulfill(error)
            .perform(() => mutable = sideEffectText)
            .run(
                () => {
                    mutable.should.equal(sideEffectText)
                    done()
                },
                () => {
                    throw 'Unexpected rejection!'
                })
    })

    it('should ignore attempts to perform side-effects using the value if the promise is rejected', done => {
        let mutable = noSideEffectText

        reject(error)
            .perform(() => mutable = sideEffectText)
            .run(
                () => {
                    throw 'Unexpected resolution!'
                },
                () => {
                    mutable.should.equal(noSideEffectText)
                    done()
                })
    })

    it('should be able to perform side-effects using the error of a rejected promise', done => {
        let mutable = noSideEffectText

        reject(error)
            .performOnError(() => mutable = sideEffectText)
            .run(
                () => {
                    throw 'Unexpected resolution!'
                },
                () => {
                    mutable.should.equal(sideEffectText)
                    done()
                })
    })

    it('should ignore attempts to perform side-effects using the error if the promise is resolved', done => {
        let mutable = noSideEffectText

        fulfill(value)
            .performOnError(() => mutable = sideEffectText)
            .run(
                () => {
                    mutable.should.equal(noSideEffectText)
                    done()
                },
                () => {
                    throw 'Unexpected rejection!'
                })
    })

    it('should map over the value of the resolved promise when folded', async() => {
        const actualValue = await fulfill(value)
            .fold({
                Resolved: map,
                Rejected: () => { throw 'Unexpected rejection!' }
            })

        const expectedValue = map(value)
        actualValue.should.equal(expectedValue)
    })

    it('should map over the value of the rejected promise when folded', async() => {
        const actualValue = await reject(error)
            .fold({
                Resolved: () => { throw 'Unexpected resolution!' },
                Rejected: map
            })

        const expectedValue = map(error)
        actualValue.should.equal(expectedValue)
    })

    it('should be able to continue with a fallback promise if the first promise is rejected', async() => {
        const got = await reject(error)
            .orPromise(Promise.resolve(value))
            .getOrElse(unsafeGet)

        got.should.equal(value)
    })

    it('should be able to continue with a fallback promise if the first and second promise are rejected', async() => {
        const got = await reject(error)
            .orPromise(Promise.reject(error))
            .orPromise(() => Promise.resolve(value))
            .getOrElse(unsafeGet)

        got.should.equal(value)
    })

    it('should continue on the rejection path if the fallback promise is rejected', async() => {
        const got = await reject(error)
            .orPromise(() => Promise.reject(error))
            .getErrorOrElse(unsafeGetError)

        got.should.equal(error)
    })

    it('should be able to continue with a fallback future if the first promise is rejected', async() => {
        const got = await reject(error)
            .orAttempt(fulfill(value))
            .getOrElse(unsafeGet)

        got.should.equal(value)
    })

    it('should be able to continue with a fallback future if the first and second futures are rejected', async() => {
        const got = await reject(error)
            .orAttempt(reject(error))
            .orAttempt(() => fulfill(value))
            .getOrElse(unsafeGet)

        got.should.equal(value)
    })

    it('should continue on the rejection path if the fallback future is rejected', async() => {
        const got = await reject(error)
            .orAttempt(() => reject(error))
            .getErrorOrElse(unsafeGetError)

        got.should.equal(error)
    })

    it('should be able to continue with a default value', async() => {
        const defaultValue = 'default'
        const got = await reject(error)
            .orElse(defaultValue)
            .getOrElse(unsafeGet)

        got.should.equal(defaultValue)
    })

    it('should be able to continue with the result of a guaranteed computation', async() => {
        const defaultValue = 'default'
        const got = await reject(error)
            .orElse(() => defaultValue)
            .getOrElse(unsafeGet)

        got.should.equal(defaultValue)
    })

})