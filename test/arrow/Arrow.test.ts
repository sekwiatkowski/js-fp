import {arrow} from '../../src'

const chai = require('chai')

chai.should()

describe('Arrow', () => {
    interface Product {
        name: string
    }

    it('should return the result of applying a value to the function', () => {
        arrow((x: string) => x.toUpperCase())
            .apply('test').should.equal('TEST')
    })

    it('should map the input', () => {
        arrow((x: string) => x.toUpperCase())
            .adaptInput<Product>(p => p.name)
            .apply({ name: 'test'}).should.equal('TEST')
    })

    it('should compose with a function', () => {
        const increment = x => x+1
        const double = x => 2*x

        arrow(increment)
            .compose(double)
            .apply(1).should.equal(4)
    })

    it('compose with another Arrow instance', () => {
        const incrementArrow = arrow((x: number) => x+1)
        const doubleArrow = arrow((x: number) => 2*x)

        incrementArrow.compose(doubleArrow)
            .apply(1).should.equal(4)
    })

    it('should be lazy', () => {
        let count = 0

        const composition = arrow((x: string) => { count++; return x.toUpperCase() })
            .adaptInput<Product>((p) => { count++; return p.name })
            .compose(arrow(x => { count++; return x.length }))
            .compose(x => { count++; return x-1})

        count.should.equal(0)

        composition
            .apply({ name: 'test'}).should.equal(3)

        count.should.equal(4)
    })
})