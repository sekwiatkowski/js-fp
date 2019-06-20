import {listWriter} from '../../src/writer/Writer'

require('chai').should()

describe('Writer', () => {
    it('can map', () => {
        listWriter(1)
            .map(x => x + 1)
            .getValue()
            .should.equal(2)
    })

    it('can chain', () => {
        const increment = (x: number) => listWriter(x+1, 'Incremented')
        const double = (x: number) => listWriter(2*x, 'Doubled')

        const chained = listWriter(1)
            .chain(increment)
            .chain(double)

        chained.getLog().getArray().should.eql(['Incremented', 'Doubled'])
        chained.getValue().should.equal(4)
    })
})