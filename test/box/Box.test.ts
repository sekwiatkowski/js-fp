import {box} from '../../src'

const chai = require('chai')

chai.should()

describe('Box', () => {
    const valueText = 'value'

    it('should be able to build an object that satisfies an interface', () => {
        interface TestInterface {
            first: string
            second: number
        }

        const firstValue = 'text'
        const secondValue = 1
        const objectThatSatisfiesTestInterface: TestInterface = box({})
            .assign('first', firstValue)
            .assign('second', secondValue)
            .get()

        objectThatSatisfiesTestInterface.first.should.equal(firstValue)
        objectThatSatisfiesTestInterface.second.should.equal(secondValue)
    })

    it('should be able to apply parameters', () => {
        box(a => b => c => d => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(box(3))
            .apply(() => box(4))
            .get()
            .should.equal(10)
    })

    it('should be able to build an object', () => {
        box({})
            .assign('a', 1)
            .assign('b', scope => scope.a + 1)
            .assign('c', box(3))
            .assign('d', scope => box(scope.c + 1))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .get()
            .should.equal(10)
    })

    it('should be able to chain boxes', () => {
        box(valueText)
            .chain(value => box(`${value} in new box`))
            .get()
            .should.equal(`${valueText} in new box`)
    })

    it('should be able to return the boxed value', () => {
        box(valueText)
            .get()
            .should.equal(valueText)
    })

    it('should be able to map over the value', () => {
        const f = value => `mapped over ${value}`
        box(valueText)
            .map(f)
            .get()
            .should.equal(f(valueText))
    })

    it('should be able to test the value', () => {
        box(valueText)
            .test(boxedValue => boxedValue === valueText)
            .should.be.true

        box(valueText)
            .test(boxedValue => boxedValue !== valueText)
            .should.be.false
    })

    it('should be able to perform a side-effect using the value', () => {
        let mutable = 'no side-effect'
        const f = value => `side-effect using ${value}`
        box(valueText)
            .perform(value => mutable = f(value))

        mutable
            .should.equal(f(valueText))
    })
})