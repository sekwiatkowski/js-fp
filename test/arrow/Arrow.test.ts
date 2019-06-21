import {arrow} from '../../src'

require('chai').should()

describe('Arrow', () => {
    interface Product {
        name: string
    }

    it('can apply a parameter', () => {
        arrow((x: string) => x.toUpperCase())
            .apply('test')
            .perform(x => x.should.equal('TEST'))
    })

    it('can adapt the input', () => {
        arrow((x: string) => x.toUpperCase())
            .adapt<Product>(p => p.name)
            .apply({ name: 'test'})
            .perform(x => x.should.equal('TEST'))
    })

    describe('can be composed', () => {

        it('with another function', () => {
            const increment = (x: number) => x+1
            const double = (x: number) => 2*x

            arrow(increment)
                .andThen(double)
                .apply(1)
                .perform(x => x.should.equal(4))
        })

        it('with another Arrow instance', () => {
            const incrementArrow = arrow((x: number) => x+1)
            const doubleArrow = arrow((x: number) => 2*x)

            incrementArrow.andThen(doubleArrow)
                .apply(1)
                .perform(x => x.should.equal(4))
        })
    })

    it('is lazy', () => {
        let count = 0

        const composition = arrow((x: string) => { count++; return x.toUpperCase() })
            .adapt<Product>(p => { count++; return p.name })
            .andThen(arrow((x: string) => { count++; return x.length }))
            .andThen(x => { count++; return x-1})

        count.should.equal(0)

        composition
            .apply({ name: 'test'})
            .perform(x => x.should.equal(3))

        count.should.equal(4)
    })
})