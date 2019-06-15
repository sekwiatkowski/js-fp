import {lazy} from '../../src'
import {lazyObject} from '../../src/lazy/Lazy'

const chai = require('chai')
chai.should()

describe('Lazy', () => {
    const noSideEffectText = 'no side-effect'
    const sideEffectText = 'side-effect'

    it('can run', () => {
        lazy(() => 1)
            .run()
            .should.equal(1)
    })

    it('can map', () => {
        lazy(() => 1)
            .map(x => x + 1)
            .run()
            .should.equal(2)
    })

    it('is lazy', () => {
        let mutable = noSideEffectText
        lazy(() => 1)
            .map(x => { mutable = 'side-effect'; return x + 1 })

        mutable.should.equal(noSideEffectText)
    })

    it('can perform side-effects', () => {
        let mutable = noSideEffectText

        const lazyComputation = lazy(() => 1)
            .map(x => x + 1)
            .perform(() => mutable = sideEffectText)

        mutable.should.equal(noSideEffectText)
        lazyComputation.run().should.equal(2)
        mutable.should.equal(sideEffectText)
    })

    it('can test for equality', () => {
        const lazyOfOne = lazy(() => 1)

        lazyOfOne.equals(lazyOfOne)
        lazyOfOne.equals(lazy(() => 2))
        lazyOfOne.equals(undefined)
        lazyOfOne.equals(null)
    })

    it('can partially apply functions', () => {
        lazy(() => (x: number) => (y: number) => x + y)
            .apply(1)
            .apply(2)
            .run()
            .should.equal(3)
    })

    it('can chain', () => {
        lazy(() => 1)
            .chain(x => lazy(() => x + 1))
            .run()
            .should.equal(2)
    })

    it('can comprehend', () => {
        lazyObject()
            .assign('a', 1)
            .assign('b', () => 2)
            .assign('c', lazy(() => 3))
            .assign('d', () => lazy(() => 4))
            .map(scope => scope.a + scope.b + scope.c + scope.d)
            .run()
            .should.equal(10)
    })
})