import {box, createBoxEquality, Future, guardedStrictEquality, Some, Success, Valid} from '../../src'

require('chai').should()

describe('Box', () => {
    const valueText = 'value'

    describe('can build an object', () => {
        it('one member at a time', () => {
            box({})
                .assign('a', 1)
                .assign('b', scope => scope.a + 1)
                .assign('c', box(3))
                .assign('d', scope => box(scope.c + 1))
                .map(scope => scope.a + scope.b + scope.c + scope.d)
                .get()
                .should.equal(10)
        })

        it('that satisfies an interface', () => {
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
    })

    it('can apply parameters', () => {
        box((a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d)
            .apply(1)
            .apply(() => 2)
            .apply(box(3))
            .apply(() => box(4))
            .get()
            .should.equal(10)
    })

    it('can be chained', () => {
        box(valueText)
            .chain(value => box(`${value} in new box`))
            .get()
            .should.equal(`${valueText} in new box`)
    })

    it('can return the contained value', () => {
        box(valueText)
            .get()
            .should.equal(valueText)
    })

    it('can be mapped over', () => {
        const f = (value: string) => `mapped over ${value}`
        box(valueText)
            .map(f)
            .get()
            .should.equal(f(valueText))
    })

    describe('cna test', () => {
        it('a predict', () => {
            box(valueText)
                .test(boxedValue => boxedValue === valueText)
                .should.be.true

            box(valueText)
                .test(boxedValue => boxedValue !== valueText)
                .should.be.false
        })

        it('test for equality', () => {
            const boxOfOne = box(1)
            const boxEquality = createBoxEquality<number>(guardedStrictEquality)
            boxOfOne.equals(box(1), boxEquality).should.be.true
            boxOfOne.equals(box(2), boxEquality).should.be.false
        })
    })

    it('can perform a side-effect on the contained value', () => {
        let mutable = 'no side-effect'
        const f = (value: string) => `side-effect using ${value}`
        box(valueText)
            .perform(value => mutable = f(value))

        mutable
            .should.equal(f(valueText))
    })

    describe('can be converted to', () => {
        it('an option', () => {
            (box(valueText).toOption() instanceof Some).should.be.true
        })

        it('a result', () => {
            (box(valueText).toResult() instanceof Success).should.be.true
        })

        it('a Validated instance', () => {
            (box(valueText).toValidated() instanceof Valid).should.be.true
        })

        it('a future', () => {
            (box(valueText).toFuture() instanceof Future).should.be.true
        })
    })
})