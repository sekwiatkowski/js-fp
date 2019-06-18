import {arrow} from '../../src'

const chai = require('chai')

chai.should()

describe('Arrow', () => {
    interface Product {
        name: string
    }

    it('should return the result of applying the function to a value', () => {
        arrow((x: string) => x.toUpperCase())
            .apply('test')
            .perform(x => x.should.equal('TEST'))
    })

    it('should map the input', () => {
        arrow((x: string) => x.toUpperCase())
            .adapt<Product>(p => p.name)
            .apply({ name: 'test'})
            .perform(x => x.should.equal('TEST'))
    })

    it('should compose with a function', () => {
        const increment = x => x+1
        const double = x => 2*x

        arrow(increment)
            .andThen(double)
            .apply(1)
            .perform(x => x.should.equal(4))
    })

    it('compose with another Arrow instance', () => {
        const incrementArrow = arrow((x: number) => x+1)
        const doubleArrow = arrow((x: number) => 2*x)

        incrementArrow.andThen(doubleArrow)
            .apply(1)
            .perform(x => x.should.equal(4))
    })

    it('should be lazy', () => {
        let count = 0

        const composition = arrow((x: string) => { count++; return x.toUpperCase() })
            .adapt<Product>((p) => { count++; return p.name })
            .andThen(arrow(x => { count++; return x.length }))
            .andThen(x => { count++; return x-1})

        count.should.equal(0)

        composition
            .apply({ name: 'test'})
            .perform(x => x.should.equal(3))

        count.should.equal(4)
    })
})